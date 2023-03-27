import React, { Fragment, useEffect, useState } from "react";
import { withTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import SEO from "../components/SEO";
import { useNavigate } from 'react-router-dom';
import { db, firebase } from "../firebase";
import { Modal, Tabs } from "antd";
import { useRef } from "react";
import { FacebookIcon, FacebookShareButton, WhatsappIcon, WhatsappShareButton } from "react-share";
import { useSelector } from "react-redux";
import { categoriesApi, UserCoinScoreApi } from "../store/actions/campaign";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";
import { updateUserDatainfo, updateUserDataInfo } from "../store/reducers/userSlice";
import { groupbattledata, LoadGroupBattleData } from "../store/reducers/groupbattleSlice";
import { Loadtempdata, playwithfreind } from "../store/reducers/tempDataSlice";
import { imgError } from "../utils";
import { settingsData } from "../store/reducers/settingsSlice";

const RandomBattle = ({ t }) => {
    // store data get
    const userData = useSelector((state) => state.User);

    const groupBattledata = useSelector(groupbattledata);

    const selectdata = useSelector(settingsData);

    const appdata = selectdata && selectdata.filter(item => item.type == "app_name");

    const appName = appdata && appdata.length > 0 ? appdata[0].message : '';

    const getData = useSelector(playwithfreind);

    const TabPane = Tabs.TabPane;

    const [category, setCategory] = useState({
        all: "",
        selected: "",
    });

    const [loading, setLoading] = useState(true);

    const [shouldGenerateRoomCode, setShouldGenerateRoomCode] = useState(false);

    const [selectedCoins, setSelectedCoins] = useState({ all: "", selected: "" });

    const [playwithfriends, setPlaywithfriends] = useState(false);

    const [inputCode, setInputCode] = useState(false);

    const [showStart, setShowStart] = useState(false);

    // userdata
    const [userdata, setUserdata] = useState({
        userName: "",
        profile: "",
    });

    const navigate = useNavigate();

    let languageid = getData.language_id;

    let category_selected = getData.category_id;

    let username = userData.data.name ? userData.data.name : userData.data.email;

    let userprofile = userData.data.profile ? userData.data.profile : "";

    let useruid = userData.data.id;

    let usercoins = userData && userData.data.coins;

    let selectedcoins = Number(selectedCoins.selected);

    let inputText = useRef(null);

    // get category data
    const getAllData = () => {
        categoriesApi(
            1,
            (response) => {
                let categoires = response.data;
                setCategory({
                    ...category,
                    all: categoires,
                    selected: categoires[0].id,
                });
                setLoading(false);
            },
            (error) => {
                console.log(error);
            }
        );
    };

    // database collection
    const createBattleRoom = async (categoryId, name, profileUrl, uid, roomCode, roomType, entryFee, questionlanguageId) => {
        try {
            let documentreference = db.collection("battleRoom").add({
                categoryId: categoryId,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                createdBy: uid,
                entryFee: entryFee ? entryFee : 0,
                languageId: questionlanguageId,
                readyToPlay: false,
                roomCode: roomCode ? roomCode : "",
                user1: {
                    answers: [],
                    name: name,
                    points: 0,
                    profileUrl: profileUrl,
                    uid: uid,
                },
                user2: {
                    answers: [],
                    name: "",
                    points: 0,
                    profileUrl: "",
                    uid: "",
                },
            });

            // created id by user to check for result screen
            LoadGroupBattleData("createdby", uid);
            setShowStart(true);

            return await documentreference;
        } catch (error) {
            toast.error(error);
        }
    };

    // delete battle room
    const deleteBattleRoom = async (documentId) => {
        try {
            await db.collection("battleRoom").doc(documentId).delete();
        } catch (error) {
            toast.error(error);
        }
    };

    // find room
    const searchBattleRoom = async (languageId, categoryId) => {
        try {
            let userfind = await db.collection("battleRoom").where("languageId", "==", languageId).where("categoryId", "==", categoryId).where("roomCode", "==", "").where("user2.uid", "==", "").get();

            let userfinddata = userfind.docs;

            let index = userfinddata.findIndex((elem) => {
                return elem.data().createdBy == useruid;
            });

            if (index !== -1) {
                deleteBattleRoom(userfinddata[index].id);
                userfinddata.splice(userfinddata.length, index);
            }

            return userfinddata;
        } catch (err) {
            toast.error("Error getting document", err);
        }
    };

    // search room
    const searchRoom = async () => {
        try {
            let documents = await searchBattleRoom(languageid, category_selected);

            let roomdocid;

            if (documents.length !== 0) {
                let room = documents;

                roomdocid = room.id;
            } else {
                roomdocid = await createRoom();
            }

            subscribeToBattleRoom(roomdocid);
            LoadGroupBattleData("roomid", roomdocid);
        } catch (error) {
            toast.error(error);
            console.log(error);
        }
    };

    // redirect question screen
    const questionScreen = (roomcode) => {
        navigate("/RandomPlay");
        let data = {
            category_id: category_selected,
            room_id: roomcode,
            destroy_match: "0",
        };
        Loadtempdata(data);
    };

    // subsscribebattle room
    const subscribeToBattleRoom = async (battleRoomDocumentId) => {
        let documentRef = db.collection("battleRoom").doc(battleRoomDocumentId);

        documentRef.onSnapshot(
            { includeMetadataChanges: true },
            (doc) => {
                if (doc.exists) {
                    let battleroom = doc.data();

                    // for user1
                    if (userData.data.id === battleroom.user1.uid) {
                        setUserdata({ ...userdata, userName: battleroom.user2.name, profile: battleroom.user2.profileUrl });
                    } else {
                        setUserdata({ ...userdata, userName: battleroom.user1.name, profile: battleroom.user1.profileUrl });
                    }

                    let check = battleroom.readyToPlay;

                    let roomCode = battleroom.roomCode;

                    if (check) {
                        setTimeout(() => {
                            questionScreen(roomCode);
                        }, 3000);
                    }
                }
            },
            (error) => {
                console.log("err", error);
            }
        );
    };

    // room code generator
    const randomFixedInteger = (length) => {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)).toString();
    };

    //create room for battle
    const createRoom = async () => {
        // battleroom joiing state
        if (usercoins < 0 || usercoins === "0") {
            toast.error(t("you dont have enough coins"));
            return;
        }

        let roomCode = "";

        //genarate room code
        roomCode = randomFixedInteger(6);
        setShouldGenerateRoomCode(roomCode);
        LoadGroupBattleData("roomCode", roomCode);

        let data = await createBattleRoom(category_selected, username, userprofile, useruid, roomCode, "public", selectedcoins, languageid);

        // popup user found with friend
        setPlaywithfriends(true);

        // coins api
        let status = 1;

        UserCoinScoreApi(
            "-" + selectedcoins,
            null,
            null,
            "battle",
            status,
            (response) => {
                updateUserDatainfo(response.data);
            },
            (error) => {
                console.log(error);
            }
        );

        return data.id;
    };

    // joinroom
    const joinRoom = async (name, profile, usernameid, roomcode, coin) => {
        try {
            setPlaywithfriends(true);
            let result = await joinBattleRoomFrd(name, profile, usernameid, roomcode, coin);
            subscribeToBattleRoom(result.id);
            LoadGroupBattleData("roomid", result.id);
        } catch (e) {
            console.log("error", e);
        }
    };

    // get userroom
    const getMultiUserBattleRoom = async (roomcode) => {
        try {
            let typeBattle = await db.collection("battleRoom").where("roomCode", "==", roomcode).get();
            return typeBattle;
        } catch (e) {
            console.log("error", e);
        }
    };

    // joinBattleRoomFrd
    const joinBattleRoomFrd = async (name, profile, usernameid, roomcode, coin) => {
        try {
            // check roomcode is valid or not
            let mulituserbattle = await getMultiUserBattleRoom(roomcode);

            // invalid room code
            if (mulituserbattle.docs === "") {
                toast.error(t("Invalid Room Code"));
            }

            // // game started code
            if (mulituserbattle.docs[0].data().readyToPlay) {
                toast.success(t("Game Started"));
            }

            // // not enough coins
            // if (mulituserbattle.docs[0].data().entryFee > coin) {
            //     toast.error("Not enough coins");
            //     return;
            // }

            //user2 update
            let docRef = mulituserbattle.docs[0].ref;

            return db.runTransaction(async (transaction) => {
                let doc = await transaction.get(docRef);
                if (!doc.exists) {
                    toast.error(t("Document does not exist!"));
                }

                let userdetails = doc.data();

                let user2 = userdetails.user2;

                if (user2.uid === "") {
                    transaction.update(docRef, {
                        "user2.name": name,
                        "user2.uid": usernameid,
                        "user2.profileUrl": profile,
                    });
                } else {
                    toast.error(t("room is full"));
                }

                return doc;
            });

            //
        } catch (e) {
            console.log("error", e);
        }
    };

    // coins data
    const coinsdata = [
        { id: "1", num: "5" },
        { id: "2", num: "10" },
        { id: "3", num: "15" },
        { id: "4", num: "20" },
    ];

    // selected coins data
    const selectedCoinsdata = (data) => {
        setSelectedCoins({ ...selectedCoins, selected: data.num });
        inputText.current.value = "";
    };

    // inputfeild data
    const handlechange = (e) => {
        // if (e === "") {
        //     toast.error(t("please enter code"));
        //     return;
        // } else {
            setInputCode(e.target.value);
        // }
    };

    // start button
    const startGame = (e) => {
        let roomid = groupBattledata.roomID;

        let docRef = db.collection("battleRoom").doc(roomid);

        return db.runTransaction(async (transaction) => {
            let doc = await transaction.get(docRef);
            if (!doc.exists) {
                toast.error(t("Document does not exist!"));
            }

            let userdetails = doc.data();

            let user2 = userdetails.user2;

            if (user2.uid !== "") {
                transaction.update(docRef, {
                    readyToPlay: true,
                });
                // subscribeToBattleRoom(roomid)
            } else {
                toast.error(t("room is full"));
            }

            return doc;
        });
    };

    // snapshot listner
    useEffect(() => {
        subscribeToBattleRoom();
        setSelectedCoins({ ...selectedCoins, selected: coinsdata[0].num });
    }, []);

    useEffect(() => {
        getAllData();
    }, [selectCurrentLanguage]);

    // get id from localstorage for start button
    let createdby = groupBattledata.createdBy;

    return (
        <Fragment>
            <SEO title={t("1 vs 1 Battle")} />
            <Breadcrumb title={t("1 vs 1 Battle")} content={t("Home")} contentTwo={t("1 vs 1 Battle")} />
            <div className="SelfLearning battlequiz">
                <div className="container">
                    <div className="row morphisam">
                        {/* battle screen */}
                        <div className="col-md-6  col-xl-5 col-xxl-6 col-12">
                            <img src={process.env.PUBLIC_URL + "/images/battle/1vs1battle.svg"} alt="1vs1" className="onevsoneimg pb-3" />
                        </div>
                        <div className="col-md-6  col-xl-7 col-xxl-6 col-12 ">
                            <Tabs defaultActiveKey="1">
                                <TabPane tab={t("Create")} key="1">
                                    <div className="inner_content d-flex align-items-center flex-wrap">
                                        <ul className="coins_deduct d-flex ps-0 align-items-center flex-wrap my-3">
                                            {coinsdata.map((data, idx) => {
                                                return (
                                                    <li key={idx} className="list-unstyled me-5" onClick={(e) => selectedCoinsdata(data)}>
                                                        <button className={`btn btn-primary ${data.num == selectedcoins ? "active-one" : "unactive-one"}`}>{data.num}</button>
                                                        <img src={process.env.PUBLIC_URL + "/images/battle/coin.svg"} alt="coin" />
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                        <div className="input_coins">
                                            <input type="number" placeholder="00" min="0" onChange={(e) => setSelectedCoins({ ...selectedCoins, selected: e.target.value })} ref={inputText} />
                                        </div>
                                    </div>

                                    {/* coins */}
                                    <div className="total_coins my-4 ml-0">
                                        <h5 className=" text-center ">
                                            {t("Current Coins")} : {userData.data.coins}
                                        </h5>
                                    </div>

                                    {/* create room */}
                                    <div className="create_room">
                                        <button className="btn btn-primary" onClick={() => searchRoom()}>
                                            {t("Create Room")}
                                        </button>
                                    </div>
                                </TabPane>
                                <TabPane tab={t("Join")} key="2">
                                    <h5 className=" mb-4">{t("Enter room code here")}</h5>
                                    <div className="join_room_code">
                                        <input type="number" placeholder={t("Enter Code")} onChange={handlechange} className="join_input" min="0" />
                                    </div>
                                    <div className="join_btn mt-4">
                                        <button className="btn btn-primary" onClick={() => joinRoom(username, userprofile, useruid, inputCode, usercoins)}>
                                            {" "}
                                            {t("Join Room")}
                                        </button>
                                    </div>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
            {/* play with friends modal */}

            <Modal centered visible={playwithfriends} onOk={() => setPlaywithfriends(false)} onCancel={() => setPlaywithfriends(false)} footer={null} className="custom_modal_notify retry-modal playwithfriend">
                {playwithfriends ? (
                    <>
                        <div className="randomplayer">
                            <div className="main_screen">
                                <div className="room_code_screen">
                                    <h3>
                                        {t("Room code")} : {shouldGenerateRoomCode}
                                    </h3>
                                    <p>{t("Share this room code to friends and ask them to join")}</p>
                                </div>

                                <div className="share">
                                    <FacebookShareButton
                                        className="me-2"
                                        url={"https://www.facebook.com/"}
                                        quote={`Hello,Join a group battle in ${appName}. Go to Group Battle in Quiz Play and join using the code : ${shouldGenerateRoomCode}`}
                                    >
                                        <FacebookIcon size="30" round="true" />
                                    </FacebookShareButton>
                                    <WhatsappShareButton url={"https://web.whatsapp.com/"} title={`Hello,Join a group battle in ${appName}. Go to Group Battle in Quiz Play and join using the code : ${shouldGenerateRoomCode}`}>
                                        <WhatsappIcon size="30" round="true" />
                                    </WhatsappShareButton>
                                </div>

                                <div className="inner_Screen">
                                    <div className="user_profile">
                                        <img src={userData.data.profile} alt="wrteam" onError={imgError} />
                                        <p className="mt-3">{userData.data.name ? userData.data.name : userData.data.email}</p>
                                    </div>
                                    <div className="vs_image">
                                        <img src={process.env.PUBLIC_URL + "/images/battle/vs.svg"} alt="versus" height={100} width={50} />
                                    </div>
                                    <div className="opponent_image">
                                        <img src={typeof userdata.profile === "undefined" ? "" : userdata.profile} alt="wrteam" onError={imgError} />
                                        <p className="mt-3">{typeof userdata.userName === "undefined" ? "" : userdata.userName}</p>
                                    </div>
                                </div>
                                {(() => {
                                    if (userData.data.id == createdby) {
                                        return (
                                            <>
                                                {showStart ? (
                                                    <div className="start_game">
                                                        <button className="btn btn-primary" onClick={(e) => startGame(e)}>
                                                            {t("Start Game")}
                                                        </button>
                                                    </div>
                                                ) : (
                                                    ""
                                                )}
                                            </>
                                        );
                                    }
                                })()}
                            </div>
                        </div>
                    </>
                ) : (
                    ""
                )}
            </Modal>
        </Fragment>
    );
};

export default withTranslation()(RandomBattle);

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from "antd";
import { FaRegBell } from "react-icons/fa";
import { withTranslation, useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {imgError, isLogin } from "../../utils";
import config from "../../utils/config";
import { useSelector } from "react-redux";
import { auth } from "../../firebase";
import { logout } from "../../store/reducers/userSlice";
import { notificationApi } from "../../store/actions/campaign";
import { toast } from "react-toastify";
import { loadLanguages, selectCurrentLanguage, selectLanguages, setCurrentLanguage } from "../../store/reducers/languageSlice";
import { sysConfigdata } from "../../store/reducers/settingsSlice";


const MySwal = withReactContent(Swal);

const TopHeader = ({ t }) => {

    const { i18n } = useTranslation();

    const languages = useSelector(selectLanguages);

    const selectcurrentLanguage = useSelector(selectCurrentLanguage);

    // store data get
    const userData = useSelector((state) => state.User);

    const systemconfig = useSelector(sysConfigdata);

    //passing route
    const navigate = useNavigate();

    //notification
    const [notificationmodal, setNotificationModal] = useState(false);

    const [notifications, setNotifications] = useState([]);

    // language change
    const languageChange = async (name, code, id) => {
        setCurrentLanguage(name, code, id);
        await i18n.changeLanguage(code);
    };

    //api render
    useEffect(() => {
        loadLanguages("", (response) => {
            if (selectcurrentLanguage.code == null) {
                let index = response.data.filter((data) => {
                    if (data.code == config.defaultLanguage) {
                        return { code: data.code, name: data.name, id: data.id };
                    }
                });
                setCurrentLanguage(index[0].language,index[0].code,index[0].id)

            }

        }, (error) => {
            toast.error(error)
        });

        if (isLogin()) {
            notificationApi(null, "DESC", 0, 10, (response) => {
                setNotifications(response.data);
            }, (error) => {

            })
        }
    }, []);

    // sign out
    const handleSignout = () => {
        MySwal.fire({
            title: t("Logout"),
            text: t("Are you sure"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: t("Logout"),
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                auth.signOut();
                navigate("/");
            }
        });
    };

    // check user data for username
    let userName = "";

     const checkUserData = (userData) => {
        if (userData.data && userData.data.name != "") {
            return userName = userData.data.name;
        } else if (userData.data && userData.data.email != "") {
            return userName = userData.data.email;
        } else {
            return userName = userData.data.mobile;
        }
     }

    return (
        <React.Fragment>
            <div className="small__top__header">
                <div className="row justify-content-between align-items-center">
                    <div className="col-md-6 col-12">
                        {systemconfig && systemconfig.language_mode === "1" ? (
                            <div className="dropdown__language">
                                <DropdownButton className="inner-language__dropdown" title={selectcurrentLanguage && selectcurrentLanguage.name ? selectcurrentLanguage.name : "Select Language"}>
                                    {/* {console.log("languages==>",languages)} */}
                                    {languages &&
                                        languages.map((data, _index) => {
                                            return (
                                                <Dropdown.Item onClick={() => languageChange(data.language,data.code,data.id)} key={data.id}>
                                                    {data.language}
                                                </Dropdown.Item>
                                            );
                                        })}
                                </DropdownButton>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>

                    <div className="col-md-6 col-12">
                        <div className="top_header_right">
                            <div className="login__sign__form">
                                {isLogin() && checkUserData(userData) ? (
                                    <DropdownButton id="dropdown-basic-button" title={`${t("hello")} ${userName}`} className="dropdown__login">
                                        <Dropdown.Item onClick={() => navigate("/Profile")}>{t("Profile")}</Dropdown.Item>
                                        <Dropdown.Item onClick={handleSignout} selected>
                                            {t("Logout")}
                                        </Dropdown.Item>
                                    </DropdownButton>
                                ) : (
                                    <div>
                                        <span>
                                            <Link to={"/Login"} className="login">
                                                {t("Login")}
                                            </Link>
                                        </span>
                                        <span>
                                            <Link to={"/SignUp"} className="signup">
                                                {t("Sign Up")}
                                            </Link>
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="notification">
                                {isLogin() ? (
                                    <Button className="notify_btn btn-primary" onClick={() => setNotificationModal(true)}>
                                        <FaRegBell />
                                    </Button>
                                ) : (
                                    ""
                                )}
                                <Modal title={t("Notification")} centered visible={notificationmodal} onOk={() => setNotificationModal(false)} onCancel={() => setNotificationModal(false)} footer={null} className="custom_modal_notify">
                                    {notifications.length ? (
                                        notifications.map((data, key) => {
                                            return (
                                                <div key={key} className="outer_noti">
                                                    <img className="noti_image" src={data.image ? data.image : process.env.PUBLIC_URL + "/images/user.svg"} alt="notication" id="image" onError={imgError}/>
                                                    <div className="noti_desc">
                                                        <p className="noti_title">{data.title}</p>
                                                        <p>{data.message}</p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <h5 className="text-center text-black-50">{t("No Data found")}</h5>
                                    )}
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(TopHeader);

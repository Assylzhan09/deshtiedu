import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";
import { FaCamera, FaEnvelope, FaEnvelopeOpenText, FaMobileAlt, FaPhoneAlt, FaRegBookmark, FaSignOutAlt, FaTrashAlt, FaUserCircle } from "react-icons/fa";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { withTranslation } from "react-i18next";
import config from "../utils/config";
import { getUserProfilestatisticsApi, getUserStatisticsDataApi, logout, updateProfileApi, updateProfileDataApi } from "../store/reducers/userSlice";
import { auth } from "../firebase";
import { useSelector } from "react-redux";
import { deleteuserAccountApi } from "../store/actions/campaign";
import { imgError } from "../utils";

const MySwal = withReactContent(Swal);

const Profile = ({ t }) => {
    const navigate = useNavigate();

    const userData = useSelector((state) => state.User);
    // console.log("user",userData)

    const [profile, setProfile] = useState({ name: "" });

    // user profile data get and statics
    useEffect(() => {
        getUserProfilestatisticsApi(
            userData.data.id,
            (success) => {},
            (error) => {
                toast.error(error);
            }
        );

        getUserStatisticsDataApi(
            (success) => {},
            (error) => {
                toast.error(error);
            }
        );
    }, []);

    // onchange name and mobile
    const handleChange = (event) => {
        const field_name = event.target.name;
        const field_value = event.target.value;
        if (field_name === "mobile" && event.target.value.length > 16) {
            event.target.value = field_value.slice(0, event.target.maxLength);
            return false;
        }
        setProfile((values) => ({ ...values, [field_name]: field_value }));
    };

    // update name and mobile
    const formSubmit = (e) => {
        e.preventDefault();
        if (!config.demo) {
            updateProfileDataApi(
                "",
                profile.name,
                profile.mobile,
                (success) => {
                    toast.success("successfully updated");
                },
                (error) => {
                    toast.error(error);
                }
            );
        } else {
            toast.error(t("Profile update is not allowed in demo version."));
        }
    };

    // update profile image
    const handleImageChange = (e) => {
        e.preventDefault();
        if (!config.demo) {
            updateProfileApi(
                e.target.files[0],
                (success) => {
                    toast.success("successfully updated");
                },
                (error) => {
                    toast.error(error);
                }
            );
        } else {
            toast.error(t("Profile update is not allowed in demo version."));
        }
    };

    // sign out
    const handleSignout = (e) => {
        e.preventDefault();
        MySwal.fire({
            title: t("Logout"),
            text: t("Are you sure"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: t("Logout"),
            cancelButtonText: t("Cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                auth.signOut();
                navigate("/");
            }
        });
    };

    // delete user account
    const deleteAccountClick = (e) => {
        e.preventDefault();
        MySwal.fire({
            title: t("Are you sure"),
            text: t("You won't be able to revert this"),
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: t("Yes delete it"),
            cancelButtonText: t("Cancel"),
        }).then((result) => {
            if (result.isConfirmed) {
                deleteuserAccountApi(
                    (success) => {
                        Swal.fire(t("Deleted"), t("Data has been deleted"), "success");
                        logout();
                        auth.signOut();
                        navigate("/");
                    },
                    (error) => {
                        toast.error(error);
                        Swal.fire(t("OOps"), t("Please Try again"), "error");
                    }
                );
            }
        });
    };

    return (
        <React.Fragment>
            <SEO title={t("Profile")} />
            <Breadcrumb title={t("Profile")} content={t("Home")} contentTwo={t("Profile")} />
            <div className="Profile__Sec">
                <div className="container px-1">
                    <div className="morphism p-5">
                        <form onSubmit={formSubmit}>
                            <div className="row pro-card position-relative">
                                <div className="col-xl-5 col-lg-5 col-md-12 col-12 ">
                                    <div className="card main__profile pt-5 d-flex justify-content-center align-items-center">
                                        <div className="prop__image">
                                            <img src={userData.data && userData.data.profile ? userData.data.profile : process.env.PUBLIC_URL + "/images/user.svg"} alt="profile" id="user_profile" onError={imgError} />
                                            <div className="select__profile">
                                                <input type="file" name="profile" id="file" onChange={handleImageChange} />
                                                <label htmlFor="file">
                                                    {" "}
                                                    <em>
                                                        <FaCamera />
                                                    </em>
                                                </label>
                                                <input type="text" className="form-control" placeholder={t("Upload File")} id="file1" name="myfile" disabled hidden />
                                            </div>
                                        </div>
                                        <div className="prop__title">
                                            <h3>{userData.data && userData.data.name}</h3>
                                        </div>
                                        {userData.data && userData.data.mobile ? (
                                            <div className="mobile__number">
                                                <span>
                                                    <i>
                                                        <FaPhoneAlt />
                                                    </i>
                                                    <p>{userData.data.mobile}</p>
                                                </span>
                                            </div>
                                        ) : (
                                            ""
                                        )}

                                        {userData.data && userData.data.email ? (
                                            <div className="email__id">
                                                <span>
                                                    <i>
                                                        <FaEnvelope />
                                                    </i>
                                                    <p>{userData.data.email}</p>
                                                </span>
                                            </div>
                                        ) : (
                                            ""
                                        )}
                                    </div>
                                </div>
                                <div className="col-xl-7 col-lg-7 col-md-12 col-12 border-line">
                                    <div className="card p-4 bottom__card_sec">
                                        <div className="row">
                                            <div className="col-md-6 col-12">
                                                <label htmlFor="fullName">
                                                    <input type="text" name="name" id="fullName" placeholder={t("Enter Your Name")} defaultValue={profile.name} onChange={handleChange} required />
                                                    <i className="custom-icon">
                                                        <FaUserCircle />
                                                    </i>
                                                </label>
                                            </div>
                                            <div className="col-md-6 col-12">
                                                <label htmlFor="mobilenumber">
                                                    <input
                                                        type="number"
                                                        name="mobile"
                                                        id="mobilenumber"
                                                        className="mobile"
                                                        placeholder={t("Enter Your Mobile Number")}
                                                        defaultValue={profile.mobile}
                                                        onChange={handleChange}
                                                        min="0"
                                                        onWheel={(event) => event.currentTarget.blur()}
                                                    />
                                                    <i className="custom-icon">
                                                        <FaMobileAlt />
                                                    </i>
                                                </label>
                                            </div>
                                        </div>
                                        <button className="btn btn-primary text-uppercase" type="submit" value="submit" name="submit" id="mc-embedded-subscribe">
                                            {t("Submit")}
                                        </button>

                                        <div className="bottom__profile_card">
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="bookmark__content">
                                                        <NavLink to={"/Bookmark"} className="w-100 d-block">
                                                            <span>{t("bookmark")}</span>
                                                            <i className="custom-icon">
                                                                <FaRegBookmark />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="Invite_friends__content">
                                                        <NavLink to={"/Invitefriends"} className="w-100 d-block">
                                                            <span>{t("Invite Friends")}</span>
                                                            <i className="custom-icon">
                                                                <FaEnvelopeOpenText />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6 col-12">
                                                    <div className="Delete_account__content">
                                                        <NavLink to={""} className="w-100 d-block" onClick={deleteAccountClick}>
                                                            <span>{t("Delete Account")}</span>
                                                            <i className="custom-icon">
                                                                <FaTrashAlt />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                                <div className="col-md-6 col-12">
                                                    <div className="Logout__content">
                                                        <NavLink to={""} onClick={handleSignout} className="w-100 d-block">
                                                            <span>{t("Logout")}</span>
                                                            <i className="custom-icon">
                                                                <FaSignOutAlt />
                                                            </i>
                                                        </NavLink>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="row botton_card_details">
                        <div className="col-md-6 col-12 ps-0">
                            <div className="quiz_details morphism">
                                <p className="quiz_details_title">{t("Quiz Details")}</p>
                                <ul className="quiz_details_inner">
                                    <li>
                                        {t("Rank")}
                                        <span className="badge badge-pill custom_badge">{userData.data && userData.data.userProfileStatics.all_time_rank}</span>
                                    </li>
                                    <li>
                                        {t("Score")}
                                        <span className="badge badge-pill custom_badge">{userData.data && userData.data.userProfileStatics.all_time_score}</span>
                                    </li>
                                    <li>
                                        {t("Coins")}
                                        <span className="badge badge-pill custom_badge">{userData.data && userData.data.userProfileStatics.coins}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="col-md-6 col-12 pe-0">
                            <div className="questions_details morphism">
                                <p className="questions_details_title">{t("Questions Details")}</p>
                                <ul className="questions_details_inner">
                                    <li>
                                        {t("Attempted")}
                                        <span className="badge badge-pill custom_badge">{userData.data && userData.data.userStatics.questions_answered}</span>
                                    </li>
                                    <li>
                                        {t("Correct")}
                                        <span className="badge badge-pill custom_badge">{userData.data && userData.data.userStatics.correct_answers}</span>
                                    </li>
                                    <li>
                                        {t("Incorrect")}
                                        <span className="badge badge-pill custom_badge">
                                            {userData.data &&
                                                userData.data.userStatics.questions_answered &&
                                                userData.data.userStatics.correct_answers &&
                                                parseInt(userData.data.userStatics.questions_answered) - parseInt(userData.data.userStatics.correct_answers)}
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(Profile);

import React, { lazy, Suspense, useEffect, useState} from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import NavScrollTop from "./components/NavScrollTop";
import language from "./utils/language";
import config from "./utils/config";
import { settingsLoaded, sysConfigdata, systemconfigApi } from "./store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import { logout } from "./store/reducers/userSlice";
import { auth } from "./firebase";
import { Route, Routes, useNavigate } from 'react-router-dom';
import Router from "./routes/Router";
import TopHeader from "./components/smalltopheader/TopHeader";
import Header from "./partials/header/Header";
import Footer from "./partials/footer/Footer";
import { RiseLoader } from "react-spinners";
import { selectCurrentLanguage } from "./store/reducers/languageSlice";
// import AdSense from "./components/adsense/Adsense";

// CSS File Here
import "antd/dist/antd.min.css";
import "./assets/css/fonts/fonts.css";
import "./assets/css/vendor/animate.css";
import "react-toastify/dist/ReactToastify.css";
import 'react-loading-skeleton/dist/skeleton.css'

//for LTR
import "./assets/css/bootstrap.min.css";
import "./assets/scss/style.scss";



// for RTL
// import "./assets/css/bootstrap.rtl.min.css";
// import "./assets/css/style.rtl.css";

// Maintenance Mode
const Maintainance = lazy(() => import("./pages/Maintainance"));

const MySwal = withReactContent(Swal);

const App = () => {
    const { i18n } = useTranslation();
    const navigate = useNavigate();

    const [redirect, setRedirect] = useState(false);


    // if same id login in other brower then its logout from current session
    const TOKEN_EXPIRED = "129";

    function handleLogout() {
        logout();
        auth.signOut();
        navigate('/');
    }

    axios.interceptors.response.use(function(response) {
        if (response.data && response.data.message === TOKEN_EXPIRED) {
            MySwal.fire({
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Logout",
            allowOutsideClick: false,
            }).then((result) => {
            if (result.isConfirmed) {
                handleLogout();
            }
            });
            return Promise.reject(new Error("Session expired"));
        } else if (response.status >= 400 && response.status < 500) {
            // Handle other client errors
            return Promise.reject(new Error("Client error"));
        } else if (response.status >= 500 && response.status < 600) {
            // Handle server errors
            return Promise.reject(new Error("Server error"));
        }
        // Return the response for further processing
        return response;
    });

    const selectcurrentLanguage = useSelector(selectCurrentLanguage);

    // all settings data
    useEffect(() => {
        settingsLoaded("");
        systemconfigApi((success) => {

        }, (error) => {
            console.log(error);
        });
        i18n.changeLanguage(selectcurrentLanguage.code)
    }, [])

    // Maintainance Mode
    const getsysData = useSelector(sysConfigdata)

    useEffect(() => {
        if (getsysData && getsysData.app_maintenance === "1") {
            setRedirect(true)
        } else {
            setRedirect(false)
        }
    }, [getsysData.app_maintenance]);


    return (
        <I18nextProvider i18n={language}>
            <ToastContainer theme="colored"/>
            {/* <AdSense /> */}
            <TopHeader />
            <Header />
            <NavScrollTop>
                {redirect ?
                    <Routes>
                        <Route path="*" exact={true} element={<Maintainance />}/>
                    </Routes>
                    :
                    <Suspense fallback={<div className="loader"><RiseLoader color="#ef5488" className="inner_loader" /></div>}>
                        <Router/>
                    </Suspense>
                }
            </NavScrollTop>
            <Footer />
        </I18nextProvider>
    );
};
export default App;

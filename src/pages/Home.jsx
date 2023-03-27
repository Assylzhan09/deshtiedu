import React, { Fragment, useEffect } from "react";
import SEO from "../components/SEO";
import ScrollToTop from "../components/ScrollToTop";
import IntroSlider from "../components/IntroSlider/IntroSlider";
import { getAndUpdateBookmarkData, isLogin } from "../utils";
import { t } from "i18next";

const Home = () => {
    useEffect(() => {
        if (isLogin()) {
            getAndUpdateBookmarkData();
        }
    }, []);
    return (
        <Fragment>
            <SEO title={t("Home")} />
            <IntroSlider />
            <ScrollToTop />
        </Fragment>
    );
};

export default Home;

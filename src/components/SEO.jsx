import PropTypes from "prop-types";
import React from "react";
import { Helmet } from "react-helmet";
import config from "../utils/config.js";
import { useSelector } from "react-redux";
import { settingsData } from "../store/reducers/settingsSlice.js";

const SEO = ({ title }) => {

    const selectdata = useSelector(settingsData);

    const appdata = selectdata && selectdata.filter(item => item.type == "app_name");

    const appName = appdata && appdata.length > 0 ? appdata[0].message : '';
    
    return (
        <Helmet>
            <meta charSet="utf-8" />
            <title>{appName + " | " + title}</title>
            <meta name="robots" content="noindex, follow" />
            <meta name="description" content={config.metaDescription} />
            <meta name="keywords" content={config.metaKeyWords}></meta>
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
            <meta property="og:title" content={appName + " | " + title} />
            <meta property="og:type" content="website" />
        </Helmet>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
};

export default SEO;

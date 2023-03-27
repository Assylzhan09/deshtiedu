import React from "react";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";

const Slider = ({ t, data }) => {
    //truncate description text
    const truncate = (input) => (input?.length > 50 ? `${input.substring(0, 70)}...` : input);

    return (
        <div className="slide2">
            <div className="container position-relative">
                <div className="row align-items-center">
                    <div className="col-lg-8 col-12">
                        <div className="outer__slide1__img">
                            {data.image ? <img src={data.image} alt="slider" /> : <Skeleton height={400} count={5}/>}
                        </div>
                    </div>
                    <div className="col-lg-4 col-12">
                        <div className="slider__content">
                            <h3>{data && data.title}</h3>
                            <p className="mb-4">{data && data.description ? truncate(data.description) : <Skeleton />}</p>
                        </div>
                        <Link to={"/Quizplay"} className="btn btn-primary slider1__btn me-2">
                            {t("Lets Play")}
                        </Link>
                        <Link to={"/contact-us"} className="btn slider1__btn2 text-white">
                            {t("Contact Us")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withTranslation()(Slider);

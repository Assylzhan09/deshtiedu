import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Keyboard, Pagination, Navigation, Autoplay } from "swiper/core";
import Slider from "../Intro/Slider";
import { sliderApi } from "../../store/actions/campaign";
import { toast } from "react-toastify";
import { selectCurrentLanguage } from "../../store/reducers/languageSlice";
import { useSelector } from "react-redux";
import { t } from "i18next";
import "swiper/swiper.min.css";
import "swiper/components/pagination/pagination.min.css";
import "swiper/components/navigation/navigation.min.css";

SwiperCore.use([Keyboard, Pagination, Navigation, Autoplay]);

const IntroSlider = () => {

    const selectcurrentLanguage = useSelector(selectCurrentLanguage);
    // const { i18n } = useTranslation();
    const [sliders, setSliders] = useState([]);

    const newSliders = (id) => {
        sliderApi(id, (response) => {
            setSliders(response.data);
            },
            (error) => {
                if (error == "102") {
                    toast.error(t("Please Add Data No Data Found"));
                }
            }
        );
    };

    useEffect(() => {
        if (selectcurrentLanguage.id) {
            newSliders(selectcurrentLanguage.id);
        }
    }, [selectcurrentLanguage]);


    const swiperOption = {
        loop: true,
        speed: 750,
        spaceBetween: 0,
        slidesPerView: 1,
        navigation: true,
        autoplay: false,
    };

    return (
        <div className="intro-slider-wrap section">
            <Swiper effect="fade" className="mySwiper" {...swiperOption}>
                {sliders &&
                    sliders.map((data, key) => {
                        return (
                            <SwiperSlide key={key}>
                                <Slider data={data} />
                            </SwiperSlide>
                        );
                    })}
            </Swiper>
        </div>
    );
};

export default IntroSlider;

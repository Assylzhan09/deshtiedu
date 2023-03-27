import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import SEO from "../components/SEO";
import { withTranslation } from "react-i18next";
import { useEffect } from "react";
import { sysConfigdata } from "../store/reducers/settingsSlice";
import { useSelector } from "react-redux";
import { selectCurrentLanguage } from "../store/reducers/languageSlice";


const Quizplay = ({ t }) => {
    const navigate = useNavigate();

    const systemconfig = useSelector(sysConfigdata);

    const languages = useSelector(selectCurrentLanguage);

    // data show
    const [data, setData] = useState([
        {
            id: 0,
            image: "images/quizplay/quizzone.svg",
            quizname: "Quiz Zone",
            url: "/QuizZone",
            quizzonehide: "1",
        },
        {
            id: 1,
            image: "images/quizplay/dailyquiz.svg",
            quizname: "Daily Quiz",
            url: "/DailyQuizDashboard",
            dailyquizhide: "1",
        },
        {
            id: 2,
            image: "images/quizplay/truefalse.svg",
            quizname: "True & False",
            url: "/TrueandFalsePlay",
            truefalsehide: "1",
        },

        {
            id: 3,
            image: "images/quizplay/funlearn.svg",
            quizname: "Fun & Learn",
            url: "/Fun-and-Learn",
            funandlearnhide: "1",
        },
        {
            id: 5,
            image: "images/quizplay/selfchellenge.svg",
            quizname: "Self Challenge",
            url: "/SelfLearning",
            selfchallengehide: "1",
        },
        {
            id: 6,
            image: "images/quizplay/contestplay.svg",
            quizname: "Contest Play",
            url: "/ContestPlay",
            contestplayhide: "1",
        },
        {
            id: 7,
            image: "images/quizplay/battlequiz.svg",
            quizname: "1 v/s 1 Battle",
            url: "/RandomBattle",
            battlequizhide: "1",
        },
        {
            id: 8,
            image: "images/quizplay/groupplay.svg",
            quizname: "Group Battle",
            url: "/GroupBattle",
            groupplayhide: "1",
        },
        {
            id: 9,
            image: "images/quizplay/audioquiz.svg",
            quizname: "Audio Questions",
            url: "/AudioQuestions",
            audioQuestionshide: "1",
        },
        {
            id: 10,
            image: "images/quizplay/mathmania.svg",
            quizname: "Math Mania",
            url: "/MathMania",
            mathQuestionshide: "1",
        },
        {
            id: 11,
            image: "images/quizplay/exam.svg",
            quizname: "Exam",
            url: "/ExamModule",
            examQuestionshide: "1",
        },
    ]);

    // redirect to page
    const redirectdata = (data) => {
        if (!data.disabled) {
            navigate(data.url);
        } else {
            toast.error(t("Coming Soon"));
        }
    };

    // hide from system settings
    const checkDisabled = () => {
        const modes = [
            {
                configProperty: "daily_quiz_mode",
                dataProperty: "dailyquizhide"
            },
            {
                configProperty: "contest_mode",
                dataProperty: "contestplayhide"
            },
            {
                configProperty: "true_false_mode",
                dataProperty:"truefalsehide"
            },
            {
                configProperty: "self_challenge_mode",
                dataProperty: "selfchallengehide"
            },
            {
                configProperty: "fun_n_learn_question",
                dataProperty: "funandlearnhide"
            },
            {
                configProperty: "guess_the_word_question",
                dataProperty: "guessthewordhide"
            },
            {
                configProperty: "battle_mode_one",
                dataProperty: "battlequizhide"
            },
            {
                configProperty: "battle_mode_group",
                dataProperty: "groupplayhide"
            },
            {
                configProperty: "audio_mode_question",
                dataProperty: "audioQuestionshide"
            },
            {
                configProperty: "maths_quiz_mode",
                dataProperty: "mathQuestionshide"
            },
            {
                configProperty: "exam_module",
                dataProperty:"examQuestionshide"
            },
        ];

        const newData = data.filter(item => {
            for (const mode of modes) {
                if (item[mode.dataProperty] === "1" && systemconfig[mode.configProperty] === "0") {
                    return false;
                }
            }
            return true;
        });

        setData(newData);
    };

    useEffect(() => {
        checkDisabled();
    }, []);

    // this is only for guess the word based on english language only.
    useEffect(() => {
        if (languages.code === "en") {
            // Check if the quiz already exists in the data array
            const quizExists = data.some((quiz) => quiz.quizname === "Guess The Word");

            // If the quiz doesn't exist, add it to the data array
            if (!quizExists) {
                setData((prevData) => [
                    ...prevData,
                    {
                        id: 4,
                        image: "images/quizplay/guesstheword.svg",
                        quizname: "Guess The Word",
                        url: "/Guess-the-Word",
                        guessthewordhide: "1",
                    },
                ]);
            }
        } else {
            // Remove "Guess The Word" quiz from the data array
            setData((prevData) => prevData.filter((quiz) => quiz.quizname !== "Guess The Word"));
        }
    }, [languages.code]);

    return (
        <React.Fragment>
            <SEO title={t("Quizplay")} />
            <div className="Quizzone">
                <div className="container">
                    <ul className="row justify-content-center">
                        {data.map((quiz) => (
                            <li onClick={() => redirectdata(quiz)} className="col-xl-2 col-lg-3 col-md-3 col-sm-6 col-6 small__div" key={quiz.id}>
                                <div className="inner__Quizzone">
                                    {quiz.disabled ? (
                                        <div className="card_disabled">
                                            <div className="card__icon">
                                                <img src={quiz.image} alt="icon" />
                                            </div>
                                            <div className="title__card">
                                                <h5 className="inner__title">{t(quiz.quizname)}</h5>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="card">
                                            <div className="card__icon">
                                                <img src={quiz.image} alt="icon" />
                                            </div>
                                            <div className="title__card">
                                                <h5 className="inner__title">{t(quiz.quizname)}</h5>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </React.Fragment>
    );
};
export default withTranslation()(Quizplay);

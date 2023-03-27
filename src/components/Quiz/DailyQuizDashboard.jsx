import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import SEO from "../SEO";
import Breadcrumb from "../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import ShowScore from "./common/ShowScore";
import Question from "./common/Question";
import ReviewAnswer from "./common/ReviewAnswer";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import config from "../../utils/config.js";
import {getBookmarkData } from "../../utils";
import { useSelector } from "react-redux";
import { sysConfigdata } from "../../store/reducers/settingsSlice";
import {dailyQuizApi, UserCoinScoreApi} from "../../store/actions/campaign"
import { updateUserDataInfo } from "../../store/reducers/userSlice";

const MySwal = withReactContent(Swal);

const DailyQuizDashboard = ({ t }) => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [reviewAnswers, setReviewAnswers] = useState(false);
  const [coins, setCoins] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [level, setLevel] = useState(1);

  // store data get
  const userData = useSelector((state) => state.User);

  const systemconfig = useSelector(sysConfigdata);

  useEffect(() => {
    if (!showScore) {
      getNewQuestions();
    }
  }, []);

  let timerseconds = parseInt(systemconfig.quiz_zone_duration);

  const TIMER_SECONDS = timerseconds;

  const getNewQuestions = () => {

    dailyQuizApi((response) => {
      if (response.data && !response.data.error) {
        let bookmark = getBookmarkData();
        let questions_ids = Object.keys(bookmark).map((index) => {
          return bookmark[index].question_id;
        });
        let questions = response.data.map((data) => {
          let isBookmark = false;
          if (questions_ids.indexOf(data.id) >= 0) {
            isBookmark = true;
          } else {
            isBookmark = false;
          }
          return {
            ...data,
            isBookmarked: isBookmark,
            selected_answer: "",
            isAnswered: false,
          };
        });
        setQuestions(questions);
        // setQuestions(response.data)
        setShowScore(false);
        setReviewAnswers(false);
        setScore(0);
      }
    }, (error) => {
      console.log(error);
      toast.error(t("No Questions Found"));
        navigate("/Quizplay");
    });
  };

  const handleAnswerOptionClick = (questions, score) => {
    setQuestions(questions);
    setScore(score);
  };

  const onQuestionEnd = (coins, quizScore) => {
    setShowScore(true);
    setCoins(coins);
    setQuizScore(quizScore);
  };

  const playAgain = () => {
    if (showScore) {
      getNewQuestions();
    }
  };

  const nextLevel = () => {
    if (showScore && data) {
      let temp_level = level + 1;
      setLevel(temp_level);
      getNewQuestions();
    }
  };

  const handleReviewAnswers = () => {
    MySwal.fire({
      title: t("Are you sure"),
      text:
        config.deductReviewAnswerCoins +
        " " +
        t("Coins will be deducted from your account"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("Continue"),
      cancelButtonText: t("Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        let coins = config.deductReviewAnswerCoins;
        if (userData.data.coins < coins) {
          toast.error(t("You Don't have enough coins"));
          return false;
        }
        let status = 1;
        UserCoinScoreApi("-" + coins, null, null, "Review Answer", status, (response) => {
          setReviewAnswers(true);
          setShowScore(false);
          updateUserDataInfo(response.data)
        }, (error) => {
          Swal.fire(t("OOps"), t("Please Try again"), "error");
          console.log(error);
        })
      }
    });
  };

  const handleReviewAnswerBack = () => {
    setShowScore(true);
    setReviewAnswers(false);
  };

  return (
    <React.Fragment>
      <SEO title={t("DashboardPlay")} />
      <Breadcrumb title={t("Daily Quiz")} content={t("Home")} contentTwo={t("Daily Quiz")}/>
      <div className="dashboard">
        <div className="container">
          <div className="row">
            <div className="morphisam">
              <div className="whitebackground pt-3">
                {(() => {
                  if (showScore) {
                    return (
                      <ShowScore
                        score={score}
                        totalQuestions={questions.length}
                        onPlayAgainClick={playAgain}
                        onReviewAnswersClick={handleReviewAnswers}
                        onNextLevelClick={nextLevel}
                        coins={coins}
                        quizScore={quizScore}
                        currentLevel={level}
                        showQuestions={true}
                        reviewAnswer={true}
                        playAgain={true}
                      />
                    );
                  } else if (reviewAnswers) {
                    return (
                      <ReviewAnswer
                      reviewlevel={false}
                        reportquestions={false}
                        questions={questions}
                        goBack={handleReviewAnswerBack}
                      />
                    );
                  } else {
                    return questions && questions.length >= 0 ? (
                      <Question
                        questions={questions}
                        timerSeconds={TIMER_SECONDS}
                        onOptionClick={handleAnswerOptionClick}
                        onQuestionEnd={onQuestionEnd}
                        showQuestions={true}
                      />
                    ) : (
                      <div className="text-center text-white">
                        <Skeleton count={5}/>
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
          <span className="circleglass__after"></span>
        </div>
      </div>
    </React.Fragment>
  );
};

export default withTranslation()(DailyQuizDashboard);

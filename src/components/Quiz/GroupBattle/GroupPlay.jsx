import React, { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import SEO from "../../SEO";
import Breadcrumb from "../../Breadcrumb/Breadcrumb";
import { toast } from "react-toastify";
import { withTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import config from "../../../utils/config";
import GroupQuestions from "../GroupBattle/GroupQuestions";
import GroupBattleScore from "./GroupBattleScore";
import { QuestionsByRoomIdApi } from "../../../store/actions/campaign";
import { selecttempdata } from "../../../store/reducers/tempDataSlice";
import { useSelector } from "react-redux";

const TIMER_SECONDS = config.randomBattleSeconds;

const GroupPlay = ({ t }) => {

  const navigate = useNavigate();

  const [questions, setQuestions] = useState([{ id: "", isBookmarked: false }]);

  const [showScore, setShowScore] = useState(false);

  const [score, setScore] = useState(0);

  const [quizScore, setQuizScore] = useState(0);

  const [coins, setCoins] = useState(0);

  let getData = useSelector(selecttempdata);

  useEffect(() => {
    if (getData) {
      getNewQuestions(getData.roomCode);
    }
  }, []);

  const getNewQuestions = (match_id) => {
    QuestionsByRoomIdApi(match_id, (response) => {
      let questions = response.data.map((data) => {
        return {
          ...data,
          selected_answer: "",
          isAnswered: false,
        };
      });
      setQuestions(questions);
      setShowScore(false);
      setScore(0);
    }, (error) => {
      toast.error(t("No Questions Found"));
          navigate("/Quizzone");
      console.log(error)
    })
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


  return (
    <React.Fragment>
      <SEO title={t("GroupBattle")} />
      <Breadcrumb
        title={t("GroupBattle")}
        content={t("Home")}
        contentTwo={t("GroupBattle")}
      />
      <div className="funandlearnplay dashboard battlerandom">
        <div className="container">
          <div className="row ">
            <div className="morphisam">
              <div className="whitebackground pt-3">
                <>
                  {(() => {
                    if (showScore) {
                      return (
                        <GroupBattleScore
                          score={score}
                          totalQuestions={questions.length}
                          quizScore={quizScore}
                          playAgain={false}
                          coins={coins}
                        />
                      );
                    }else {
                      return questions && questions.length > 0 && questions[0].id !== "" ? (
                        <GroupQuestions
                          questions={questions}
                          timerSeconds={TIMER_SECONDS}
                          onOptionClick={handleAnswerOptionClick}
                          onQuestionEnd={onQuestionEnd}
                        />
                      ) : (
                        <div className="text-center text-white">
                          <Skeleton count={5}/>
                        </div>
                      );
                    }
                  })()}
                </>
              </div>
            </div>
          </div>
          <span className="circleglass__after"></span>
        </div>
      </div>
    </React.Fragment>
  );
};
export default withTranslation()(GroupPlay);

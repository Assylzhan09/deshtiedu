import React, { lazy } from "react";
import { Route, Routes } from "react-router";
import PublicRoute from "../routes/PublicRoute";
import PrivateRoute from "../routes/PrivateRoute";

const Home = lazy(() => import("../pages/Home"));
const Quizplay = lazy(() => import("../pages/Quizplay"));
const Login = lazy(() => import("../components/smalltopheader/Login"));
const SignUp = lazy(() => import("../components/smalltopheader/SignUp"));
const Otpverify = lazy(() => import("../components/smalltopheader/Otpverify"));
const QuizZone = lazy(() => import("../pages/QuizZone"));
const ResetPassword = lazy(() => import("../components/smalltopheader/ResetPassword"));
const DashboardPlay = lazy(() => import("../components/Quiz/DashboardPlay"));
const Profile = lazy(() => import("../pages/Profile"));
const Bookmark = lazy(() => import("../pages/Bookmark"));
const Instruction = lazy(() => import("../pages/Instruction"));
const Invitefriends = lazy(() => import("../pages/Invitefriends"));
const LeaderBoard = lazy(() => import("../pages/LeaderBoard"));
const Contact_us = lazy(() => import("../pages/Contact-us"));
const About_us = lazy(() => import("../pages/About-us"));
const BookmarkPlay = lazy(() => import("../pages/BookmarkPlay"));
const TermAndConditions = lazy(() => import("../pages/TermAndConditions"));
const PrivacyPolicy = lazy(() => import("../pages/PrivacyPolicy"));
const DailyQuizDashboard = lazy(() => import("../components/Quiz/DailyQuizDashboard"));
const TrueandFalsePlay = lazy(() => import("../pages/TrueandFalsePlay"));
const FunandLearn = lazy(() => import("../pages/Fun-and-Learn"));
const FunandLearnPlay = lazy(() => import("../components/Quiz/Fun_and_Learn/FunandLearnPLay"));
const GuesstheWord = lazy(() => import("../pages/Guess-the-Word"));
const GuesstheWordplay = lazy(() => import("../components/Quiz/Guesstheword/Guessthewordplay"));
const SelfLearning = lazy(() => import("../pages/SelfLearning"));
const SelfLearningplay = lazy(() => import("../components/Quiz/SelfLearning/SelfLearningplay"));
const ContestPlay = lazy(() => import("../pages/ContestPlay"));
const ContestPlayBoard = lazy(() => import("../components/Quiz/ContestPlay/ContestPlayBoard"));
const ContestLeaderBoard = lazy(() => import("../components/Quiz/ContestPlay/ContestLeaderBoard"));
const RandomBattle = lazy(() => import("../pages/RandomBattle"));
const RandomPlay = lazy(() => import("../components/Quiz/RandomBattle/RandomPlay"));
const PlayWithFriendBattle = lazy(() => import("../pages/PlayWithFrndBattle"));
const GroupBattle = lazy(() => import("../pages/GroupBattle"));
const GroupPlay = lazy(() => import("../components/Quiz/GroupBattle/GroupPlay"));
const GroupBattleScore = lazy(() => import("../components/Quiz/GroupBattle/GroupBattleScore"));
const AudioQuestions = lazy(() => import("../pages/AudioQuestions"));
const AudioQuestionsPlay = lazy(() => import("../components/Quiz/AudioQuestions/AudioQuestionsPlay"));
const AudioReviewAnswer = lazy(() => import("../components/Quiz/AudioQuestions/AudioReviewAnswer"));
const MathMania = lazy(() => import("../pages/MathMania"));
const MathmaniaPlay = lazy(() => import("../components/Quiz/Mathmania/MathmaniaPlay"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ExamModule = lazy(() => import("../pages/ExamModule"));
const ExamModulePlay = lazy(() => import("../components/Quiz/Exammodule/ExamModulePlay"));

const Router = () => {
    return (
      <Routes basename={process.env.REACT_APP_BASE_URL}>

        {/* public routes */}

        <Route path="/" exact={true} element={<Home />} />

        <Route path="/home" exact={true} element={<Home />} />

        <Route path="/Instruction" exact={true} element={<Instruction/>}/>

        <Route path="/Quizplay" exact={true} element={<Quizplay/>}/>

        <Route path="/contact-us" exact={true}element={<Contact_us/>}/>

        <Route path="/about-us" exact={true} element={<About_us/>}/>

        <Route path="/terms-conditions" exact={true} element={<TermAndConditions/>}/>

        <Route path="/privacy-policy" exact={true} element={<PrivacyPolicy />} />

        <Route path="*" exact={true} element={<NotFound />} />

         {/* private routes */}
        {/* Display this routes only after User Authentication */}
        <Route path="/" element={<PrivateRoute />}>

          <Route path="/LeaderBoard" exact={true} element={<LeaderBoard />}/>

          <Route path="/QuizZone" exact={true} element={<QuizZone />}/>

          <Route path="/DashboardPlay" exact={true} element={<DashboardPlay />}/>

          <Route path="/DailyQuizDashboard" exact={true} element={<DailyQuizDashboard />}/>

          <Route path="/Profile" exact={true} element={<Profile />}/>

          <Route path="/Bookmark" exact={true} element={<Bookmark />}/>

          <Route path="/play-bookmark-questions" exact={true} element={<BookmarkPlay />}/>

          <Route path="/Invitefriends" exact={true} element={<Invitefriends />}/>

          <Route path="/TrueandFalsePlay" exact={true} element={<TrueandFalsePlay />}/>

          <Route path="/Fun-and-Learn" exact={true} element={<FunandLearn />}/>

          <Route path="/FunandLearnPlay" exact={true} element={<FunandLearnPlay />}/>

          <Route path="/Guess-the-Word" exact={true} element={<GuesstheWord />}/>

          <Route path="/guess-the-word-play" exact={true} element={<GuesstheWordplay />}/>

          <Route path="/SelfLearning" exact={true} element={<SelfLearning />}/>

          <Route path="/SelfLearningPlay" exact={true} element={<SelfLearningplay />}/>

          <Route path="/ContestPlay" exact={true} element={<ContestPlay />}/>

          <Route path="/ContestPlayBoard" exact={true} element={<ContestPlayBoard />}/>

          <Route path="/ContestLeaderBoard" exact={true} element={<ContestLeaderBoard />}/>

          <Route path="/RandomBattle" exact={true} element={<RandomBattle />}/>

          <Route path="/RandomPlay" exact={true} element={<RandomPlay />}/>

          <Route path="/PlaywithfreindBattle" exact={true} element={<PlayWithFriendBattle />}/>

          <Route path="/GroupBattle" exact={true} element={<GroupBattle />}/>

          <Route path="/GroupPlay" exact={true} element={<GroupPlay />}/>

          <Route path="/GroupBattleScore" exact={true} element={<GroupBattleScore />}/>

          <Route path="/AudioQuestions" exact={true} element={<AudioQuestions />}/>

          <Route path="/AudioQuestionsPlay" exact={true} element={<AudioQuestionsPlay />}/>

          <Route path="/AudioReviewAnswer" exact={true} element={<AudioReviewAnswer />}/>

          <Route path="/MathMania" exact={true} element={<MathMania />}/>

          <Route path="/MathmaniaPlay" exact={true} element={<MathmaniaPlay />} />

          <Route path="/ExamModule" exact={true} element={<ExamModule />} />

          <Route path="/ExamModulePlay" exact={true} element={<ExamModulePlay />} />

        </Route>


        {/* Display this pages only if user is not Unauthenticated */}
        <Route path="/" exact={true} element={<PublicRoute afterLoginAccess={false}/>}>
            <Route path="/Login" exact={true} element={<Login/>}/>
          <Route path="/SignUp" exact={true} element={<SignUp />} />
          <Route path="/Otpverify" exact={true} element={<Otpverify />} />
          <Route path="/ResetPassword" exact={true} element={<ResetPassword/>}/>
        </Route>



      </Routes>
    );
};

export default Router;

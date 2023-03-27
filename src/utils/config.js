let config = {
  // Set the Demo Version
  demo: false,

  // you get this type data from google adsense

  // <ins class="adsbygoogle"
  //    style="display:block"
  //    data-ad-client="xxxxxxxxxxxx"
  //    data-ad-slot="xxxxxxxxxxxxxx"
  //    data-ad-format="auto"
  //    data-full-width-responsive="true"></ins>

  // googleAddsense
  data_ad_client: "ca-pub-9667891148162497", //ca-pub-your-ad-client-id
  data_ad_slot:"9154149295", //your-ad-slot-id

  //SEO Configurations
  metaDescription: "Elite Quiz is a Web Quiz Application",
  metaKeyWords: "Elite Quiz,Quiz,Questions,Answers,Online Quiz",

  //Language Configurations
  // Get Your Language Codes ---> https://developers.google.com/admin-sdk/directory/v1/languages
  supportedLanguages: ["en", "hi", "ur"],
  defaultLanguage: "en",

  // If your Default Language is not in supportedLanguages then add there first and after that set the defaultLanguage.

  //Quiz Configurations
  deductReviewAnswerCoins: 10, // 10 coins will be deducted if user Review the Answer
  deductIncorrectAnswerScore: 1, // This will deduct the points if user will give wrong answer
  deductLifeLineCoins: 1, // Deduct Coins when using Life Line

  // default country selection Configurations
  DefaultCountrySelectedInMobile: "in", //Default Country Selected in Mobile Login Screen

  // guess the word Quiz Configurations
  Guessthewordhintcoin: 5, //deduct coins guess the word

  // 1 vs 1 battle Quiz Configurations
  // matchrandomBattleSeconds: 30,
  battlecorrectanswer: 4,
  randomBattleSeconds:30, // 1 vs 1 battle timer seconds
  Randombattlecoins: 5, //deduct coins 1 vs 1 battle
  randomBattleoneToTwoSeconds: 2, // quick answer :- 1 vs 1 battle points 2 added on first 1 & 2 seconds
  randomBattlethreeToFourSeconds: 1, // quick answer :- 1 vs 1 battle points 1 added on first 3 & 4 seconds


  // audio question timer
  audiotimer: 30,
  mathtimer:30,

  //Firebase Configurations

  apiKey: "XXXXXXXXXXXXXXXXXXXXX",
  authDomain: "XXXXXXXXXXXXXXXXX",
  projectId: "XXXXXXXXXXXXXXXXXX",
  storageBucket: "XXXXXXXXXXXXXX",
  messagingSenderId: "XXXXXXXXXX",
  appId: "XXXXXXXXXXXXXXXXXXXXXX",
  measurementId: "XXXXXXXXXXXXXX",

  //footer area
  companytext: "Elite Quiz made with key principles of a beautiful, effective, simple to use and better code quality with use of functional based component.",
  addresstext: "Address: #262-263, Time Square Empire, SH 42 Mirzapar highway,  Bhuj - Kutch 370001 Gujarat India.",
  phonenumber: "+91 9797945459",
  email: "support@wrteam.in",
  facebooklink: "https://www.facebook.com/wrteam.in",
  instagramlink: "https://www.instagram.com/wrteam.in",
  linkedinlink: "https://www.linkedin.com/company/wrteam",
  weblink: "https://wrteam.in/",
  companyname: "WRTeam.",
};

export default config;

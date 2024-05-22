import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';


// Firebase config

// THIS IS FOR NON BUILD RUNS
// const firebaseConfig = {
//     apiKey: Constants.manifest2.extra.expoClient.extra.apiKey,
//     authDomain: Constants.manifest2.extra.expoClient.extra.authDomain,
//     projectId: Constants.manifest2.extra.expoClient.extra.projectId,
//     storageBucket: Constants.manifest2.extra.expoClient.extra.storageBucket,
//     messagingSenderId: Constants.manifest2.extra.expoClient.extra.messagingSenderId,
//     appId: Constants.manifest2.extra.expoClient.extra.appId,
//     measurementId: Constants.manifest2.extra.expoClient.extra.measurementId,
//    // databaseURL: Constants.manifest2.extra.expoClient.extra.databaseURL
// };

// THIS IS FOR ANDROID BUILD RUNS
// const firebaseConfig = {
//     apiKey: Constants.easConfig.extra.apiKey,
//     authDomain: Constants.easConfig.extra.authDomain,
//     projectId: Constants.easConfig.extra.projectId,
//     storageBucket: Constants.easConfig.extra.storageBucket,
//     messagingSenderId: Constants.easConfig.extra.messagingSenderId,
//     appId: Constants.easConfig.extra.appId,
//     measurementId: Constants.easConfig.extra.measurementId,
//    // databaseURL: Constants.manifest2.extra.expoClient.extra.databaseURL
// };

// ANY BUILD
// const firebaseConfig = {
//     apiKey: "AIzaSyCbexBmp1n87jEPtFdUcy03hdTSxEZQ9IU",
//     authDomain: "chatfuze-e6658.firebaseapp.com",
//     projectId: "chatfuze-e6658",
//     storageBucket: "chatfuze-e6658.appspot.com",
//     messagingSenderId: "272135652991",
//     appId: "1:272135652991:web:362cedd001478f4356614a",
//     measurementId: "G-3Q29BMQ5X0",
//     databaseURL: "https://chatfuze-e6658-default-rtdb.europe-west1.firebasedatabase.app"
// };


// ANY BUILD
 const firebaseConfig = {
   apiKey: "AIzaSyCbexBmp1n87jEPtFdUcy03hdTSxEZQ9IU",
  authDomain: "chatfuze-e6658.firebaseapp.com",
  projectId: "chatfuze-e6658",
  storageBucket: "chatfuze-e6658.appspot.com",
  messagingSenderId: "272135652991",
  appId: "1:272135652991:web:362cedd001478f4356614a",
  measurementId: "G-3Q29BMQ5X0",
  databaseURL: "https://chatfuze-e6658-default-rtdb.europe-west1.firebasedatabase.app"
};
//  const firebaseConfig = {
//    apiKey: "AIzaSyDF3ezDdisumUiFNX43xKAd1WVa9hGGpQE",
//    authDomain: "auspicious-silo-407613.firebaseapp.com",
//    projectId: "auspicious-silo-407613",
//    storageBucket: "auspicious-silo-407613.appspot.com",
//    messagingSenderId: "23995301065",
//    appId: "1:23995301065:web:aa3e7e3e821d3178c5e118",
//    measurementId: "G-WGD2TENJHB",
//    databaseURL: "https://auspicious-silo-407613-default-rtdb.firebaseio.com"
//  };


// console.log(firebaseConfig);

// // initialize firebase
initializeApp(firebaseConfig);
// // export const auth = getAuth();
export const database = getFirestore();
// try {
//     const app = initializeApp(firebaseConfig);
//     const database = getFirestore(app);
//     console.log(app);
//     console.log(database);
// } catch (error) {
//     console.error('Firebase initialization error:', error);
// }
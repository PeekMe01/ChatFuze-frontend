import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Ralph Firebase
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

// Antoine Firebase
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


initializeApp(firebaseConfig);

export const database = getFirestore();

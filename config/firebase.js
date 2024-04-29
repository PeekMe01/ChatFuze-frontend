import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase config
const firebaseConfig = {
    apiKey: Constants.manifest2.extra.expoClient.extra.apiKey,
    authDomain: Constants.manifest2.extra.expoClient.extra.authDomain,
    projectId: Constants.manifest2.extra.expoClient.extra.projectId,
    storageBucket: Constants.manifest2.extra.expoClient.extra.storageBucket,
    messagingSenderId: Constants.manifest2.extra.expoClient.extra.messagingSenderId,
    appId: Constants.manifest2.extra.expoClient.extra.appId,
    measurementId: Constants.manifest2.extra.expoClient.extra.measurementId,
    //databaseURL: Constants.manifest2.extra.expoClient.extra.databaseURL
};

console.log(firebaseConfig);

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
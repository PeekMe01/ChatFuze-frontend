import React, { useRef, useState, useEffect } from 'react';
import { AppState } from 'react-native';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from "./config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppLifecycleMonitor = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  function getCurrentDateTime() {
    let currentDate = new Date();
    let day = currentDate.getDate();
    let month = currentDate.getMonth() + 1;
    let year = currentDate.getFullYear();
    let hours = currentDate.getHours();
    let minutes = currentDate.getMinutes();
    let seconds = currentDate.getSeconds();

    let formattedDate = `${year}-${month}-${day}`;
    let formattedTime = `${hours}:${minutes}:${seconds}`;
    let dateTime = `${formattedDate} ${formattedTime}`;

    return dateTime;
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('id');

      if (userToken) {
        let active;
        if (nextAppState === 'active') {
          active = true;
        } else {
          active = false;
        }
        try {
          // Check if the document already exists
          const docRef = doc(database, 'status', userId);
          const docSnapshot = await getDoc(docRef);
          let datetime = getCurrentDateTime();
          if (docSnapshot.exists()) {
            // Update the existing document
            await updateDoc(docRef, { active, datetime });
          } else {
            // If the document doesn't exist, create it
            await setDoc(docRef, { userId: parseInt(userId), active, datetime });
          }
        } catch (error) {
          console.error('Error occurreeEed while updating user status:', error);
        }
      }

    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <></>
  );
};



export default AppLifecycleMonitor;
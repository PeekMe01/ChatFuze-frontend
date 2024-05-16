import { AppState } from 'react-native';
import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useState } from 'react';
import { GluestackUIProvider, View, Text, KeyboardAvoidingView } from '@gluestack-ui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import BubbleScene from './Components/Background/BubbleScene';
import Login from './Components/Login/Login';
import { config } from "@gluestack-ui/config"
import {ImageBackground, Platform } from 'react-native'
import SignUp from './Components/SignUp/SignUp';
import { StatusBar } from 'react-native';
import { useScroll } from '@react-three/drei';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import Profile from './Components/Profile/Profile'
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import EditSettings from './Components/Profile/EditSettings';
import Leaderboard from './Components/Leaderboard/Leaderboard';
import FriendsList from './Components/Profile/FriendsList';
import ProfileVisit from './Components/Profile/ProfileVisit';
import ChangePassword from './Components/Profile/EditSettings/ChangePassword';
import Insights from './Components/Profile/EditSettings/Insights';
import Language from './Components/Profile/EditSettings/Languague';
import AboutUs from './Components/Profile/EditSettings/AboutUs';
import Feedback from './Components/Profile/EditSettings/Feedback';
import Verification from './Components/Profile/EditSettings/Verification';
import ChangeUsername from './Components/Profile/EditProfile/ChangeUsername';
import ChangeCountry from './Components/Profile/EditProfile/ChangeCountry';
import EditBio from './Components/Profile/EditProfile/EditBio';
import EditSocials from './Components/Profile/EditProfile/EditSocials';
import EditProfile from './Components/Profile/EditProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabBar from '@react-navigation/bottom-tabs';
import Messages from './Components/Messages/Messages';
import Chat from './Components/Messages/Chat';
import ProfileMessages from './Components/Messages/ProfileMessages';
import api from './Components/Config'
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { database } from "./config/firebase";
import ChangeProfilePicture from './Components/Profile/EditProfile/ChangeProfilePicture';
import { TotpMultiFactorGenerator } from 'firebase/auth';
// import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
export default function App() {

  const [loginPage, setLoginPage] = useState(true);
  const [signupPage, setSignupPage] = useState(false);
  const [welcomePage, setWelcomePage] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);
  const [userOnline, setUserOnline] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  const [totalUnreadMessages, setTotalUnreadMessages] = useState(0);

  //Let's added listeners for when user receives new messages
  useEffect(()=>{
    setupTotalMessages()
    setupListeners();
  }, [loggedIn])

  const setupTotalMessages = async () => {
    const data = await AsyncStorage.getItem('id')
    const response = await api.get(`/messages/friends/${data}`);
    response.data.forEach(async (friend) => {
      const friendStatusQuery = query(
        collection(database, 'unread'),
        where('senderID', '==', friend.idusers),
        where('receiverID', '==', parseInt(data))
      );

      const querySnapshot = await getDocs(friendStatusQuery);
      querySnapshot.forEach((doc) => {
        console.log(doc.data().messages);
        setTotalUnreadMessages(totalUnreadMessages+doc.data().messages)
      });
    })
  }

  const setupListeners = async () => {
    try {
      const data = await AsyncStorage.getItem('id')
      const response = await api.get(`/messages/friends/${data}`);
      const unsubscribeFunctions = [];

     response.data.forEach(async (friend) => {
         const friendStatusQuery = query(
             collection(database, 'unread'),
             where('senderID', '==', friend.idusers),
             where('receiverID', '==', parseInt(data))
         );
         
        //  const querySnapshot = await getDocs(friendStatusQuery);
        //  querySnapshot.forEach((doc) => {
        //   console.log(doc.data().messages);
        //   setTotalUnreadMessages(totalUnreadMessages+doc.data().messages)
        // });

         // Set up a real-time listener for each query
         const unsubscribe = onSnapshot(friendStatusQuery, (snapshot) => {
             console.log(`Snapshot received for friend ${friend.idusers}`);
             snapshot.docChanges().forEach((change) => {
                 if (change.type === 'added' ||change.type === 'modified') {
                     console.log(`Friend ${friend.idusers} has sent you a message`);
                     setupTotalMessages()
                 }
             });
         });

         // Add the unsubscribe function to the array
         unsubscribeFunctions.push(unsubscribe);
         });

         // Return a cleanup function that unsubscribes all listeners
         return () => {
             unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
         };
    } catch (error) {
        console.log(error)
    }
  }


  useEffect(() => {
    checkLoginStatus(); 

    if (AppState) {
      AppState.addEventListener('change', handleAppStateChange);
    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }
  }, []);

  useEffect(() =>{
    handleAppStateChange()
  }, [loggedIn])

function getCurrentDateTime() {
  let currentDate = new Date();
  let day = currentDate.getDate();
  let month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
  let year = currentDate.getFullYear();
  let hours = currentDate.getHours();
  let minutes = currentDate.getMinutes();
  let seconds = currentDate.getSeconds();

  // Format the date and time
  let formattedDate = `${year}-${month}-${day}`;
  let formattedTime = `${hours}:${minutes}:${seconds}`;

  // Concatenate date and time
  let dateTime = `${formattedDate} ${formattedTime}`;

  // Return the concatenated date and time
  return dateTime;
}
  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleAppStateChange = useCallback(async (nextAppState) => {
    const userToken = await AsyncStorage.getItem('userToken');
    const userId = await AsyncStorage.getItem('id');
    if (userToken) {
        let active;
        console.log("App.js " + imagePickerOpen)
        // if(imagePickerOpen){
        //   return;
        // }
        if (nextAppState === 'active' || !nextAppState) {
            active = true;
            setUserOnline(true);
        } else {
            active = false;
            setUserOnline(false);
        }

        try {
            // Check if the document already exists
            const docRef = doc(database, 'status', userId);
            const docSnapshot = await getDoc(docRef);
            let datetime= getCurrentDateTime();
            if (docSnapshot.exists()) {
                // Update the existing document
                
                await updateDoc(docRef, { active ,datetime});
            } else {
                // If the document doesn't exist, create it
                await setDoc(docRef, { userId: parseInt(userId), active ,datetime});
            }

            console.log('User status updated successfully App.js.');
        } catch (error) {
            console.error('Error occurreeEed while updating user status:', error);
        }
    }
}, [setUserOnline]);


  function HomeScreen() {
    return (
      <View style={{ flex: 1}}>
        <StatusBar translucent backgroundColor="transparent"/>
        <ImageBackground
            source={require('./assets/img/HomePage1.png')}
            style={{ flex:1 ,resizeMode: 'cover', justifyContent: 'center', display: 'flex', alignItems: 'center' }}
          >
          <Text>Home!</Text>
        </ImageBackground>
      </View>
    );
  }
  
  function MessagesScreen({ navigation }) {
    React.useLayoutEffect(() => {
      const unsubscribe = navigation.addListener('state', (e) => {
          const currentRoute = e.data.state.routes[e.data.state.index];
          const leafRouteName = getCurrentRouteName(currentRoute);

        
          if (leafRouteName==="Chat" || leafRouteName==="ProfileMessages") {
              navigation.setOptions({
                  tabBarStyle: { display: 'none' }
              });
          } else {
             
              navigation.setOptions({
                tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' }, 
            
              });
          }
      });

      
      return unsubscribe;
  }, [navigation]);

  // Function to get the leaf route name
  const getCurrentRouteName = (route) => {
      if (route.state) {
          // Dive into nested navigators
          return getCurrentRouteName(route.state.routes[route.state.index]);
      }
      return route.name;
  };

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }} initialRouteName='MessagesStack'>
                <Stack.Screen name="MessagesStack" component={Messages} />
                <Stack.Screen name="Chat" component={Chat}/>
                <Stack.Screen name="ProfileMessages" component={ProfileMessages} />
            </Stack.Navigator>
        </View>
    );
}


  function LeaderboardScreen() {
    return (
      <Leaderboard/>
    );
  }

  function ProfileScreen({ navigation }) {
    React.useLayoutEffect(() => {
      const unsubscribe = navigation.addListener('state', (e) => {
          const currentRoute = e.data.state.routes[e.data.state.index];
          const leafRouteName = getCurrentRouteName(currentRoute);

        
          if (leafRouteName!=="ProfileMain" && leafRouteName!=='Profile' ) {
              navigation.setOptions({
                  tabBarStyle: { display: 'none' }
              });
          } else {
              navigation.setOptions({
                tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
              });
          }
      });

      
      return unsubscribe;
  }, [navigation]);

  // Function to get the leaf route name
  const getCurrentRouteName = (route) => {
      if (route.state) {
          // Dive into nested navigators
          return getCurrentRouteName(route.state.routes[route.state.index]);
      }
      return route.name;
  };

    return (
      <View style={{ flex: 1}}>
        {/* initialParams={{ setLoggedIn: setLoggedIn, setLoginPage: setLoginPage, setSignupPage: setSignupPage }} */}
            <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal'}} initialRouteName='ProfileMain'>
              <Stack.Screen name="ProfileMain" component={Profile} />
              <Stack.Screen name="EditSettings">
                { ({ navigation }) => <EditSettings navigation={navigation} setLoggedIn={setLoggedIn} setLoginPage={setLoginPage} setSignupPage={setSignupPage}/>}
              </Stack.Screen>
              <Stack.Screen name="EditProfile" component={EditProfile}/>
              <Stack.Screen name="FriendsList" component={FriendsList}/>
              <Stack.Screen name="ProfileVisit" component={ProfileVisit}/>
              <Stack.Screen name="ChangePassword" component={ChangePassword}/>
              <Stack.Screen name="Insights" component={Insights}/>
              <Stack.Screen name="Language" component={Language}/>
              <Stack.Screen name="AboutUs" component={AboutUs}/>
              <Stack.Screen name="Feedback" component={Feedback}/>
              <Stack.Screen name="Verification" component={Verification}/>
              <Stack.Screen name="ChangeUsername" component={ChangeUsername}/>
              <Stack.Screen name="ChangeCountry" component={ChangeCountry}/>
              <Stack.Screen name="EditBio" component={EditBio}/>
              <Stack.Screen name="EditSocials" component={EditSocials}/>
              <Stack.Screen name="ChangeProfilePicture">
                { ({ navigation }) => <ChangeProfilePicture navigation={navigation} imagePickerOpen={imagePickerOpen} setImagePickerOpen={setImagePickerOpen}/> }
              </Stack.Screen>
            </Stack.Navigator>
       </View>
    );
  }

  if(!loggedIn){
    return (
    
    <GluestackUIProvider config={config}>
      {/* <SafeAreaProvider> */}
      <StatusBar translucent backgroundColor="transparent"/>
      <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
      <View flex={1}>
        <ImageBackground
            source={require('./assets/img/LoginSignUp1.png')}
            style={{ flex:1 ,resizeMode: 'cover', justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100vh'}}
          >

        {/* LOGIN FROM */}
        {loginPage&&<Login 
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          setLoginPage={setLoginPage}
          setSignupPage={setSignupPage} 
          welcomePage={welcomePage} 
          setWelcomePage={setWelcomePage}
        />}

        {/* SIGN UP FORM  */}
        {signupPage&&<SignUp 
          loggedIn={loggedIn}
          setLoggedIn={setLoggedIn}
          setLoginPage={setLoginPage} 
          setSignupPage={setSignupPage} 
          welcomePage={welcomePage} 
          setWelcomePage={setWelcomePage}
        />}

        {/* For later use */}
        {/* Embed the 3D scene component */}
        {/* <BubbleScene /> */}
        </ImageBackground>
      </View>
      </TouchableWithoutFeedback>
      {/* </SafeAreaProvider> */}
    </GluestackUIProvider>
    
  );
  } else if (loggedIn) {

    return (
      // <SafeAreaProvider>
      <GluestackUIProvider config={config}>
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerShown: false}}>
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
              // tabBarIcon: () => <Icon name="home" size={24} color="#2cd6d3" />,
              tabBarIcon: () => <MaterialIcons name="home" size={30} color="white" />,
              tabBarActiveTintColor: "white",
              title: ({focused}) => focused?<Octicons name="dot-fill" size={15} color="#512095" />:<></>,
            }} />
          <Tab.Screen 
            name="Messages" 
            component={MessagesScreen} 
            options={{
              tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' }, 
              // tabBarIcon: () => <Icon name="inbox" size={24} color="#2cd6d3" />,
              tabBarIcon: () => <MaterialIcons name="inbox" size={30} color="white" />,
              tabBarActiveTintColor: "white",
              title: ({focused}) => focused?<Octicons name="dot-fill" size={15} color="#512095" />:<></>,
              tabBarBadge: totalUnreadMessages,
              tabBarBadgeStyle: {backgroundColor: '#512095', display: totalUnreadMessages>0?'flex':'none'}
            }} />
          <Tab.Screen 
          name="Leaderboard" 
          component={LeaderboardScreen} 
          options={{ 
            tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
            tabBarIcon: () => <MaterialIcons name="leaderboard" size={30} color="white" />,
            tabBarActiveTintColor: "white",
            title: ({focused}) => focused?<Octicons name="dot-fill" size={15} color="#512095" />:<></>
          }} />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ 
              tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
              tabBarIcon: () => <MaterialIcons name="person" size={30} color="white" />,
              tabBarActiveTintColor: "white",
              title: ({focused}) => focused?<Octicons name="dot-fill" size={15} color="#512095" />:<></>
             }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
    // </SafeAreaProvider>
    )
    
  }
  
}
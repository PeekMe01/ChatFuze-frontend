import { AppState } from 'react-native';
import 'react-native-gesture-handler';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GluestackUIProvider, View, Text, KeyboardAvoidingView, HStack, Spinner, Center } from '@gluestack-ui/themed';
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
import {
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';

import { UnreadMessagesProvider, useUnreadMessages } from './Components/UnreadMessages/UnreadMessagesProvider'; // Adjust the path accordingly
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AppLifecycleMonitor from './AppLifecycleMonitor';
import Home from './Components/Home/Home';
import MatchMakingScreen from './Components/Home/MatchMakingScreen';
import RequestProvider from './Components/Home/RequestProvider';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [loginPage, setLoginPage] = useState(true);
  const [signupPage, setSignupPage] = useState(false);
  const [welcomePage, setWelcomePage] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  // const [userOnline, setUserOnline] = useState(false);
  const [imagePickerOpen, setImagePickerOpen] = useState(false);

  useEffect(()=>{
    checkUserLogin();
  }, [])

  const checkUserLogin = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('id');
      if(userId){
        setLoggedIn(true)
      }
    } catch (error) {
      setLoggedIn(false)
    }
  }

  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('./assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
});

useEffect(()=>{
  updateUserStatusAfterLoginSignUp();
}, [loggedIn])

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

const updateUserStatusAfterLoginSignUp = async () => {
  if(loggedIn){
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      const userId = await AsyncStorage.getItem('id');
      // Check if the document already exists
      const docRef = doc(database, 'status', userId);
      const docSnapshot = await getDoc(docRef);
      let datetime= getCurrentDateTime();
      if (docSnapshot.exists()) {
          // Update the existing document
          
          await updateDoc(docRef, { active: true ,datetime});
      } else {
          // If the document doesn't exist, create it
          await setDoc(docRef, { userId: parseInt(userId), active: true ,datetime});
      }
    
      console.log('User status updated successfully App.js.');
    } catch (error) {
        console.error('Error occurreeEed while updating user status:', error);
    }
  }
}

  const MainApp = () => {
    const { totalUnreadMessages, setTotalUnreadMessages } = useUnreadMessages();
    const unsubscribesRef = useRef([]);
    const appState = useRef(AppState.currentState);
    const { updateUnreadCounts } = useUnreadMessages();

  useEffect(() => {
    if (loggedIn) {
      setupTotalMessages(updateUnreadCounts);
      const unsubscribeListeners = setupListeners();
      return () => {
        // unsubscribeListeners.forEach((unsub) => unsub());
      };
    }
  }, [loggedIn]);

  const setupTotalMessages = async (updateUnreadCounts) => {
    try {
      const userId = await AsyncStorage.getItem('id');
      const response = await api.get(`/messages/friends/${userId}`);
      let total = 0;
      for (const friend of response.data) {
        const friendStatusQuery = query(
          collection(database, 'unread'),
          where('senderID', '==', friend.idusers),
          where('receiverID', '==', parseInt(userId))
        );

        const querySnapshot = await getDocs(friendStatusQuery);
        querySnapshot.forEach((doc) => {
          total += doc.data().messages;
        });
      }
      setTotalUnreadMessages(total);
    } catch (error) {
      console.error(error);
    }
  };

  const setupListeners = async () => {
    try {
      const userId = await AsyncStorage.getItem('id');
      const response = await api.get(`/messages/friends/${userId}`);
      const unsubscribeFunctions = [];
      // const friendUnreadCounts = {};

      for (const friend of response.data) {
        const friendStatusQuery = query(
          collection(database, 'unread'),
          where('senderID', '==', friend.idusers),
          where('receiverID', '==', parseInt(userId))
        );

        if(friendStatusQuery){
          const unsubscribe = onSnapshot(friendStatusQuery, (snapshot) => {
            let count = 0;
            snapshot.docChanges().forEach((change) => {
              if (change.type === 'added' || change.type === 'modified') {
                count  += change.doc.data().messages;
              }
            });
            updateUnreadCounts(friend.idusers, count);
          });
  
          unsubscribeFunctions.push(unsubscribe);
        }
      }

      unsubscribesRef.current = unsubscribeFunctions;
      return unsubscribeFunctions;
    } catch (error) {
      console.error(error);
    }
  };
  
    return (
      <NavigationContainer>
        <AppLifecycleMonitor />
        <StatusBar translucent backgroundColor="transparent"/>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
              tabBarStyle: { backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
              tabBarIcon: () => <MaterialIcons name="home" size={30} color="white" />,
              tabBarActiveTintColor: "white",
              title: ({ focused }) => focused ? <Octicons name="dot-fill" size={15} color="#512095" /> : <></>,
            }} 
          />
          <Tab.Screen 
            name="Messages" 
            component={MessagesScreen} 
            options={{
              tabBarStyle: { backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
              tabBarIcon: () => <MaterialCommunityIcons name="message" size={30} color="white" />,
              tabBarActiveTintColor: "white",
              title: ({ focused }) => focused ? <Octicons name="dot-fill" size={15} color="#512095" /> : <></>,
              tabBarBadge: totalUnreadMessages,
              tabBarBadgeStyle: { backgroundColor: '#512095', display: totalUnreadMessages > 0 ? 'flex' : 'none' }
            }} 
          />
          <Tab.Screen 
            name="Leaderboard" 
            component={LeaderboardScreen} 
            options={{ 
              tabBarStyle: { backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
              tabBarIcon: () => <MaterialIcons name="leaderboard" size={30} color="white" />,
              tabBarActiveTintColor: "white",
              title: ({ focused }) => focused ? <Octicons name="dot-fill" size={15} color="#512095" /> : <></>
            }} 
          />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ 
              tabBarStyle: { backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
              tabBarIcon: () => <MaterialIcons name="person" size={30} color="white" />,
              tabBarActiveTintColor: "white",
              title: ({ focused }) => focused ? <Octicons name="dot-fill" size={15} color="#512095" /> : <></>
            }} 
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  };

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


  // function HomeScreen() {
  //   return (
  //     <View style={{ flex: 1}}>
  //       <StatusBar translucent backgroundColor="transparent"/>
  //       <ImageBackground
  //           source={require('./assets/img/HomePage1.png')}
  //           style={{ flex:1 ,resizeMode: 'cover', justifyContent: 'center', display: 'flex', alignItems: 'center' }}
  //         >
  //         <Text>Home!</Text>
  //       </ImageBackground>
  //     </View>
  //   );
  // }

  function HomeScreen({ navigation }) {
    React.useLayoutEffect(() => {
      const unsubscribe = navigation.addListener('state', (e) => {
          const currentRoute = e.data.state.routes[e.data.state.index];
          const leafRouteName = getCurrentRouteName(currentRoute);

        
          if (leafRouteName==="MatchMakingScreen") {
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
  const [requestID, setRequestID] = useState(null);
  // requestID={requestID} setRequestID={setRequestID}

  // <Stack.Screen name="HomeScreen">
  //   { ({ navigation }) => <HomeScreen navigation={navigation} requestID={requestID} setRequestID={setRequestID}/>}
  // </Stack.Screen>
  // <Stack.Screen name="MatchMakingScreen">
  //   {({ navigation }) => <MatchMakingScreen navigation={navigation} requestID={requestID} setRequestID={setRequestID}/>}
  // </Stack.Screen>

    return (
      <RequestProvider>
        <View style={{ flex: 1 }}>
            <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }} initialRouteName='MessagesStack'>
                <Stack.Screen name="HomeScreen" component={Home}/>
                <Stack.Screen name="MatchMakingScreen" component={MatchMakingScreen}/>
            </Stack.Navigator>
        </View>
      </RequestProvider>
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
                { ({ navigation }) => <ChangeProfilePicture navigation={navigation}/> }
              </Stack.Screen>
            </Stack.Navigator>
       </View>
    );
  }

  if(!loggedIn){
    return (
    
    <GluestackUIProvider config={config}>
      <AppLifecycleMonitor />
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

        </ImageBackground>
      </View>
      </TouchableWithoutFeedback>
    </GluestackUIProvider>
    
  );
  } else if (loggedIn) {

    return (
        <UnreadMessagesProvider>
          <GluestackUIProvider config={config}>
            <MainApp />
          </GluestackUIProvider>
        </UnreadMessagesProvider>
    )
    
  }
  
}
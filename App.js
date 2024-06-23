import { AppState, ImageBackground, Platform, StatusBar, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { GluestackUIProvider, View, Text, AlertDialogBody, AlertDialog, AlertDialogFooter, ButtonGroup, Button, ButtonText, AlertDialogBackdrop, AlertDialogContent, AlertDialogHeader, Heading, Spinner, ScrollView } from '@gluestack-ui/themed';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { config } from "@gluestack-ui/config"
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './Components/Login/Login';
import SignUp from './Components/SignUp/SignUp';
import Profile from './Components/Profile/Profile'
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
import ChangeDOB from './Components/Profile/EditProfile/ChangeDOB'
import EditBio from './Components/Profile/EditProfile/EditBio';
import EditSocials from './Components/Profile/EditProfile/EditSocials';
import EditProfile from './Components/Profile/EditProfile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Messages from './Components/Messages/Messages';
import Chat from './Components/Messages/Chat';
import ProfileMessages from './Components/Messages/ProfileMessages';
import ChangeProfilePicture from './Components/Profile/EditProfile/ChangeProfilePicture';
import api from './Components/Config'
import { UnreadMessagesProvider, useUnreadMessages } from './Components/UnreadMessages/UnreadMessagesProvider'; // Adjust the path accordingly
import AppLifecycleMonitor from './AppLifecycleMonitor';
import Home from './Components/Home/Home';
import MatchMakingScreen from './Components/Home/MatchMakingScreen';
import RequestProvider from './Components/Home/RequestProvider';
import ChatRoom from './Components/Home/ChatRoom';
import Results from './Components/Home/Results';
import CustomBadge from './Components/Messages/CustomBadge';
import { useFonts } from 'expo-font';
import { collection, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { database } from "./config/firebase";

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
import { Box } from '@gluestack-ui/themed';
import { Center } from '@gluestack-ui/themed';
import { HStack } from '@gluestack-ui/themed';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [loginPage, setLoginPage] = useState(true);
  const [signupPage, setSignupPage] = useState(false);
  const [welcomePage, setWelcomePage] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkUserLogin();
  }, [])

  const checkUserLogin = async () => {
    try {
      const userId = await AsyncStorage.getItem('id');
      if (userId) {
        setLoggedIn(true)
      }
    } catch (error) {
      setLoggedIn(false)
    }
  }

  async function fetchData() {
    try {
      const data = await AsyncStorage.getItem('id')
      const response = await api.get(`/settings/getinsight/${data}`);
      setUser(response.data.user);
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData();
  }, [!user]);

  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('./assets/fonts/ARLRDBD.ttf'),
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

  useEffect(() => {
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
    if (loggedIn) {
      try {

        const userId = await AsyncStorage.getItem('id');
        // Check if the document already exists
        const docRef = doc(database, 'status', userId);
        const docSnapshot = await getDoc(docRef);
        let datetime = getCurrentDateTime();
        if (docSnapshot.exists()) {
          // Update the existing document

          await updateDoc(docRef, { active: true, datetime });
        } else {
          // If the document doesn't exist, create it
          await setDoc(docRef, { userId: parseInt(userId), active: true, datetime });
        }

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
    const { roomIDForListeners, setRoomIDForListeners} = useUnreadMessages();

    // Define the unsubscribeAll function in the component scope
    const unsubscribeAll = () => {
      if(unsubscribesRef.current.length>0){
        unsubscribesRef.current.forEach((unsub) => unsub());
        unsubscribesRef.current = [];
      }
    };

    useEffect(() => {
      if (loggedIn) {
        // Unsubscribe from previous listeners
        unsubscribeAll();
  
        setupTotalMessages(updateUnreadCounts);
  
        const unsubscribeListeners = setupListeners();
        unsubscribesRef.current = unsubscribeListeners;
  
        return () => {
          unsubscribeAll();
        };
      }
    }, [loggedIn, roomIDForListeners]);

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

          if (friendStatusQuery) {
            const unsubscribe = onSnapshot(friendStatusQuery, (snapshot) => {
              let count = 0;
              snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                  count += change.doc.data().messages;
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
          <StatusBar translucent backgroundColor="transparent" />
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
              options={({ route }) => ({
                tabBarStyle: {
                  backgroundColor: 'transparent',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  elevation: 0,
                  marginTop: 10,
                  marginBottom: 20,
                  borderTopColor: 'transparent',
                },
                tabBarIcon: ({ focused }) => (
                  <CustomBadge focused={focused} totalUnreadMessages={totalUnreadMessages} />
                ),
                tabBarActiveTintColor: "white",
                title: ({ focused }) => focused ? <Octicons name="dot-fill" size={15} color="#512095" /> : null,
              })}
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


  function HomeScreen({ navigation }) {
    const [showRejoinAlertDialog, setShowRejoinAlertDialog] = useState(false)
    const [alertDismissed, setAlertDismissed] = useState(false);
    const [countdown, setCountdown] = useState(0);
    React.useLayoutEffect(() => {
      const unsubscribe = navigation.addListener('state', (e) => {
        const currentRoute = e.data.state.routes[e.data.state.index];
        const leafRouteName = getCurrentRouteName(currentRoute);


        if (leafRouteName === "MatchMakingScreen" || leafRouteName === "ChatRoom" || leafRouteName === "HomeVerification" || leafRouteName === "Results") {
          navigation.setOptions({
            tabBarStyle: { display: 'none' }
          });
        } else {

          navigation.setOptions({
            tabBarStyle: { backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },

          });
        }
      });


      return unsubscribe;
    }, [navigation]);

    const getCurrentRouteName = (route) => {
      if (route.state) {
        return getCurrentRouteName(route.state.routes[route.state.index]);
      }
      return route.name;
    };

    useEffect(() => {
      let timer;
      if (showRejoinAlertDialog) {
        timer = setInterval(() => {
          setCountdown(prevCountdown => {
            if (prevCountdown <= 1) {
              clearInterval(timer);
              console.log("timer done")
              setShowRejoinAlertDialog(false)
            }
            return prevCountdown - 1;
          });
        }, 1000);
      }
      return () => clearInterval(timer);
    }, [showRejoinAlertDialog]);

    useEffect(() => {
      checkForAnyValidRejoins()
    }, [])


    const checkForAnyValidRejoins = async () => {
      try {
        const userId = await AsyncStorage.getItem('id');
        const validRejoinsQuery = query(
          collection(database, 'validRejoins'),
          where('inviteReceiver', '==', parseInt(userId)),
          where('status', '==', 'pending')
        );

        const querySnapshot = await getDocs(validRejoinsQuery);
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const createdAtTimestamp = data.createdAt.toDate(); // Convert Firestore Timestamp to JavaScript Date object
          const currentTime = new Date();
          const elapsedTimeInSeconds = Math.floor((currentTime - createdAtTimestamp) / 1000); // Convert milliseconds to seconds

          // Calculate remaining seconds until 30 seconds have passed
          const remainingSeconds = 60 - elapsedTimeInSeconds;
          if (remainingSeconds <= 0) {
          } else {
            setCountdown(remainingSeconds - 1)
            if (!alertDismissed) { // Only show if the alert hasn't been dismissed
              setShowRejoinAlertDialog(true);
            }
          }
        });
      } catch (error) {
        console.log("checkForAnyValidRejoins" + error);
      }
    }

    const rejectRejoinInvite = async () => {
      setCountdown(0)
      setShowRejoinAlertDialog(false)
      setAlertDismissed(true); // Dismiss the alert permanently

      try {
        const userId = await AsyncStorage.getItem('id');
        // Create a query to find documents with the specified criteria
        const q = query(
          collection(database, 'validRejoins'),
          where('inviteReceiver', '==', parseInt(userId)),
          where('status', '==', 'pending')
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No matching documents found to update");
        } else {
          // Iterate over each document and update it
          for (const doc of querySnapshot.docs) {
            // Define the updated fields
            const updatedData = {
              status: 'rejected'
            };

            // Update the document
            await updateDoc(doc.ref, updatedData);


            // Delete the document
            await deleteDoc(doc.ref);

          }
        }
      } catch (error) {
        console.log("Error updating document(s): ", error);
      }
    }

    const acceptRejoinInvite = async () => {
      setCountdown(0)
      setShowRejoinAlertDialog(false)
      setAlertDismissed(true); // Dismiss the alert permanently

      try {
        const userId = await AsyncStorage.getItem('id');
        // Create a query to find documents with the specified criteria
        const q = query(
          collection(database, 'validRejoins'),
          where('inviteReceiver', '==', parseInt(userId)),
          where('status', '==', 'pending')
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log("No matching documents found to update");
        } else {
          // Iterate over each document and update it
          for (const doc of querySnapshot.docs) {
            // Define the updated fields
            const updatedData = {
              status: 'accepted'
            };

            // Update the document
            await updateDoc(doc.ref, updatedData);

            // Delete the document
            await deleteDoc(doc.ref);

            setTimeout(() => {
              navigation.navigate("ChatRoom", {
                receiverID: doc.data().inviteSender,
                roomID: doc.data().roomID,
              });
            }, 1000);
            console.log(`Document with ID ${doc.id} updated successfully`);
          }
        }
      } catch (error) {
        console.log("Error updating document(s): ", error);
      }
    }

    return (
      <RequestProvider>
        <View style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }} initialRouteName='MessagesStack'>
           
			<Stack.Screen name="HomeScreen">
            {({ navigation }) => <Home navigation={navigation} setLoggedIn={setLoggedIn} setLoginPage={setLoginPage} setSignupPage={setSignupPage} />}
          </Stack.Screen>
            <Stack.Screen name="MatchMakingScreen" component={MatchMakingScreen} />
            <Stack.Screen name="ChatRoom" component={ChatRoom} />
            <Stack.Screen name="HomeVerification" component={Verification} />
            <Stack.Screen name="Results" component={Results} />
          </Stack.Navigator>

          {showRejoinAlertDialog && (
            <AlertDialog
              isOpen={showRejoinAlertDialog}
            >
              <AlertDialogBackdrop />
              <AlertDialogContent>
                <AlertDialogHeader justifyContent='center' alignItems='center'>
                  <Heading textAlign='center' paddingTop={80} flex={1} color='#512095'>
                    <AntDesign name='disconnect' size={100} />
                  </Heading>
                </AlertDialogHeader>
                <AlertDialogBody>
                  <Text size="xl" textAlign='center'>
                    Disconnected!
                  </Text>
                  <Text size="md" textAlign='center' marginVertical={10}>
                    {countdown} second{countdown !== 1 ? 's' : ''} before abandoning room.
                  </Text>
                </AlertDialogBody>
                <AlertDialogFooter>
                  <ButtonGroup space="lg">
                    <Button
                      variant="outline"
                      action="secondary"
                      borderWidth={2}
                      onPress={() => {
                        rejectRejoinInvite();
                      }}
                    >
                      <ButtonText>Abandon</ButtonText>
                    </Button>
                    <Button
                      bg="#512095"
                      action="negative"
                      onPress={() => {
                        acceptRejoinInvite();
                      }}
                    >
                      <ButtonText>Rejoin</ButtonText>
                    </Button>
                  </ButtonGroup>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </View>
      </RequestProvider>
    );
  }

  function MessagesScreen({ navigation }) {
    React.useLayoutEffect(() => {
      const unsubscribe = navigation.addListener('state', (e) => {
        const currentRoute = e.data.state.routes[e.data.state.index];
        const leafRouteName = getCurrentRouteName(currentRoute);


        if (leafRouteName === "Chat" || leafRouteName === "ProfileMessages") {
          navigation.setOptions({
            tabBarStyle: { display: 'none' }
          });
        } else {

          navigation.setOptions({
            tabBarStyle: { backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },

          });
        }
      });


      return unsubscribe;
    }, [navigation]);

    const getCurrentRouteName = (route) => {
      if (route.state) {
        return getCurrentRouteName(route.state.routes[route.state.index]);
      }
      return route.name;
    };

    return (
      // <KeyboardAvoidingView style={{ flex: 1}} behavior='height' keyboardVerticalOffset={-500}>
        <View style={{ flex: 1 }}>
          <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }} initialRouteName='MessagesStack'>
            <Stack.Screen name="MessagesStack">
              {({ navigation }) => <Messages navigation={navigation} setLoggedIn={setLoggedIn} setLoginPage={setLoginPage} setSignupPage={setSignupPage}/>}
            </Stack.Screen>
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="ProfileMessages" component={ProfileMessages} />
          </Stack.Navigator>
        </View>
      // </KeyboardAvoidingView>
    );
  }


  function LeaderboardScreen() {
    return (
      <Leaderboard setLoggedIn={setLoggedIn} setLoginPage={setLoginPage} setSignupPage={setSignupPage}/>
    );
  }

  function ProfileScreen({ navigation }) {
    React.useLayoutEffect(() => {
      const unsubscribe = navigation.addListener('state', (e) => {
        const currentRoute = e.data.state.routes[e.data.state.index];
        const leafRouteName = getCurrentRouteName(currentRoute);


        if (leafRouteName !== "ProfileMain" && leafRouteName !== 'Profile') {
          navigation.setOptions({
            tabBarStyle: { display: 'none' }
          });
        } else {
          navigation.setOptions({
            tabBarStyle: { backgroundColor: 'transparent', position: 'absolute', left: 0, right: 0, bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
          });
        }
      });


      return unsubscribe;
    }, [navigation]);

    const getCurrentRouteName = (route) => {
      if (route.state) {
        return getCurrentRouteName(route.state.routes[route.state.index]);
      }
      return route.name;
    };

    return (
      <View style={{ flex: 1 }}>
        <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal' }} initialRouteName='ProfileMain'>
          <Stack.Screen name="ProfileMain">
            {({ navigation }) => <Profile navigation={navigation} setLoggedIn={setLoggedIn} setLoginPage={setLoginPage} setSignupPage={setSignupPage}/>}
          </Stack.Screen>
          <Stack.Screen name="EditSettings">
            {({ navigation }) => <EditSettings navigation={navigation} setLoggedIn={setLoggedIn} setLoginPage={setLoginPage} setSignupPage={setSignupPage} />}
          </Stack.Screen>
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="FriendsList" component={FriendsList} />
          <Stack.Screen name="ProfileVisit" component={ProfileVisit} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="Insights" component={Insights} />
          <Stack.Screen name="Language" component={Language} />
          <Stack.Screen name="AboutUs" component={AboutUs} />
          <Stack.Screen name="Feedback" component={Feedback} />
          <Stack.Screen name="Verification" component={Verification} />
          <Stack.Screen name="ChangeUsername" component={ChangeUsername} />
          <Stack.Screen name="ChangeCountry" component={ChangeCountry} />
          <Stack.Screen name="ChangeDOB" component={ChangeDOB} />
          <Stack.Screen name="EditBio" component={EditBio} />
          <Stack.Screen name="EditSocials" component={EditSocials} />
          <Stack.Screen name="ChangeProfilePicture">
            {({ navigation }) => <ChangeProfilePicture navigation={navigation} />}
          </Stack.Screen>
        </Stack.Navigator>
      </View>
    );
  }

  if (!loggedIn) {
    return (

      <GluestackUIProvider config={config}>
        <AppLifecycleMonitor />
        <StatusBar translucent backgroundColor="transparent" />
        <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
          <View flex={1}>
            <ImageBackground
              source={require('./assets/img/LoginSignUp1.png')}
              style={{ flex: 1, resizeMode: 'cover', justifyContent: 'center', display: 'flex', alignItems: 'center', height: '100vh' }}
            >

              {/* LOGIN FROM */}
              {loginPage && <Login
                loggedIn={loggedIn}
                setLoggedIn={setLoggedIn}
                setLoginPage={setLoginPage}
                setSignupPage={setSignupPage}
                welcomePage={welcomePage}
                setWelcomePage={setWelcomePage}
              />}

              {/* SIGN UP FORM  */}
              {signupPage && <SignUp
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
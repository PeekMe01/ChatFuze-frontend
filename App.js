import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { GluestackUIProvider, View, Text, KeyboardAvoidingView } from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BubbleScene from './Components/Background/BubbleScene';
import Login from './Components/Login/Login';
import { config } from "@gluestack-ui/config"
import { ImageBackground, Platform } from 'react-native'
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [loginPage, setLoginPage] = useState(true);
  const [signupPage, setSignupPage] = useState(false);
  const [welcomePage, setWelcomePage] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  useEffect(() => {

    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      // const id = await AsyncStorage.getItem('id');
      if (userToken) {
        // setid(id)
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };


  function HomeScreen() {
    return (
      <View style={{ flex: 1}}>
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
            <Stack.Navigator screenOptions={{ headerShown: false, presentation: 'transparentModal'}} initialRouteName='ProfileMain'>
              <Stack.Screen name="ProfileMain" component={Profile} />
              <Stack.Screen name="EditSettings" component={EditSettings} initialParams={{ setLoggedIn: setLoggedIn, setLoginPage: setLoginPage, setSignupPage: setSignupPage }}/>
              <Stack.Screen name="EditProfile" component={EditProfile}/>
              <Stack.Screen name="FriendsList" component={FriendsList}/>
              <Stack.Screen name="ProfileVisit" component={ProfileVisit}/>
              <Stack.Screen name="ChangePassword" component={ChangePassword}/>
              <Stack.Screen name="Insights" component={Insights}/>
              <Stack.Screen name="Language" component={Language}/>
              <Stack.Screen name="AboutUs" component={AboutUs}/>
              <Stack.Screen name="Feedback" component={Feedback}/>
              <Stack.Screen name="ChangeUsername" component={ChangeUsername}/>
              <Stack.Screen name="ChangeCountry" component={ChangeCountry}/>
              <Stack.Screen name="EditBio" component={EditBio}/>
              <Stack.Screen name="EditSocials" component={EditSocials}/>
            </Stack.Navigator>
       </View>
    );
  }

  if(!loggedIn){
    return (
    
    <GluestackUIProvider config={config}>
      {/* <SafeAreaProvider> */}
      <StatusBar backgroundColor="transparent" hidden/>
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
              tabBarIcon: () => <Icon name="home" size={24} color="white" />,
              tabBarActiveTintColor: "white"
            }} />
          <Tab.Screen 
            name="Messages" 
            component={MessagesScreen} 
            options={{
              tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' }, 
              // tabBarIcon: () => <Icon name="inbox" size={24} color="#2cd6d3" />,
              tabBarIcon: () => <Icon name="inbox" size={24} color="white" />,
              tabBarActiveTintColor: "white"
            }} />
          <Tab.Screen 
          name="Leaderboard" 
          component={LeaderboardScreen} 
          options={{ 
            tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
            tabBarIcon: () => <Icon name="leaderboard" size={24} color="white" />,
            tabBarActiveTintColor: "white"
          }} />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ 
              tabBarStyle: { backgroundColor: 'transparent',position: 'absolute',left: 0,right: 0,bottom: 0, elevation: 0, marginTop: 10, marginBottom: 20, borderTopColor: 'transparent' },
              tabBarIcon: () => <Icon name="person" size={24} color="white" />,
              tabBarActiveTintColor: "white"
             }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
    // </SafeAreaProvider>
    )
    
  }
  
}
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { GluestackUIProvider, View, Text } from '@gluestack-ui/themed';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BubbleScene from './Components/Background/BubbleScene';
import Login from './Components/Login/Login';
import { config } from "@gluestack-ui/config"
import { ImageBackground } from 'react-native'
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
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  function HomeScreen() {
    return (
      <View style={{ flex: 1}}>
          <Text>Home!</Text>
      </View>
    );
  }
  
  function MessagesScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Message!</Text>
      </View>
    );
  }

  function LeaderboardScreen() {
    return (
      <Leaderboard/>
    );
  }

  function ProfileScreen() {
    return (
      
      <View style={{ flex: 1}}>
          <Stack.Navigator screenOptions={{ headerShown: false}} initialRouteName='ProfileMain'>
            <Stack.Screen name="ProfileMain" component={Profile} />
            <Stack.Screen name="EditSettings" component={EditSettings}/>
          </Stack.Navigator>
       </View>
       
    );
  }

  const [loginPage, setLoginPage] = useState(true);
  const [signupPage, setSignupPage] = useState(false);
  const [welcomePage, setWelcomePage] = useState(true);
  const [loggedIn, setLoggedIn] = useState(true);

  if(!loggedIn){
    return (
    <GluestackUIProvider config={config}>
      <View flex={1}>
        {/* <StatusBar/> */}
        <ImageBackground
            source={require('./assets/img/LoginSignUp1.png')}
            style={{ flex:1 ,resizeMode: 'cover', justifyContent: 'center', display: 'flex', alignItems: 'center' }}
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
    </GluestackUIProvider>
  );
  } else if (loggedIn) {
    return (
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
    )
    
  }
  
}
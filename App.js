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

const Tab = createBottomTabNavigator();

export default function App() {

  function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Eddy 5ara!</Text>
      </View>
    );
  }

  function ProfileScreen() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile!</Text>
      </View>
    );
  }

  const [loginPage, setLoginPage] = useState(true);
  const [signupPage, setSignupPage] = useState(false);
  const [welcomePage, setWelcomePage] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

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
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ 
              tabBarIcon: () => <Icon name="home" size={24} color="#2cd6d3" />,
              tabBarActiveTintColor: "#2cd6d3"
            }} />
          <Tab.Screen 
            name="Messages" 
            component={MessagesScreen} 
            options={{ 
              tabBarIcon: () => <Icon name="inbox" size={24} color="#2cd6d3" />,
              tabBarActiveTintColor: "#2cd6d3"
            }} />
          <Tab.Screen 
          name="Leaderboard" 
          component={LeaderboardScreen} 
          options={{ 
            tabBarIcon: () => <Icon name="leaderboard" size={24} color="#2cd6d3" />,
            tabBarActiveTintColor: "#2cd6d3"
          }} />
          <Tab.Screen 
            name="Profile" 
            component={ProfileScreen} 
            options={{ 
              tabBarIcon: () => <Icon name="person" size={24} color="#2cd6d3" />,
              tabBarActiveTintColor: "#2cd6d3"
             }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </GluestackUIProvider>
    )
    
  }
  
}
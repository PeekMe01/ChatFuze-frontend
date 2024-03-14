import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { GluestackUIProvider, View, Text } from '@gluestack-ui/themed';
import BubbleScene from './Components/Background/BubbleScene';
import Login from './Components/Login/Login';
import { config } from "@gluestack-ui/config"
import { ImageBackground } from 'react-native'
import SignUp from './Components/SignUp/SignUp';
import { StatusBar } from 'react-native';
import { useScroll } from '@react-three/drei';
export default function App() {

  const [loginPage, setLoginPage] = useState(true);
  const [signupPage, setSignupPage] = useState(false);

  return (
    <GluestackUIProvider config={config}>
      <View flex={1}>
        {/* <StatusBar/> */}
        <ImageBackground
            source={require('./assets/img/LoginSignUp1.png')}
            style={{ flex:1 ,resizeMode: 'cover', justifyContent: 'center', display: 'flex', alignItems: 'center' }}
          >

        {/* LOGIN FROM */}
        {loginPage&&<Login setLoginPage={setLoginPage} setSignupPage={setSignupPage}/>}

        {/* SIGN UP FORM  */}
        {signupPage&&<SignUp setLoginPage={setLoginPage} setSignupPage={setSignupPage}/>}

        {/* For later use */}
        {/* Embed the 3D scene component */}
        {/* <BubbleScene /> */}
        </ImageBackground>
      </View>
    </GluestackUIProvider>
  );
}
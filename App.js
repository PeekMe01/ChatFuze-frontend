import 'react-native-gesture-handler';
import React from 'react';
import { GluestackUIProvider, View, Text } from '@gluestack-ui/themed';
import BubbleScene from './Components/Background/BubbleScene';
import Login from './Components/Login/Login';
import { config } from "@gluestack-ui/config"
import { ImageBackground } from 'react-native'
import SignUp from './Components/SignUp/SignUp';

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <View flex={1}>
        <ImageBackground
            source={require('./assets/img/LoginSignUp1.png')}
            style={{ flex:1 ,resizeMode: 'cover', justifyContent: 'center', display: 'flex', alignItems: 'center' }}
          >

        {/* LOGIN FROM */}
        {/* <Login/> */}

        {/* SIGN UP FORM  */}
        <SignUp/>

        {/* For later use */}
        {/* Embed the 3D scene component */}
        {/* <BubbleScene /> */}
        </ImageBackground>
      </View>
    </GluestackUIProvider>
  );
}
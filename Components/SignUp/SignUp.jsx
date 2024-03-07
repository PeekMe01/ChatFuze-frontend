import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View } from '@gluestack-ui/themed';
import React, { Fragment, useState } from 'react';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';
import { HStack } from '@gluestack-ui/themed';
import { Spinner } from '@gluestack-ui/themed';
import * as Progress from 'react-native-progress';
import { createStackNavigator } from '@react-navigation/stack';
import FirstPage from './FirstPage';
// import { NavigationContainer } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import SecondPage from './SecondPage';

const Stack = createStackNavigator();

export default function Login() {

  //First Page
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);

  //Second Page
    const [birthday, setBirthday] = useState();
    const [country, setCountry] = useState("LB");
    const [gender, setGender] = useState('Male');

    const [invalidPassword, setInvalidPassword] = useState(false);
    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
  
  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
  });

  const [signUpProgress, setSignUpProgress] = useState(0)

  const validate = () => {
    let usernameGood = false;
    let emailGood = false;
    let passwordGood = false;

    if((password&&password.length<8)||!password){
        setInvalidPassword(true)
    }else{
        setInvalidPassword(false)
        usernameGood = true;
    }
    if(!email||(email&&!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))){
        setInvalidEmail(true)
    }else{
        setInvalidEmail(false)
        emailGood = true;
    }
    if((username&&username.length<3)||!username){
        setInvalidUsername(true)
    }else{
        setInvalidUsername(false)
        passwordGood = true;
    }
    if(usernameGood&&emailGood&&passwordGood){
      setChangingPage(true)
      setTimeout(function() {
        setChangePage(1);
        setChangingPage(false)
      }, 500); // 1000 milliseconds = 1 second
    }
  }

  if (!fontsLoaded) {
    return (
      <HStack space="sm">
        <Spinner size="large" color="#321bb9" />
      </HStack>
    ) 
  }
  return (
    <Animatable.View animation="fadeIn">
        <View>
            <Center>
              {/* <FormControl m={10} pt={30}>
                  <Progress.Bar progress={signUpProgress} width={300} color='#2cb5d6' height={8}/>
              </FormControl> */}
              <Animatable.Text animation="bounceIn" easing="ease-out">
                <Text size='5xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                  SIGN UP
                </Text>
              </Animatable.Text>
              <Divider my="$10"/>

              
                {changePage==0?
                <Animatable.View animation={changingPage?"fadeOut":null} duration={500}>
                  <FirstPage
                  username={username}
                  setUsername={setUsername}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  invalidUsername={invalidUsername}
                  setInvalidUsername={setInvalidUsername}
                  invalidEmail={invalidEmail}
                  setInvalidEmail={setInvalidEmail}
                  invalidPassword={invalidPassword}
                  setInvalidPassword={setInvalidPassword}
                  signUpProgress={signUpProgress}
                  setSignUpProgress={setSignUpProgress}
                  changePage={changePage}
                  setChangePage={setChangePage}
                  />
                </Animatable.View>
              :changePage==1?
              <SecondPage
                birthday={birthday}
                setBirthday={setBirthday}
                country={country}
                setCountry={setCountry}
                gender={gender}
                setGender={setGender}
                signUpProgress={signUpProgress}
                setSignUpProgress={setSignUpProgress}
                changePage={changePage}
                setChangePage={setChangePage}
              />:<View><Text>NOFUGHDHOHOUFDHVOTUIEHGVDUOFBHVDFUOVBDFUVKBFSKJVDFHVKHSGBHJKDFGYUIEVG{console.log('hello')}</Text></View>}

              <FormControl m={10} pt={50}>
                <Button
                  size="lg"
                  mb="$4"
                  borderRadius={40}
                  hardShadow='1'
                  bgColor="#2cb5d6"
                  $hover={{
                      bg: "$green600",
                      _text: {
                      color: "$white",
                      },
                  }}
                  $active={{
                      bg: "#2c94d6",
                  }}
                  onPress={validate}
                  >
                  <ButtonText fontSize="$xl" fontWeight="$medium">
                    Next
                  </ButtonText>
                </Button>

                <FormControlHelper style={{ alignItems: 'center', justifyContent: 'center'}}>
                  <FormControlHelperText  color='rgba(255,255,255,0.7)' >
                      Already have an account? <FormControlHelperText color='#2cb5d6' fontWeight='$semibold' onPress={()=>console.log('Pressed login')}>Login</FormControlHelperText>
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>

            </Center>
        </View>
    </Animatable.View>
    )
  // return (
  //   <Animatable.View animation="fadeIn">
  //     <FirstPage
  //         username={username}
  //         setUsername={setUsername}
  //         email={email}
  //         setEmail={setEmail}
  //         password={password}
  //         setPassword={setPassword}
  //         invalidUsername={invalidUsername}
  //         setInvalidUsername={setInvalidUsername}
  //         invalidEmail={invalidEmail}
  //         setInvalidEmail={setInvalidEmail}
  //         invalidPassword={invalidPassword}
  //         setInvalidPassword={setInvalidPassword}
  //         signUpProgress={signUpProgress}
  //         setSignUpProgress={setSignUpProgress}
  //         changePage={changePage}
  //         setChangePage={setChangePage}
  //       />
  //     </Animatable.View>
  // );else{
  //   return(
  //     <Animatable.View animation="fadeIn">
  //       <SecondPage
  //         username={username}
  //         setUsername={setUsername}
  //         email={email}
  //         setEmail={setEmail}
  //         password={password}
  //         setPassword={setPassword}
  //         invalidUsername={invalidUsername}
  //         setInvalidUsername={setInvalidUsername}
  //         invalidEmail={invalidEmail}
  //         setInvalidEmail={setInvalidEmail}
  //         invalidPassword={invalidPassword}
  //         setInvalidPassword={setInvalidPassword}
  //         signUpProgress={signUpProgress}
  //         setSignUpProgress={setSignUpProgress}
  //         changePage={changePage}
  //         setChangePage={setChangePage}
  //       />
  //     </Animatable.View>
  //   )
  // }
  
}
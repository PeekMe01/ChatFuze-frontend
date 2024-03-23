import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, ToastDescription, ToastTitle, View } from '@gluestack-ui/themed';
import React, { Fragment, useState, useEffect, useRef } from 'react';
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
import ThirdPage from './ThirdPage';
import { StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Buttons from './Buttons';
import FourthPage from './FourthPage'
import { useToast, Toast } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';

import debounce from 'lodash.debounce';
import axios from 'axios';
import API_URL from '../Config'

const Stack = createStackNavigator();

let goodOTP = false;

export default function Login(props) {

  const toast = useToast()
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  const [emailErrorText, setEmailErrorText] = useState(null);
  const [usernameErrorText, setUsernameErrorText] = useState(null);

  const {
    loggedIn,
    setLoggedIn,
    setLoginPage,
    setSignupPage,
    setWelcomePage,
    welcomePage
  } = props

  useEffect(() => {
    (async () => {
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, [])

  const takePicture = async () => {
    if(cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync();
        console.log(data)
        setImage(data.uri)
      } catch (error) {
        console.log(e)
      }
    }
  }

  //First Page
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [invalidPassword, setInvalidPassword] = useState(false);
    const [invalidUsername, setInvalidUsername] = useState(false);
    const [invalidEmail, setInvalidEmail] = useState(false);

  //Second Page
    const [dateOfBirth, setDateOfBirth] = useState(new Date);
    const [country, setCountry] = useState();
    const [gender, setGender] = useState('male');
    const [invalidCountry, setInvalidCountry] = useState(false)
    const [invalidAge, setInvalidAge] = useState(false)


  //Third Page
    const [image, setImage] = useState(null);
    const [invalidImage, setInvalidImage] = useState(false)

  //Fourth Page
    const [OTP, setOTP] = useState(null);
    const [invalidOTP, setInvalidOTP] = useState(false);

  //Firth Page
    const [changePageAfterOTP, setChangePageAfterOTP] = useState(false);
    
    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [actualOTP, setActualOTP] = useState(null);
    const [attemptingSignup, setAttemptingSignup] = useState(false);

    const validateUsername = async (tmpUsername) => {
      setAttemptingSignup(true)
      if (tmpUsername&&tmpUsername.length > 3) {
        const data = {tmpUsername}
        try {
          // const response = await axios.post('http://localhost:3001/login', data);
          const response = await axios.post(`${API_URL}/Accounts/validate_username`, data);
          if(response){
            if(response.data.available){
              // Good shit
            }else{
              setUsernameErrorText("Username is already in use")
              setInvalidUsername(true);
            }
          }
        } catch (error) {
            console.log(error);
        }
      }
      setAttemptingSignup(false)
    };

    const validateEmail = async (tmpEmail) => {
      setAttemptingSignup(true)
      if (tmpEmail&&tmpEmail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        
        const data = {tmpEmail}
      try {
        // const response = await axios.post('http://localhost:3001/login', data);
        const response = await axios.post(`${API_URL}/Accounts/validate_email`, data);
        if(response){
          if(response.data.available){
            // Good shit
          }else{
            setEmailErrorText("Email is already in use")
            setInvalidEmail(true);
          }
        }
      } catch (error) {
          console.log(error);
      }
      }
      setAttemptingSignup(false)
    }
    
  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
  });

  const [signUpProgress, setSignUpProgress] = useState(0)

  const validate = async () => {
    if(changePage==0){
      let usernameGood = false;
      let emailGood = false;
      let passwordGood = false;

      validateUsername(username);
      validateEmail(email);

      if((password&&password.length<8)||!password){
          setInvalidPassword(true)
      }else{
          setInvalidPassword(false)
          passwordGood = true;
      }
      if(!email||(email&&!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))||invalidEmail){
          setEmailErrorText("Email is in wrong format")
          setInvalidEmail(true)
      }else{
          setInvalidEmail(false)
          emailGood = true;
      }
      if((username&&username.length<3)||!username||invalidUsername){
          setUsernameErrorText("Username is too short")
          setInvalidUsername(true)
      }else{
          setInvalidUsername(false)
          usernameGood = true;
      }
      if(usernameGood&&emailGood&&passwordGood){
        setChangingPage(true)
        setTimeout(function() {
          setChangePage(1);
          setChangingPage(false)
        }, 100); // 1000 milliseconds = 1 second
      } 
    }else if(changePage==1){
      let goodCountry = false;
      if(!country){
        setInvalidCountry(true);
      }else{
        setInvalidCountry(false);
        goodCountry = true;
      }

      if(goodCountry){
        setChangingPage(true)
        setTimeout(function() {
          setChangePage(2);
          setChangingPage(false)
        }, 100); // 1000 milliseconds = 1 second
      }
    }else if(changePage==2){
      let goodImage = true; // temporary true until imagepicker is fixed
      if(!image){
        setInvalidImage(true);
      }else{
        setInvalidImage(false);
        goodImage = true;
      }
      if(goodImage){
        // send the otp
        const data = {email}
        try {
          const response = await axios.post(`${API_URL}/Accounts/sendOTP`, data);
          setActualOTP(response.data.otp)
        } catch (error) {
          
        }
        setChangingPage(true)
        setTimeout(function() {
          setChangePage(3);
          setChangingPage(false)
        }, 100); // 1000 milliseconds = 1 second
      }
    }else if(changePage==3){
      console.log(OTP)
      console.log(actualOTP)
      if(!OTP||OTP!==actualOTP){
        setInvalidOTP(true);
      }else{
        setInvalidOTP(false);
        goodOTP = true;
      }

      if(goodOTP){
        setAttemptingSignup(true);
        const data = {email, username, password, dateOfBirth, country, gender};

        try {
          const response = await axios.post(`${API_URL}/Accounts/register`, data);
          console.log(response.data)
          setChangingPage(true)
          // toast.show({
          //   duration: 3000,
          //   placement: "top",
          //   render: ({ id }) => {
          //       const toastId = "toast-" + id
          //       return (
          //       <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
          //           <VStack space="xs">
          //           <ToastTitle>Welcome Aboard</ToastTitle>
          //           <ToastDescription>
          //               Your account has been succesfully created!
          //           </ToastDescription>
          //           </VStack>
          //       </Toast>
          //       )
          //   },
          //   })
          setChangePage(4);
          setTimeout(function() {
            setLoggedIn(true);
            setChangingPage(false);
            setAttemptingSignup(false)
            setChangePageAfterOTP(true);
          }, 100); // 1000 milliseconds = 1 second

        } catch (error) {
          // halla2 bzabbit
        }
      }
    }
    
  }

  if (!fontsLoaded) {
    return (
      <HStack space="sm">
        <Spinner size="large" color="#321bb9" />
      </HStack>
    ) 
  }

  if(changePageAfterOTP){
    return (
      <Animatable.View animation={changingPage?"fadeOut":null} duration={500}>
        <View>
          {/* <Center> */}
            {/* <FormControl m={10} pt={30}>386154
                <Progress.Bar progress={signUpProgress} width={300} color='#2cb5d6' height={8}/>
            </FormControl> */}
            <Animatable.Text animation="bounceIn" easing="ease-out">
              <Text size='xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' >
                Welcome aboard {username.length<=30?username:username.substring(0, 10)+'...'}!
              </Text>
            </Animatable.Text>
            <Divider my="$10"/>

            <Button
              isDisabled={attemptingSignup}
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
              onPress={()=>console.log('pressed go to home page')}
              >
              <ButtonText fontSize="$xl" fontWeight="$medium">
                Go to home page
              </ButtonText>
            </Button>

          {/* </Center> */}
        </View>
      </Animatable.View>
    )
  }else{
    return (
      <Animatable.View animation={changePage==4?"fadeOut":"fadeIn"} duration={500}>
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
                      emailErrorText={emailErrorText}
                      setEmailErrorText={setEmailErrorText}
                      usernameErrorText={usernameErrorText}
                      setUsernameErrorText={setUsernameErrorText}
                      validateEmail={validateEmail}
                      validateUsername={validateUsername}
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
                <Animatable.View animation={changingPage?"fadeOut":null} duration={500}>
                  <SecondPage
                    invalidAge={invalidAge}
                    setInvalidAge={setInvalidAge}
                    dateOfBirth={dateOfBirth}
                    setDateOfBirth={setDateOfBirth}
                    country={country}
                    setCountry={setCountry}
                    gender={gender}
                    setGender={setGender}
                    signUpProgress={signUpProgress}
                    setSignUpProgress={setSignUpProgress}
                    changePage={changePage}
                    setChangePage={setChangePage}
                    invalidCountry={invalidCountry}
                    setInvalidCountry={setInvalidCountry}
                  />
                </Animatable.View>
                :changePage==2?
                <Animatable.View animation={changingPage?"fadeOut":null} duration={500}>
                <ThirdPage
                  image={image}
                  setImage={setImage}
                  invalidImage={invalidImage}
                  setInvalidImage={setInvalidImage}
                  signUpProgress={signUpProgress}
                  setSignUpProgress={setSignUpProgress}
                  changePage={changePage}
                  setChangePage={setChangePage}
                />
              </Animatable.View>
              :changePage==3||changePage==4?
              <Animatable.View animation={changingPage?"fadeOut":null} duration={500}>
                <FourthPage
                  email={email}
                  OTP={OTP}
                  setOTP={setOTP}
                  invalidOTP={invalidOTP}
                  setInvalidOTP={setInvalidOTP}
                />
              </Animatable.View>
              :<></>}
  
                <FormControl m={10} pt={50}>
                  <Button
                    isDisabled={attemptingSignup}
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
                        Already have an account? <FormControlHelperText color='#2cb5d6' fontWeight='$semibold' onPress={()=>{setSignupPage(false);setLoginPage(true)}}>Login</FormControlHelperText>
                    </FormControlHelperText>
                  </FormControlHelper>
                </FormControl>
  
              </Center>
          </View>
      </Animatable.View>
      // <View style={styles.container}>
      //   <Camera
      //       style={styles.camera}
      //       type={type}
      //       flasMode={flash}
      //       ref={cameraRef}
      //   >
      //       <View style={{top:  '95%', margin: "0px 100px"}}>
      //           <Buttons title={'Take a picture'} icon="camera" onPress={takePicture}/> 
      //       </View>
      //   </Camera>
      // </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      justifyContent: 'center',
      paddingBottom: 20,
      width: '100%'
  },
  camera: {
      flex: 1,
      borderRadius: 20,
      aspectRatio: 7/9

  }
})

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

const Stack = createStackNavigator();

let goodOTP = false;

export default function Login(props) {

  const toast = useToast()
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  const {
    setLoginPage,
    setSignupPage
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
    const [birthday, setBirthday] = useState(new Date);
    const [country, setCountry] = useState();
    const [gender, setGender] = useState('male');
    const [invalidCountry, setInvalidCountry] = useState(false)


  //Third Page
    const [image, setImage] = useState(null);
    const [invalidImage, setInvalidImage] = useState(false)

  //Fourth Page
    const [OTP, setOTP] = useState(null);
    const [invalidOTP, setInvalidOTP] = useState(false);
    
    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)

    const validateUsername = debounce(async (tmpUsername) => {
      if (tmpUsername&&tmpUsername.length > 3) {
        const data = {tmpUsername}
        try {
          // const response = await axios.post('http://localhost:3001/login', data);
          const response = await axios.post('http://192.168.0.102:3001/accounts/validate_username', data);
          if(response){
            if(response.data.available){
              // Good shit
            }else{
              setInvalidUsername(true);
            }
          }
        } catch (error) {
            console.log(error);
        }
      }
    }, 1000); // Adjust the debounce duration as needed

    const validateEmail = debounce(async (tmpEmail) => {
      if (tmpEmail&&tmpEmail.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        
        const data = {tmpEmail}
      try {
        // const response = await axios.post('http://localhost:3001/login', data);
        const response = await axios.post('http://192.168.0.102:3001/accounts/validate_email', data);
        if(response){
          if(response.data.available){
            // Good shit
          }else{
            setInvalidEmail(true);
          }
        }
      } catch (error) {
          console.log(error);
      }
      }
    }, 2000); // Adjust the debounce duration as needed
    
  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
  });

  const [signUpProgress, setSignUpProgress] = useState(0)

  const validate = async () => {
    if(changePage==0){
      let usernameGood = false;
      let emailGood = false;
      let passwordGood = false;

      if((password&&password.length<8)||!password){
          setInvalidPassword(true)
      }else{
          setInvalidPassword(false)
          passwordGood = true;
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
          usernameGood = true;
      }
      if(usernameGood&&emailGood&&passwordGood){
        setChangingPage(true)
        setTimeout(function() {
          setChangePage(1);
          setChangingPage(false)
        }, 500); // 1000 milliseconds = 1 second
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
        }, 500); // 1000 milliseconds = 1 second
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
          const response = await axios.post('http://192.168.0.102:3001/accounts/send_otp', data);
        } catch (error) {
          
        }
        setChangingPage(true)
        setTimeout(function() {
          setChangePage(3);
          setChangingPage(false)
        }, 500); // 1000 milliseconds = 1 second
      }
    }else if(changePage==3){
      if(!OTP){
        setInvalidOTP(true);
      }else{
        setInvalidOTP(false);
        goodOTP = true;
      }

      if(goodOTP){
        setChangingPage(true)
        toast.show({
          duration: 1000,
          placement: "top",
          render: ({ id }) => {
              const toastId = "toast-" + id
              return (
              <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
                  <VStack space="xs">
                  <ToastTitle>Welcome Aboard</ToastTitle>
                  <ToastDescription>
                      Your account has been succesfully created!
                  </ToastDescription>
                  </VStack>
              </Toast>
              )
          },
          })
        setTimeout(function() {
          setChangePage(4);
          setChangingPage(false)
        }, 2000); // 1000 milliseconds = 1 second
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
            :
            <Animatable.View animation={changingPage?"fadeOut":null} duration={500}>
              <FourthPage
                email={email}
                OTP={OTP}
                setOTP={setOTP}
                invalidOTP={invalidOTP}
                setInvalidOTP={setInvalidOTP}
              />
            </Animatable.View>}

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

import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Image, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, ToastDescription, ToastTitle, View } from '@gluestack-ui/themed';
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
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Buttons from './Buttons';
import FourthPage from './FourthPage'
import { useToast, Toast } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import api from '../Config'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons';
import mime from "mime";
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

import debounce from 'lodash.debounce';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

let goodOTP = false;

export default function Login(props) {

  const toast = useToast()

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

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, [])

  // const takePicture = async () => {
  //   if(cameraRef) {
  //     try {
  //       const data = await cameraRef.current.takePictureAsync();
  //       console.log(data)
  //       setImage(data.uri)
  //     } catch (error) {
  //       console.log(e)
  //     }
  //   }
  // }

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
    const [invalidImage, setInvalidImage] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);

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
          // const response = await axios.post(`${API_URL}/Accounts/validate_username`, data);
          const response = await api.post(`/Accounts/validate_username`, data);
          if(response){
            if(response.data.available){
              return true;
            }else{
              setUsernameErrorText("Username is already in use")
              setInvalidUsername(true);
              return false;
            }
          }
        } catch (error) {
            console.log(error);
            return false;
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
        // const response = await axios.post(`${API_URL}/Accounts/validate_email`, data);
        const response = await api.post(`/Accounts/validate_email`, data);
        if(response){
          if(response.data.available){
            return true;
          }else{
            setEmailErrorText("Email is already in use")
            setInvalidEmail(true);
            return false;
          }
        }
      } catch (error) {
          console.log(error);
          return false;
      }
      }
      setAttemptingSignup(false)
    }
    
  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
  });

  const [signUpProgress, setSignUpProgress] = useState(0)

  const validate = async () => {
    setAttemptingSignup(true)
    if(changePage==0){
      
      let usernameGood = false;
      let emailGood = false;
      let passwordGood = false;

      if((password&&password.length<8)||!password){
          passwordGood = false;
          setInvalidPassword(true)
      }else{
          setInvalidPassword(false)
          passwordGood = true;
      }
      if(!email||(email&&!email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))||invalidEmail){
          setEmailErrorText("Email is in wrong format")
          emailGood = false;
          setInvalidEmail(true)
      }else{
          setInvalidEmail(false)
          emailGood = true;
      }
      if((username&&username.length<3)||!username||invalidUsername){
          usernameGood = false;
          setUsernameErrorText("Username is too short")
          setInvalidUsername(true)
      }else{
          setInvalidUsername(false)
          usernameGood = true;
      }
      usernameGood = false;
      emailGood = false;
      usernameGood = await validateUsername(username);
      emailGood = await validateEmail(email);
      
      if(usernameGood&&emailGood&&passwordGood){
        setChangingPage(true)
        setTimeout(function() {
          setChangePage(1);
          setChangingPage(false);
        }, 100); // 1000 milliseconds = 1 second
      }
    }else if(changePage==1){
      let goodCountry = false;
      let goodDateOfBirth = false;
      if(!country){
        goodCountry = false;
        setInvalidCountry(true);
      }else{
        setInvalidCountry(false);
        goodCountry = true;
      }

      if(!dateOfBirth){
        goodDateOfBirth = false;
        setInvalidAge(true);
      }else{
        const currentDate =  dateOfBirth;
        const minimumAgeDate = new Date();
        minimumAgeDate.setFullYear(minimumAgeDate.getFullYear() - 18);
        if (currentDate < minimumAgeDate) {
          setInvalidAge(false)
          goodDateOfBirth = true;
        } else {
          setInvalidAge(true)
          console.log("im too young")
        }
      }

      if(goodCountry&&goodDateOfBirth){
        setChangingPage(true)
        setTimeout(function() {
          setChangePage(2);
          setChangingPage(false)
        }, 100); // 1000 milliseconds = 1 second
      }
    }else if(changePage==2){
      let goodImage = false; // temporary true until imagepicker is fixed
      if(!image){
        goodImage = false
        setInvalidImage(true);
      }else{
        setInvalidImage(false);
        goodImage = true;
      }
      if(goodImage){
        // send the otp
        const data = {email}
        try {
          // const response = await axios.post(`${API_URL}/Accounts/sendOTP`, data);
          const response = await api.post(`/Accounts/sendOTP`, data);
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
        
        const formData = new FormData();

        formData.append('image', {
          name: `${username}_${email}.jpg`,
          uri: image.uri,
          type: 'image/jpg'
        })
        formData.append('email',email);
        formData.append('username',username);
        formData.append('password',password);
        formData.append('dateOfBirth',dateOfBirth+"");
        formData.append('country',country);
        formData.append('gender',gender);

        // const data = {email, username, password, dateOfBirth, country, gender};

        try {
          // const response = await axios.post(`${API_URL}/Accounts/register`, data);
          // const responsePhoto = await axios.post('http://192.168.0.102:3001/Accounts/idphoto', formData ,{
          //   headers:{
          //     'x-expo-app': 'chatfuze-frontend',
          //     Accept: 'application/json',
          //     'Content-Type' : 'multipart/form-data',
          //   },
          // })
          const response = await axios.post('http://192.168.227.92:3001/Accounts/register', formData ,{
            headers:{
              'x-expo-app': 'chatfuze-frontend',
              Accept: 'application/json',
              'Content-Type' : 'multipart/form-data',
            },
          })
          console.log(response.data)
          // console.log(responsePhoto.data)
          setChangingPage(true)
          toast.show({
            duration: 3000,
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
          setChangePage(4);
          setTimeout(async function() {
            const { token, id } = response.data;
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('id', String(id));
            setLoggedIn(true);
            setChangingPage(false);
            setAttemptingSignup(false)
            setChangePageAfterOTP(true);
          }, 100); // 1000 milliseconds = 1 second

        } catch (error) {
          console.log(error)
          toast.show({
            duration: 3000,
            placement: "top",
            render: ({ id }) => {
                const toastId = "toast-" + id
                return (
                <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
                    <VStack space="xs">
                    <ToastTitle>Error</ToastTitle>
                    <ToastDescription>
                        There was an error creating your account.
                    </ToastDescription>
                    </VStack>
                </Toast>
                )
            },
            })
        }
      }
    }
    setTimeout(() => {
      setAttemptingSignup(false)
    }, 1000);
    
    
  }

  if (!fontsLoaded) {
    return (
      <HStack space="sm">
        <Spinner size="large" color="#321bb9" />
      </HStack>
    ) 
  }

  const snap = async () => {
    if (cameraRef) {
      let photo = await cameraRef.current.takePictureAsync();
      console.log("THE PHOTOS ARE HERE, MILDRED", photo);
      setImage(photo);
    }
  };

  const saveImage = async () => {
    // if(image){
    //   try{
    //     // console.log(image.localUri)
    //     await MediaLibrary.createAssetAsync(image);
    //   }catch(e){
    //     console.log(e)
    //   }
    // }
    setOpenCamera(false);
  }

  if(hasCameraPermission&&changePage==2&&openCamera){
    return (
      <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {!image&&<Camera
          style={styles.container}
          type={type}
          flashMode={flash}
          ref={cameraRef}
          ratio='16:9'
        />}
        {!image&&<Icon name='center-focus-weak' size={350} color="#ffffff50" style={{position: 'absolute'}}/>}
        {image&&<Image source={{ uri : image.uri}} alt='photo_id' style={styles.container}/>}
        <View style={{ backgroundColor: 'black', position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', padding: 10, flexDirection: 'row' }}>
          {!image&&
          <TouchableHighlight onPress={()=>{snap()}} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
            <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
              <Icon name="camera-alt" size={50} color="white" style={{padding: 10}}/>
            </View>
          </TouchableHighlight>}
          {image&&
          <>
            <TouchableHighlight onPress={()=>{setImage(null)}} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
              <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
                <Icon name="refresh" size={50} color="white" style={{padding: 10}}/>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={()=>{saveImage()}} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
            <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
              <Icon name="navigate-next" size={50} color="white" style={{padding: 10}}/>
            </View>
            </TouchableHighlight>
          </>
          }
          </View>
      </View>
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
                  openCamera={openCamera}
                  setOpenCamera={setOpenCamera}
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
    height: 2408/3,
    width: 1080/2.4,
    // width: '100%',
    // marginBottom: 15,
    height: '100%',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
  }
})

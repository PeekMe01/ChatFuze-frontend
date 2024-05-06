import { AddIcon, AlertCircleIcon, Button, ButtonText, Divider, FormControlError, FormControlErrorIcon, HStack, Icon, Image, ImageBackground, Pressable, Spinner, Text, TextareaInput, Toast, ToastDescription, ToastTitle, VStack, useToast } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView } from 'react-native';
import { Textarea } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Config'
import { FormControl } from '@gluestack-ui/themed';
import { FormControlErrorText } from '@gluestack-ui/themed';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { StyleSheet, TouchableHighlight } from 'react-native';
import axios from 'axios';
import { CloseIcon } from '@gluestack-ui/themed';

export default function Verification({navigation}) {

    const toast = useToast()

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [clickedButton, setClickedButton] = useState(false);

    const [userHasAnIdVerificationRequest, setUserHasAnIdVerificationRequest] = useState(false);
    const [userAlreadyVerified, setUserAlreadyVerified] = useState(false);

    const [image, setImage] = useState(null);
    const [invalidImage, setInvalidImage] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);

    const checkIfUserHasAnIdVerificationRequest = async () =>{
        const data = {
            userid: await AsyncStorage.getItem('id'),
        }
        try {
            const response = await api.post(`/Accounts/checkIdVerification`, data);
            if(response){
                console.log(response.data)
                setUserAlreadyVerified(response.data.userAlreadyVerified)
                setUserHasAnIdVerificationRequest(response.data.hasIDVerificationRequest)
            }
        } catch (error) {
            console.log(error)
            toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                    <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                        <VStack space="xs">
                        <ToastTitle>Error</ToastTitle>
                        <ToastDescription>
                            There was an error checking for your verification status
                        </ToastDescription>
                        </VStack>
                        <Pressable mt="$1" onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} color="$black" />
                        </Pressable>
                    </Toast>
                    )
                },
            })
        }
    }

    useEffect(() =>{
        checkIfUserHasAnIdVerificationRequest();
    }, [])

    // const [feedback, setFeedback] = useState('');
    // const [invalidFeedback, setInvalidFeedback] = useState(false);
    // const [attemptingSendFeedback, setAttemptingSendFeedback] = useState(false);
    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
    });

    // const handleSendFeedback = async () => {
    //     let goodFeedback = false;
    //     setAttemptingSendFeedback(true);
    //     if(!feedback||feedback.length<20){
    //         setInvalidFeedback(true);
    //         goodFeedback = false;
    //     }else{
    //         goodFeedback = true
    //         setInvalidFeedback(false);
    //     }

    //     if(goodFeedback){
    //         const data = {
    //             userid: await AsyncStorage.getItem('id'),
    //             message: feedback
    //         }

    //         try {
    //             // const response = await axios.post(`${API_URL}/settings/changepassword`, data);
    //             const response = await api.post(`/settings/sendfeedback`, data);
    //             if(response){
    //                 setFeedback('');
    //             toast.show({
    //                 duration: 5000,
    //                 placement: "top",
    //                 render: ({ id }) => {
    //                     const toastId = "toast-" + id
    //                     return (
    //                     <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
    //                         <VStack space="xs">
    //                         <ToastTitle>Success</ToastTitle>
    //                         <ToastDescription>
    //                             Your voice has been heard!
    //                         </ToastDescription>
    //                         </VStack>
    //                     </Toast>
    //                     )
    //                 },
    //                 })
                    
    //             }
    //             setAttemptingSendFeedback(false);
    //         } catch (error) {
    //             // console.log(error.response.data.error)
    //             console.log(error)
    //             const errorMsg = await error.response.data.error;
    //             toast.show({
    //             duration: 5000,
    //             placement: "top",
    //             render: ({ id }) => {
    //                 const toastId = "toast-" + id
    //                 return (
    //                 <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
    //                     <VStack space="xs">
    //                     <ToastTitle>There was an error while sending your feedback.</ToastTitle>
    //                     <ToastDescription>
    //                         {errorMsg}
    //                     </ToastDescription>
    //                     </VStack>
    //                 </Toast>
    //                 )
    //             },
    //             })
    //             setAttemptingSendFeedback(false);
    //         }
    //     }else{
    //         setTimeout(() => {
    //             setAttemptingSendFeedback(false);
    //         }, 1000);
    //     }
    // }

    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                    <HStack space="sm">
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
            </ImageBackground>
        ) 
    }

    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flash, setFlash] = useState(Camera.Constants.FlashMode.off);
    const cameraRef = useRef(null);

    const snap = async () => {
        if (cameraRef) {
            let photo = await cameraRef.current.takePictureAsync();
            console.log("THE PHOTOS ARE HERE, MILDRED", photo);
            setImage(photo);
        }
    };

    const saveImage = async () => {
        setOpenCamera(false);
    }

    useEffect(() => {
        (async () => {
            MediaLibrary.requestPermissionsAsync();
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');
        })();
      }, [])

    const submitID = async () =>{
        const formData = new FormData();

        const userid = await AsyncStorage.getItem('id');

        const responseUser = await api.get(`/settings/getinsight/${userid}`);

        formData.append('image', {
          name: `${responseUser.data.user.username}_${responseUser.data.user.email}.jpg`,
          uri: image.uri,
          type: 'image/jpg'
        })
        
        formData.append('userid', userid);

        try {
            const response = await axios.post('http://192.168.0.102:3001/Accounts/applyForIDVerification', formData ,{
            headers:{
              'x-expo-app': 'chatfuze-frontend',
              Accept: 'application/json',
              'Content-Type' : 'multipart/form-data',
            },
          })

          if(response){
            setClickedButton(false);
            setUserHasAnIdVerificationRequest(true);
            setImage(null);
            toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                    <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
                        <VStack space="xs">
                        <ToastTitle>Success</ToastTitle>
                        <ToastDescription>
                            Your ID has been submit for review.
                        </ToastDescription>
                        </VStack>
                        <Pressable mt="$1" onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} color="$black" />
                        </Pressable>
                    </Toast>
                    )
                },
            })
          }
        } catch (error) {
            console.log(error)
            setClickedButton(false)
            toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                    <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                        <VStack space="xs">
                        <ToastTitle>Error</ToastTitle>
                        <ToastDescription>
                            There was an error uploading your ID.
                        </ToastDescription>
                        </VStack>
                        <Pressable mt="$1" onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} color="$black" />
                        </Pressable>
                    </Toast>
                    )
                },
            })
        }  
    }

    if(openCamera){
        return (
            <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              {!image&&<Camera
                style={styles.container}
                type={type}
                flashMode={flash}
                ref={cameraRef}
                ratio='16:9'
              />}
              {!image&&<MaterialIcons name='center-focus-weak' size={350} color="#ffffff50" style={{position: 'absolute'}}/>}
              {image&&<Image source={{ uri : image.uri}} alt='photo_id' style={styles.container}/>}
              <View style={{ backgroundColor: 'black', position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', padding: 10, flexDirection: 'row' }}>
                {!image&&
                <TouchableHighlight onPress={()=>{snap()}} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
                  <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
                    <MaterialIcons name="camera-alt" size={50} color="white" style={{padding: 10}}/>
                  </View>
                </TouchableHighlight>}
                {image&&
                <>
                  <TouchableHighlight onPress={()=>{setImage(null)}} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
                    <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
                      <MaterialIcons name="refresh" size={50} color="white" style={{padding: 10}}/>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight onPress={()=>{saveImage()}} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
                  <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
                    <MaterialIcons name="navigate-next" size={50} color="white" style={{padding: 10}}/>
                  </View>
                  </TouchableHighlight>
                </>
                }
                </View>
            </View>
          )
    }else{
        return (
    <ImageBackground
        source={require('../../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} marginBottom={100}>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                        <MaterialIcons name="arrow-back" size={30} color="white"/>
                    </TouchableHighlight>
                    <Text size='3xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Verification
                    </Text>
                </View>

            <View alignItems='center' justifyContent='center' margin={10} marginTop={'20%'}>
                {userHasAnIdVerificationRequest&&
                    <Text size='xl' color='white' fontWeight='$light'>
                        You're ID verification request is being proccessed...
                    </Text>
                }
                {userAlreadyVerified&&
                    <Text size='xl' color='white' fontWeight='$light'>
                        You are already verified!
                    </Text>
                }
                {!userHasAnIdVerificationRequest&&!userAlreadyVerified&&!image&&
                    <View gap={20}>
                        <Text size='xl' color='white' fontWeight='$light'>
                            Please upload your ID photo and submit it
                        </Text>
                        <Button
                            isDisabled={false}
                            size="lg"
                            mb="$4"
                            // borderRadius={40}
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
                            onPress={()=>{setOpenCamera(true);setImage(null); setInvalidImage(false)}}
                            >
                            <ButtonText fontSize="$xl" fontWeight="$medium">
                            Upload ID
                            </ButtonText>
                        </Button>
                    </View>
                }
                {image&&
                    <FormControl gap={20}>
                        <View width={'$72'} height={'$48'}>
                            <Image
                            borderWidth={3}
                            borderColor='#bcbcbc'
                            borderRadius={30}
                            flex={1}
                            w={'$full'}
                            // size='2xl'
                            // rotation={90}
                            source={image}
                            alt='photo_id'
                            // aspectRatio={16/9}
                            />
                        </View>
                        <Button
                            isDisabled={clickedButton}
                            size="lg"
                            mb="$4"
                            // borderRadius={40}
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
                            onPress={()=>{setClickedButton(true);submitID()}}
                            >
                            <ButtonText fontSize="$xl" fontWeight="$medium">
                            Submit
                            </ButtonText>
                        </Button>
                    </FormControl>
                }

            </View>
            
            </ScrollView>
            </View>
        </Animatable.View>
        </TouchableWithoutFeedback>
    </ImageBackground>
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

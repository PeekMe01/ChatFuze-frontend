import { AddIcon, AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogFooter, Button, ButtonGroup, ButtonText, CloseIcon, Divider, HStack, Heading, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React, { useEffect } from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TouchableHighlight } from 'react-native';
import SocialMedia from './SocialMedia';
import { AlertDialogContent } from '@gluestack-ui/themed';
import { AlertDialogHeader } from '@gluestack-ui/themed';
import { AlertDialogCloseButton } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from "../../config/firebase";
import {
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  } from '@expo-google-fonts/roboto';

export default function EditSettings({ navigation, setLoggedIn, setLoginPage, setSignupPage }) {
    // console.log(props)
    // const { setLoggedIn, setLoginPage, setSignupPage } = props;

    const [clickedButton, setClickedButton] = useState(false);
    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
        Roboto_100Thin,
        Roboto_100Thin_Italic,
        Roboto_300Light,
        Roboto_300Light_Italic,
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_500Medium_Italic,
        Roboto_700Bold,
        Roboto_700Bold_Italic,
        Roboto_900Black,
        Roboto_900Black_Italic,
    });
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                    <HStack space="sm">
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
            </ImageBackground>
        ) 
    }

    const handleChangePasswordPage = () => {
        navigation.push('ChangePassword');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleInsightsPage = () => {
        navigation.push('Insights');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleLanguagePage = () => {
        navigation.push('Language');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleAboutUsPage = () => {
        navigation.push('AboutUs');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleFeedbackPage = () => {
        navigation.push('Feedback');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleVerificationPage = () => {
        navigation.push('Verification');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleLogoutPressed = () => {
        setClickedButton(true);
        setShowAlertDialog(true)
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }
    function getCurrentDateTime() {
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
        let year = currentDate.getFullYear();
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        let seconds = currentDate.getSeconds();
      
        // Format the date and time
        let formattedDate = `${year}-${month}-${day}`;
        let formattedTime = `${hours}:${minutes}:${seconds}`;
      
        // Concatenate date and time
        let dateTime = `${formattedDate} ${formattedTime}`;
      
        // Return the concatenated date and time
        return dateTime;
      }
        const checkLoginStatus = async () => {
          try {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
              setLoggedIn(true);
            } else {
              setLoggedIn(false);
            }
          } catch (error) {
            console.error('Error checking login status:', error);
          }
        };
      
  return (
    <ImageBackground
        source={require('../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
        <AlertDialog
            isOpen={showAlertDialog}
            onClose={() => {
            setShowAlertDialog(false)
            }}
        >
            <AlertDialogBackdrop />
            <AlertDialogContent>
            <AlertDialogHeader>
                <Heading size="lg" color='#512095'>Logout?</Heading>
                <AlertDialogCloseButton>
                <Icon as={CloseIcon} />
                </AlertDialogCloseButton>
            </AlertDialogHeader>
            <AlertDialogBody>
                <Text size="sm">
                Are you sure you want to logout?
                </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
                <ButtonGroup space="lg">
                <Button
                    variant="outline"
                    action="secondary"
                    borderWidth={2}
                    onPress={() => {
                    setShowAlertDialog(false)
                    }}
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                    bg="#512095"
                    action="negative"
                    onPress={async () => {
                    setShowAlertDialog(false)
                        try {
                            const userToken = await AsyncStorage.getItem('userToken');
                            const userId = await AsyncStorage.getItem('id');
                            if (userToken) {
                                    let active;
                                    active = false;
                                    try {
                                        // Check if the document already exists
                                        const docRef = doc(database, 'status', userId);
                                        const docSnapshot = await getDoc(docRef);
                                    
                                        if (docSnapshot.exists()) {
                                            // Update the existing document
                                               let datetime= getCurrentDateTime();
                                            await updateDoc(docRef, { active,datetime });
                                        } else {
                                            // If the document doesn't exist, create it
                                            console.log('User status record doesn\'t exist, please fire the devs.')
                                        }
                                    
                                        console.log('User status updated successfully.');
                                    } catch (error) {
                                        console.error('Error occurred while updating user status:', error);
                                    }
                                }
                            await AsyncStorage.removeItem('userToken');
                            await AsyncStorage.removeItem('id');
                            setLoggedIn(false);
                            setLoginPage(true);
                            setSignupPage(false);
                          
                        } catch (error) {
                          console.error('Logout failed:', error);
                        }
                    }}
                >
                    <ButtonText>Logout</ButtonText>
                </Button>
                </ButtonGroup>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
            <View margin={30} marginBottom={100}>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                        <Icon name="arrow-back" size={25} color="white"/>
                    </TouchableHighlight>
                    <Text size='4xl' color='white' fontFamily='Roboto_500Medium'>
                        Edit Settings
                    </Text>
                </View>
                <View w="$80" alignSelf='center' marginVertical={100}>
                    <TouchableHighlight onPress={()=>{handleChangePasswordPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular' style={{paddingLeft:10}}>
                                Change Password
                            </Text>
                            <Icon name="keyboard-arrow-right" size={25} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleInsightsPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular' style={{paddingLeft:10}}>
                                Insights
                            </Text>
                            <Icon name="keyboard-arrow-right" size={25} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleLanguagePage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular' style={{paddingLeft:10}}>
                                Language
                            </Text>
                            <Icon name="keyboard-arrow-right" size={25} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleAboutUsPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular' style={{paddingLeft:10}}>
                                About us
                            </Text>
                            <Icon name="keyboard-arrow-right" size={25} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleFeedbackPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular' style={{paddingLeft:10}}>
                                Feedback
                            </Text>
                            <Icon name="keyboard-arrow-right" size={25} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleVerificationPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular' style={{paddingLeft:10}}>
                                Verification
                            </Text>
                            <Icon name="keyboard-arrow-right" size={25} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleLogoutPressed()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular' style={{paddingLeft:10}}>
                                Logout
                            </Text>
                            <Icon name="keyboard-arrow-right" size={25} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                </View>
                

            </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

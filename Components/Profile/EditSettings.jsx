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

export default function EditSettings({ navigation,route }) {
    const { setLoggedIn } = route.params;

    const [clickedButton, setClickedButton] = useState(false);
    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
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

    const handleLogoutPressed = () => {
        setClickedButton(true);
        setShowAlertDialog(true)
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

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
                          await AsyncStorage.removeItem('userToken');
                          await AsyncStorage.removeItem('id');
                          setLoggedIn(false);
                          
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
                <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={30}>
                    Edit Settings
                </Text>
                <View w="$80" alignSelf='center' marginVertical={100}>
                    <TouchableHighlight onPress={()=>{handleChangePasswordPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Change Password
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleInsightsPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Insights
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleLanguagePage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Language
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleAboutUsPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                About us
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleFeedbackPage()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Feedback
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{handleLogoutPressed()}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Logout
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
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

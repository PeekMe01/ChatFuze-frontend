import { Box, InputField, AlertCircleIcon, Toast, VStack, Icon, View, AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast, Textarea, TextareaInput, Link, LinkText, Pressable, CloseIcon } from '@gluestack-ui/themed';
import React, { useState, useEffect } from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather'
import { Linking, ScrollView, TouchableHighlight, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';
import * as Facebook from "expo-auth-session/providers/facebook";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri } from 'expo-auth-session';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Config'
import { AntDesign, Ionicons } from "@expo/vector-icons";
WebBrowser.maybeCompleteAuthSession();



export default function EditSocials({ navigation, route }) {
    let facebookLink;
    let facebookimg;
    const [user, setUser] = useState();

    async function fetchData() {
        try {
            const data = await AsyncStorage.getItem('id')
            const response = await api.get(`/settings/getinsight/${data}`);
            setUser(response.data.user);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [!user]);

    const [request, response, promptAsync] = Facebook.useAuthRequest(
        {
            clientId: "1200886614214250"
        }
    );

    useEffect(() => {
        handleFacebookLogin();
    }, [response])

    const handleFacebookLogin = async () => {
        if (response && response.type === "success" && response.authentication) {
            await AsyncStorage.setItem('FacebookToken', response.authentication.accessToken);
            const userInfoResponse = await fetch(
                `https://graph.facebook.com/me?access_token=${response.authentication.accessToken}&fields=id,name,link,picture.type(large)`
            );

            const userInfo = await userInfoResponse.json();
            facebookLink = userInfo.link;
            facebookimg = userInfo.picture.data.url;
            const data = {
                userid: await AsyncStorage.getItem('id'),
                facebooklink: facebookLink,
                imageurl: facebookimg
            }

            try {
                const response = await api.post(`/settings/facebooklink`, data);
                if (response) {
                    try {
                        const data = await AsyncStorage.getItem('id')
                        const response = await api.get(`/settings/getinsight/${data}`);
                        setUser(null);
                    } catch (error) {
                        console.log(error)
                    }
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
                                            You have succesfully linked your facebook profile!
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
                const errorMsg = await error.response.data.error;
                toast.show({
                    duration: 5000,
                    placement: "top",
                    render: ({ id }) => {
                        const toastId = "toast-" + id
                        return (
                            <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                                <VStack space="xs">
                                    <ToastTitle>There was an error while connecting your facebook</ToastTitle>
                                    <ToastDescription>
                                        {errorMsg}
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
    }

    const handlePressAsync = async () => {
        const result = await promptAsync();
        if (result.type !== "success") {
            alert("Uh oh, something went wrong");
            return;
        }
    }

    const handleFacebookLogout = async () => {
        const data = {
            userid: await AsyncStorage.getItem('id'),
        }
        try {
            const response = await api.post(`/settings/removeFacebookLink`, data);
            if (response) {
                try {
                    const data = await AsyncStorage.getItem('id')
                    const response = await api.get(`/settings/getinsight/${data}`);
                    setUser(null);
                } catch (error) {
                    console.log(error)
                }
                await AsyncStorage.removeItem('FacebookToken')
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
                                        You have succesfully un-linked your facebook profile!
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
            const errorMsg = await error.response.data.error;
            toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                        <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                            <VStack space="xs">
                                <ToastTitle>There was an error while removing your facebook</ToastTitle>
                                <ToastDescription>
                                    {errorMsg}
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

    const toast = useToast()

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);
    const [clickedButton, setClickedButton] = useState(false);

    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }


    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'),
    });
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <HStack space="sm" justifyContent='center' alignItems='center'>
                    <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                </HStack>
            </ImageBackground>
        )
    }

    return (
        <ImageBackground
            source={require('../../../assets/img/HomePage1.png')}
            style={{ flex: 1, resizeMode: 'cover' }}
        >
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                    <View margin={30} marginBottom={100}>
                        <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                            <TouchableHighlight onPress={() => { handleGoBackPressed() }} underlayColor={'transparent'} disabled={clickedButton}>
                            <AntDesign name="arrowleft" size={25}  color="white"  />
                            </TouchableHighlight>
                            <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                                Edit Socials
                            </Text>
                        </View>

                        <Box style={{ display: 'flex', gap: 40, justifyContent: 'center', marginVertical: 80 }}>
                            {user && user.instagramlink && <View display='flex' flexDirection='row' gap={10} justifyContent='space-around' alignItems='center'>
                                <FontAwesome5 name="instagram" size={30} color="white" />
                                <Text color='white' fontFamily='Roboto_400Regular'>
                                    Go to Instagram profile
                                </Text>
                                <TouchableHighlight onPress={() => { }} style={{ borderRadius: 10 }} underlayColor={'#51209550'}>
                                    <View borderWidth={1} borderColor='white' paddingHorizontal={20} paddingVertical={10} borderRadius={10}>
                                        <Text color='white' fontWeight='$light'>remove</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>}
                            {user && !user.instagramlink && <View display='flex' flexDirection='row' gap={10} justifyContent='space-around' alignItems='center'>
                                <FontAwesome5 name="instagram" size={30} color="white" />
                                <Text color='white' fontFamily='Roboto_400Regular'>
                                    INSTAGRAM
                                </Text>
                                <TouchableHighlight onPress={() => { }} style={{ borderRadius: 10 }} underlayColor={'#51209550'}>
                                    <View borderWidth={1} borderColor='white' paddingHorizontal={20} paddingVertical={10} borderRadius={10}>
                                        <Text color='white' fontWeight='$light'>add</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>}
                            <Divider />
                            {user && user.facebooklink && <View display='flex' flexDirection='row' gap={10} justifyContent='space-around' alignItems='center'>
                                <FontAwesome5 name="facebook" size={30} color="white" />
                                <Link href={user.facebooklink}>
                                    <TouchableHighlight onPress={() => { Linking.openURL(user.facebooklink) }} style={{ borderRadius: 10 }} underlayColor={'#51209550'}>
                                        <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                                            <LinkText textDecorationLine='none' color='white' fontFamily='Roboto_400Regular'>Visit Profile </LinkText><Feather name="link" size={20} color="white" />
                                        </View>
                                    </TouchableHighlight>
                                </Link>
                                <TouchableHighlight onPress={() => { handleFacebookLogout() }} style={{ borderRadius: 10 }} underlayColor={'#51209550'}>
                                    <View borderWidth={1} borderColor='white' paddingHorizontal={20} paddingVertical={10} borderRadius={10}>
                                        <Text color='white' fontWeight='$light'>remove</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>}
                            {user && !user.facebooklink && <View display='flex' flexDirection='row' gap={10} justifyContent='space-around' alignItems='center'>
                                <FontAwesome5 name="facebook" size={30} color="white" />
                                <Text color='white' fontFamily='Roboto_400Regular'>
                                    FACEBOOK
                                </Text>
                                <TouchableHighlight onPress={() => { handlePressAsync() }} style={{ borderRadius: 10 }} underlayColor={'#51209550'}>
                                    <View borderWidth={1} borderColor='white' paddingHorizontal={20} paddingVertical={10} borderRadius={10}>
                                        <Text color='white' fontWeight='$light'>add</Text>
                                    </View>
                                </TouchableHighlight>
                            </View>}

                        </Box>
                    </View>
                </Animatable.View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    )
}
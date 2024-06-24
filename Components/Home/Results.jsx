import { ButtonGroup, Heading, AlertDialogHeader, AlertDialogContent, AlertDialogFooter, AlertDialogBackdrop, AlertDialogBody, AlertDialog, Button, SafeAreaView, ImageBackground, ScrollView, Text, ButtonText, Center, CloseIcon, Divider, HStack, Icon, Pressable, Spinner, Toast, ToastDescription, ToastTitle, VStack, View, useToast } from '@gluestack-ui/themed'

import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc, getDocs } from 'firebase/firestore';
import { database } from "../../config/firebase";
import HorizontalNumberPicker from './HorizontalNumberPicker';

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
import api from '../Config';

export default function Results({ navigation, route }) {

    const toast = useToast()

    const { receiverID, senderID, roomID } = route.params;

    const [receiverMessages, setReceiverMessages] = useState({ count: 0, totalCharacters: 0 });
    const [senderMessages, setSenderMessages] = useState({ count: 0, totalCharacters: 0 });

    const [selectedIndex, setSelectedIndex] = useState(0);

    const [backToHomePressed, setBackToHomePressed] = useState(false)

    const [showAlertDialog, setShowAlertDialog] = useState(false)

    const handleAddFriend = async () => {
        try {
            const data = {
                idusers: receiverID,
                ratingcount: (selectedIndex + 1),
            };
            const response = await api.post(`/home/rating`, data);

            if (response) {
                const data1 = {
                    friendid1: senderID,
                    friendid2: receiverID
                }
                const response1 = await api.post(`/home/addFriendRequest`, data1);

                if (response1) {
                    setTimeout(() => {
                        setShowAlertDialog(false)
                        setBackToHomePressed(false)
                        navigation.navigate('HomeScreen', {
                            roomID: roomID
                        });
                    }, 1000);
                }
            }
        } catch (error) {
            setBackToHomePressed(false)
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
                                    There was an error rating your match.
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

    const handleBackToHome = async () => {
        setBackToHomePressed(true)
        if (selectedIndex >= 6) {
            setShowAlertDialog(true)
        } else {
            try {
                const data = {
                    idusers: receiverID,
                    ratingcount: (selectedIndex + 1),
                };
                const response = await api.post(`/home/rating`, data);

                if (response) {
                    setTimeout(() => {
                        navigation.navigate('HomeScreen', {
                            roomID: roomID
                        });
                        setBackToHomePressed(false)
                    }, 1000);
                }
            } catch (error) {
                setBackToHomePressed(false)
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
                                        There was an error rating your match.
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

    useEffect(() => {
        getMessagesCounts();
    }, [])

    const getMessagesCounts = async () => {
        try {
            const getMyMessagesQuery = query(
                collection(database, 'roomChats'),
                where('receivingUser', '==', parseInt(receiverID)),
                where('roomID', '==', parseInt(roomID))
            );
            const getMatchMessagesQuery = query(
                collection(database, 'roomChats'),
                where('receivingUser', '==', parseInt(senderID)),
                where('roomID', '==', parseInt(roomID))
            );

            // Function to get the total number of characters in the text field for a given query
            const getTotalCharacters = async (query) => {
                const querySnapshot = await getDocs(query);
                let totalCharacters = 0;

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.text) {
                        totalCharacters += data.text.length;
                    }
                });

                return { count: querySnapshot.size, totalCharacters };
            };

            // Get counts and total characters for both queries
            const myMessagesResult = await getTotalCharacters(getMyMessagesQuery);
            const matchMessagesResult = await getTotalCharacters(getMatchMessagesQuery);
            setReceiverMessages(matchMessagesResult)
            setSenderMessages(myMessagesResult)

         
        } catch (error) {

        }
    }

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'),
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
    const [changingPage, setChangingPage] = useState(false)
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <Center h={'$full'}>
                    <HStack space="sm">
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
                </Center>
            </ImageBackground>
        )
    }

    return (
        <ImageBackground
            source={require('../../assets/img/HomePage1.png')}
            style={{ flex: 1, resizeMode: 'cover' }}
        >
            <AlertDialog
                isOpen={showAlertDialog}
                onClose={() => {
                    setShowAlertDialog(false)
                    setBackToHomePressed(false)
                }}
            >
                <AlertDialogBackdrop />
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <Heading size='lg' color='#512095'>High Rating</Heading>
                    </AlertDialogHeader>
                    <AlertDialogBody>
                        <Text size="sm">
                            You have given this user a high rating, do you want to add him as a friend? He will need to add you as well in order to become friends.
                        </Text>
                    </AlertDialogBody>
                    <AlertDialogFooter>
                        <ButtonGroup space="lg">
                            <Button
                                variant="outline"
                                action="secondary"
                                borderWidth={2}
                                onPress={async () => {
                                    try {
                                        const data = {
                                            idusers: receiverID,
                                            ratingcount: (selectedIndex + 1),
                                        };
                                        const response = await api.post(`/home/rating`, data);

                                        if (response) {
                                            setShowAlertDialog(false)
                                            setBackToHomePressed(false)
                                            navigation.navigate('HomeScreen', {
                                                roomID: roomID
                                            });
                                        }
                                    } catch (error) {
                                        console.log(error)
                                    }

                                }}
                            >
                                <ButtonText>No</ButtonText>
                            </Button>
                            <Button
                                bg="#512095"
                                action="negative"
                                onPress={() => {
                                    handleAddFriend()
                                }}
                            >
                                <ButtonText>Add Friend</ButtonText>
                            </Button>
                        </ButtonGroup>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500} style={{ flex: 1 }}>
                <View margin={30}>
                    <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false}>
                        <Text textAlign='center' size='5xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                            Results
                        </Text>
                        <Divider />
                    </ScrollView>
                    <View height={'50%'} marginTop={-150}>
                        <Text size='lg' color='white' fontFamily='Roboto_300Light' paddingTop={10}>
                            You have sent {senderMessages.count} {senderMessages.count === 1 ? "message" : "messages"}.
                        </Text>
                        <Text size='lg' color='white' fontFamily='Roboto_300Light' paddingTop={10} style={{ marginBottom: 20 }}>
                            Your match has sent {receiverMessages.count} {receiverMessages.count === 1 ? "message" : "messages"}.
                        </Text>
                        <Divider />
                        <Text size='lg' color='white' fontFamily='Roboto_300Light' paddingVertical={20}>
                            {senderMessages.totalCharacters > receiverMessages.totalCharacters ? "You have carried the conversation." : "Your match has carried the conversation."}
                        </Text>
                        <Divider />
                        <Text size='2xl' textAlign='center' color='white' fontFamily='Roboto_300Light' paddingTop={10} style={{ marginBottom: 20 }}>
                            Rate your match from 1 to 10
                        </Text>
                        <View style={{ height: 150 }}>
                            <HorizontalNumberPicker selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                        </View>
                        <Button
                            isDisabled={backToHomePressed}
                            size="lg"
                            mb="$4"
                            borderRadius={40}
                            hardShadow='1'
                            bgColor="#512095"
                            $active={{
                                bg: "#51209595",
                            }}
                            onPress={handleBackToHome}
                        >
                            <ButtonText fontSize="$xl" fontWeight="$medium" >
                                Submit Rating
                            </ButtonText>
                        </Button>
                    </View>
                </View>
            </Animatable.View>
        </ImageBackground>
    );
}
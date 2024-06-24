import AsyncStorage from '@react-native-async-storage/async-storage';
import {InputField, ButtonText, ButtonGroup, Heading, AlertDialogHeader, AlertDialogContent, AlertDialog, AlertDialogBackdrop, Select, SelectTrigger, SelectItem, SelectDragIndicator, SelectIcon, SelectInput, SelectContent, SelectDragIndicatorWrapper, SelectPortal, SelectBackdrop, ChevronDownIcon, Image, ImageBackground, Text, View, Input, HStack, Spinner, Center, AlertDialogCloseButton, CloseIcon, AlertDialogBody, AlertDialogFooter, Button, Toast, useToast, ToastTitle, ToastDescription, VStack, Pressable, Icon } from "@gluestack-ui/themed";
import React, { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import userimg from '../../assets/img/user.png'
import api from '../Config'
import { useHeaderHeight } from '@react-navigation/elements';
import { Alert, AppState, KeyboardAvoidingView, Platform, TextInput, BackHandler, ToastAndroid, TouchableHighlight, TouchableWithoutFeedback, Keyboard } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { database } from "../../config/firebase";
import { API_URL } from '../Config'
import io from 'socket.io-client';

const error = console.error; console.error = (...args) => { if (/defaultProps/.test(args[0])) return; error(...args); };
const socket = io.connect(`${API_URL}`);


export default function ChatRoom({ navigation, route }) {
    const toast = useToast()
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };
    const lastBackPressed = useRef(0);

    const [loggedInUserID, setLoggedInUserID] = useState();
    const [typing, setTyping] = useState(false)
    const [receiverTyping, setReceiverTyping] = useState(false);
    const { receiverID, roomID } = route.params;
    const [remainderTime, setRemainderTime] = useState({})

    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const [countdown, setCountdown] = useState(5); // Countdown timer starting from 5 seconds

    const [matchDisconnected, setMatchDisconnected] = useState(false);
    const matchDisconnectedRef = useRef(matchDisconnected);
    const intervalIdRef = useRef(null);

    const appState = useRef(AppState.currentState);
    const [roomStatus, setRoomStatus] = useState(true);
    const [showAlertReport, setshowAlertReport] = useState(false)
    const [reportCategory, setreportCategory] = useState();
    const [invalidreport, setInvalidReport] = useState(false);
    const [message, setmessage] = useState('');
    const [invalidtext, setinvalidtext] = useState(false)
    const [disablebutton, setdisablebutton] = useState(false);
    const [clickedButton, setClickedButton] = useState(false);
    const [sendReport, setSendReport] = useState(false)
    const [messagesForReport, setMessagesForReport] = useState([]);

    // useEffect(() => {
    //     const collectionRef = collection(database, 'chats');

    //     const receivingUserId = receiverID; // Example receiving user ID
    //     const currentUserID = loggedInUserID; // Example current user ID

    //     if (loggedInUserID) {
    //         // const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
    //         const q = query(
    //             collectionRef,
    //             where('receivingUser', 'in', [parseInt(receivingUserId), parseInt(currentUserID)]), // Filter by receiving user
    //             where('user._id', 'in', [parseInt(receivingUserId), parseInt(currentUserID)]), // Filter by current user
    //             orderBy('createdAt', 'asc')
    //         );


    //         const unsubscribe = onSnapshot(q, snapshot => {
    //             setMessages(
    //                 snapshot.docs.map(doc => ({
    //                     _id: doc.id,
    //                     createdAt: doc.data().createdAt.toDate(),
    //                     text: doc.data().text,
    //                     user: doc.data().user
    //                 }))
    //             )
    //         })
    //         return () => unsubscribe();
    //     }
    // }, [loggedInUserID]);

    const submitreport = async () => {
        try {
            if (reportCategory && message !== '') {
                setdisablebutton(true)
                setSendReport(true)
                const response = await api.post(`/reports/submitreport`, {
                    categoryname: reportCategory,
                    message: message,
                    tenmessage: messages.length>20?messages.reverse().slice(-20,-1):messages.reverse(),
                    reporterid: loggedInUserID,
                    reportedid: receiverID,
                });
                console.log(messages)
                setshowAlertReport(false)
                setTimeout(() => {
                    setdisablebutton(false);
                }, 1000);
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
                                        You have succesfully Submitted your report...
                                    </ToastDescription>
                                </VStack>
                                <Pressable mt="$1" onPress={() => toast.close(id)}>
                                    <Icon as={CloseIcon} color="$black" />
                                </Pressable>
                            </Toast>
                        )
                    },
                })
            } else {
                if (!reportCategory)
                    setInvalidReport(true)
                if (message === "")
                    setinvalidtext(true)
            }
        } catch (error) {
            console.error('Error Reporting friend:', error);
        }
    }
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {
            if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
                // App has come to the foreground, check the room status
                checkRoomStatus();
                autoRejoinInvite()
            }
            appState.current = nextAppState;
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [receiverID, roomID, loggedInUserID]);

    // Define the function to update documents
    async function autoRejoinInvite() {
        try {
            // Create a query to find documents with the specified criteria
            const q = query(
                collection(database, 'validRejoins'),
                where('inviteReceiver', '==', parseInt(loggedInUserID)),
                where('inviteSender', '==', parseInt(receiverID)),
                where('roomID', '==', parseInt(roomID)),
                where('status', '==', 'pending')
            );

            // Execute the query
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                console.log("No matching documents found to update");
            } else {
                // Iterate over each document and update it
                for (const doc of querySnapshot.docs) {
                    // Define the updated fields
                    const updatedData = {
                        status: 'auto'
                    };

                    // Update the document
                    await updateDoc(doc.ref, updatedData);

                    // Delete the document
                    await deleteDoc(doc.ref);
                }
            }
        } catch (error) {
            console.log("Error updating document(s): ", error);
        }
    }

    useEffect(() => {
        // Set up the listener only when matchDisconnected changes to true
        if (matchDisconnected) {
            // Define the query to find documents with the specified criteria
            const q = query(
                collection(database, 'validRejoins'),
                where('inviteSender', '==', parseInt(loggedInUserID)),
                where('inviteReceiver', '==', parseInt(receiverID)),
                where('roomID', '==', roomID),
            );

            // Set up the listener inside the useEffect hook
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("No matching documents found to listen to");
                } else {
                    querySnapshot.forEach((doc) => {
                        const status = doc.data().status;
                        if (status === 'auto' || status === 'accepted') {
                            console.log('Status changed to "auto" in document: ', doc.id);
                            setMatchDisconnected(false);
                            // Handle the change to "auto" status as needed
                        } else {
                            if (status === 'rejected') {
                                updateAllRoomStatus();
                                deleteRejoinInvite();
                                if (!matchDisconnectedRef.current) {
                                    setShowAlertDialog(true)
                                } else {
                                    try {
                                       const data = {
                                            roomId: roomID,
                                            receiverId: receiverID,
                                            senderId: loggedInUserID
                                        };
                                        socket.emit('roomDestroyed', data);
                                        navigation.navigate('HomeScreen', {
                                            disconnetedDueToMatchLeaving: true,
                                            roomID: roomID,
                                        }
                                        ); 
                                    } catch (error) {
                                        console.log('Reject error: ' + error);
                                    }
                                }
                            }
                        }
                    });
                }
            }, (error) => {
                console.error('Error listening to documents: ', error);
            });

            // Clean up the listener when the component unmounts or when dependencies change
            return () => unsubscribe();
        }
    }, [matchDisconnected, loggedInUserID, receiverID, roomID]);

    const checkRoomStatus = async () => {
        try {
            const roomsCollection = collection(database, 'rooms');
            const roomsQuery = query(roomsCollection, where('roomID', '==', roomID));
            const roomsQuerySnapshot = await getDocs(roomsQuery);

            if (roomsQuerySnapshot.empty) {
                console.log('No rooms found with the specified roomID');
                return;
            }

            let allRoomsStatusFalse = true;

            roomsQuerySnapshot.forEach((roomDoc) => {
                const roomData = roomDoc.data();
                if (roomData.roomStatus !== false) {
                    allRoomsStatusFalse = false;
                }
            });

            if (allRoomsStatusFalse) {
                console.log('All rooms with the given roomID have roomStatus as false, navigating to HomeScreen');
                navigation.navigate('HomeScreen', {
                    disconnetedDueToMeLeaving: true,
                    roomID: roomID,
                }
                );
            } else {
                console.log('Not all rooms with the given roomID have roomStatus as false');
            }
        } catch (error) {
            console.error('Error checking room status:', error);
        }
    };

    useEffect(() => {
        matchDisconnectedRef.current = matchDisconnected;
    }, [matchDisconnected]);

    useEffect(() => {
        let timer;
        if (showAlertDialog) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => {
                    if (prevCountdown <= 1) {
                        clearInterval(timer);
                        navigation.navigate("Results", {
                            receiverID: receiverID,
                            senderID: loggedInUserID,
                            roomID: roomID
                        });
                        setShowAlertDialog(false)
                    }
                    return prevCountdown - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showAlertDialog]);

    useEffect(() => {
        const handleRoomCreated = ({ data, newtime }) => {
            if (data.idmessages === roomID || data.idmessages === roomID) {
                setRemainderTime(newtime);
                if (newtime.minutes === 0 && newtime.seconds === 0) {
                    updateAllRoomStatus();
                    deleteRejoinInvite();
                    if (!matchDisconnectedRef.current) {
                        setShowAlertDialog(true)
                    } else {
                        const data = {
                            roomId: roomID,
                            receiverId: receiverID,
                            senderId: loggedInUserID
                        };
                        socket.emit('roomDestroyed', data);
                        navigation.navigate('HomeScreen', {
                            disconnetedDueToMatchLeaving: true,
                            roomID: roomID,
                        }
                        );
                    }


                }
            }
        };

        socket.on('updateTime', handleRoomCreated);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            socket.off('updateTime', handleRoomCreated);
        };
    }, [socket, roomID, loggedInUserID]);


    useEffect(() => {
        const onBackPress = () => {
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', onBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
    }, []);


    const timeoutRef = useRef(null);
    const clearTypingTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };
    const updateTyping = async (typing) => {
        try {
            let senderid = loggedInUserID
            let receiverid = receiverID
            const docId = `${senderid}_${receiverid}`;
            const docRef = doc(database, 'typing', docId);

            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                await updateDoc(docRef, {
                    typing: typing
                });
            } else {
                await setDoc(docRef, {
                    senderid: parseInt(senderid),
                    receiverid: parseInt(receiverid),
                    typing: typing
                });
            }

        } catch (error) {
            console.error('Error occurred while updating user typing status:', error);
        }
    }
    const isFirstInput = useRef(true);

    const onInputTextChanged = text => {
        clearTypingTimeout();
        setTyping(true);

        if (isFirstInput.current) {
            isFirstInput.current = false;
        } else {
            if (!typing) {
                updateTyping(true);
            }
        }

        timeoutRef.current = setTimeout(() => {
            setTyping(false);
            updateTyping(false);
        }, 500);
    };

    useEffect(() => {
        let senderid = loggedInUserID;
        let receiverid = receiverID;
        const docId = `${receiverid}_${senderid}`;

        const typingStatusQuery = query(
            collection(database, 'typing'),
            where('receiverid', '==', parseInt(senderid)),
            where('senderid', '==', parseInt(receiverid))
        );

        // Set up a real-time listener for typing status
        const unsubscribeTyping = onSnapshot(typingStatusQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const data = change.doc.data();
                    setReceiverTyping(data.typing);
                }
            });
        });

        // Clean up the listener on component unmount
        return () => {
            unsubscribeTyping();
        };
    }, [loggedInUserID, receiverID, setReceiverTyping]);

    // Function to update roomStatus to false
    const updateAllRoomStatus = async () => {
        try {
            const roomsCollection = collection(database, 'rooms');
            const roomsQuery = query(roomsCollection, where('roomID', '==', roomID));
            const roomsQuerySnapshot = await getDocs(roomsQuery);

            // Iterate over each room document and update roomStatus to false
            roomsQuerySnapshot.forEach(async (roomDoc) => {
                const roomDocRef = doc(database, 'rooms', roomDoc.id);
                await updateDoc(roomDocRef, {
                    roomStatus: false
                });
            });

        } catch (error) {
            console.error('Error updating room statuses:', error);
        }
    };

    useEffect(() => {
        const handleRoomDestroyed = (data) => {
            if (data.roomId == roomID) {
                deleteRejoinInvite()
                updateAllRoomStatus()
                navigation.navigate('HomeScreen', {
                    disconnetedDueToMatchLeaving: true,
                    roomID: roomID,
                }
                );
            }
        };

        socket.on('roomDestroyed', handleRoomDestroyed);

        return () => {
            socket.off('roomDestroyed', handleRoomDestroyed);
        };

    }, [socket, loggedInUserID]);

    const checkFor60Seconds = () => {

        let tries = 60;
        if (intervalIdRef.current) return; // Prevent starting multiple intervals

        intervalIdRef.current = setInterval(() => {
            console.log(tries)
            if (matchDisconnectedRef.current) {
                tries--;

                if (tries === 0) {
                    clearInterval(intervalIdRef.current);
                    intervalIdRef.current = null;
                    const data = {
                        roomId: roomID,
                        receiverId: receiverID,
                        senderId: loggedInUserID
                    };
                    socket.emit('roomDestroyed', data);
                    updateAllRoomStatus()
                    deleteRejoinInvite()
                    navigation.navigate('HomeScreen', {
                        disconnetedDueToMatchLeaving: true,
                        roomID: roomID,
                    })
                }
            } else {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        }, 1000);
    };

    const deleteRejoinInvite = async () => {
        try {

            const q = query(
                collection(database, 'validRejoins'),
                where('inviteReceiver', '==', parseInt(receiverID)),
                where('inviteSender', '==', parseInt(loggedInUserID)),
                where('roomID', '==', roomID)
            );

            // Get the documents that match the query
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
            } else {
                // Iterate over each document and delete it
                for (const doc of querySnapshot.docs) {
                    await deleteDoc(doc.ref);
                }
            }
        } catch (error) {
            console.log("Error deleting document(s): ", error);
        }
    }

    const createRejoinInvite = async () => {
        try {
            await addDoc(collection(database, 'validRejoins'), {
                inviteSender: parseInt(loggedInUserID),
                inviteReceiver: parseInt(receiverID),
                roomID: roomID,
                status: 'pending',
                createdAt: new Date()
            });
        } catch (error) {
            console.log("valid"+error)
        }
    }

    useEffect(() => {
        const friendStatusQuery = query(
            collection(database, 'status'),
            where('userId', '==', receiverID) // Assuming 'userId' is the field storing the user ID in the 'status' documents
        );

        // Set up a real-time listener for friend status
        const unsubscribeStatus = onSnapshot(friendStatusQuery, (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const friendData = change.doc.data();
                    if (!friendData.active) {
                        setMatchDisconnected(true);
                        createRejoinInvite();
                        checkFor60Seconds();
                    } else {
                        // setMatchDisconnected(false);
                        // deleteRejoinInvite();
                    }
                }
            });
        });

        // Clean up the listener on component unmount
        return () => {
            unsubscribeStatus();
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
            }
        };
    }, [receiverID, loggedInUserID]);

    // Get the safe area insets
    const insets = useSafeAreaInsets();

    // Get the height of the camera cutout
    const cameraCutoutHeight = insets.top;

    const [messages, setMessages] = useState([])
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        getLoggedInUserId();
    }, [])

    getLoggedInUserId = async () => {
        const userId = await AsyncStorage.getItem('id');
        setLoggedInUserID(userId)
    }








    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: true })
        navigation.setOptions({
            headerTransparent: true,
            headerLeft: () => null, // Remove the default back button
            headerTintColor: 'white',
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'white', paddingTop: 30, width: '100%', borderBottomWidth: .5, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Image source={userimg} alt='' style={{ borderRadius: 50, width: 50, height: 50, marginLeft: 1 }} />
                        <View>
                            <Text size='xl' color='white' fontFamily='Roboto_400Regular'>
                                Anonymous
                            </Text>
                            <Text size='sm' color='white' fontFamily='Roboto_300Light'>
                                {matchDisconnected?"Disconnected":"Connected"}
                            </Text>
                        </View>
                        
                        <TouchableHighlight onPress={() => {
                            if (!sendReport) {
                                setshowAlertReport(true);
                            }
                        }} style={{ borderRadius: 50 }} underlayColor={'#51209550'} disabled={clickedButton}>
                            <View width={40} height={40} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                                <MaterialIcons name="report" size={30} color="white" />
                            </View>
                        </TouchableHighlight>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                        <Text size='xl' color='white' fontFamily='Roboto_300Light'>Time: </Text>

                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text size='xl' color='white' fontFamily='Roboto_300Light'>
                                {remainderTime.minutes}:{remainderTime.seconds < 10 ? `0${remainderTime.seconds}` : remainderTime.seconds}

                            </Text>

                        </View>
                    </View>
                </View>
            ),
        });
    })

    useEffect(() => {
        const collectionRef = collection(database, 'roomChats');

        const receivingUserId = receiverID; // Example receiving user ID
        const currentUserID = loggedInUserID; // Example current user ID

        if (loggedInUserID) {

            // const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
            const q = query(
                collectionRef,
                where('receivingUser', 'in', [parseInt(receivingUserId), parseInt(currentUserID)]), // Filter by receiving user
                where('user._id', 'in', [parseInt(receivingUserId), parseInt(currentUserID)]), // Filter by current user
                where('roomID', 'in', [roomID]),
                orderBy('createdAt', 'desc')
            );



            const unsubscribe = onSnapshot(q, snapshot => {

                setMessages(
                    snapshot.docs.map(doc => ({
                        _id: doc.id,
                        createdAt: doc.data().createdAt.toDate(),
                        text: doc.data().text,
                        user: doc.data().user
                    }))
                )
            })
            return () => unsubscribe();
        }
    }, [loggedInUserID, receiverID]);


    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
        const { _id, createdAt, text, user } = messages[0];
        try {
            addDoc(collection(database, 'roomChats'), {
                _id,
                createdAt,
                roomID,
                text,
                user,
                receivingUser: receiverID
            });
        } catch (error) {
            console.log(error)
        }
    }, [])

    // Create a ref for the FlatList inside GiftedChat
    const messageContainerRef = useRef(null);

    const flatList = messageContainerRef.current;
    // Check if the FlatList exists
    if (flatList) {
        flatList.setNativeProps({
            style: {
                marginTop: headerHeight + cameraCutoutHeight,
                marginBottom: 30,
                paddingHorizontal: 10
            },
            fadingEdgeLength: 100
        });
    };
    if (!loggedInUserID) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <Center flex={1}>
                    <HStack alignItems='center' gap={10}>
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
                </Center>
            </ImageBackground>
        )
    } else {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <View style={{ flex: 1 }}>
                    <AlertDialog
                        isOpen={showAlertReport}
                        onClose={() => {
                            setshowAlertReport(false)
                        }}
                    >
                        <AlertDialogBackdrop />
                        <AlertDialogContent>
                            <TouchableWithoutFeedback onPress={dismissKeyboard}>
                                <View>
                                    <AlertDialogHeader>
                                        <Heading size="lg" color='#512095'>Report User</Heading>
                                        <AlertDialogCloseButton>
                                            <MaterialIcons as={CloseIcon} />
                                        </AlertDialogCloseButton>
                                    </AlertDialogHeader>
                                    <AlertDialogBody>
                                        <Select
                                            style={{ borderWidth: 2, borderColor: invalidreport ? 'red' : '#ccc', borderRadius: 5 }}
                                            selectedValue={reportCategory}
                                            onValueChange={(value) => { setreportCategory(value); setInvalidReport(false) }}
                                        >
                                            <SelectTrigger size="md" borderColor='rgba(255,255,255,0)'>
                                                <SelectInput placeholderTextColor='grey' placeholder="Select Report Category" style={{ color: 'grey' }} />
                                                <SelectIcon mr="$3">
                                                    <MaterialIcons as={ChevronDownIcon} style={{ color: 'white' }} />
                                                </SelectIcon>
                                            </SelectTrigger>
                                            <SelectPortal>
                                                <SelectBackdrop />
                                                <SelectContent>
                                                    <SelectDragIndicatorWrapper>
                                                        <SelectDragIndicator />
                                                    </SelectDragIndicatorWrapper>
                                                    <SelectItem label="Abuse" value="Abuse" />
                                                    <SelectItem label="Spam" value="Spam" />
                                                    <SelectItem label="Hate Speech" value="Hate Speech" />
                                                    <SelectItem label="Inappropriate Speech" value="Inappropriate Speech" />
                                                </SelectContent>
                                            </SelectPortal>
                                        </Select>
                                        <Input
                                        marginTop={10}
                                        borderColor={invalidtext ? 'red' : '#ccc'}
                                        borderWidth={2}
                                        borderRadius={5}
                                    >
                                        <InputField
                                            type="text"
                                            placeholder="Type your message..."
                                            value={message}
                                            onChangeText={(text) => {
                                                setmessage(text);
                                                setinvalidtext(false);
                                            }}
                                        />
                                    </Input>
                                    </AlertDialogBody>
                                    <AlertDialogFooter>
                                        <ButtonGroup space="lg">
                                            <Button
                                                variant="outline"
                                                action="secondary"
                                                borderWidth={2}
                                                onPress={() => {
                                                    setshowAlertReport(false)
                                                }}

                                            >
                                                <ButtonText>Cancel</ButtonText>
                                            </Button>
                                            <Button
                                                bg="#512095"
                                                action="negative"
                                                onPress={() => {
                                                    submitreport();
                                                }}
                                                disabled={disablebutton}
                                            >
                                                <ButtonText>Report</ButtonText>
                                            </Button>
                                        </ButtonGroup>
                                    </AlertDialogFooter>
                                </View>
                            </TouchableWithoutFeedback>
                        </AlertDialogContent>
                    </AlertDialog>


                    <AlertDialog
                        isOpen={showAlertDialog}

                    >
                        <AlertDialogBackdrop />
                        <AlertDialogContent>
                            <AlertDialogHeader justifyContent='center' alignItems='center'>
                                <Heading textAlign='center' paddingTop={80} flex={1} color='#512095'>
                                    <MaterialCommunityIcons name='timer' size={100} />
                                </Heading>
                            </AlertDialogHeader>
                            <AlertDialogBody>
                                <Text size="xl" textAlign='center'>
                                    Time's Up!
                                </Text>
                                <Text size="md" textAlign='center' marginVertical={10}>
                                    Going to results page in {countdown} second{countdown !== 1 ? 's' : ''}...
                                </Text>
                            </AlertDialogBody>
                        </AlertDialogContent>
                    </AlertDialog>
                    <GiftedChat
                        messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: parseInt(loggedInUserID),
                        }}
                        messageContainerRef={messageContainerRef}
                        renderAvatar={null}
                        onInputTextChanged={onInputTextChanged}
                        isTyping={receiverTyping}
                        scrollToBottom={true}
                        renderFooter={(messages.length == 0) ? (() => {
                            if (messages.length == 0) {
                                return (
                                    <View justifyContent='center' alignItems='center' h={'$full'}>
                                        <Text color='white'>Start chatting!</Text>
                                        <Text color='white'>Remember to be friendly!</Text>
                                    </View>
                                )
                            }

                        }) : null}
                    />
                    {
                        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                    }
                </View>
            </ImageBackground>
        )
    }
}
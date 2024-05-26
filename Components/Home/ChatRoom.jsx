import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, ImageBackground, Text, View, Input, HStack, Spinner, Center, AlertDialogCloseButton, CloseIcon, AlertDialogBody, AlertDialogFooter, Button } from "@gluestack-ui/themed";
import React, { useRef } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import userimg from '../../assets/img/user.png'
import { useHeaderHeight } from '@react-navigation/elements';
import { Alert, KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, addDoc, orderBy, query, onSnapshot, where , doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import { database } from "../../config/firebase";
import { API_URL } from '../Config'
import { BackHandler, ToastAndroid } from 'react-native';

import io from 'socket.io-client';
import { AlertDialog } from '@gluestack-ui/themed';
import { AlertDialogBackdrop } from '@gluestack-ui/themed';
import { AlertDialogContent } from '@gluestack-ui/themed';
import { AlertDialogHeader } from '@gluestack-ui/themed';
import { Heading } from '@gluestack-ui/themed';
import { ButtonGroup } from '@gluestack-ui/themed';
import { ButtonText } from '@gluestack-ui/themed';
const error = console.error; console.error = (...args) => { if (/defaultProps/.test(args[0])) return; error(...args); };
const socket = io.connect(`${API_URL}`);


export default function ChatRoom({navigation,route}) {

    const lastBackPressed = useRef(0);
    
    const[loggedInUserID, setLoggedInUserID] = useState();
    const [typing,setTyping]=useState(false)
    const [receiverTyping,setReceiverTyping]=useState(false);
    const { receiverID,roomID ,startingTime} = route.params;
   // const [timeLeft,setTimeLeft]=useState({})
    const [remainderTime,setRemainderTime]=useState({})

    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const [countdown, setCountdown] = useState(5); // Countdown timer starting from 5 seconds

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
        const handleRoomCreated = ({data, newtime}) => {
            if (data.idmessages === roomID || data.idmessages === roomID) {
                setRemainderTime(newtime);
                if (newtime.minutes === 0 && newtime.seconds === 0) {
                    console.log("Room Done");
                    // alert("Times up!")
                    setShowAlertDialog(true)
                    // setTimeout(() => {
                    //     navigation.navigate("Results")
                    // }, 5000);
                    
                }
            }
        };
    
        socket.on('updateTime', handleRoomCreated);
    
        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            socket.off('updateTime', handleRoomCreated);
        };
    }, [socket, roomID]);

    // useEffect( () => {
    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         () => { return true}
    //       );
    
    //       return () => backHandler.remove();
    // }, [])

    useEffect(() => {
        const onBackPress = () => {
          const now = Date.now();
          if (lastBackPressed.current && now - lastBackPressed.current < 2000) {
            // If back button is pressed within 2 seconds, exit the app
            BackHandler.exitApp();
            return false;
          }
    
          lastBackPressed.current = now;
          ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
          return true;
        };
    
        BackHandler.addEventListener('hardwareBackPress', onBackPress);
    
        return () => {
          BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        };
      }, []);


    // useEffect(() => {
    //     let st = new Date(startingTime);
    //     let t = new Date(st.getTime() + 5 * 60000);

    //     const interval = setInterval(() => {
    //         setTimeLeft(calculateTimeDifference(st, t));
    //         st = new Date(new Date(st).getTime() + 1000).toISOString();
    //     }, 1000);

    //     return () => clearInterval(interval);
    // }, []);
    const timeoutRef = useRef(null);
    const clearTypingTimeout = () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      };
      const updateTyping= async(typing)=>{
        try {
            let senderid=loggedInUserID
            let receiverid=receiverID
            console.log(senderid)
            console.log(receiverid)
            console.log(typing)
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
    
            console.log('User typing status updated successfully.');
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
          }, 3000);
        };
      useEffect(()=>{
        let senderid=loggedInUserID
        let receiverid=receiverID
        const docId = `${receiverid}_${senderid}`;
        const typingStatusQuery = query(
            collection(database, 'typing'),
            where('receiverid', '==',parseInt(senderid)) ,
            where('senderid', '==',parseInt(receiverid)) 
        );

        // Set up a real-time listener for each query
        const unsubscribe = onSnapshot(typingStatusQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const data = change.doc.data();
                   

                    console.log(data.typing)
                 
                    setReceiverTyping(data.typing);
                    // console.log(`Friend ${friendData.userId} status changed to ${friendData.active}`);
                    // updateFriendStatus(friendData.userId, friendData.active,friendData.datetime)
                    // Update UI or perform actions based on friend's status change
                }
            });
        });
    })
    // Get the safe area insets
    const insets = useSafeAreaInsets();

    // Get the height of the camera cutout
    const cameraCutoutHeight = insets.top;

    const [messages, setMessages] = useState([])
    const headerHeight = useHeaderHeight();

    useEffect(()=>{
        getLoggedInUserId();
    }, [])

    getLoggedInUserId = async () => {
        const userId = await AsyncStorage.getItem('id');
        setLoggedInUserID(userId)
    }

    
        //   function calculateTimeDifference(st, t) {
        //     const startDate = new Date(st);
        //     const endDate = new Date(t);
        
        //     const difference = Math.abs(endDate - startDate);
        //     const minutesDifference = Math.floor(difference / 60000);
        //     const secondsDifference = Math.floor((difference % 60000) / 1000);
        
        //     return { minutes: minutesDifference, seconds: secondsDifference };
        // }



       
      
        
    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: true })
        navigation.setOptions({
            headerTransparent: true,
            headerLeft: () => null, // Remove the default back button
            headerTintColor: 'white',
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',borderBottomColor:'white', paddingTop: 30, width: '100%',borderBottomWidth:.5,paddingBottom:10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10}}>
                    <Image source={userimg} alt='' style={{ borderRadius: 50, width: 50, height: 50, marginLeft: 1 }} />
                      <Text size='xl' color='white' fontFamily='Roboto_400Regular'>
                        Anonymous
                      </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                  <Text size='xl' color='white' fontFamily='Roboto_300Light'>Time: </Text>
                  {/* <Text size='xl' color='white' fontFamily='Roboto_300Light'>{startingTime} </Text> */}
                  {/* {console.log(startingTime)} */}
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

        if(loggedInUserID){
            console.log(parseInt(receivingUserId))
            console.log(parseInt(currentUserID))
            // const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
            const q = query(
                collectionRef, 
                where('receivingUser', 'in', [parseInt(receivingUserId),parseInt(currentUserID)]), // Filter by receiving user
                where('user._id', 'in', [parseInt(receivingUserId),parseInt(currentUserID)]), // Filter by current user
                where('roomID', 'in', [roomID]),
                orderBy('createdAt', 'desc')
            );

            console.log(q)

            const unsubscribe = onSnapshot(q, snapshot => {
                console.log('snapshot');
                console.log("snap docs: " + snapshot.docs)
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
    if(!loggedInUserID){
        return (
                <ImageBackground
                    source={require('../../assets/img/HomePage1.png')}
                    style={{ flex:1 ,resizeMode: 'cover'}}
                >
                    <Center flex={1}>
                        <HStack alignItems='center' gap={10}>
                            <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                        </HStack>
                    </Center>
                </ImageBackground>
            ) 
    }else{
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <View style={{ flex: 1 }}>
                    <AlertDialog
                        isOpen={showAlertDialog}
                        // onClose={() => {
                        // setShowAlertDialog(false)
                        // }}
                    >
                        <AlertDialogBackdrop />
                            <AlertDialogContent>
                                <AlertDialogHeader justifyContent='center' alignItems='center'>
                                    <Heading textAlign='center' paddingTop={80} flex={1} color='#512095'>
                                        <MaterialCommunityIcons name='timer' size={100}/>
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
                            {/* <AlertDialogFooter>
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
                                        onPress={() => {
                                            null
                                        }}
                                        disabled={disabledeletebutton}
                                    >
                                        <ButtonText>Remove</ButtonText>
                                    </Button>
                                </ButtonGroup>
                            </AlertDialogFooter> */}
                        </AlertDialogContent>
                    </AlertDialog>
                    <GiftedChat
                        messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: parseInt(loggedInUserID),
                        }}
                        messageContainerRef={messageContainerRef}
                        // renderAvatarOnTop={true}
                        renderAvatar = {null}
                        onInputTextChanged={onInputTextChanged}
                        isTyping ={receiverTyping}
                        scrollToBottom ={true}
                        renderFooter={(messages.length==0)?(()=>{
                            if(messages.length==0){
                            return(
                                <View justifyContent='center' alignItems='center' h={'$full'}>
                                    <Text color='white'>Start chatting!</Text>
                                    <Text color='white'>Remember to be friendly!</Text>
                                </View>
                                )  
                            }
                            
                        }):null}
                    />
                    {
                        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                    }
                </View>
            </ImageBackground>
        )
    }
}
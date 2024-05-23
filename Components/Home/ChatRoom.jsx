import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, ImageBackground, Text, View, Input, HStack, Spinner, Center } from "@gluestack-ui/themed";
import React, { useRef } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import userimg from '../../assets/img/user.png'
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, addDoc, orderBy, query, onSnapshot, where , doc, getDoc, setDoc, updateDoc} from 'firebase/firestore';
import { database } from "../../config/firebase";

const error = console.error; console.error = (...args) => { if (/defaultProps/.test(args[0])) return; error(...args); };

export default function ChatRoom({navigation,route}) {
    
    const[loggedInUserID, setLoggedInUserID] = useState();
    const [typing,setTyping]=useState(false)
    const [receiverTyping,setReceiverTyping]=useState(false);
    const { receiverID } = route.params;
    const { roomID } = route.params;
    const { startingTime } = route.params;

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
                    console.log("hello world")
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

    const CountdownTimer = ({ startTime }) => {
        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
      
        useEffect(() => {
            const interval = setInterval(() => {
              setTimeLeft(calculateTimeLeft());
            }, 1000);
        
            return () => clearInterval(interval);
          }, []);
        
          function calculateTimeLeft() {
            const startTimeDate = new Date(startTime);
            const timezoneOffset = startTimeDate.getTimezoneOffset() * 60000; // Timezone offset in milliseconds
            const targetTime = startTimeDate.getTime() + timezoneOffset + 5 * 60 * 1000;
            const currentTime = new Date().getTime();
            const difference = targetTime - currentTime;
        
            if (difference > 0) {
              const minutes = Math.floor(difference / 1000 / 60);
              const seconds = Math.floor((difference / 1000) % 60);
              return { minutes, seconds };
            } else {
              return { minutes: 0, seconds: 0 };
            }
          }
      
        return (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Text size='xl' color='white' fontFamily='Roboto_300Light'>
              {timeLeft.minutes}:{timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
            </Text>
          </View>
        );
      };

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
                  <CountdownTimer startTime={startingTime} />
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
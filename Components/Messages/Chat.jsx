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

export default function Chat({navigation,route}) {
    
    const[loggedInUserID, setLoggedInUserID] = useState();
    const [typing,setTyping]=useState(false)
    const [receiverTyping,setReceiverTyping]=useState(false);
    // const handleAppStateChange = useCallback(async (nextAppState) => {
    //     const userToken = await AsyncStorage.getItem('userToken');
    //     const userId = await AsyncStorage.getItem('id');
    //     if (userToken) {
    //         let active;
    //         console.log("App.js " + imagePickerOpen)
    //         // if(imagePickerOpen){
    //         //   return;
    //         // }
    //         if (nextAppState === 'active' || !nextAppState) {
    //             active = true;
    //             setUserOnline(true);
    //         } else {
    //             active = false;
    //             setUserOnline(false);
    //         }
    
    //         try {
    //             // Check if the document already exists
    //             const docRef = doc(database, 'status', userId);
    //             const docSnapshot = await getDoc(docRef);
    //             let datetime= getCurrentDateTime();
    //             if (docSnapshot.exists()) {
    //                 // Update the existing document
                    
    //                 await updateDoc(docRef, { active ,datetime});
    //             } else {
    //                 // If the document doesn't exist, create it
    //                 await setDoc(docRef, { userId: parseInt(userId), active ,datetime});
    //             }
    
    //             console.log('User status updated successfully App.js.');
    //         } catch (error) {
    //             console.error('Error occurreeEed while updating user status:', error);
    //         }
    //     }
    // }, [setUserOnline]);


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
            let receiverid=receivingUser.idusers
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
        useEffect(() => {
            if (!loggedInUserID || !receivingUser?.idusers) {
                return;
            }
        
            const senderid = loggedInUserID;
            const receiverid = receivingUser.idusers;
            const docId = `${receiverid}_${senderid}`;
            
            const typingStatusQuery = query(
                collection(database, 'typing'),
                where('receiverid', '==', senderid),
                where('senderid', '==', receiverid)
            );
        
            // Set up a real-time listener for the query
            const unsubscribe = onSnapshot(typingStatusQuery, (snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added' || change.type === 'modified') {
                        const data = change.doc.data();
                        console.log("hello world");
                        console.log(data.typing);
                        setReceiverTyping(data.typing);
                    }
                });
            });
        
            // Cleanup function to unsubscribe from the listener
            return () => {
                unsubscribe();
            };
        }, [loggedInUserID, receivingUser]);
        
    
    function getFormattedTimeDifference(datetime) {
        // Parse the given datetime string
        let givenDatetime = new Date(datetime);
    
        // Get the current date and time
        let currentDate = new Date();
    
        // Calculate the difference in milliseconds
        let difference = currentDate - givenDatetime;
    
        // Convert milliseconds to days, hours, minutes, and seconds
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
        // Construct the formatted string
        let formattedTimeDifference = '';
        if (days > 0) formattedTimeDifference += `${days} day${days > 1 ? 's' : ''} `;
        if (hours > 0) formattedTimeDifference += `${hours}h `;
        if (minutes > 0) formattedTimeDifference += `${minutes}min `;
        
        // Append a message if formattedTimeDifference is empty
        if (formattedTimeDifference === '') {
            formattedTimeDifference = "just now";
        }
    
        return formattedTimeDifference.trim();
    }
    // Get the safe area insets
    const insets = useSafeAreaInsets();

    // Get the height of the camera cutout
    const cameraCutoutHeight = insets.top;
    const { receivingUser } = route.params;
    const [userStatus, setUserStatus] = useState(false)

    const [messages, setMessages] = useState([])
    const headerHeight = useHeaderHeight();

    useEffect(()=>{
        getLoggedInUserId()
    }, [])

    useEffect(()=>{
        clearUnreadMessages()
    },[messages])

    const clearUnreadMessages = async () => {
        try {
            let receiverid=loggedInUserID;
            let senderid=receivingUser.idusers;

            if(receiverid){
                const docId = `${senderid}_${receiverid}`;
                const docRef = doc(database, 'unread', docId);
                
                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    // Update the existing document
                    
                    await updateDoc(docRef, { messages: 0});
                } else {
                    // If the document doesn't exist, create it
                    await setDoc(docRef, { senderID: parseInt(senderid), receiverID: parseInt(receiverid) , messages: 0});
                }

                console.log('User status updated successfully App.js.');
            }
        } catch (error) {
            console.error('Error occurreeEed while updating user status:', error);
        }
    }

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
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',borderBottomColor:'white', paddingTop: 30, width: '100%',borderBottomWidth:.5,paddingBottom:10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                    <AntDesign name="arrowleft" size={25} color="white" onPress={() => navigation.goBack()} padding={10}/>
                    {receivingUser.imageurl ? <Image
                            alt='profilePic'
                            // borderColor='white'
                            // borderWidth={2}
                            // border
                            w={140}
                            h={140}
                            zIndex={-1}
							style={{width:50,height:50}}
                            borderRadius="$full"
                            source={{
                                uri: receivingUser.imageurl,
                            }}
                        /> : <Image source={userimg} alt='' style={{ borderRadius: 50, width: 50, height: 50, marginLeft: 1 }} />}
                    <TouchableOpacity style={{ marginLeft: 10,width:'100%', display: 'flex', flexDirection: 'column' }} onPress={() => {
                      navigation.push('ProfileMessages', {
                        user: receivingUser,
                      });
                    }}>
                      <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                        {/* {receivingUser.username} */}
                        {receivingUser.username.length<=10?receivingUser.username:receivingUser.username.substring(0, 10)+'...'}
                      </Text>
                      <Text size='sm' fontFamily='Roboto_400Regular' style={{ color: userStatus === true ? '#2cd6d3' : '#727386' }}>
                                {userStatus === true
                                    ? 'online'
                                    : getFormattedTimeDifference(receivingUser.datetime) === "just now"
                                    ? 'last seen just now'
                                    : 'last seen ' + getFormattedTimeDifference(receivingUser.datetime) + ' ago'}
                                </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                    <Ionicons name="call" size={24} color="white" style={{ marginRight: 20 }} />
                    <FontAwesome name="video-camera" size={24} color="white" />
                  </View>
                </View>
              ),
          });
    })

    useEffect(() => {
        const collectionRef = collection(database, 'chats');

        const receivingUserId = receivingUser.idusers; // Example receiving user ID
        const currentUserID = loggedInUserID; // Example current user ID

        if(loggedInUserID){
            console.log(parseInt(receivingUserId))
            console.log(parseInt(currentUserID))
            // const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
            const q = query(
                collectionRef, 
                where('receivingUser', 'in', [parseInt(receivingUserId),parseInt(currentUserID)]), // Filter by receiving user
                where('user._id', 'in', [parseInt(receivingUserId),parseInt(currentUserID)]), // Filter by current user
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
    }, [loggedInUserID, receivingUser]);

    const updateFriendStatus = (userId, userStatus,datetime) => {
        setUserStatus(userStatus)
        receivingUser.datetime=datetime
    };

    useEffect(() => {
        if (!receivingUser?.idusers) return;

        // Create a query for the friend's status document
        const friendStatusQuery = query(
            collection(database, 'status'),
            where('userId', '==', receivingUser.idusers) // Assuming 'userId' is the field storing the user ID in the 'status' documents
        );

        // Set up a real-time listener for the query
        const unsubscribe = onSnapshot(friendStatusQuery, (snapshot) => {
            console.log(`Snapshot received for friend ${receivingUser.idusers}`);
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const friendData = change.doc.data();
                    console.log(`Friend ${friendData.userId} status changed to ${friendData.active}`);
                    updateFriendStatus(friendData.userId, friendData.active, friendData.datetime);
                    // Update UI or perform actions based on friend's status change
                }
            });
        });

        // Cleanup subscription on unmount or when receivingUser.idusers changes
        return () => unsubscribe();
    }, [receivingUser?.idusers, updateFriendStatus]);


      const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        )
        const { _id, createdAt, text, user } = messages[0];
        console.log(user)
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user,
            receivingUser: receivingUser.idusers
        });
        try {
            // Check if the document already exists
            const docRef = doc(database, 'unread', user._id+'_'+receivingUser.idusers);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                await updateDoc(docRef, { messages: docSnapshot.data().messages+1 });
            } else {
                await setDoc(docRef, { senderID: parseInt(user._id), receiverID: parseInt(receivingUser.idusers) , messages: 1});
            }
        } catch (error) {
            console.error(error);
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
                    />
                    {
                        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                    }
                </View>
            </ImageBackground>
        )
    }
}
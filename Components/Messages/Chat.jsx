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
import { collection, addDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { database } from "../../config/firebase";

export default function Chat({navigation,route}) {
    const[loggedInUserID, setLoggedInUserID] = useState();

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
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, width: '100%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <AntDesign name="arrowleft" size={30} color="white" onPress={() => navigation.goBack()} marginLeft={-20} />
                    {receivingUser.imageurl ? <Text>profile image</Text> : <Image source={userimg} alt='' style={{ borderRadius: 50, width: 60, height: 60, marginLeft: 10 }} />}
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                      navigation.push('ProfileMessages', {
                        user: receivingUser,
                      });
                    }}>
                      <Text size='2xl' color='white' fontFamily='ArialRoundedMTBold' paddingTop={10}>
                        {receivingUser.username}
                      </Text>
                      <Text fontFamily='ArialRoundedMTBold' style={{ color: userStatus===true?'#2cd6d3':'#727386', fontSize: 15 }}>{userStatus === true ? 'online' : 'offline'}</Text>
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

    const updateFriendStatus = (userId, userStatus) => {
        setUserStatus(userStatus)
    };

    // Set up the listener
    useEffect(()=>{
        // Create a query for each friend's status document
        const friendStatusQuery = query(
            collection(database, 'status'),
            where('userId', '==', receivingUser.idusers) // Assuming 'userId' is the field storing the user ID in the 'status' documents
        );

        // Set up a real-time listener for each query
        const unsubscribe = onSnapshot(friendStatusQuery, (snapshot) => {
            console.log(`Snapshot received for friend ${receivingUser.idusers}`);
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const friendData = change.doc.data();
                    console.log(`Friend ${friendData.userId} status changed to ${friendData.active}`);
                    updateFriendStatus(friendData.userId, friendData.active)
                    // Update UI or perform actions based on friend's status change
                }
            });
        });
    })


      const onSend = useCallback((messages = []) => {
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
                        renderAvatarOnTop={true}
                        renderAvatar = {null}
                    />
                    {
                        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                    }
                </View>
            </ImageBackground>
        )
    }
}
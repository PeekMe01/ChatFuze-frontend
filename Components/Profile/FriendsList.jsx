import { AddIcon, Center, Divider, HStack, Image, ImageBackground, RefreshControl, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React, { useEffect } from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import SocialMedia from './SocialMedia';
import api from '../Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from "../../config/firebase";
import userimg from '../../assets/img/user.png'
// import { Pusher, PusherEvent } from '@pusher/pusher-websocket-react-native';

export default function FriendsList({navigation}) {
    const [clickedButton, setClickedButton] = useState(false);
    const [friendsList, setFriendsList] = useState();
    const isFocused = useIsFocused();

    const updateFriendStatus = (userId, newStatus,datetime) => {
        setFriendsList(prevFriendsList => (
            prevFriendsList.map(friend => {
                if (friend.idusers === userId) { // Assuming `userId` uniquely identifies each friend
                    return {
                        ...friend,
                        active: newStatus,
                        datetime:datetime
                    };
                }
                return friend;
            })
        ));
    };
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
    async function fetchData(){
        try {
             const data = await AsyncStorage.getItem('id')
             const response = await api.get(`/messages/friends/${data}`);
             // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
             setFriendsList(response.data)
             // Create an array to store all listener unsubscribe functions
            const unsubscribeFunctions = [];

            // Assuming `friendIds` is an array of friend IDs
            response.data.forEach((friend) => {
                // Create a query for each friend's status document
                const friendStatusQuery = query(
                    collection(database, 'status'),
                    where('userId', '==', friend.idusers) // Assuming 'userId' is the field storing the user ID in the 'status' documents
                );

                // Set up a real-time listener for each query
                const unsubscribe = onSnapshot(friendStatusQuery, (snapshot) => {
                    console.log(`Snapshot received for friend ${friend.idusers}`);
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added' || change.type === 'modified') {
                            const friendData = change.doc.data();
                            console.log(`Friend ${friendData.userId} status changed to ${friendData.active}`);
                            updateFriendStatus(friendData.userId, friendData.active,friendData.datetime)
                            // Update UI or perform actions based on friend's status change
                        }
                    });
                });

                // Add the unsubscribe function to the array
                unsubscribeFunctions.push(unsubscribe);
                });

                // Return a cleanup function that unsubscribes all listeners
                return () => {
                    unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
                };
         } catch (error) {
             console.log(error)
         }
     }
     
    useEffect(() => {
        fetchData();
    }, [isFocused]);

    useEffect(() =>{
        if(friendsList){
            console.log('hihi')
            
            }
    }, [])

   

    const handleProfileVisit = (user) =>{
        navigation.push('ProfileVisit', { 
            userId: user.idusers,
        });
        setClickedButton(true);
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

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
    });
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <Center h={'$full'}>
                    <HStack space="sm" justifyContent='center' alignItems='center'>
                        <Text  color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                    </HStack>
                </Center>
            </ImageBackground>
        ) 
    }

  return (
    <ImageBackground
        source={require('../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} marginBottom={230}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                        <Icon name="arrow-back" size={25} color="white"/>
                    </TouchableHighlight>
                    <Text size='4xl' color='white' fontFamily='Roboto_500Medium'>
                        Friends ({friendsList?friendsList.length:0})
                    </Text>
                </View>
            <ScrollView style={{ marginTop: friendsList?0:250 }} fadingEdgeLength={100} showsVerticalScrollIndicator = {false} >
                <View w="$80" alignSelf='center' marginVertical={50}>
                    {friendsList&&friendsList.length>0?friendsList.map((user)=>(
                <React.Fragment key={user.idusers}>
                    <TouchableHighlight onPress={()=>{handleProfileVisit(user)}} underlayColor={'#ffffff50'} style={{ padding:10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row' >
                        <View justifyContent='center' alignItems='center' flexDirection='row' gap= {10}>
                        {user.imageurl?
                        <Image
                            alt='profilePic'
                            // borderColor='white'
                            // borderWidth={2}
                            // border
                            size='sm'
                            zIndex={-1}
                            style={{width:60,height:60}}
                            borderRadius="$full"
                            source={{
                                uri: user.imageurl,
                            }}
                        />
                        :<Image
                            alt='profilePic'
                            // borderColor='white'
                            // borderWidth={2}
                            // border
                            size='sm'
                            zIndex={-1}
                            borderRadius="$full"
                            source={userimg}
                            style={{ width:60, height:60 }}
                        />}
                        <View>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                {user.username}
                            </Text>
                            <Text size='sm' color={user.active?'#2cd6d3':'#727386'} fontFamily='Roboto_400Regular'>
                            {user.active === true
                                ? 'Active'
                                : getFormattedTimeDifference(user.datetime) === "just now"
                                ? 'last seen just now'
                                : 'last seen from: ' + getFormattedTimeDifference(user.datetime)}
                            </Text>
                        </View>
                            
                        </View>
                            <Icon name="keyboard-arrow-right" size={24} color="white"/>
                        </View>
                    </TouchableHighlight>

                    <Divider/>
                </React.Fragment>
                )):null}

                </View>
                {!friendsList&&
                    <View>
                        <Center>
                        <HStack space="sm" justifyContent='center' alignItems='center'>
                            <Text  color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                        </HStack>
                        </Center>
                    </View>  
                }
            </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

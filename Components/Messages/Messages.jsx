import React, { useState, useEffect,useRef } from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import api from '../Config'
import userimg from '../../assets/img/user.png'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';
import { ScrollView, TouchableHighlight, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { AlertCircleIcon, Image, Box, HStack, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, ToastDescription, ToastTitle, VStack, View, Spinner, RefreshControl } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from "../../config/firebase";
import { useIsFocused } from '@react-navigation/native';
import { useUnreadMessages } from '../UnreadMessages/UnreadMessagesProvider';
const Messages = ({ navigation, setLoggedIn, setLoginPage, setSignupPage }) => {
    const { friendUnreadCounts } = useUnreadMessages();
    const isFocused = useIsFocused();
    const [friendsuser, setfriendsuser] = useState([]);
    const [loading, setIsLoading] = useState(true)
    const [user, setUser] = useState(null);
    const [pendingSnapchot,setPendingSnapchot]=useState()
    const pendingSnapchotRef = useRef(0); 

    async function fetchUserData() {
        try {
          const data = await AsyncStorage.getItem('id')
          const response = await api.get(`/settings/getinsight/${data}`);
          setUser(response.data.user);
        } catch (error) {
          console.log(error)
        }
      }
      useEffect(() => {
        fetchUserData();
      }, [!user || isFocused]);

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
        if (days == 0) {
            if (minutes > 0) {
                formattedTimeDifference += `${minutes}min`
            }
        }

        // Append a message if formattedTimeDifference is empty
        if (formattedTimeDifference === '') {
            formattedTimeDifference = "just now";
        }


        return formattedTimeDifference.trim();
    }


    const updateFriendStatus = (userId, newStatus, dateTime) => {
        if (pendingSnapchotRef.current > 0) {
            pendingSnapchotRef.current -= 1;
          }
          if(pendingSnapchotRef.current == 0){
            setPendingSnapchot(pendingSnapchotRef.current);
          }
        setfriendsuser(prevFriendsList => (
            prevFriendsList.map(friend => {
                if (friend.idusers === userId) { // Assuming `userId` uniquely identifies each friend
                    return {
                        ...friend,
                        active: newStatus,
                        datetime: dateTime
                    };
                }
                return friend;
            })
        ));
    };

    const fetchData = async () => {
        try {
            const userId = await AsyncStorage.getItem('id');
            const response = await api.get(`/messages/friends/${userId}`);
            setPendingSnapchot(response.data.length)
             pendingSnapchotRef.current = response.data.length; 
            setfriendsuser(response.data);
            setIsLoading(false);
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
                    snapshot.docChanges().forEach((change) => {
                        if (change.type === 'added' || change.type === 'modified') {
                            const friendData = change.doc.data();
                            updateFriendStatus(friendData.userId, friendData.active, friendData.datetime)
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
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {

        const unsubscribe = navigation.addListener('focus', () => {
            fetchData();
        });

        return unsubscribe;
    }, [navigation]);
    useEffect(() => {
        fetchData();
    }, [isFocused]);

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity key={index} style={{ padding: 10, borderBottomWidth: 1, borderColor: 'white' }}
                onPress={async () => {
                    navigation.push('Chat', {
                        receivingUser: item,
                    });
                }}
            >
                <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                    <View justifyContent='center' alignItems='center' flexDirection='row' gap={10}>
                        {item.imageurl ? <Image
                            alt='profilePic'
                            w={140}
                            h={140}
                            zIndex={-1}
                            style={{ width: 60, height: 60 }}
                            borderRadius="$full"
                            source={{
                                uri: item.imageurl,
                            }}
                        /> : <Image source={userimg} alt='' borderRadius="$full" style={{ width: 60, height: 60 }} />}
                        <View>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                {item.username.length <= 10 ? item.username : item.username.substring(0, 10) + '...'}
                            </Text>
                          {pendingSnapchot==0 ?  <Text size='sm' color={item.active ? '#2cd6d3' : '#727386'} fontFamily='Roboto_400Regular'>
                                {item.active === true
                                    ? 'Active'
                                    : getFormattedTimeDifference(item.datetime) === "just now"
                                        ? 'last seen just now'
                                        : 'last seen ' + getFormattedTimeDifference(item.datetime) + ' ago'}
                            </Text> :<Text size='sm' color={item.active ? '#2cd6d3' : '#727386'} fontFamily='Roboto_400Regular'></Text> }
                        </View>
                    </View>
                    {friendUnreadCounts[item.idusers] != undefined &&
                        <View flex={1}>
                            {friendUnreadCounts[item.idusers] != 0 ? <Text width={friendUnreadCounts[item.idusers] > 9 ? 40 : 30} textAlign='center' alignSelf='flex-end' size='lg' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' margin={2} paddingHorizontal={8} backgroundColor='#2cd6d3' borderRadius={300}>
                                {friendUnreadCounts[item.idusers] > 9 ? '9+' : friendUnreadCounts[item.idusers]}
                            </Text> : null}
                        </View>}
                    <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={24} color="white" />
                </View>
            </TouchableOpacity>
        );
    };


    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'),
    });
    const [changingPage, setChangingPage] = useState(false)
    if (!fontsLoaded ) {
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

    if(user){
        if(user.isbanned){
            return(
                <ImageBackground
                    source={require('../../assets/img/HomePage1.png')}
                    style={{ flex: 1, resizeMode: 'cover' }}
                >
                    <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                        <View margin={30}>
                            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false} style={{ marginBottom: 0}}>
                                <Text size='4xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                                    Messages
                                </Text>
                            </ScrollView>
                        </View>
                        <View justifyContent='center' alignItems='center'>
                            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false} >
                                <View gap={5} display='flex' flexDirection='row' >
                                <Box style={{ display: 'flex', gap: 20, marginVertical: '2%' }}>
                                <Text style={{ alignSelf: 'center', fontSize: 24, color: 'white', fontFamily: 'Roboto_300Light' }}>
                                    Your Account Has Been Banned!
                                </Text>
                                <Text style={{ alignSelf: 'flex-start', marginBottom: '1%', fontSize: 20, color: 'white', fontFamily: 'Roboto_300Light' }}>
                                    Please check your email for more info about your ban.
                                </Text>
                                <Button
                                            bg="rgba(81, 32, 149,1)"
                                            $active={{
                                            bg: "rgba(81, 32, 149,0.5)",
                                            }}
                                            onPress={async () => {
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
                                                        let datetime = getCurrentDateTime();
                                                        await updateDoc(docRef, { active, datetime });
                                                        } else {
                                                        // If the document doesn't exist, create it
                                                        let datetime = getCurrentDateTime();
                                                        await setDoc(docRef, { active, datetime });
                                                        }
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
                                </Box>
                                </View>
                            </ScrollView>
                        </View>
                        
                        
                    </Animatable.View>
                </ImageBackground>
            )
        }
    }

    if (loading) {

        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                    <ActivityIndicator size="large" color="purple" />
                    <Text>Loading...</Text>
                </View>
            </ImageBackground>
        );

    }
    else {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                    <View margin={30}>
                        <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false} style={{ marginBottom: 20 }}>
                            <Text size='4xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                                Messages
                            </Text>
                        </ScrollView>

                        {friendsuser && friendsuser.length >= 1 ? <FlatList style={{ height: '85%' }}
                            data={friendsuser}
                            renderItem={renderItem}
                            showsVerticalScrollIndicator={false}
                            fadingEdgeLength={100}
                        /> : <>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular' style={{ textAlign: 'center' }}>No Friends Available!</Text>
                        </>}

                    </View>
                </Animatable.View>
            </ImageBackground>
        )
    }
}

export default Messages
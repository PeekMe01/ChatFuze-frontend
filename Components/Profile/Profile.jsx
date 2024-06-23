import { AddIcon, HStack, Image, ImageBackground, Spinner, Text, RefreshControl, Divider, Center, View, Box, ButtonText, Button } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native';
import SocialMedia from './SocialMedia';
import api from '../Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import userimg from '../../assets/img/user.png'
import beginnerRank from '../../assets/img/RankFrames/Beginner.png'
import amateurRank from '../../assets/img/RankFrames/Amateur.png'
import expertRank from '../../assets/img/RankFrames/Expert.png'
import masterRank from '../../assets/img/RankFrames/Master.png'
import champRank from '../../assets/img/RankFrames/Champ.png'
import superstarRank from '../../assets/img/RankFrames/Superstar.png'
import EditProfile from './EditProfile';
import { AntDesign } from '@expo/vector-icons';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from "../../config/firebase";

export default function Profile({ navigation, setLoggedIn, setLoginPage, setSignupPage }) {

    const [refreshing, setRefreshing] = React.useState(false);
    const [clickedButton, setClickedButton] = useState(false);
    const [rankName, setRankName] = useState();
    const [leaderboardnumber, setLeaderboardnumber] = useState();
    const [roomCount, setRoomCount] = useState();
    const [user, setUser] = useState();
    const [expanded, setExpanded] = useState(false);
    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)

    const toggleBio = () => {
        setExpanded(!expanded);
    };
    async function fetchData() {
        try {
            const data = await AsyncStorage.getItem('id')
            const response = await api.get(`/settings/getinsight/${data}`);
            setUser(response.data.user);
            setRankName(response.data.rankname);
            setLeaderboardnumber(response.data.leaderboardnumber);
            setRoomCount(response.data.roomCount)
        } catch (error) {
            console.log(error)
        }
    }
    const isFocused = useIsFocused();
    useEffect(() => {
        fetchData();
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

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setUser()
        setTimeout(() => {
            setRefreshing(false);
        }, await fetchData());

    }, []);

    const handleEditSettings = () => {
        navigation.push('EditSettings');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleEditProfile = () => {
        navigation.push('EditProfile');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleFriendsList = () => {
        navigation.push('FriendsList');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

  

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'),
    });

    function calculateAge(dateOfBirth) {
        var today = new Date();
        var birthDate = new Date(dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();

        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        return age;
    }

    function formatDateOfBirth(dateOfBirth) {
        var birthDate = new Date(dateOfBirth);
        var day = birthDate.getDate();
        var monthIndex = birthDate.getMonth();
        var year = birthDate.getFullYear();

        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        return day + ' ' + months[monthIndex] + ' ' + year;
    }

    if (!fontsLoaded || !user) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <Center h={'$full'}>
                    <HStack space="sm" justifyContent='center' alignItems='center'>
                        <Text color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
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
                                    Leaderboard
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

    return (
        <ImageBackground
            source={require('../../assets/img/HomePage1.png')}
            style={{ flex: 1, resizeMode: 'cover' }}
        >
            <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                <View margin={30} marginBottom={100}>
                    <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl colors={["#321bb9"]} refreshing={refreshing} onRefresh={onRefresh} />}>
                        <Text size='4xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                            Profile
                        </Text>

                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15%' }}>
                            {user.imageurl ?
                                <Image
                                    alt='profilePic'
                                    borderColor='white'
                                    borderWidth={2}
                                    border
                                    w={140}
                                    h={140}
                                    zIndex={-1}
                                    borderRadius="$full"
                                    source={{
                                        uri: user.imageurl,
                                    }}
                                />
                                : <Image
                                    alt='profilePic'
                                    borderColor='white'
                                    borderWidth={2}
                                    border
                                    w={140}
                                    h={140}
                                    zIndex={-1}
                                    borderRadius="$full"
                                    source={userimg}
                                />}

                            <Image
                                marginTop={-160}
                                alt='profilePic'
                                borderColor='white'
                                w={180}
                                h={180}
                                source={
                                    rankName == "Beginner" ? beginnerRank :
                                        rankName == "Amateur" ? amateurRank :
                                            rankName == "Expert" ? expertRank :
                                                rankName == "Master" ? masterRank :
                                                    rankName == "Champ" ? champRank :
                                                        superstarRank
                                }
                            />
                            <View style={{ backgroundColor: '#512095', paddingHorizontal: '10%', paddingVertical: '1%', borderRadius: 30, marginTop: -20 }}>
                                <Text color='white'>{rankName} ({user.rankpoints})</Text>
                            </View>
                            <View display='flex' flexDirection='row' justifyContent='center' alignItems='center' margin={20} gap={5}>
                                <Text size='2xl' color='white' fontFamily='Roboto_400Regular' >{user.username}, {calculateAge(user.dateOfBirth)}</Text>
                                <Icon name="verified" size={24} color={user.verified ? "#2cd6d3" : "#bcbcbc"} />
                            </View>

                        </View>

                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 50, marginTop: -30 }}>
                            <TouchableHighlight onPress={() => { handleEditSettings() }} style={{ borderRadius: 50 }} underlayColor={'#51209550'} disabled={clickedButton}>
                                <View width={50} height={50} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                                    <Icon name="settings" size={30} color="white" />
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => { handleEditProfile() }} style={{ borderRadius: 50, marginTop: 50 }} underlayColor={'#51209550'} disabled={clickedButton}>
                                <View width={50} height={50} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                                    <Icon name="edit" size={30} color="white" />
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => { handleFriendsList() }} style={{ borderRadius: 50 }} underlayColor={'#51209550'} disabled={clickedButton}>
                                <View width={50} height={50} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                                    <Icon name="people-alt" size={30} color="white" />
                                </View>
                            </TouchableHighlight>
                        </View>

                        <Divider marginVertical={10} marginTop={20} />

                        <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10 }}>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                Bio
                            </Text>
                            <Text color='white' fontFamily='Roboto_300Light' size='lg' numberOfLines={expanded ? undefined : 3} ellipsizeMode="clip"  >
                                {!user.bio ? "No bio yet!" : user.bio}
                            </Text>
                            {user.bio && (user.bio.split('\n').length > 3 || user.bio.length > 120) && (
                                <TouchableOpacity onPress={toggleBio} >
                                    <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                                        {expanded ? "See less... " : "See more... "}
                                        <AntDesign
                                            name={expanded ? "arrowup" : "arrowdown"}
                                            size={20}
                                            color="white"
                                        />
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        <Divider marginVertical={10} />

                        <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10 }}>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                Gender
                            </Text>
                            <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                                <Icon name={user.gender == "Male" ? "male" : "female"} size={30} color="white" />
                                <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                                    {user.gender}
                                </Text>
                            </View>
                        </View>

                        <Divider marginVertical={10} />

                        <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10 }}>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                Global ranking spot
                            </Text>
                            <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                                <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                                    #{leaderboardnumber}
                                </Text>
                            </View>
                        </View>

                        <Divider marginVertical={10} />

                        <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10 }}>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                Total chat rooms joined
                            </Text>
                            <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                                <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                                    {roomCount}
                                </Text>
                            </View>
                        </View>

                        <Divider marginVertical={10} />

                        <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10 }}>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                Country of residence
                            </Text>
                            <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                                {/* Lebanon */}
                                {user.country}
                            </Text>
                        </View>

                        <Divider marginVertical={10} />

                        <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10 }}>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                Birthday
                            </Text>
                            <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                                {/* 17 April 2003 */}
                                {formatDateOfBirth(user.dateOfBirth)}
                            </Text>
                        </View>

                        <Divider marginVertical={10} />

                        <SocialMedia instagram={user.instagramlink} facebook={user.facebooklink} />

                    </ScrollView>
                </View>
            </Animatable.View>
        </ImageBackground>
    )
}

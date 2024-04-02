// This page is for visiting a friend's profile.
import { AddIcon, Center, Divider, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React, { useEffect } from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import SocialMedia from './SocialMedia';
import { RefreshControl } from '@gluestack-ui/themed';
import api from '../Config'
import beginnerRank from '../../assets/img/RankFrames/Beginner.png'
import amateurRank from '../../assets/img/RankFrames/Amateur.png'
import expertRank from '../../assets/img/RankFrames/Expert.png'
import masterRank from '../../assets/img/RankFrames/Master.png'
import champRank from '../../assets/img/RankFrames/Champ.png'
import superstarRank from '../../assets/img/RankFrames/Superstar.png'

export default function ProfileVisit({navigation, route}) {

    const { userId } = route.params;

    const [refreshing, setRefreshing] = React.useState(false);
    const [clickedButton, setClickedButton] = useState(false);
    const [friend, setFriend] = useState();
    const [rankName, setRankName] = useState();
    const [leaderboardnumber, setLeaderboardnumber] = useState();
    const [roomCount, setRoomCount] = useState();

    async function fetchData(){
        try {
             const data = userId;
             const response = await api.get(`/settings/getinsight/${data}`);
             // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
             setFriend(response.data.user);
             setRankName(response.data.rankname);
             setLeaderboardnumber(response.data.leaderboardnumber);
             setRoomCount(response.data.roomCount)
             console.log(response.data.user)
         } catch (error) {
             console.log(error)
         }
     }
     
    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setFriend();
        setTimeout(() => {
          setRefreshing(false);
        }, await fetchData());
        
      }, []);
  

    // const handleEditSettings = () =>{
    //     navigation.push('EditSettings');
    //     setClickedButton(true);
    //     setTimeout(() => {
    //         setClickedButton(false);
    //     }, 1000);
    // }

    // const handleEditProfile = () =>{
    //     navigation.push('EditProfile');
    //     setClickedButton(true);
    //     setTimeout(() => {
    //         setClickedButton(false);
    //     }, 1000);
    // }

    // const handleFriendsList = () =>{
    //     navigation.push('FriendsList');
    //     setClickedButton(true);
    //     setTimeout(() => {
    //         setClickedButton(false);
    //     }, 1000);
    // }

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)

    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
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

    if (!fontsLoaded||!friend) {
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
        {/* <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}> */}
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} marginBottom={100}>
                <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false} refreshControl={<RefreshControl  colors={["#321bb9"]} refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                        <Icon name="arrow-back" size={30} color="white"/>
                    </TouchableHighlight>
                    <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Profile
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15%'}}>
                    {/* <ImageBackground
                        source={{uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'}}
                        height={200}
                        alignSelf='center'
                        
                    > */}
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
                            uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        }}
                    />

                    <Image
                        marginTop={-160}
                        alt='profilePic'
                        borderColor='white'
                        // borderWidth={2}
                        w={180}
                        h={180}
                        // borderRadius="$full"
                        // source={{
                        //     uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        //     // uri: "assets/img/RankFrames/Beginner.png"
                        //     // uri : 
                        // }}
                        source={
                            rankName=="Beginner"?beginnerRank:
                            rankName=="Amateur"?amateurRank:
                            rankName=="Expert"?expertRank:
                            rankName=="Master"?masterRank:
                            rankName=="Champ"?champRank:
                            superstarRank
                        }
                    />
                    {/* </ImageBackground> */}
                    <View style={{ backgroundColor: '#512095', paddingHorizontal: '10%', paddingVertical: '1%', borderRadius: 30, marginTop: -20 }}>
                        <Text color='white'>{rankName} ({friend.rankpoints})</Text>
                    </View>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center' margin={20} gap={5}>
                        <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' >{friend.username}, {calculateAge(friend.dateOfBirth)}</Text>
                        <Icon name="verified" size={24} color={friend.verified?"#2cd6d3":"#bcbcbc"}/>
                    </View>
                    
                </View>

                <Divider marginVertical={10}/>

                <View style={{ alignItems: 'center', flexDirection: 'column', marginTop: 0, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Bio
                    </Text>
                    <Text color='white' fontWeight='$light' textAlign='center'>
                        {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. */}
                        {!friend.bio?"No bio yet!":friend.bio}
                    </Text>
                </View>

                <Divider marginVertical={10}/>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Gender
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Icon name={friend.gender=="Male"?"male":"female"} size={30} color="white"/>
                        <Text color='white' fontWeight='$light'>
                            {friend.gender}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Global ranking spot
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Text color='white' fontWeight='$light'>
                            #{leaderboardnumber}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Total chat rooms joined
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Text color='white' fontWeight='$light'>
                            {roomCount}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 10, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Country of residence
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        {friend.country}
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Birthday
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        {/* 17 April 2003 */}
                        {formatDateOfBirth(friend.dateOfBirth)}
                    </Text>
                </View>

                <SocialMedia instagram={friend.instagramlink} facebook={friend.facebooklink}/>

                </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}
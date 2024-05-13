import { AddIcon, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Center } from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';

import beginnerRank from '../../assets/img/RankFrames/Beginner.png'
import amateurRank from '../../assets/img/RankFrames/Amateur.png'
import expertRank from '../../assets/img/RankFrames/Expert.png'
import masterRank from '../../assets/img/RankFrames/Master.png'
import champRank from '../../assets/img/RankFrames/Champ.png'
import superstarRank from '../../assets/img/RankFrames/Superstar.png'
import EditProfile from './EditProfile';

export default function Profile({navigation}) {

    const [refreshing, setRefreshing] = React.useState(false);
    const [clickedButton, setClickedButton] = useState(false);
    const [rankName, setRankName] = useState();
    const [leaderboardnumber, setLeaderboardnumber] = useState();
    const [roomCount, setRoomCount] = useState();

    const [user, setUser] = useState();

    async function fetchData(){
        try {
             const data = await AsyncStorage.getItem('id')
             const response = await api.get(`/settings/getinsight/${data}`);
             // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
             setUser(response.data.user);
             setRankName(response.data.rankname);
             setLeaderboardnumber(response.data.leaderboardnumber);
             setRoomCount(response.data.roomCount)
            //  console.log(response.data.user)
         } catch (error) {
             console.log(error)
         }
     }
    const isFocused = useIsFocused();
    useEffect(() => {
        fetchData();
    }, [!user||isFocused]);


    const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      setUser()
      setTimeout(() => {
        setRefreshing(false);
      }, await fetchData());
      
    }, []);

    const handleEditSettings = () =>{
        navigation.push('EditSettings');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleEditProfile = () =>{
        navigation.push('EditProfile');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const handleFriendsList = () =>{
        navigation.push('FriendsList');
        setClickedButton(true);
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)

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

    if (!fontsLoaded||!user) {
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
                <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false} refreshControl={<RefreshControl colors={["#321bb9"]} refreshing={refreshing} onRefresh={onRefresh}/>}>
                <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={10}>
                    Profile
                </Text>

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
                            uri: user.imageurl?user.imageurl:"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
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
                        <Text color='white'>{rankName} ({user.rankpoints})</Text>
                    </View>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center' margin={20} gap={5}>
                        <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' >{user.username}, {calculateAge(user.dateOfBirth)}</Text>
                        <Icon name="verified" size={24} color={user.verified?"#2cd6d3":"#bcbcbc"}/>
                    </View>
                    
                </View>

                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 50, marginTop: -30 }}>
                    <TouchableHighlight onPress={()=>{handleEditSettings()}} style={{ borderRadius: 50 }} underlayColor={'#51209550'} disabled={clickedButton}>
                        <View width={50} height={50} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                            <Icon name="settings" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{handleEditProfile()}} style={{ borderRadius: 50, marginTop: 50}} underlayColor={'#51209550'} disabled={clickedButton}>
                        <View width={50} height={50} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                            <Icon name="edit" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{handleFriendsList()}} style={{ borderRadius: 50 }} underlayColor={'#51209550'} disabled={clickedButton}>
                        <View width={50} height={50} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                            <Icon name="people-alt" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Bio
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        {!user.bio?"No bio yet!":user.bio}
                        {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. */}
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Gender
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Icon name={user.gender=="Male"?"male":"female"} size={30} color="white"/>
                        <Text color='white' fontWeight='$light'>
                            {user.gender}
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

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Country of residence
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        {/* Lebanon */}
                        {user.country}
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Birthday
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        {/* 17 April 2003 */}
                        {formatDateOfBirth(user.dateOfBirth)}
                    </Text>
                </View>

                <SocialMedia instagram={user.instagramlink} facebook={user.facebooklink}/>

                </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

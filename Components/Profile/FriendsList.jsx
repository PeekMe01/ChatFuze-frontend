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

export default function FriendsList({navigation}) {

    const [refreshing, setRefreshing] = React.useState(false);
    const [clickedButton, setClickedButton] = useState(false);
    const [friendsList, setFriendsList] = useState();

    async function fetchData(){
        try {
             const data = await AsyncStorage.getItem('id')
             const response = await api.get(`/messages/friends/${data}`);
             // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
             setFriendsList(response.data)
             console.log(response.data)
         } catch (error) {
             console.log(error)
         }
     }
     
    useEffect(() => {
        fetchData();
    }, []);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setFriendsList()
        setTimeout(() => {
          setRefreshing(false);
        }, await fetchData());
    }, []);

    const handleProfileVisit = (user) =>{
        navigation.push('ProfileVisit', { 
            userId: user.idusers
        });
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
                <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={30}>
                    Friends ({friendsList?friendsList.length:0})
                </Text>
            <ScrollView style={{ marginTop: friendsList?0:250 }} fadingEdgeLength={100} showsVerticalScrollIndicator = {false} refreshControl={<RefreshControl colors={["#321bb9"]} refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View w="$80" alignSelf='center' marginVertical={50}>
                    {friendsList&&friendsList.length>0?friendsList.map((user)=>(
                <>
                    <TouchableHighlight onPress={()=>{handleProfileVisit(user)}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                        <View justifyContent='center' alignItems='center' flexDirection='row' gap= {10}>
                        <Image
                            alt='profilePic'
                            borderColor='white'
                            borderWidth={1}
                            size="sm"
                            borderRadius="$full"
                            source={{
                                uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                            }}
                        />
                        <View>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                {user.username}
                            </Text>
                            <Text size='sm' color={user.active?'#2cd6d3':'#727386'} fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                {user.active?"Active":"Offline"}
                            </Text>
                        </View>
                            
                        </View>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>

                    <Divider/>
                </>
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

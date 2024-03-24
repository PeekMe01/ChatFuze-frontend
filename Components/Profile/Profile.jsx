import { AddIcon, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import SocialMedia from './SocialMedia';
import { RefreshControl } from '@gluestack-ui/themed';

export default function Profile({navigation}) {

    const [refreshing, setRefreshing] = React.useState(false);
    const [clickedButton, setClickedButton] = useState(false);


    const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      setTimeout(() => {
        setRefreshing(false);
      }, 2000);
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

    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                    <HStack space="sm">
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
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

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15%' }}>
                    <Image
                        alt='profilePic'
                        borderColor='white'
                        borderWidth={2}
                        size="xl"
                        borderRadius="$full"
                        source={{
                            uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        }}
                    />
                    <View style={{ backgroundColor: '#512095', paddingHorizontal: '17%', paddingVertical: '1%', borderRadius: 30, marginTop: -20 }}>
                        <Text color='white'>Rank</Text>
                    </View>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center' margin={20}>
                        <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' >Ralph, 21</Text>
                        <Icon name="verified" size={24} color="#2cd6d3"/>
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
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Country of residence
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        Lebanon
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Birthday
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        17 April 2003
                    </Text>
                </View>

                <SocialMedia instagram={"daher.ralph"} facebook={"Ralph Daher"}/>

                </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

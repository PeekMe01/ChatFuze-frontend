// This page is for visiting a friend's profile.
import { AddIcon, Divider, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import SocialMedia from './SocialMedia';
import { RefreshControl } from '@gluestack-ui/themed';

export default function ProfileVisit({navigation}) {

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
                <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}>

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
                        <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' >Antoine, 19</Text>
                        <Icon name="verified" size={24} color="#2cd6d3"/>
                    </View>
                    
                </View>

                <Divider marginVertical={10}/>

                <View style={{ alignItems: 'center', flexDirection: 'column', marginTop: 0, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Bio
                    </Text>
                    <Text color='white' fontWeight='$light' textAlign='center'>
                    We ordered the Among Us potion from the DarkWeb. And supposedly when you drink this Among Us potion. At 3 a.m. you turn into the Impostor from Among Us. And we’re gonna find out if it actually is real, or not if it’s not. And it better be real you guys. Cause i literally spent $500 and 69 cents.
                    </Text>
                </View>

                <Divider marginVertical={10}/>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 10, gap: 10}}>
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
                        15 April 2004
                    </Text>
                </View>

                <SocialMedia instagram={"ak"} facebook={null}/>

                </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

import { AddIcon, Divider, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState,useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Config'
export default function Insights({navigation}) {

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [clickedButton, setClickedButton] = useState(false);
    const [insights, setInsights] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const idusers = await AsyncStorage.getItem('id');
                const response = await api.get(`/settings/getinsight/${idusers}`);
                const data = await response.data;
                setInsights(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
    });
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
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
        source={require('../../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} marginBottom={100}>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                {/* <View flexDirection='row' backgroundColor='blue' alignItems='center'>
                 */}
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10} style={{marginBottom:'30%'}}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton} >
                        <Icon name="arrow-back" size={30} color="white"/>
                    </TouchableHighlight>
                    <Text size='3xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Insights
                    </Text>
                </View>
                 <View style={{ flex: 1, alignItems: 'center' }}>
      {insights && (
        
        <View >
          
          <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                    Room Count: {insights.roomCount}
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Text color='white' fontWeight='$light'>
                        {((1- insights.roomCount / insights.maxRoomCountPerUser) * 100).toFixed(2)}%
                        </Text>
                    </View>
                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                    Friends Count:{insights.friendsCount}
                    </Text>
                    
                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                    Leaderboard Number:{insights.leaderboardnumber}
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Text color='white' fontWeight='$light'>
                        {(( insights.leaderboardnumber / insights.users.length) * 100).toFixed(2)}%
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                    Rank Name:
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Text color='white' fontWeight='$light'>
                        {insights.rankname}: {insights.userrankk} / {insights.usersbyrankpoints.length}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                    Rank Points:{insights.user.rankpoints}pts
                    </Text>
                    
                </View>
        </View>
      )}
    </View>
            </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

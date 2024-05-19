import { AddIcon, Divider, HStack, Image, ImageBackground, Progress, ProgressFilledTrack, Spinner, Text } from '@gluestack-ui/themed';
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
    // var percentage = 0;
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const idusers = await AsyncStorage.getItem('id');
                const response = await api.get(`/settings/getinsight/${idusers}`);
                const data = await response.data;
                setInsights(data);
                setPercentage(((1 - data.roomCount / data.maxRoomCountPerUser) * 100).toFixed(2));
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
            <View margin={30} marginBottom={'15%'}>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10} style={{marginBottom:'20%'}}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton} >
                        <Icon name="arrow-back" size={25} color="white"/>
                    </TouchableHighlight>
                    <Text size='4xl' color='white' fontFamily='Roboto_500Medium' >
                        Insights
                    </Text>
                </View>
                 <View style={{ flex: 1, alignItems: 'center' }}>
      {insights && (
        
        <View >
          
          <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10}}>
                    <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                    Rooms Count: {insights.roomCount}
                    </Text>
                    <View display='flex' flexDirection='column' justifyContent='center' gap={10} alignItems='center'>
                         <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                         {percentage == '0.00'
								  ? 'You rank in the top 0.01% of users!'
								  : `You rank in the top ${percentage}% of users!`}
                        </Text>
                        <Progress value={100-percentage} w={300} size="md">
                            <ProgressFilledTrack bgColor='#7478d4'/>
                        </Progress>
                    </View>
					<Divider marginVertical={10} />
                </View>
				 
                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                   <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                    Friends Count: {insights.friendsCount}
                    </Text>
                    <Divider marginVertical={10} />
                </View>
                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                     <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                    Leaderboard Number: {insights.leaderboardnumber}
                    </Text>
                    <View display='flex' flexDirection='column' justifyContent='center' gap={10} alignItems='center'>
                        <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                        You rank in the top {(( insights.leaderboardnumber / insights.users.length) * 100).toFixed(2)}% of users!
                        </Text>
                        <Progress value={100-(( insights.leaderboardnumber / insights.users.length) * 100).toFixed(2)} w={300} size="md">
                            <ProgressFilledTrack bgColor='#7478d4'/>
                        </Progress>
                    </View>
					 <Divider marginVertical={10} />
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                    Rank: {insights.rankname}
                    </Text>
                    <Text color='white' fontFamily='Roboto_300Light' size='lg'>You rank {insights.userrankk}{insights.userrankk==1?'st':insights.userrankk==2?'nd':insights.userrankk==3?'rd':'th'} among the {insights.usersbyrankpoints.length} users in your rank.</Text>
					 <Divider marginVertical={10} />
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                     <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                    Rank Points: {insights.user.rankpoints} pts
                    </Text>
                    {insights.user.rankpoints==0?<Text size='md' color='white' fontFamily='Roboto_100Thin'>
                    Hint: Join rooms to get more points
                    </Text>:null}
                    
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
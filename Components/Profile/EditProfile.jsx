import { AddIcon, Divider, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import SocialMedia from './SocialMedia';

export default function EditProfile({navigation}) {

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
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} marginBottom={100}>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={30}>
                    Edit Profile
                </Text>
                <View w="$80" alignSelf='center' marginVertical={100}>
                    <TouchableHighlight onPress={()=>{}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Change Username
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Change Country
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Edit Bio
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                    <TouchableHighlight onPress={()=>{}} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }}>
                        <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                            <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                                Edit Social Media Links
                            </Text>
                            <Icon name="keyboard-arrow-right" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <Divider/>
                </View>
            </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

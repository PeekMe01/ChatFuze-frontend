import { AddIcon, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import SocialMedia from './SocialMedia';

export default function EditSettings({navigation}) {

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
                <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={10}>
                    Edit Settings
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
                    <TouchableHighlight onPress={()=>{navigation.push('EditSettings');}} style={{ borderRadius: 50 }} underlayColor={'#51209550'}>
                        <View width={50} height={50} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                            <Icon name="settings" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{}} style={{ borderRadius: 50, marginTop: 50}} underlayColor={'#51209550'}>
                        <View width={50} height={50} justifyContent='center' alignItems='center' backgroundColor='#51209530' borderRadius={50}>
                            <Icon name="edit" size={30} color="white"/>
                        </View>
                    </TouchableHighlight>
                    <TouchableHighlight onPress={()=>{}} style={{ borderRadius: 50 }} underlayColor={'#51209550'}>
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
                    We ordered the Among Us potion from the DarkWeb. And supposedly when you drink this Among Us potion. At 3 a.m. you turn into the Impostor from Among Us. And we’re gonna find out if it actually is real, or not if it’s not. And it better be real you guys. Cause i literally spent $500 and 69 cents.
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

                <SocialMedia/>

                </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

import { AddIcon, Divider, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import logo from '../../../assets/img/Logo/Logo_WithoutBackground.png';
import { Box } from '@gluestack-ui/themed';

export default function AboutUs({navigation}) {

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
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
                <Text size='3xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={30}>
                    About us
                </Text>
                <View alignItems='center' justifyContent='center' margin={10} marginTop={40}>
                    <Image source={logo}
                    // style={{width: '100%', height: '100%'}}
                    alt='company_logo'
                    backgroundColor='white'
                    w={'$72'}
                    h={'$72'}
                    borderRadius={30}
                    borderColor='#bcbcbc'
                    borderWidth={5}
                    />
                </View>

                <Text size='3xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' padding={30} textAlign='center'>
                    ChatFuze
                </Text>
                
                <Text color='white' fontWeight='$light' size='lg' textAlign='center'>
                    ChatFuze is a forward-thinking Lebanese website development company that specializes in creating customized digital solutions for businesses. With a focus on creativity and quality, we design and develop visually appealing, user-friendly websites tailored to meet the unique needs of our clients. Our team of experts collaborates closely with each client to understand their goals and deliver websites that not only look great but also drive engagement and growth. Whether you need a new website, an e-commerce platform, or a website redesign, ChatFuze has the expertise to bring your vision to life and enhance your online presence. 
                </Text>
            </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

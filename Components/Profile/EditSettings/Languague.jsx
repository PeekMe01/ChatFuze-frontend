import { View, AddIcon, Divider, HStack, Image, ImageBackground, Spinner, Text } from '@gluestack-ui/themed';
import React, { useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function Language({ navigation }) {

    const [clickedButton, setClickedButton] = useState(false);
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
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'),
    });
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
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
            style={{ flex: 1, resizeMode: 'cover' }}
        >
            <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                <View margin={30} marginBottom={100}>
                    <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false}>
                        <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                            <TouchableHighlight onPress={() => { handleGoBackPressed() }} underlayColor={'transparent'} disabled={clickedButton}>
                            <AntDesign name="arrowleft" size={25} color="white"   />
                            </TouchableHighlight>
                            <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                                Language
                            </Text>
                        </View>
                        <View style={{width:'100%'}} alignSelf='center' marginVertical={100}>
                            <TouchableHighlight onPress={() => { }} underlayColor={'#ffffff50'} style={{ paddingVertical: 10 }} disabled={clickedButton}>
                                <View justifyContent='space-between' alignItems='center' flexDirection='row'>
                                    <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                        English
                                    </Text>
                                    <AntDesign name='check' size={24} color={'white'} />
                                    {/* <Icon name="keyboard-arrow-right" size={30} color="white"/> */}
                                </View>
                            </TouchableHighlight>
                            <Divider />
                        </View>
                    </ScrollView>
                </View>
            </Animatable.View>
        </ImageBackground>
    )
}

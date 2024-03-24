import { AddIcon, Button, ButtonText, Divider, HStack, Image, ImageBackground, Spinner, Text, TextareaInput } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TouchableHighlight } from 'react-native';
import { Textarea } from '@gluestack-ui/themed';

export default function Feedback({navigation}) {

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [feedback, setFeedback] = useState('');
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
                Feedback
            </Text>

            <View alignItems='center' justifyContent='center' margin={10}>
                <Text size='2xl' color='white' marginVertical={30}>Your feedback matters!</Text>
                <Textarea
                    size="md"
                    isReadOnly={false}
                    isInvalid={false}
                    isDisabled={false}
                    $focus-borderColor='white'
                    h={'$48'}
                    >
                    <TextareaInput 
                        value={feedback}
                        onChange={(value)=>{setFeedback(value.nativeEvent.text);}}
                        
                        maxLength={300}
                        color='white'
                        placeholderTextColor={'#ffffff50'}
                        $active-borderWidth={30}
                        borderColor='white'
                        placeholder="Your text goes here..." />
                </Textarea>
                <Button
                    isDisabled={false}
                    size="lg"
                    margin={30}
                    borderRadius={40}
                    w={'$56'}
                    hardShadow='1'
                    bgColor="#bcbcbc"
                    $hover={{
                        bg: "$green600",
                        _text: {
                        color: "$white",
                        },
                    }}
                    $active={{
                        bg: "#727386",
                    }}
                    onPress={()=>{}}
                    >
                    <ButtonText fontSize="$xl" fontWeight="$medium">
                    Submit
                    </ButtonText>
                </Button>
            </View>
            
            </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

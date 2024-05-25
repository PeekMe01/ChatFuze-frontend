import { AddIcon, AlertCircleIcon, Button, ButtonText, CloseIcon, Divider, FormControlError, FormControlErrorIcon, HStack, Icon, Image, ImageBackground, Pressable, Spinner, Text, TextareaInput, Toast, ToastDescription, ToastTitle, VStack, useToast } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TouchableHighlight } from 'react-native';
import { Textarea } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Config'
import { FormControl } from '@gluestack-ui/themed';
import { FormControlErrorText } from '@gluestack-ui/themed';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function Feedback({navigation}) {

    const toast = useToast()

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [clickedButton, setClickedButton] = useState(false);

    const [feedback, setFeedback] = useState('');
    const [invalidFeedback, setInvalidFeedback] = useState(false);
    const [attemptingSendFeedback, setAttemptingSendFeedback] = useState(false);

    const [saveDisabled, setSaveDisabled] = useState(true)

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
    });

    const handleSendFeedback = async () => {
        let goodFeedback = false;
        setAttemptingSendFeedback(true);
        setSaveDisabled(true)
        if(!feedback||feedback.length<20){
            setInvalidFeedback(true);
            setSaveDisabled(true)
            goodFeedback = false;
        }else{
            goodFeedback = true
            setInvalidFeedback(false);
            setSaveDisabled(false)
        }
        setSaveDisabled(true)
        if(goodFeedback){
            const data = {
                userid: await AsyncStorage.getItem('id'),
                message: feedback
            }

            try {
                // const response = await axios.post(`${API_URL}/settings/changepassword`, data);
                const response = await api.post(`/settings/sendfeedback`, data);
                if(response){
                    setFeedback('');
                toast.show({
                    duration: 5000,
                    placement: "top",
                    render: ({ id }) => {
                        const toastId = "toast-" + id
                        return (
                        <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
                            <VStack space="xs">
                            <ToastTitle>Success</ToastTitle>
                            <ToastDescription>
                                Your voice has been heard!
                            </ToastDescription>
                            </VStack>
                            <Pressable mt="$1" onPress={() => toast.close(id)}>
                                <Icon as={CloseIcon} color="$black" />
                            </Pressable>
                        </Toast>
                        )
                    },
                    })
                    
                }
                setAttemptingSendFeedback(false);
            } catch (error) {
                // console.log(error.response.data.error)
                console.log(error)
                const errorMsg = await error.response.data.error;
                toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                    <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                        <VStack space="xs">
                        <ToastTitle>There was an error while sending your feedback.</ToastTitle>
                        <ToastDescription>
                            {errorMsg}
                        </ToastDescription>
                        </VStack>
                        <Pressable mt="$1" onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} color="$black" />
                        </Pressable>
                    </Toast>
                    )
                },
                })
                setAttemptingSendFeedback(false);
            }
        }else{
            setTimeout(() => {
                setAttemptingSendFeedback(false);
            }, 1000);
        }
    }

    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

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
        <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} marginBottom={100}>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                        <MaterialIcons name="arrow-back" size={25} color="white"/>
                    </TouchableHighlight>
                    <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                        Feedback
                    </Text>
                </View>

            <View alignItems='center' justifyContent='center' margin={10}>
                <Text size='2xl' color='white' fontFamily='Roboto_500Medium' marginVertical={30}>Your feedback matters!</Text>
                <FormControl isDisabled={attemptingSendFeedback} isInvalid={invalidFeedback} isReadOnly={false} isRequired={true} w={'$full'} >
                    <Animatable.View animation={invalidFeedback?"shake":null}>
                    <Textarea
                        borderColor={invalidFeedback?'#512095':'white'}
                        $focus-borderColor={invalidFeedback?'#512095':'white'}
                        $invalid-borderColor='#512095'
                        size="md"
                        isReadOnly={false}
                        isInvalid={false}
                        isDisabled={false}
                        h={'$48'}
                        >
                        <TextareaInput 
                            value={feedback}
                            onChange={(value)=>{
                                setFeedback(value.nativeEvent.text);
                                setInvalidFeedback(false);
                                setSaveDisabled(false)
                            }}
                            
                            maxLength={300}
                            color='white'
                            fontFamily='Roboto_400Regular'
                            placeholderTextColor={'#ffffff50'}
                            $active-borderWidth={30}
                            borderColor='white'
                            placeholder="Your text goes here..." />
                    </Textarea>
                    </Animatable.View>
                    <FormControlError mb={-24}>
                    <FormControlErrorIcon
                        as={AlertCircleIcon}
                        color='#512095'
                    />
                    <FormControlErrorText color='#512095'>
                        Your feedback is too short!
                    </FormControlErrorText>
                    </FormControlError>
                </FormControl>

                <FormControl isDisabled={attemptingSendFeedback} isInvalid={invalidFeedback} isReadOnly={false} isRequired={true} w={'$full'} >
                <Button
                    // isDisabled={attemptingSendFeedback}
                    disabled={saveDisabled}
                    opacity={saveDisabled?0.4:1}
                    size="lg"
                    margin={30}
                    borderRadius={40}
                    w={'$56'}
                    hardShadow='1'
                    bgColor="#512095"
                    $active={{
                        bg: "#51209595",
                    }}
                    onPress={()=>{handleSendFeedback()}}
                    >
                    <ButtonText fontSize="$xl" fontFamily='Roboto_400Regular'>
                    Submit
                    </ButtonText>
                </Button>
                </FormControl>
            </View>
            
            </ScrollView>
            </View>
        </Animatable.View>
        </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

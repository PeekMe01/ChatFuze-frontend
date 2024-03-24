import { AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast, Textarea, TextareaInput } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { ScrollView, TouchableHighlight } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { Input } from '@gluestack-ui/themed';
import { InputField } from '@gluestack-ui/themed';
import { AlertCircleIcon } from '@gluestack-ui/themed';
import { Toast } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import axios from 'axios';

export default function EditSocials({navigation}) {

    const toast = useToast()

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);

    const [attemptingChangeBio, setAttemptingChangeBio] = useState(false);


    const [currentBio, setCurrentBio] = useState('bhigfvlehjbhviguoecvdigdhuocvhghdfbicuosifvighbicsvbcsojfhvgdjofcbhvjghdbfjcbhvgf jhbdkjfvj ghdfbjchvgfj dfhbkjnbhvgjhfdbkjchvjdbkjcshvjdbhk');
    const [invalidCurrentBio, setInvalidCurrentBio] = useState(false);
    const [invalidCurrentBioErrorMessage, setInvalidCurrentBioErrorMessage] = useState("Error Message Current Password");

    const validate = async () => {
        let goodBio = false;
        setAttemptingChangeBio(true);
        if(currentBio.length>300||currentBio.length<10){
            setInvalidCurrentBio(true);
            setInvalidCurrentBioErrorMessage('Bio is in bad format!')
        }else{
            setInvalidCurrentBio(false);
            goodBio=true;
        }
    

        if(goodBio){
            console.log('here')
            const data = {
                userid: 1,
                oldpassword: currentBio,
                password: newPassword,
            }

            try {
                const response = await axios.post(`${API_URL}/settings/changeBio`, data);
                if(response){
                    setCurrentBio('');
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
                                You have succesfully linked your social media!
                            </ToastDescription>
                            </VStack>
                        </Toast>
                        )
                    },
                    })
                    
                }
                setAttemptingChangeBio(false);
            } catch (error) {
                // console.log(error.response.data.error)
                const errorMsg = await error.response.data.error;
                toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                    <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                        <VStack space="xs">
                        <ToastTitle>There was an error while linking your social media</ToastTitle>
                        <ToastDescription>
                            {errorMsg}
                        </ToastDescription>
                        </VStack>
                    </Toast>
                    )
                },
                })
                setAttemptingChangeBio(false);
            }
            
            
        }else{
            setTimeout(() => {
                setAttemptingChangeBio(false);
        }, 1000);
        }
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
            {/* <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}> */}
                <Text size='3xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={30}>
                    Edit Socials
                </Text>

                    <Box style={{ display: 'flex', gap: 40, justifyContent: 'center', marginVertical: 80}}>
                        <View display='flex' flexDirection='row' gap={10} justifyContent='space-around' alignItems='center'>
                            <Icon name="instagram" size={30} color="white"/>
                            <Text color='white' fontWeight='$light'>
                                @daher.ralph
                            </Text>
                            <TouchableHighlight onPress={()=>{}} style={{ borderRadius: 10}} underlayColor={'#51209550'}>
                                <View borderWidth={1} borderColor='white' padding={5} borderRadius={10}>
                                    <Text color='white' fontWeight='$light'>un-link</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        <Divider/>
                        <View display='flex' flexDirection='row' gap={10} justifyContent='space-around' alignItems='center'>
                            <Icon name="facebook" size={30} color="white"/>
                            <Text color='white' fontWeight='$light'>
                                FACEBOOK
                            </Text>
                            <TouchableHighlight onPress={()=>{}} style={{ borderRadius: 10}} underlayColor={'#51209550'}>
                                <View borderWidth={1} borderColor='white' padding={5} borderRadius={10}>
                                    <Text color='white' fontWeight='$light'>link</Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                        
                    </Box>
            {/* </ScrollView> */}
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}
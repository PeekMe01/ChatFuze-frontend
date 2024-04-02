import { AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast, Textarea, TextareaInput } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TouchableHighlight } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { Input } from '@gluestack-ui/themed';
import { InputField } from '@gluestack-ui/themed';
import { AlertCircleIcon } from '@gluestack-ui/themed';
import { Toast } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import api from '../../Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function EditBio({navigation, route}) {

    const toast = useToast()
    const { user, setUser } = route.params;

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);
    const [clickedButton, setClickedButton] = useState(false);

    const [attemptingChangeBio, setAttemptingChangeBio] = useState(false);


    const [oldBio, setOldBio] = useState(user.bio);
    const [currentBio, setCurrentBio] = useState(user.bio);
    const [invalidCurrentBio, setInvalidCurrentBio] = useState(false);
    const [invalidCurrentBioErrorMessage, setInvalidCurrentBioErrorMessage] = useState("Error Message Current Password");

    const validate = async () => {
        let goodBio = false;
        setAttemptingChangeBio(true);
        if(!currentBio||currentBio.length>300||currentBio.length<10){
            goodBio = false;
            setInvalidCurrentBio(true);
            setInvalidCurrentBioErrorMessage('Bio is in too short!')
        }else{
            if(currentBio===oldBio){
            goodBio = false;
                setInvalidCurrentBio(true);
                setInvalidCurrentBioErrorMessage('Bio is still the same!')
            }else{
                setInvalidCurrentBio(false);
                goodBio=true;
            }
        }
        

        if(goodBio){
            console.log('here')
            const data = {
                userid: await AsyncStorage.getItem('id'),
                bio: currentBio,
            }

            try {
                // const response = await axios.post(`${API_URL}/settings/updatebio`, data);
                const response = await api.post(`/settings/updatebio`, data);
                if(response){
                    setOldBio(currentBio)
                    setUser(null)
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
                                You have succesfully updated your bio!
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
                        <ToastTitle>There was an error while changing your bio</ToastTitle>
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
        <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
        
            <View margin={30} marginBottom={100}>
            {/* <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}> */}
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                        <Icon name="arrow-back" size={30} color="white"/>
                    </TouchableHighlight>
                    <Text size='3xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Edit Bio
                    </Text>
                </View>
                <View gap={20}>

                <Center>
                <Box h="$96" w="$72" style={{ display: 'flex', gap: 40, justifyContent: 'center'}}>
                        {/* Old Password */}
                        <FormControl isDisabled={attemptingChangeBio} isInvalid={invalidCurrentBio} isReadOnly={false} isRequired={true} >
                            {/* <FormControlLabel mb='$1'>
                            <FormControlLabelText>Password</FormControlLabelText>
                            </FormControlLabel> */}
                            <Animatable.View animation={invalidCurrentBio?"shake":null}>
                            <Textarea
                                size="md"
                                isReadOnly={false}
                                isInvalid={invalidCurrentBio}
                                isDisabled={false}
                                $invalid-borderColor='#512095'
                                $focus-borderColor={invalidCurrentBio?'#512095':'white'}
                                h={'$48'}
                                >
                                <TextareaInput
                                    value={currentBio}
                                    onChange={(value)=>{
                                        setCurrentBio(value.nativeEvent.text);
                                        setInvalidCurrentBio(false);
                                    }}
                                    maxLength={300}
                                    color='white'
                                    placeholderTextColor={'#ffffff50'}
                                    $active-borderWidth={30}
                                    borderColor='white'
                                    placeholder="Your bio goes here..." />
                            </Textarea>
                            </Animatable.View>
                            <FormControlError mb={-24}>
                            <FormControlErrorIcon
                                as={AlertCircleIcon}
                                color='#512095'
                            />
                            <FormControlErrorText color='#512095'>
                                {invalidCurrentBioErrorMessage}
                            </FormControlErrorText>
                            </FormControlError>
                        </FormControl>


                        {/* Save */}
                        <FormControl>
                        <Button
                            isDisabled={attemptingChangeBio}
                            size="lg"
                            mb="$4"
                            borderRadius={40}
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
                            onPress={validate}
                            >
                            <ButtonText fontSize="$xl" fontWeight="$medium">
                            Save
                            </ButtonText>
                        </Button>
                    </FormControl>
                    </Box>
                    </Center>
                </View>
            {/* </ScrollView> */}
            </View>
        </Animatable.View>
        </TouchableWithoutFeedback>
    </ImageBackground>
  )
}
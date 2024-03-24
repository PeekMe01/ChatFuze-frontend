import { AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast } from '@gluestack-ui/themed';
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
import axios from 'axios';

export default function ChangeUsername({navigation}) {

    const toast = useToast()

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);

    const [attemptingChangeUsername, setAttemptingChangeUsername] = useState(false);


    const [currentUsername, setCurrentUsername] = useState('ni993r');
    const [invalidCurrentUsername, setInvalidCurrentUsername] = useState(false);
    const [invalidCurrentUsernameErrorMessage, setInvalidCurrentUsernameErrorMessage] = useState("Error Message Current Password");

    const validate = async () => {
        let goodUsername = false;
        setAttemptingChangeUsername(true);
        if(currentUsername.length<3){
            setInvalidCurrentUsername(true);
            setInvalidCurrentUsernameErrorMessage('Username is too short!')
        }else{
            setInvalidCurrentUsername(false);
            goodUsername=true;
        }

        if(goodUsername){
            console.log('here')
            const data = {
                userid: 1,
                oldpassword: currentUsername,
                password: newPassword,
            }

            try {
                const response = await axios.post(`${API_URL}/settings/changeusername`, data);
                if(response){
                    setCurrentUsername('');
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
                                You have succesfully changed your username!
                            </ToastDescription>
                            </VStack>
                        </Toast>
                        )
                    },
                    })
                    
                }
                setAttemptingChangeUsername(false);
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
                        <ToastTitle>There was an error while changing your username</ToastTitle>
                        <ToastDescription>
                            {errorMsg}
                        </ToastDescription>
                        </VStack>
                    </Toast>
                    )
                },
                })
                setAttemptingChangeUsername(false);
            }
            
            
        }else{
            setTimeout(() => {
                setAttemptingChangeUsername(false);
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
                    Change Username
                </Text>
                <View gap={20}>

                <Center>
                <Box h="$96" w="$64" style={{ display: 'flex', gap: 40, justifyContent: 'center'}}>
                        {/* Old Password */}
                        <FormControl isDisabled={attemptingChangeUsername} isInvalid={invalidCurrentUsername} isReadOnly={false} isRequired={true} >
                            {/* <FormControlLabel mb='$1'>
                            <FormControlLabelText>Password</FormControlLabelText>
                            </FormControlLabel> */}
                            <Animatable.View animation={invalidCurrentUsername?"shake":null}>
                            <Input 
                                p={5} 
                                backgroundColor='rgba(255,255,255,0.2)'
                                borderWidth={2}
                                $focus-borderColor={invalidCurrentUsername?'#512095':'white'}
                                $invalid-borderColor='#512095'
                                >
                                <InputField
                                type={"text"}
                                placeholder="Username"
                                fontSize={'$xl'}
                                color='white'
                                placeholderTextColor={'rgba(255,255,255,0.5)'}
                                value={currentUsername}
                                onChange={(newValue)=>{
                                    setCurrentUsername(newValue.nativeEvent.text);
                                    setInvalidCurrentUsername(false);
                                }}
                                />
                            </Input>
                            </Animatable.View>
                            <FormControlError mb={-24}>
                            <FormControlErrorIcon
                                as={AlertCircleIcon}
                                color='#512095'
                            />
                            <FormControlErrorText color='#512095'>
                                {invalidCurrentUsernameErrorMessage}
                            </FormControlErrorText>
                            </FormControlError>
                        </FormControl>


                        {/* Save */}
                        <FormControl>
                        <Button
                            isDisabled={attemptingChangeUsername}
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
    </ImageBackground>
  )
}

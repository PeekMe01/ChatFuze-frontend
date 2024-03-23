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

export default function ChangePassword({navigation}) {

    const toast = useToast()

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);

    const [attemptingChangePassword, setAttemptingChangePassword] = useState(false);


    const [currentPassword, setCurrentPassword] = useState();
    const [invalidCurrentPassword, setInvalidCurrentPassword] = useState(false);
    const [invalidCurrentPasswordErrorMessage, setInvalidCurrentPasswordErrorMessage] = useState("Error Message Current Password");

    const [newPassword, setNewPassword] = useState();
    const [invalidNewPassword, setInvalidNewPassword] = useState(false);
    const [invalidNewPasswordErrorMessage, setInvalidNewPasswordErrorMessage] = useState("Error Message New Password");

    const [confirmNewPassword, setConfirmNewPassword] = useState();
    const [invalidConfirmNewPassword, setInvalidConfirmNewPassword] = useState(false);
    const [invalidConfirmNewPasswordErrorMessage, setInvalidConfirmNewPasswordErrorMessage] = useState("Error Message Confirm New Password");

    const validate = async () => {
        let goodCurrentPassword, goodNewPassword, goodConfirmNewPassword;

        setAttemptingChangePassword(true);

        if(!currentPassword||currentPassword.length<8){
            setInvalidCurrentPassword(true);
            setInvalidCurrentPasswordErrorMessage("Current password is too short!");
            goodCurrentPassword = false;
        }else {
            setInvalidCurrentPassword(false);
            goodCurrentPassword = true;
            setInvalidCurrentPasswordErrorMessage("Error Message Current Password");
        }

        if(!newPassword||newPassword.length<8){
            setInvalidNewPassword(true);
            setInvalidNewPasswordErrorMessage("New password is too short!");
            goodNewPassword = false;
        }else {
            setInvalidNewPassword(false);
            goodNewPassword = true;
            setInvalidNewPasswordErrorMessage("Error Message New Password");
        }

        if(!confirmNewPassword||confirmNewPassword.length<8){
            setInvalidConfirmNewPassword(true);
            setInvalidConfirmNewPasswordErrorMessage("Password mismatch");
            goodConfirmNewPassword = false;
        }else {
            setInvalidConfirmNewPassword(false);
            goodConfirmNewPassword = true;
            setInvalidConfirmNewPasswordErrorMessage("Error Message New Password");
        }
        //oldpassword, password
        console.log('here')
        if(goodCurrentPassword&&goodNewPassword&&goodConfirmNewPassword){
            console.log('here')
            const data = {
                userid: 1,
                oldpassword: currentPassword,
                password: newPassword,
            }

            try {
                const response = await axios.post(`${API_URL}/settings/changepassword`, data);
                if(response){
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
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
                                You have succesfully changed your password!
                            </ToastDescription>
                            </VStack>
                        </Toast>
                        )
                    },
                    })
                    
                }
                setAttemptingChangePassword(false);
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
                        <ToastTitle>There was an error while changing your password</ToastTitle>
                        <ToastDescription>
                            {errorMsg}
                        </ToastDescription>
                        </VStack>
                    </Toast>
                    )
                },
                })
                setAttemptingChangePassword(false);
            }
            
            
        }else{
            setTimeout(() => {
            setAttemptingChangePassword(false);
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
                    Change Password
                </Text>
                <View marginVertical={100} gap={20}>

                <Center>
                <Box h="$96" w="$64" mb={50} style={{ display: 'flex', gap: 40, justifyContent: 'center'}}>
                        {/* Old Password */}
                        <FormControl isDisabled={attemptingChangePassword} isInvalid={invalidCurrentPassword} isReadOnly={false} isRequired={true} >
                            {/* <FormControlLabel mb='$1'>
                            <FormControlLabelText>Password</FormControlLabelText>
                            </FormControlLabel> */}
                            <Animatable.View animation={invalidCurrentPassword?"shake":null}>
                            <Input 
                                p={5} 
                                backgroundColor='rgba(255,255,255,0.2)'
                                borderWidth={2}
                                $focus-borderColor={invalidCurrentPassword?'#512095':'white'}
                                $invalid-borderColor='#512095'
                                >
                                <InputField
                                type={"password"}
                                placeholder="Current Password"
                                fontSize={'$xl'}
                                color='white'
                                placeholderTextColor={'rgba(255,255,255,0.5)'}
                                value={currentPassword}
                                onChange={(newValue)=>{
                                    setCurrentPassword(newValue.nativeEvent.text);
                                    setInvalidCurrentPassword(false);
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
                                {invalidCurrentPasswordErrorMessage}
                            </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        {/* New Password */}
                        <FormControl isDisabled={attemptingChangePassword} isInvalid={invalidNewPassword} isReadOnly={false} isRequired={true} >
                            {/* <FormControlLabel mb='$1'>
                            <FormControlLabelText>Password</FormControlLabelText>
                            </FormControlLabel> */}
                            <Animatable.View animation={invalidNewPassword?"shake":null}>
                            <Input 
                                p={5} 
                                backgroundColor='rgba(255,255,255,0.2)'
                                borderWidth={2}
                                $focus-borderColor={invalidNewPassword?'#512095':'white'}
                                $invalid-borderColor='#512095'
                                >
                                <InputField
                                type={"password"}
                                placeholder="New Password"
                                fontSize={'$xl'}
                                color='white'
                                placeholderTextColor={'rgba(255,255,255,0.5)'}
                                value={newPassword}
                                onChange={(newValue)=>{
                                    setNewPassword(newValue.nativeEvent.text);
                                    setInvalidNewPassword(false);
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
                                {invalidNewPasswordErrorMessage}
                            </FormControlErrorText>
                            </FormControlError>
                        </FormControl>

                        {/* Confirm New Password */}
                        <FormControl isDisabled={attemptingChangePassword} isInvalid={invalidConfirmNewPassword} isReadOnly={false} isRequired={true} >
                            {/* <FormControlLabel mb='$1'>
                            <FormControlLabelText>Password</FormControlLabelText>
                            </FormControlLabel> */}
                            <Animatable.View animation={invalidConfirmNewPassword?"shake":null}>
                            <Input 
                                p={5} 
                                backgroundColor='rgba(255,255,255,0.2)'
                                borderWidth={2}
                                $focus-borderColor={invalidConfirmNewPassword?'#512095':'white'}
                                $invalid-borderColor='#512095'
                                >
                                <InputField
                                type={"password"}
                                placeholder="Confirm New Password"
                                fontSize={'$xl'}
                                color='white'
                                placeholderTextColor={'rgba(255,255,255,0.5)'}
                                value={confirmNewPassword}
                                onChange={(newValue)=>{
                                    setConfirmNewPassword(newValue.nativeEvent.text);
                                    setInvalidConfirmNewPassword(false);
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
                                {invalidConfirmNewPasswordErrorMessage}
                            </FormControlErrorText>
                            </FormControlError>
                        </FormControl>


                        {/* Save */}
                        <FormControl>
                        <Button
                            isDisabled={attemptingChangePassword}
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

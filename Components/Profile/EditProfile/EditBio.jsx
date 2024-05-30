import { Box, Input, InputField, AlertCircleIcon, Toast, View, VStack, AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast, Textarea, TextareaInput, Icon, CloseIcon } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Pressable, ScrollView, TouchableHighlight, Keyboard, TouchableWithoutFeedback } from 'react-native';
import api from '../../Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function EditBio({ navigation, route }) {

    const toast = useToast()

    const [user, setUser] = useState(null);

    async function fetchData() {
        try {
            const data = await AsyncStorage.getItem('id')
            const response = await api.get(`/settings/getinsight/${data}`);
            setUser(response.data.user);
            setOldBio(response.data.user.bio);
            setCurrentBio(response.data.user.bio);
        } catch (error) {
            console.log(error)
        }
    }
    const isFocused = useIsFocused();

    useEffect(() => {
        fetchData();
    }, [!user || isFocused]);

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);
    const [clickedButton, setClickedButton] = useState(false);

    const [attemptingChangeBio, setAttemptingChangeBio] = useState(false);


    const [oldBio, setOldBio] = useState();
    const [currentBio, setCurrentBio] = useState();
    const [invalidCurrentBio, setInvalidCurrentBio] = useState(false);
    const [invalidCurrentBioErrorMessage, setInvalidCurrentBioErrorMessage] = useState("Error Message Current Password");

    const [saveDisabled, setSaveDisabled] = useState(true)

    const validate = async () => {
        let goodBio = false;
        setAttemptingChangeBio(true);
        setSaveDisabled(true)
        if (!currentBio || currentBio.length > 300 || currentBio.length < 10) {
            goodBio = false;
            setInvalidCurrentBio(true);
            setInvalidCurrentBioErrorMessage('Bio is in too short!')
        } else {
            if (currentBio === oldBio) {
                goodBio = false;
                setInvalidCurrentBio(true);
                setInvalidCurrentBioErrorMessage('Bio is still the same!')
            } else {
                setInvalidCurrentBio(false);
                goodBio = true;
            }
        }


        if (goodBio) {
            const data = {
                userid: await AsyncStorage.getItem('id'),
                bio: currentBio,
            }

            try {
                const response = await api.post(`/settings/updatebio`, data);
                if (response) {
                    setOldBio(currentBio)
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
                                    <Pressable mt="$1" onPress={() => toast.close(id)}>
                                        <Icon as={CloseIcon} color="$black" />
                                    </Pressable>
                                </Toast>
                            )
                        },
                    })

                }
                setAttemptingChangeBio(false);
            } catch (error) {
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
                                <Pressable mt="$1" onPress={() => toast.close(id)}>
                                    <Icon as={CloseIcon} color="$black" />
                                </Pressable>
                            </Toast>
                        )
                    },
                })
                setAttemptingChangeBio(false);
                setSaveDisabled(false)
            }


        } else {
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
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'),
    });
    if (!fontsLoaded || !user) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <Center h={'$full'}>
                    <HStack space="sm" justifyContent='center' alignItems='center'>
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
                </Center>
            </ImageBackground>
        )
    }

    return (
        <ImageBackground
            source={require('../../../assets/img/HomePage1.png')}
            style={{ flex: 1, resizeMode: 'cover' }}
        >
            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>

                    <View margin={30} marginBottom={100}>
                        <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                            <TouchableHighlight onPress={() => { handleGoBackPressed() }} underlayColor={'transparent'} disabled={clickedButton}>
                                <MaterialIcons name="arrow-back" size={25} color="white" />
                            </TouchableHighlight>
                            <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                                Edit Bio
                            </Text>
                        </View>
                        <View gap={20}>

                            <Center>
                                <Box h="$96" w="$72" style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
                                    <FormControl isDisabled={attemptingChangeBio} isInvalid={invalidCurrentBio} isReadOnly={false} isRequired={true} >

                                        <Animatable.View animation={invalidCurrentBio ? "shake" : null}>
                                            <Textarea
                                                size="md"
                                                isReadOnly={false}
                                                isInvalid={invalidCurrentBio}
                                                isDisabled={false}
                                                borderColor={invalidCurrentBio ? '#512095' : 'white'}
                                                $invalid-borderColor='#512095'
                                                $focus-borderColor={invalidCurrentBio ? '#512095' : 'white'}
                                                h={'$48'}
                                            >
                                                <TextareaInput
                                                    value={currentBio}
                                                    onChange={(value) => {
                                                        setCurrentBio(value.nativeEvent.text);
                                                        setInvalidCurrentBio(false);
                                                        setSaveDisabled(false)
                                                    }}
                                                    maxLength={300}
                                                    color='white'
                                                    fontFamily='Roboto_400Regular'
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


                                    <FormControl>
                                        <Button
                                            disabled={saveDisabled}
                                            opacity={saveDisabled ? 0.4 : 1}
                                            size="lg"
                                            mb="$4"
                                            borderRadius={40}
                                            hardShadow='1'
                                            bgColor="#512095"
                                            $active={{
                                                bg: "#51209595",
                                            }}
                                            onPress={validate}
                                        >
                                            <ButtonText fontSize="$xl" fontFamily='Roboto_400Regular'>
                                                Save
                                            </ButtonText>
                                        </Button>
                                    </FormControl>
                                </Box>
                            </Center>
                        </View>
                    </View>
                </Animatable.View>
            </TouchableWithoutFeedback>
        </ImageBackground>
    )
}
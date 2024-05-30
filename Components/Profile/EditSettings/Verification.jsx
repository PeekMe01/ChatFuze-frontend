import { CloseIcon, FormControlErrorText, FormControl, Textarea, View, AddIcon, AlertCircleIcon, Button, ButtonText, Divider, FormControlError, FormControlErrorIcon, HStack, Icon, Image, ImageBackground, Pressable, Spinner, Text, TextareaInput, Toast, ToastDescription, ToastTitle, VStack, useToast } from '@gluestack-ui/themed';
import React, { useEffect, useRef, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Config';
import { Keyboard, TouchableWithoutFeedback, StyleSheet, TouchableHighlight, ScrollView } from 'react-native';
import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import axios from 'axios';
import { API_URL } from '../../Config';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

export default function Verification({ navigation }) {

    const toast = useToast()
    const storage = getStorage();

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)
    const [clickedButton, setClickedButton] = useState(false);


    const [userHasAnIdVerificationRequest, setUserHasAnIdVerificationRequest] = useState(false);
    const [userAlreadyVerified, setUserAlreadyVerified] = useState(false);

    const [image, setImage] = useState(null);
    const [invalidImage, setInvalidImage] = useState(false);
    const [openCamera, setOpenCamera] = useState(false);

    const checkIfUserHasAnIdVerificationRequest = async () => {
        const data = {
            userid: await AsyncStorage.getItem('id'),
        }
        try {
            const response = await api.post(`/Accounts/checkIdVerification`, data);
            if (response) {
                setUserAlreadyVerified(response.data.userAlreadyVerified)
                setUserHasAnIdVerificationRequest(response.data.hasIDVerificationRequest)
            }
        } catch (error) {
            console.log(error)
            toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                        <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                            <VStack space="xs">
                                <ToastTitle>Error</ToastTitle>
                                <ToastDescription>
                                    There was an error checking for your verification status
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
    }

    useEffect(() => {
        checkIfUserHasAnIdVerificationRequest();
    }, [])

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'),
    });

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
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <HStack space="sm">
                    <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                </HStack>
            </ImageBackground>
        )
    }
    const [permission, requestPermission] = useCameraPermissions();
    const [type, setType] = useState('back');
    const [flash, setFlash] = useState('off');
    const cameraRef = useRef(null);

    const snap = async () => {
        if (cameraRef) {
            let photo = await cameraRef.current.takePictureAsync({
                quality: 0.3, // Adjust this value (0.0 - 1.0) for picture quality
                skipProcessing: true,
            });
            setImage(photo);
        }
    };

    const saveImage = async () => {
        setOpenCamera(false);
    }

    const submitID = async (imageUri) => {
        var downloadUrl;
        try {
            const resp = await fetch(imageUri);
            const blob = await resp.blob();
            const data = await AsyncStorage.getItem('id')
            const storageRef = ref(storage, 'ChatFuze/Verification/' + data + Date.now() + '.jpg');
            await uploadBytes(storageRef, blob);
            downloadUrl = await getDownloadURL(storageRef);
        } catch (error) {
            console.log(error)
        }


        const userid = await AsyncStorage.getItem('id');

        const data = {
            userid: userid,
            imageURL: downloadUrl
        }

        try {
            const response = await api.post(`/Accounts/applyForIDVerification`, data);

            if (response) {
                setClickedButton(false);
                setUserHasAnIdVerificationRequest(true);
                setImage(null);
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
                                        Your ID has been submit for review.
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
        } catch (error) {
            console.log(error)
            setClickedButton(false)
            toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                        <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                            <VStack space="xs">
                                <ToastTitle>Error</ToastTitle>
                                <ToastDescription>
                                    There was an error uploading your ID.
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
    }

    if (openCamera) {
        return (
            <View style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {!image && <CameraView
                    style={styles.container}
                    type={type}
                    flashMode={flash}
                    ref={cameraRef}
                    ratio='16:9'
                />}
                {!image && <MaterialIcons name='center-focus-weak' size={350} color="#ffffff50" style={{ position: 'absolute' }} />}
                {image && <Image source={{ uri: image.uri }} alt='photo_id' style={styles.container} />}
                <View style={{ backgroundColor: 'black', position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', padding: 10, flexDirection: 'row' }}>
                    {!image &&
                        <TouchableHighlight onPress={() => { snap() }} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
                            <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
                                <MaterialIcons name="camera-alt" size={50} color="white" style={{ padding: 10 }} />
                            </View>
                        </TouchableHighlight>}
                    {image &&
                        <>
                            <TouchableHighlight onPress={() => { setImage(null) }} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
                                <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
                                    <MaterialIcons name="refresh" size={50} color="white" style={{ padding: 10 }} />
                                </View>
                            </TouchableHighlight>
                            <TouchableHighlight onPress={() => { saveImage() }} underlayColor={'#51209550'} style={{ borderRadius: 100 }}>
                                <View justifyContent='center' alignItems='center' backgroundColor='#51209560' style={{ borderRadius: 100 }}>
                                    <MaterialIcons name="navigate-next" size={50} color="white" style={{ padding: 10 }} />
                                </View>
                            </TouchableHighlight>
                        </>
                    }
                </View>
            </View>
        )
    } else {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                    <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                        <View margin={30} marginBottom={100}>
                            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false}>
                                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                                    <TouchableHighlight onPress={() => { handleGoBackPressed() }} underlayColor={'transparent'} disabled={clickedButton}>
                                        <MaterialIcons name="arrow-back" size={25} color="white" />
                                    </TouchableHighlight>
                                    <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                                        Verification
                                    </Text>
                                </View>

                                <View alignItems='center' justifyContent='center' margin={10} marginTop={'20%'}>
                                    {userHasAnIdVerificationRequest &&
                                        <Text size='xl' color='white' fontFamily='Roboto_400Regular'>
                                            You're ID verification request is being proccessed...
                                        </Text>
                                    }
                                    {userAlreadyVerified &&
                                        <Text size='xl' color='white' fontFamily='Roboto_400Regular'>
                                            You are already verified!
                                        </Text>
                                    }
                                    {!userHasAnIdVerificationRequest && !userAlreadyVerified && !image &&
                                        <View gap={20}>
                                            <Text size='xl' color='white' fontFamily='Roboto_400Regular'>
                                                Please upload your ID photo and submit it
                                            </Text>
                                            <Button
                                                isDisabled={false}
                                                size="lg"
                                                mb="$4"
                                                // borderRadius={40}
                                                hardShadow='1'
                                                bgColor="#512095"
                                                $active={{
                                                    bg: "#51209595",
                                                }}
                                                onPress={() => { setOpenCamera(true); setImage(null); setInvalidImage(false); if (permission && !permission.granted) { requestPermission() } }}
                                            >
                                                <ButtonText fontSize="$xl" fontFamily='Roboto_400Regular'>
                                                    Upload ID
                                                </ButtonText>
                                            </Button>
                                        </View>
                                    }
                                    {image &&
                                        <FormControl gap={20}>
                                            <View width={'$72'} height={'$48'}>
                                                <Image
                                                    borderWidth={3}
                                                    borderColor='#fff'
                                                    borderRadius={30}
                                                    flex={1}
                                                    w={'$full'}
                                                    // size='2xl'
                                                    // rotation={90}
                                                    source={image}
                                                    alt='photo_id'
                                                // aspectRatio={16/9}
                                                />
                                            </View>
                                            <Button
                                                isDisabled={clickedButton}
                                                size="lg"
                                                mb="$4"
                                                // borderRadius={40}
                                                hardShadow='1'
                                                bgColor="#512095"
                                                $active={{
                                                    bg: "#51209595",
                                                }}
                                                onPress={() => { setClickedButton(true); submitID(image.uri) }}
                                            >
                                                <ButtonText fontSize="$xl" fontWeight="$medium">
                                                    Submit
                                                </ButtonText>
                                            </Button>
                                        </FormControl>
                                    }

                                </View>

                            </ScrollView>
                        </View>
                    </Animatable.View>
                </TouchableWithoutFeedback>
            </ImageBackground>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        height: 2408 / 3,
        width: 1080 / 2.4,
        // width: '100%',
        // marginBottom: 15,
        height: '100%',
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
    }
})

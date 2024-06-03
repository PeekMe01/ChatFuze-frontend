import {Box,Input, InputField,View,AlertCircleIcon,Toast,VStack,Icon,AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast, Pressable, CloseIcon } from '@gluestack-ui/themed';
import React, { useEffect, useLayoutEffect ,useState} from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TouchableHighlight, TouchableWithoutFeedback ,Keyboard} from 'react-native';
import api from '../../Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { AntDesign, Ionicons } from "@expo/vector-icons";
export default function ChangeUsername({navigation, route}) {
    
    const toast = useToast()

    const [user, setUser] = useState(null);

    async function fetchData(){
        try {
             const data = await AsyncStorage.getItem('id')
             const response = await api.get(`/settings/getinsight/${data}`);
             setUser(response.data.user);
             setOldUsername(response.data.user.username);
             setCurrentUsername(response.data.user.username);
         } catch (error) {
             console.log(error)
         }
     }
    const isFocused = useIsFocused();

    useEffect(() => {
        fetchData();
    }, [!user||isFocused]);

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);
    const [clickedButton, setClickedButton] = useState(false);

    const [attemptingChangeUsername, setAttemptingChangeUsername] = useState(false);

    
    const [oldUsername, setOldUsername] = useState()
    const [currentUsername, setCurrentUsername] = useState();
    const [invalidCurrentUsername, setInvalidCurrentUsername] = useState(false);
    const [invalidCurrentUsernameErrorMessage, setInvalidCurrentUsernameErrorMessage] = useState("Error Message Current Password");

    const [saveDisabled, setSaveDisabled] = useState(true)

    const validate = async () => {
        let goodUsername = false;
        setAttemptingChangeUsername(true);
        setSaveDisabled(true)
        if(currentUsername===oldUsername){
            goodUsername = false;
            setInvalidCurrentUsername(true);
            setInvalidCurrentUsernameErrorMessage('Username is still the same!')
            setSaveDisabled(true)
        }else{
            setInvalidCurrentUsername(false);
            setSaveDisabled(false)
            goodUsername=true;
            if(currentUsername.length<3){
                goodUsername = false;
                setInvalidCurrentUsername(true);
                setInvalidCurrentUsernameErrorMessage('Username is too short!')
                setSaveDisabled(true)
            } else if(currentUsername.length>16){
                goodUsername = false;
                setInvalidCurrentUsername(true);
                setInvalidCurrentUsernameErrorMessage('Username is too long!')
                setSaveDisabled(true)
            }
            else{
                setInvalidCurrentUsername(false);
                setSaveDisabled(false)
                goodUsername=true;
            }
        }

        if(goodUsername){
            setSaveDisabled(true)
            const data = {
                userid: await AsyncStorage.getItem('id'),
                username: currentUsername
            }

            try {
                const response = await api.post(`/settings/updateusername`, data);
                if(response){
                    setOldUsername(currentUsername);
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
                                <Pressable mt="$1" onPress={() => toast.close(id)}>
                                    <Icon as={CloseIcon} color="$black" />
                                </Pressable>
                            </Toast>
                            )
                        },
                    })
                    
                }
                setAttemptingChangeUsername(false);
            } catch (error) {
                const errorMsg = await error.response.data.error;
                console.log(error)
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
                        <Pressable mt="$1" onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} color="$black" />
                        </Pressable>
                    </Toast>
                    )
                },
                })
                setAttemptingChangeUsername(false);
                setSaveDisabled(false)
            }
            
            
        }else{
            setTimeout(() => {
                setAttemptingChangeUsername(false);
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
    if (!fontsLoaded|!user) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
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
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        <TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} marginBottom={100}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                    <AntDesign name="arrowleft" size={25}  color="white"  />
                    </TouchableHighlight>
                    <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                        Change Username
                    </Text>
                </View>
                <View gap={20}>

                <Center>
                <Box h="$96" w="$64" style={{ display: 'flex', gap: 40, justifyContent: 'center'}}>
                        <FormControl isDisabled={attemptingChangeUsername} isInvalid={invalidCurrentUsername} isReadOnly={false} isRequired={true} >
                            <Animatable.View animation={invalidCurrentUsername?"shake":null}>
                            <Input 
                                p={5} 
                                backgroundColor='rgba(255,255,255,0.2)'
                                borderWidth={2}
                                borderColor={invalidCurrentUsername?'#512095':'white'}
                                $focus-borderColor={invalidCurrentUsername?'#512095':'white'}
                                $invalid-borderColor='#512095'
                                >
                                <InputField
                                type={"text"}
                                placeholder="Username"
                                fontSize={'$xl'}
                                color='white'
                                fontFamily='Roboto_400Regular'
                                placeholderTextColor={'rgba(255,255,255,0.5)'}
                                value={currentUsername}
                                onChange={(newValue)=>{
                                    setCurrentUsername(newValue.nativeEvent.text);
                                    setInvalidCurrentUsername(false);
                                    setSaveDisabled(false)
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

                        <FormControl>
                        <Button
                            disabled={saveDisabled}
                            opacity={saveDisabled?0.4:1}
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

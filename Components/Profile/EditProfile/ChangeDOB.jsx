import { AlertCircleIcon, Box, Button, FormControl, FormControlError, FormControlErrorText, ImageBackground, Spinner, Toast, ToastDescription, ToastTitle } from '@gluestack-ui/themed';
import { Center } from '@gluestack-ui/themed';
import { Text } from '@gluestack-ui/themed';
import { HStack } from '@gluestack-ui/themed';
import { useToast } from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Config';
import { View } from '@gluestack-ui/themed';
import * as Animatable from 'react-native-animatable';
import { TouchableHighlight, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { ButtonText } from '@gluestack-ui/themed';
import { FormControlErrorIcon } from '@gluestack-ui/themed';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Platform, Pressable, StyleSheet } from 'react-native';
import { VStack } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { CloseIcon } from '@gluestack-ui/themed';

const ChangeDOB = ({navigation}) => {

    const toast = useToast()

    const [user, setUser] = useState(null);

    const [changingPage, setChangingPage] = useState(false);
    const [clickedButton, setClickedButton] = useState(false);

    const [invalidAge, setInvalidAge] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(new dayjs());
    const [show, setShow] = useState(false)
    const [saveDisabled, setSaveDisabled] = useState(true)

    const [userAlreadyVerified, setUserAlreadyVerified] = useState(false);

    const checkIfUserHasAnIdVerificationRequest = async () =>{
        const data = {
            userid: await AsyncStorage.getItem('id'),
        }
        try {
            const response = await api.post(`/Accounts/checkIdVerification`, data);
            if(response){
                setUserAlreadyVerified(response.data.userAlreadyVerified)
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

    useEffect(() =>{
        checkIfUserHasAnIdVerificationRequest();
    }, [])

    async function fetchData(){
        try {
             const data = await AsyncStorage.getItem('id')
             const response = await api.get(`/settings/getinsight/${data}`);
             setUser(response.data.user);
             setDateOfBirth(response.data.user.dateOfBirth)
             console.log(response.data.user)
         } catch (error) {
             console.log(error)
         }
     }
    const isFocused = useIsFocused();

    useEffect(() => {
        fetchData();
    }, [!user||isFocused]);

    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const showMode = (currentMode) => {
        setShow(!show);
      }

    const onChange = (date) => {
        // Ensure the provided date is a valid dayjs object
        let currentDate = dayjs(date).hour(12); // Setting the time to noon to avoid timezone issues
        
        // If date is still invalid, use the current date
        if (!currentDate.isValid()) {
          currentDate = dayjs();
        }
        
        // Calculate the date 18 years ago from today
        const minimumAgeDate = dayjs().subtract(18, 'year');
        
        // Check if the selected date makes the user at least 18 years old
        if (currentDate.isBefore(minimumAgeDate)) {
          setInvalidAge(false);
          setDateOfBirth(currentDate.toDate());
          console.log(currentDate.toDate()); // This will log the current selected date
          
          // Format the date for logging
          let fDate = currentDate.format('D/M/YYYY');
          console.log(fDate);
          setSaveDisabled(false)
        } else {
          setInvalidAge(true);
          console.log("I'm too young");
        }
        
        // Show the date picker if the platform is iOS
        setShow(Platform.OS === 'ios');
      };

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
    });
    if (!fontsLoaded||!user) {
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

    const submitUpdateDateOfBirth = async () => {
        if(saveDisabled){
            return
        }
        try {
            const data = {
                userid: user.idusers,
                dob: dateOfBirth
            }

            const response = await api.post(`/settings/updateDateOfBirth`, data);

            if(response){
                setSaveDisabled(true);
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
                                You have succesfully changed your date of birth!
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
            toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                    <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
                        <VStack space="xs">
                        <ToastTitle>Error</ToastTitle>
                        <ToastDescription>
                            There was an error while changing your date of birth.
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

    if(!userAlreadyVerified){
        return (
            <ImageBackground
              source={require('../../../assets/img/HomePage1.png')}
              style={{ flex: 1, resizeMode: 'cover' }}
            >
              {/* <TouchableWithoutFeedback onPress={() => { setShow(false) }}> */}
                <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500} pointerEvents="box-none">
                  <View margin={30} marginBottom={100}>
                    <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                      <TouchableHighlight onPress={() => { handleGoBackPressed() }} underlayColor={'transparent'} disabled={clickedButton}>
                        <MaterialIcons name="arrow-back" size={25} color="white" />
                      </TouchableHighlight>
                      <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                        Change Date of Birth
                      </Text>
                    </View>
          
                    <Box paddingVertical={50} gap={30}>
                      <FormControl isDisabled={false} isInvalid={invalidAge} isReadOnly={false} isRequired={true}>
                      <View>
                        <Animatable.View animation={invalidAge ? "shake" : null}>
                        <Button
                            onPress={(event) => {
                                event.stopPropagation(); // Prevent touch event propagation
                                showMode('date');
                            }}
                            size="lg"
                            borderRadius={40}
                            hardShadow='1'
                            bgColor="#512095"
                            $active={{
                                bg: "#51209595",
                            }}
                        >
                            <ButtonText fontSize="$xl" fontWeight="$medium">
                                Enter Birthday
                            </ButtonText>
                        </Button>
                        </Animatable.View>
                        <FormControlError mb={'-$6'}>
                          <FormControlErrorIcon
                            as={AlertCircleIcon}
                            color="#512095"
                          />
                          <FormControlErrorText color="#512095">
                            You must be over 18
                          </FormControlErrorText>
                        </FormControlError>
                        </View>
                        </FormControl>
    
                        <FormControl>
                            <Button
                                disabled={saveDisabled}
                                onPress={(event) => {
                                    submitUpdateDateOfBirth()
                                }}
                                size="lg"
                                opacity={saveDisabled?0.4:1}
                                borderRadius={40}
                                hardShadow='1'
                                bgColor="#512095"
                                $active={{
                                    bg: "#51209595",
                                }}
                            >
                                <ButtonText fontSize="$xl" fontWeight="$medium">
                                    Save
                                </ButtonText>
                            </Button>
                        </FormControl>
    
                        {show && (
                          <View marginTop={50} backgroundColor='white' padding={10} borderRadius={20} borderColor='#512095' borderWidth={1}>
                            <DateTimePicker
                              mode="single"
                              date={dateOfBirth}
                              onChange={({ date }) => { onChange(date) }}
                              dayContainerStyle={{
                                borderWidth: 1,
                                borderColor: '#cccccc50'
                              }}
                              selectedItemColor='#512095'
                            />
                          </View>
                        )}
                    </Box>
                  </View>
                </Animatable.View>
              {/* </TouchableWithoutFeedback> */}
            </ImageBackground>
          );
    }else{
        return(
            <ImageBackground
              source={require('../../../assets/img/HomePage1.png')}
              style={{ flex: 1, resizeMode: 'cover' }}
            >
                <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500} pointerEvents="box-none">
                  <View margin={30} marginBottom={100}>
                    <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                      <TouchableHighlight onPress={() => { handleGoBackPressed() }} underlayColor={'transparent'} disabled={clickedButton}>
                        <MaterialIcons name="arrow-back" size={25} color="white" />
                      </TouchableHighlight>
                      <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                        Change Date of Birth
                      </Text>
                    </View>
          
                    <View alignItems='center' justifyContent='center' margin={10} marginTop={'20%'}>
                        <Text size='xl' color='white' fontFamily='Roboto_400Regular'>
                            You are already verified!
                        </Text>
                        <Text size='xl' color='white' textAlign='center' fontFamily='Roboto_400Regular'>
                            You can no longer change your date of birth.
                        </Text>
                    </View>
                  </View>
                </Animatable.View>
              {/* </TouchableWithoutFeedback> */}
            </ImageBackground>
        )
    }
}

export default ChangeDOB
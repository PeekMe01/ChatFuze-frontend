import { AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast, SelectTrigger, SelectPortal, SelectBackdrop, SelectDragIndicator, SelectItem, ChevronDownIcon } from '@gluestack-ui/themed';
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
import { Select } from '@gluestack-ui/themed';
import { SelectInput } from '@gluestack-ui/themed';
import { SelectIcon } from '@gluestack-ui/themed';
import { SelectContent } from '@gluestack-ui/themed';
import { SelectDragIndicatorWrapper } from '@gluestack-ui/themed';

export default function ChangeCountry({navigation}) {

    const toast = useToast()

    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);

    const [attemptingChangeCountry, setAttemptingChangeCountry] = useState(false);


    const [currentCountry, setCurrentCountry] = useState("Lebanon");
    const [invalidCurrentCountry, setInvalidCurrentCountry] = useState(false);
    const [invalidCurrentCountryErrorMessage, setInvalidCurrentCountryErrorMessage] = useState("Error Message Current Password");

    const validate = async () => {
        let goodCountry = false;
        setAttemptingChangeCountry(true);
        if(!currentCountry){
            setInvalidCurrentCountry(true);
            setInvalidCurrentCountryErrorMessage('Please select a country')
        }else{
            setInvalidCurrentCountry(false);
            goodCountry=true;
        }

        if(goodCountry){
            console.log('here')
            const data = {
                userid: 1,
                oldpassword: currentCountry,
                // password: newPassword,
            }

            try {
                const response = await axios.post(`${API_URL}/settings/changeCountry`, data);
                if(response){
                    // setCurrentCountry('');
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
                                You have succesfully changed your country!
                            </ToastDescription>
                            </VStack>
                        </Toast>
                        )
                    },
                    })
                    
                }
                setAttemptingChangeCountry(false);
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
                        <ToastTitle>There was an error while changing your country</ToastTitle>
                        <ToastDescription>
                            {errorMsg}
                        </ToastDescription>
                        </VStack>
                    </Toast>
                    )
                },
                })
                setAttemptingChangeCountry(false);
            }
            
            
        }else{
            setTimeout(() => {
                setAttemptingChangeCountry(false);
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
                    Change Country
                </Text>
                <View gap={20}>

                <Center>
                <Box h="$96" w="$64" style={{ display: 'flex', gap: 40, justifyContent: 'center'}}>
                        {/* Old Country */}
                        <FormControl isInvalid={invalidCurrentCountry} isReadOnly={false} isRequired={true}>
                            {/* <FormControlLabel mb='$1'>
                            <FormControlLabelText>Email</FormControlLabelText>
                            </FormControlLabel> */}
                            <Animatable.View animation={invalidCurrentCountry?"shake":null}>
                            {/* <Input 
                                p={5}
                                borderWidth={2}
                                backgroundColor='rgba(255,255,255,0.2)'
                                $focus-borderColor='white'
                                >
                                <InputField
                                type="text"
                                placeholder="country"
                                fontSize={'$xl'}
                                color='white'
                                placeholderTextColor={'rgba(255,255,255,0.5)'}
                                value={country}
                                onChange={(newValue)=>{
                                    setCountry(newValue.nativeEvent.text);
                                }}
                                />
                            </Input> */}
                            
                            <Select style={{ borderWidth: 2, borderColor: invalidCurrentCountry?'rgba(255,0,0,0.8)':'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.2)',borderRadius: 5}}
                            selectedValue={currentCountry}
                            isDisabled={attemptingChangeCountry}
                            
                            $disabled-borderColor='blue'
                            onValueChange={(value)=>{setCurrentCountry(value); setInvalidCurrentCountry(false)}}
                            >
                            <SelectTrigger size="md" borderColor='rgba(255,255,255,0)'>
                                <SelectInput placeholderTextColor={'rgba(255,255,255,0.5)'} placeholder="Select Country" style={{ color: 'white' }}/>
                                <SelectIcon mr="$3">
                                    <Icon as={ChevronDownIcon} style={{color: 'white'}}/>
                                </SelectIcon>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop/>
                                <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>

                                {/* Here you put all the countries */}
                                <SelectItem label="Lebanon" value="Lebanon" />
                                <SelectItem label="Syria" value="Syria" />
                                <SelectItem label="United States" value="United States" />
                                <SelectItem label="Canada" value="Canada" />
                                <SelectItem label="Japan" value="Japan" />
                                <SelectItem label="France" value="France" />
                                <SelectItem label="Russia" value="Russia" />
                                


                                </SelectContent>
                            </SelectPortal>
                            </Select>

                            </Animatable.View>
                            <FormControlError mb={-24}>
                            <FormControlErrorIcon
                                as={AlertCircleIcon}
                            />
                            <FormControlErrorText>
                                Invalid Country
                            </FormControlErrorText>
                            </FormControlError>
                        </FormControl>


                        {/* Save */}
                        <FormControl>
                        <Button
                            isDisabled={attemptingChangeCountry}
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

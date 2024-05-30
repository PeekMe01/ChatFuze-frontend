import { Box, Input, InputField, AlertCircleIcon, Toast, VStack, Select, SelectInput, SelectIcon, SelectDragIndicatorWrapper, SelectContent, Icon, View, CloseIcon, AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast, SelectTrigger, SelectPortal, SelectBackdrop, SelectDragIndicator, SelectItem, ChevronDownIcon, Pressable } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, TouchableHighlight, Keyboard, TouchableWithoutFeedback } from 'react-native';
import api from '../../Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import emojiFlags from 'emoji-flags';

export default function ChangeCountry({ navigation, route }) {

    const [countriesWithEmojis, setCountriesWithEmojis] = useState([]);

    const [saveDisabled, setSaveDisabled] = useState(true)
    const [userAlreadyVerified, setUserAlreadyVerified] = useState(false);
    const [user, setUser] = useState(null);
    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false);
    const [clickedButton, setClickedButton] = useState(false);

    const [attemptingChangeCountry, setAttemptingChangeCountry] = useState(false);


    const [oldCountry, setOldCountry] = useState();
    const [currentCountry, setCurrentCountry] = useState();
    const [invalidCurrentCountry, setInvalidCurrentCountry] = useState(false);
    const [invalidCurrentCountryErrorMessage, setInvalidCurrentCountryErrorMessage] = useState("Error Message Current Password");

    useEffect(() => {
        // Get all country codes
        const countryCodes = Object.keys(emojiFlags.data);

        // Map country codes to country names and emojis
        const countries = countryCodes.map(countryCode => {
            const countryData = emojiFlags.data[countryCode];
            return {
                country: countryData.name,
                emoji: countryData.emoji
            };
        });

        const sortedCountries = countries.sort((a, b) => a.country.localeCompare(b.country));

        setCountriesWithEmojis(sortedCountries);
    }, []);

    const dropdownData = useMemo(() => {
        return countriesWithEmojis.map(({ country, emoji }) => ({ country, emoji }));
    }, [countriesWithEmojis]);


    const toast = useToast()

    async function fetchData() {
        try {
            const data = await AsyncStorage.getItem('id')
            const response = await api.get(`/settings/getinsight/${data}`);
            // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
            setUser(response.data.user);
            setOldCountry(response.data.user.country);
            setCurrentCountry(response.data.user.country);
        } catch (error) {
            console.log(error)
        }
    }
    const isFocused = useIsFocused();

    useEffect(() => {
        fetchData();
    }, [!user || isFocused]);


    const checkIfUserHasAnIdVerificationRequest = async () => {
        const data = {
            userid: await AsyncStorage.getItem('id'),
        }
        try {
            const response = await api.post(`/Accounts/checkIdVerification`, data);
            if (response) {
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

    useEffect(() => {
        checkIfUserHasAnIdVerificationRequest();
    }, [])

    const validate = async () => {
        let goodCountry = false;
        setAttemptingChangeCountry(true);
        setSaveDisabled(true)
        if (!currentCountry) {
            goodCountry = false;
            setInvalidCurrentCountry(true);
            setInvalidCurrentCountryErrorMessage('Please select a country')
            setSaveDisabled(true)
        } else {
            setInvalidCurrentCountry(false);
            setSaveDisabled(false)
            goodCountry = true;
        }

        if (currentCountry === oldCountry) {
            goodCountry = false;
            setInvalidCurrentCountry(true);
            setSaveDisabled(true)
            setInvalidCurrentCountryErrorMessage('Country did not change!')
        } else {
            setInvalidCurrentCountry(false);
            setSaveDisabled(false)
            goodCountry = true;
        }

        if (goodCountry) {
            setSaveDisabled(true)
            const data = {
                userid: await AsyncStorage.getItem('id'),
                country: currentCountry,
            }

            try {
                const response = await api.post(`/settings/updatecountry`, data);
                if (response) {
                    // setCurrentCountry('');
                    setOldCountry(currentCountry)
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
                                    <Pressable mt="$1" onPress={() => toast.close(id)}>
                                        <Icon as={CloseIcon} color="$black" />
                                    </Pressable>
                                </Toast>
                            )
                        },
                    })

                }
                setAttemptingChangeCountry(false);
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
                                    <ToastTitle>There was an error while changing your country</ToastTitle>
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
                setAttemptingChangeCountry(false);
                setSaveDisabled(false)
            }


        } else {
            setTimeout(() => {
                setAttemptingChangeCountry(false);
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

    const styles = StyleSheet.create({
        dropdownButtonStyle: {
            width: '100%',
            height: 50,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 5,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 12,
            borderWidth: 2,
            borderColor: invalidCurrentCountry ? '#512095' : 'white'
        },
        dropdownButtonTxtStyle: {
            flex: 1,
            fontSize: 18,
            color: 'white',
        },
        dropdownButtonArrowStyle: {
            fontSize: 28,
        },
        dropdownButtonIconStyle: {
            fontSize: 28,
            marginRight: 8,
        },
        dropdownMenuStyle: {
            backgroundColor: '#E9ECEF',
            borderRadius: 8,
        },
        dropdownItemStyle: {
            width: '100%',
            flexDirection: 'row',
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 8,
            gap: 10,
        },
        dropdownItemTxtStyle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '500',
            color: '#151E26',
        },
        dropdownItemIconStyle: {
            fontSize: 28,
            marginRight: 8,
        },
    });

    if (!userAlreadyVerified) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                    <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                        <View margin={30} marginBottom={100}>
                            {/* <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}> */}
                            <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                                <TouchableHighlight onPress={() => { handleGoBackPressed() }} underlayColor={'transparent'} disabled={clickedButton}>
                                    <MaterialIcons name="arrow-back" size={25} color="white" />
                                </TouchableHighlight>
                                <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                                    Change Country
                                </Text>
                            </View>
                            <View gap={20}>

                                <Center>
                                    <Box h="$96" w="$64" style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
                                        <FormControl isInvalid={invalidCurrentCountry} isReadOnly={false} isRequired={true}>
                                            <Animatable.View animation={invalidCurrentCountry ? "shake" : null}>
                                                <SelectDropdown
                                                    disabled={attemptingChangeCountry}
                                                    data={dropdownData}
                                                    onSelect={(selectedItem, index) => {
                                                        setCurrentCountry(selectedItem.country);
                                                        setInvalidCurrentCountry(false);
                                                        setSaveDisabled(false)
                                                    }}
                                                    disableAutoScroll
                                                    defaultValue={currentCountry ? dropdownData.find(item => item.country === currentCountry) : null}
                                                    renderButton={(selectedItem, isOpened) => {
                                                        return (
                                                            <View style={styles.dropdownButtonStyle}>
                                                                {selectedItem && (
                                                                    <Text style={{ paddingRight: 10 }}>{selectedItem.emoji}</Text>
                                                                )}
                                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                                    {(selectedItem && selectedItem.country) || 'Select your country'}
                                                                </Text>
                                                                <MaterialCommunityIcons color={'white'} name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                                            </View>
                                                        );
                                                    }}
                                                    renderItem={(item, index, isSelected) => {
                                                        return (
                                                            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                                <Text>{item.emoji}</Text>
                                                                <Text style={styles.dropdownItemTxtStyle}>{item.country}</Text>
                                                            </View>
                                                        );
                                                    }}
                                                    showsVerticalScrollIndicator={false}
                                                    dropdownStyle={styles.dropdownMenuStyle}
                                                />
                                            </Animatable.View>

                                            <FormControlError mb={-24}>
                                                <FormControlErrorIcon
                                                    color='#512095'
                                                    as={AlertCircleIcon}
                                                />
                                                <FormControlErrorText color='#512095'>
                                                    {invalidCurrentCountryErrorMessage}
                                                </FormControlErrorText>
                                            </FormControlError>

                                        </FormControl>


                                        {/* Save */}
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
                                                <ButtonText fontSize="$xl" fontFamily='Roboto_500Medium'>
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
    } else {
        return (
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
                                Change Country
                            </Text>
                        </View>

                        <View alignItems='center' justifyContent='center' margin={10} marginTop={'20%'}>
                            <Text size='xl' color='white' fontFamily='Roboto_400Regular'>
                                You are already verified!
                            </Text>
                            <Text size='xl' color='white' textAlign='center' fontFamily='Roboto_400Regular'>
                                You can no longer change your country.
                            </Text>
                        </View>
                    </View>
                </Animatable.View>
                {/* </TouchableWithoutFeedback> */}
            </ImageBackground>
        )
    }
}

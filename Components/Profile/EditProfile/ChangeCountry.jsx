import { AddIcon, Divider, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, HStack, Image, ImageBackground, Spinner, Text, Center, ButtonText, Button, ToastTitle, ToastDescription, useToast, SelectTrigger, SelectPortal, SelectBackdrop, SelectDragIndicator, SelectItem, ChevronDownIcon, Pressable } from '@gluestack-ui/themed';
import { View } from '@gluestack-ui/themed';
import React, { useEffect, useMemo } from 'react'
import { useState } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, StyleSheet, TouchableHighlight } from 'react-native';
import { Box } from '@gluestack-ui/themed';
import { Input } from '@gluestack-ui/themed';
import { InputField } from '@gluestack-ui/themed';
import { AlertCircleIcon } from '@gluestack-ui/themed';
import { Toast } from '@gluestack-ui/themed';
import { VStack } from '@gluestack-ui/themed';
import { Select } from '@gluestack-ui/themed';
import { SelectInput } from '@gluestack-ui/themed';
import { SelectIcon } from '@gluestack-ui/themed';
import { SelectContent } from '@gluestack-ui/themed';
import { SelectDragIndicatorWrapper } from '@gluestack-ui/themed';
import api from '../../Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Icon } from '@gluestack-ui/themed';
import { CloseIcon } from '@gluestack-ui/themed';
import { useIsFocused } from '@react-navigation/native';
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import emojiFlags from 'emoji-flags';

export default function ChangeCountry({navigation, route}) {

    const [countriesWithEmojis, setCountriesWithEmojis] = useState([]);

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

    //   console.log(countriesWithEmojis)

    const toast = useToast()

    const [user, setUser] = useState(null);

    async function fetchData(){
        try {
             const data = await AsyncStorage.getItem('id')
             const response = await api.get(`/settings/getinsight/${data}`);
             // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
             setUser(response.data.user);
             setOldCountry(response.data.user.country);
             setCurrentCountry(response.data.user.country);
             console.log(response.data.user)
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

    const [attemptingChangeCountry, setAttemptingChangeCountry] = useState(false);


    const [oldCountry, setOldCountry] = useState();
    const [currentCountry, setCurrentCountry] = useState();
    const [invalidCurrentCountry, setInvalidCurrentCountry] = useState(false);
    const [invalidCurrentCountryErrorMessage, setInvalidCurrentCountryErrorMessage] = useState("Error Message Current Password");

    const validate = async () => {
        let goodCountry = false;
        setAttemptingChangeCountry(true);
        if(!currentCountry){
            goodCountry = false;
            setInvalidCurrentCountry(true);
            setInvalidCurrentCountryErrorMessage('Please select a country')
        }else{
            setInvalidCurrentCountry(false);
            goodCountry=true;
        }

        if(currentCountry===oldCountry){
            goodCountry = false;
            setInvalidCurrentCountry(true);
            setInvalidCurrentCountryErrorMessage('Country did not change!')
        }else{
            setInvalidCurrentCountry(false);
            goodCountry=true;
        }

        if(goodCountry){
            console.log('here')
            console.log(currentCountry)
            const data = {
                userid: await AsyncStorage.getItem('id'),
                country: currentCountry,
                // password: newPassword,
            }

            try {
                // const response = await axios.post(`${API_URL}/settings/changeCountry`, data);
                const response = await api.post(`/settings/updatecountry`, data);
                if(response){
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
                        <Pressable mt="$1" onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} color="$black" />
                        </Pressable>
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
    if (!fontsLoaded||!user) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <Center h={'$full'}>
                    <HStack space="sm">
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
          borderColor:invalidCurrentCountry?'#512095':'white'
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
                        <MaterialIcons name="arrow-back" size={30} color="white"/>
                    </TouchableHighlight>
                    <Text size='3xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Change Country
                    </Text>
                </View>
                <View gap={20}>

                <Center>
                <Box h="$96" w="$64" style={{ display: 'flex', gap: 40, justifyContent: 'center'}}>

                        {/* <FormControl isInvalid={invalidCurrentCountry} isReadOnly={false} isRequired={true}>
                            <Animatable.View animation={invalidCurrentCountry?"shake":null}>
                            
                            <Select
                            selectedValue={currentCountry}
                            borderRadius={5}
                            bgColor='rgba(255,255,255,0.2)'
                            borderWidth={2}
                            borderColor={invalidCurrentCountry?'#512095':'white'}
                            isInvalid={invalidCurrentCountry}
                            isDisabled={attemptingChangeCountry}
                            onValueChange={(value)=>{setCurrentCountry(value); setInvalidCurrentCountry(false)}}
                            >
                            <SelectTrigger size="md" borderColor='rgba(255,255,255,0)'>
                                <SelectInput placeholderTextColor={'rgba(255,255,255,0.5)'} placeholder="Select Country" style={{ color: 'white' }}/>
                                <SelectIcon mr="$3">
                                    <MaterialIcons as={ChevronDownIcon} style={{color: 'white'}}/>
                                </SelectIcon>
                            </SelectTrigger>
                            <SelectPortal>
                                <SelectBackdrop/>
                                <SelectContent>
                                <SelectDragIndicatorWrapper>
                                    <SelectDragIndicator />
                                </SelectDragIndicatorWrapper>

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
                                color='#512095'
                                as={AlertCircleIcon}
                            />
                            <FormControlErrorText color='#512095'>
                                {invalidCurrentCountryErrorMessage}
                            </FormControlErrorText>
                            </FormControlError>
                        </FormControl> */}

                        <FormControl isInvalid={invalidCurrentCountry} isReadOnly={false} isRequired={true}>
                            <Animatable.View animation={invalidCurrentCountry?"shake":null}>
                            <SelectDropdown
                                disabled={attemptingChangeCountry}
                                data={dropdownData}
                                onSelect={(selectedItem, index) => {
                                    setCurrentCountry(selectedItem.country);
                                    setInvalidCurrentCountry(false);
                                    console.log(selectedItem, index);
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
        </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

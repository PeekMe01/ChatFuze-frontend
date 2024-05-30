import { CircleIcon, Radio, SelectDragIndicator, SelectInput, Icon, SelectItem, SelectIcon, AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View, Select, SelectTrigger, ChevronDownIcon, SelectContent, SelectDragIndicatorWrapper, SelectPortal, SelectBackdrop, RadioGroup, HStack, RadioIndicator, RadioIcon, RadioLabel } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Platform, StyleSheet } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import emojiFlags from 'emoji-flags';

export default function SecondPage(props) {

  const [countriesWithEmojis, setCountriesWithEmojis] = useState([]);
  const [show, setShow] = useState(false)
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

      // Format the date for logging
      let fDate = currentDate.format('D/M/YYYY');
      // setSaveDisabled(false)
    } else {
      setInvalidAge(true);
    }

    // Show the date picker if the platform is iOS
    setShow(Platform.OS === 'ios');
  };

  const {
    invalidAge,
    setInvalidAge,
    dateOfBirth,
    setDateOfBirth,
    country,
    setCountry,
    gender,
    setGender,
    signUpProgress,
    setSignUpProgress,
    changePage,
    setChangePage,
    invalidCountry,
    setInvalidCountry,
  } = props;

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
      borderColor: invalidCountry ? '#512095' : 'white'
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


    <Box h="$32" w="$72" mb={50} style={{ display: 'flex', gap: 40 }}>
      <FormControl isDisabled={false} isInvalid={invalidAge} isReadOnly={false} isRequired={true}>
        <Animatable.View animation={invalidAge ? "shake" : null}>
          <Button onPress={() => showMode('date')} backgroundColor='#2cb5d6'>
            <ButtonText fontSize="$xl" fontWeight="$medium">
              Enter Birthday
            </ButtonText>
          </Button>
          {show && (
            <View flex={1}>
              <View backgroundColor='white' padding={10} borderRadius={20} borderColor='#512095' borderWidth={1} position='absolute' alignSelf='center'>
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
            </View>
          )}

        </Animatable.View>
        <FormControlError mb={-24}>
          <FormControlErrorIcon
            as={AlertCircleIcon}
            color="#512095"
          />
          <FormControlErrorText color="#512095">
            You must be over 18
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl zIndex={-100} isDisabled={false} isInvalid={invalidCountry} isReadOnly={false} isRequired={true}>
        <Animatable.View animation={invalidCountry ? "shake" : null}>
          <SelectDropdown
            disabled={false}
            data={dropdownData}
            onSelect={(selectedItem, index) => {
              setCountry(selectedItem.country);
              setInvalidCountry(false);
            }}
            disableAutoScroll
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
            Invalid Country
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl zIndex={-100} isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={true} >
        <Animatable.View animation={null}>
          <RadioGroup value={gender} onChange={setGender}>
            <HStack space="sm" style={{ justifyContent: 'space-evenly', backgroundColor: 'transparent' }}>
              <Radio value="male">
                <RadioIndicator mr="$2" $active-borderColor='#2cb5d6' $checked-borderColor='#2cb5d6'>
                  <RadioIcon as={CircleIcon} $checked-color='#2cb5d6' size='l' />
                </RadioIndicator>
                <RadioLabel style={{ color: 'white' }} size='xl'>Male</RadioLabel>
              </Radio>
              <Radio value="female">
                <RadioIndicator mr="$2" $active-borderColor='#2cb5d6' $checked-borderColor='#2cb5d6'>
                  <RadioIcon as={CircleIcon} $checked-color='#2cb5d6' size='l' />
                </RadioIndicator>
                <RadioLabel style={{ color: 'white' }} size='xl'>Female</RadioLabel>
              </Radio>
            </HStack>
          </RadioGroup>
        </Animatable.View>
      </FormControl>
    </Box>

  )
}

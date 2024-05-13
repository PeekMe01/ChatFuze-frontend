import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View, Select, SelectTrigger, ChevronDownIcon, SelectContent, SelectDragIndicatorWrapper, SelectPortal, SelectBackdrop, RadioGroup, HStack, RadioIndicator, RadioIcon, RadioLabel } from '@gluestack-ui/themed';
import React, { useEffect, useMemo, useState } from 'react';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import { SelectInput } from '@gluestack-ui/themed';
import { SelectIcon } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { SelectItem } from '@gluestack-ui/themed';
import { SelectDragIndicator } from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform, StyleSheet } from 'react-native';
import { Radio } from '@gluestack-ui/themed';
import { CircleIcon } from '@gluestack-ui/themed';
import SelectDropdown from 'react-native-select-dropdown'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import emojiFlags from 'emoji-flags';

export default function SecondPage(props) {

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

  const [show, setShow] = useState(false)
  
  // const [text, setText] = useState('Empty')

  const showMode = (currentMode) => {
    setShow(!show);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || Date;
    const minimumAgeDate = new Date();
    minimumAgeDate.setFullYear(minimumAgeDate.getFullYear() - 18);
    setShow(Platform.OS==='ios');
    if (currentDate < minimumAgeDate) {
      setInvalidAge(false)
      setDateOfBirth(currentDate)
      selectedDate(currentDate);
      console.log(dateOfBirth)
      let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() +1) + '/' + tempDate.getFullYear();
    } else {
      setInvalidAge(true)
      console.log("im too young")
    }
  }

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
      borderColor:invalidCountry?'#512095':'white'
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
    // <View>
    //     <Center>
    //         {/* <FormControl m={10} pt={30}>
    //             <Progress.Bar progress={signUpProgress} width={300} color='#2cb5d6' height={8}/>
    //         </FormControl> */}
    //         <Animatable.Text animation="bounceIn" easing="ease-out">
    //           <Text size='5xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
    //             SIGN UP2
    //           </Text>
    //         </Animatable.Text>
    //         <Divider my="$10"/>                 
      
        <Box h="$32" w="$72" mb={50} style={{ display: 'flex', gap: 40 }}>
        <FormControl isDisabled={false} isInvalid={invalidAge} isReadOnly={false} isRequired={true}>
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel> */}
            <Animatable.View animation={invalidAge?"shake":null}>
              {/* <Input 
                p={5}
                borderWidth={2}
                backgroundColor='rgba(255,255,255,0.2)'
                $focus-borderColor='white'
                >
                <InputField
                  type="text"
                  placeholder="birthday"
                  fontSize={'$xl'}
                  color='white'
                  placeholderTextColor={'rgba(255,255,255,0.5)'}
                  value={birthday}
                  onChange={(newValue)=>{
                      setBirthday(newValue.nativeEvent.text);
                  }}
                />
              </Input> */}
              <Button onPress={()=> showMode('date')} backgroundColor='#2cb5d6'>
                <ButtonText fontSize="$xl" fontWeight="$medium">
                    Enter Birthday
                  </ButtonText>
              </Button>
              {show && (
                <DateTimePicker
                testID='dateTimePicker'
                value = {dateOfBirth}
                mode='date'
                display='default'
                onChange={onChange}
              />)}
              
            </Animatable.View>
            <FormControlError mb={-24}>
              <FormControlErrorIcon
                as={AlertCircleIcon}
                color = "#512095"
              />
              <FormControlErrorText color = "#512095">
                You must be over 18
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          {/* <FormControl isDisabled={false} isInvalid={invalidCountry} isReadOnly={false} isRequired={true}>
            <Animatable.View animation={invalidCountry?"shake":null}>   
            <Select style={{ borderWidth: 2, borderColor: invalidCountry?'#512095':'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.2)',borderRadius: 5}}
              selectedValue={country}
              onValueChange={(value)=>{setCountry(value); setInvalidCountry(false)}}
            >
              {console.log(country)}
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
                color='#512095'
              />
              <FormControlErrorText color='#512095'>
                Invalid Country
              </FormControlErrorText>
            </FormControlError>
          </FormControl> */}

          
          <FormControl isDisabled={false} isInvalid={invalidCountry} isReadOnly={false} isRequired={true}>
          <Animatable.View animation={invalidCountry?"shake":null}>
              <SelectDropdown
                disabled={false}
                data={dropdownData}
                onSelect={(selectedItem, index) => {
                    setCountry(selectedItem.country);
                    setInvalidCountry(false);
                    console.log(selectedItem, index);
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

          <FormControl isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={true} >
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel> */}
            <Animatable.View animation={null}>
            <RadioGroup value={gender} onChange={setGender}>
              <HStack space="sm" style={{ justifyContent: 'space-evenly', backgroundColor: 'transparent' }}>
                <Radio value="male">
                  <RadioIndicator mr="$2" $active-borderColor='#2cb5d6' $checked-borderColor='#2cb5d6'>
                    <RadioIcon as={CircleIcon} $checked-color='#2cb5d6' size='l'/>
                  </RadioIndicator>
                  <RadioLabel style={{ color: 'white' }} size='xl'>Male</RadioLabel>
                </Radio>
                <Radio value="female">
                  <RadioIndicator mr="$2" $active-borderColor='#2cb5d6' $checked-borderColor='#2cb5d6'>
                    <RadioIcon as={CircleIcon} $checked-color='#2cb5d6'size='l'/>
                  </RadioIndicator>
                  <RadioLabel style={{ color: 'white' }} size='xl'>Female</RadioLabel>
                </Radio>
              </HStack>
            </RadioGroup>
            </Animatable.View>
          </FormControl>
        </Box>

        // <FormControl m={10} pt={50}>
        //   <Button
        //     size="lg"
        //     mb="$4"
        //     borderRadius={40}
        //     hardShadow='1'
        //     bgColor="#2cb5d6"
        //     $hover={{
        //         bg: "$green600",
        //         _text: {
        //         color: "$white",
        //         },
        //     }}
        //     $active={{
        //         bg: "#2c94d6",
        //     }}
        //     onPress={validate}
        //     >
        //       <ButtonText fontSize="$xl" fontWeight="$medium">
        //         Next
        //       </ButtonText>
        //     </Button>

        //     <FormControlHelper style={{ alignItems: 'center', justifyContent: 'center'}}>
        //     <FormControlHelperText  color='rgba(255,255,255,0.7)' >
        //         Already have an account? <FormControlHelperText color='#2cb5d6' fontWeight='$semibold' onPress={()=>console.log('Pressed login')}>Login</FormControlHelperText>
        //     </FormControlHelperText>
        //     </FormControlHelper>
        //   </FormControl>


    //     </Center>
    // </View>
  )
}

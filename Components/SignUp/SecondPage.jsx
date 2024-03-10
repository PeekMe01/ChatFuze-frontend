import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View, Select, SelectTrigger, ChevronDownIcon, SelectContent, SelectDragIndicatorWrapper, SelectPortal, SelectBackdrop, RadioGroup, HStack, RadioIndicator, RadioIcon, RadioLabel } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import { SelectInput } from '@gluestack-ui/themed';
import { SelectIcon } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { SelectItem } from '@gluestack-ui/themed';
import { SelectDragIndicator } from '@gluestack-ui/themed';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform } from 'react-native';
import { Radio } from '@gluestack-ui/themed';
import { CircleIcon } from '@gluestack-ui/themed';


export default function SecondPage(props) {

  const [show, setShow] = useState(false)
  // const [text, setText] = useState('Empty')

  const showMode = (currentMode) => {
    setShow(true);
  }

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || Date;
    setShow(Platform.OS==='ios');
    selectedDate(currentDate);

    let tempDate = new Date(currentDate);
    let fDate = tempDate.getDate() + '/' + (tempDate.getMonth() +1) + '/' + tempDate.getFullYear();

  }

  const { 
    birthday,
    setBirthday,
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
        <FormControl isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={true}>
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel> */}
            <Animatable.View animation={null}>
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
                value = {birthday}
                mode='date'
                display='default'
                onChange={onChange}

              />)}
              
            </Animatable.View>
          </FormControl>

          <FormControl isDisabled={false} isInvalid={invalidCountry} isReadOnly={false} isRequired={true}>
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel> */}
            <Animatable.View animation={invalidCountry?"shake":null}>
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
              
            <Select style={{ borderWidth: 2, borderColor: invalidCountry?'rgba(255,0,0,0.8)':'rgba(255,255,255,0.8)', backgroundColor: 'rgba(255,255,255,0.2)',borderRadius: 5}}
              selectedValue={country}
              onValueChange={setCountry}
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

                  {/* Here you put all the countries */}
                  <SelectItem label="Lebanon" value="lb" />
                  <SelectItem label="Syria" value="sr" />
                  <SelectItem label="United States" value="us" />
                  <SelectItem label="Canada" value="ca" />
                  <SelectItem label="Japan" value="jp" />
                  <SelectItem label="France" value="fr" />
                  <SelectItem label="Russia" value="rs" />


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

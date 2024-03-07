import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';

export default function SecondPage(props) {

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
    setChangePage
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
              <Input 
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
              </Input>
            </Animatable.View>
            <FormControlError mb={-24}>
              <FormControlErrorIcon
                as={AlertCircleIcon}
              />
              <FormControlErrorText>
                Username Unavailable
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={true}>
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel> */}
            <Animatable.View animation={null}>
              <Input 
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
              </Input>
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
              <Input 
                p={5} 
                backgroundColor='rgba(255,255,255,0.2)'
                borderWidth={2}
                $focus-borderColor='white'
                >
                <InputField
                  type={"text"}
                  placeholder="gender"
                  fontSize={'$xl'}
                  color='white'
                  placeholderTextColor={'rgba(255,255,255,0.5)'}
                  value={gender}
                  onChange={(newValue)=>{
                      setGender(newValue.nativeEvent.text);
                  }}
                />
              </Input>
            </Animatable.View>
            <FormControlError mb={-24}>
              <FormControlErrorIcon
                as={AlertCircleIcon}
              />
              <FormControlErrorText>
                At least 8 characters are required.
              </FormControlErrorText>
            </FormControlError>
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

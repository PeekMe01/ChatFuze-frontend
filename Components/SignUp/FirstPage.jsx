import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';

export default function FirstPage(props) {
  
  const [showPassword, setShowPassword] = useState(false)
  const handleShowPassword = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  const { 
    validateUsername,
    validateEmail,
    username, 
    setUsername, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    invalidUsername, 
    setInvalidUsername, 
    invalidEmail, 
    setInvalidEmail, 
    invalidPassword, 
    setInvalidPassword ,
    signUpProgress,
    setSignUpProgress,
    changePage,
    setChangePage
  } = props;

  return (
    // <Animatable.View animation={changingPage?"fadeOut":null} duration={500}>
    // <View>
    //     <Center>
    //         {/* <FormControl m={10} pt={30}>
    //             <Progress.Bar progress={signUpProgress} width={300} color='#2cb5d6' height={8}/>
    //         </FormControl> */}
    //         <Animatable.Text animation="bounceIn" easing="ease-out">
    //           <Text size='5xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
    //             SIGN UP
    //           </Text>
    //         </Animatable.Text>
    //         <Divider my="$10"/>                 
      
        <Box h="$32" w="$72" mb={50} style={{ display: 'flex', gap: 40 }}>
        <FormControl isDisabled={false} isInvalid={invalidUsername} isReadOnly={false} isRequired={true}>
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel> */}
            <Animatable.View animation={invalidUsername?"shake":null}>
              <Input 
                p={5}
                borderWidth={2}
                backgroundColor='rgba(255,255,255,0.2)'
                $focus-borderColor='white'
                >
                <InputField
                  type="text"
                  placeholder="Username"
                  fontSize={'$xl'}
                  color='white'
                  placeholderTextColor={'rgba(255,255,255,0.5)'}
                  value={username}
                  onChange={(newValue)=>{
                      setUsername(newValue.nativeEvent.text);
                      setInvalidUsername(false);
                      validateUsername(newValue.nativeEvent.text);
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

          <FormControl isDisabled={false} isInvalid={invalidEmail} isReadOnly={false} isRequired={true}>
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel> */}
            <Animatable.View animation={invalidEmail?"shake":null}>
              <Input 
                p={5}
                borderWidth={2}
                backgroundColor='rgba(255,255,255,0.2)'
                $focus-borderColor='white'
                >
                <InputField
                  type="email"
                  placeholder="Email"
                  fontSize={'$xl'}
                  color='white'
                  placeholderTextColor={'rgba(255,255,255,0.5)'}
                  value={email}
                  onChange={(newValue)=>{
                      setEmail(newValue.nativeEvent.text);
                      setInvalidEmail(false);
                      validateEmail(newValue.nativeEvent.text);
                  }}
                />
              </Input>
            </Animatable.View>
            <FormControlError mb={-24}>
              <FormControlErrorIcon
                as={AlertCircleIcon}
              />
              <FormControlErrorText>
                Invalid Email
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isDisabled={false} isInvalid={invalidPassword} isReadOnly={false} isRequired={true} >
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel> */}
            <Animatable.View animation={invalidPassword?"shake":null}>
              <Input 
                p={5} 
                backgroundColor='rgba(255,255,255,0.2)'
                borderWidth={2}
                $focus-borderColor='white'
                >
                <InputField
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  fontSize={'$xl'}
                  color='white'
                  placeholderTextColor={'rgba(255,255,255,0.5)'}
                  value={password}
                  onChange={(newValue)=>{
                      setPassword(newValue.nativeEvent.text);
                      setInvalidPassword(false);
                  }}
                />
                <InputSlot pr="$3" onPress={handleShowPassword}>
                  {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                  <InputIcon
                    as={showPassword ? EyeIcon : EyeOffIcon}
                    color="white"
                  />
                </InputSlot>
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

    //     <FormControl m={10} pt={50}>
    //       <Button
    //         size="lg"
    //         mb="$4"
    //         borderRadius={40}
    //         hardShadow='1'
    //         bgColor="#2cb5d6"
    //         $hover={{
    //             bg: "$green600",
    //             _text: {
    //             color: "$white",
    //             },
    //         }}
    //         $active={{
    //             bg: "#2c94d6",
    //         }}
    //         onPress={validate}
    //         >
    //           <ButtonText fontSize="$xl" fontWeight="$medium">
    //             Next
    //           </ButtonText>
    //         </Button>

    //         <FormControlHelper style={{ alignItems: 'center', justifyContent: 'center'}}>
    //         <FormControlHelperText  color='rgba(255,255,255,0.7)' >
    //             Already have an account? <FormControlHelperText color='#2cb5d6' fontWeight='$semibold' onPress={()=>console.log('Pressed login')}>Login</FormControlHelperText>
    //         </FormControlHelperText>
    //         </FormControlHelper>
    //       </FormControl>


    //     </Center>
    // </View>
    // </Animatable.View>
  )
}

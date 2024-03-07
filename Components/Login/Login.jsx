import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { useFonts } from 'expo-font';
import { AppLoading } from 'expo';
import { HStack } from '@gluestack-ui/themed';
import { Spinner } from '@gluestack-ui/themed';

export default function Login() {
  
  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
  });

  const [showPassword, setShowPassword] = useState(false)
  const handleState = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  if (!fontsLoaded) {
    return (
      <HStack space="sm">
        <Spinner size="large" color="#321bb9" />
      </HStack>
    ) 
  } else
  return (
    <View>
        <Center>
            <Text size='5xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
              LOGIN
            </Text>
            <Divider my="$10"/>
        
      
        <Box h="$32" w="$72" style={{ display: 'flex', gap: 30 }}>
          <FormControl isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={true} >
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Email</FormControlLabelText>
            </FormControlLabel> */}
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
              />
            </Input>
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
              />
              <FormControlErrorText>
                Invalid Email
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl isDisabled={false} isInvalid={false} isReadOnly={false} isRequired={true} >
            {/* <FormControlLabel mb='$1'>
              <FormControlLabelText>Password</FormControlLabelText>
            </FormControlLabel> */}
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
              />
              <InputSlot pr="$3" onPress={handleState}>
                {/* EyeIcon, EyeOffIcon are both imported from 'lucide-react-native' */}
                <InputIcon
                  as={showPassword ? EyeIcon : EyeOffIcon}
                  color="white"
                />
              </InputSlot>
            </Input>
            <FormControlError>
              <FormControlErrorIcon
                as={AlertCircleIcon}
              />
              <FormControlErrorText>
                At least 8 characters are required.
              </FormControlErrorText>
            </FormControlError>
          </FormControl>
        </Box>

        <FormControl m={10} pt={30}>
          <Button
            size="lg"
            mb="$4"
            borderRadius={40}
            hardShadow='1'
            bgColor="#2cb5d6"
            $hover={{
                bg: "$green600",
                _text: {
                color: "$white",
                },
            }}
            $active={{
                bg: "#2c94d6",
            }}
            onPress={()=>(console.log("Login in pressed"))}
            >
              <ButtonText fontSize="$xl" fontWeight="$medium">
                Login
              </ButtonText>
            </Button>

            <FormControlHelper style={{ alignItems: 'center', justifyContent: 'center'}}>
            <FormControlHelperText  color='rgba(255,255,255,0.7)' >
                Don't have an account? <FormControlHelperText color='#2cb5d6' fontWeight='$semibold' onPress={()=>console.log('Pressed create one')}>Create one</FormControlHelperText>
            </FormControlHelperText>
            </FormControlHelper>
          </FormControl>
        </Center>
    </View>
  )
  
}

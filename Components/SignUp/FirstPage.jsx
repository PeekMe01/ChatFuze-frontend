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
    emailErrorText,
    setEmailErrorText,
    usernameErrorText,
    setUsernameErrorText,
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
    setInvalidPassword,
    signUpProgress,
    setSignUpProgress,
    changePage,
    setChangePage
  } = props;

  return (
    <Box h="$32" w="$72" mb={50} style={{ display: 'flex', gap: 40 }}>
      <FormControl isDisabled={false} isInvalid={invalidUsername} isReadOnly={false} isRequired={true}>
        <Animatable.View animation={invalidUsername ? "shake" : null}>
          <Input
            p={5}
            borderWidth={2}
            backgroundColor='rgba(255,255,255,0.2)'
            $focus-borderColor={invalidUsername ? '#512095' : 'white'}
            borderColor={invalidUsername ? '#512095' : 'white'}
          >
            <InputField
              type="text"
              placeholder="Username"
              fontSize={'$xl'}
              autoCapitalize='none'
              color='white'
              placeholderTextColor={'rgba(255,255,255,0.5)'}
              value={username}
              onChange={(newValue) => {
                setUsername(newValue.nativeEvent.text);
                setInvalidUsername(false);
              }}
            />
          </Input>
        </Animatable.View>
        <FormControlError mb={-24}>
          <FormControlErrorIcon
            color='#512095'
            as={AlertCircleIcon}
          />
          <FormControlErrorText color='#512095'>
            {usernameErrorText}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isDisabled={false} isInvalid={invalidEmail} isReadOnly={false} isRequired={true}>
        <Animatable.View animation={invalidEmail ? "shake" : null}>
          <Input
            p={5}
            borderWidth={2}
            borderColor={invalidEmail ? '#512095' : 'white'}
            backgroundColor='rgba(255,255,255,0.2)'
            $focus-borderColor={invalidEmail ? '#512095' : 'white'}
          >
            <InputField
              type="email"
              placeholder="Email"
              fontSize={'$xl'}
              autoCapitalize='none'
              color='white'
              placeholderTextColor={'rgba(255,255,255,0.5)'}
              value={email}
              onChange={(newValue) => {
                setEmail(newValue.nativeEvent.text);
                setInvalidEmail(false);
              }}
            />
          </Input>
        </Animatable.View>
        <FormControlError mb={-24}>
          <FormControlErrorIcon
            color='#512095'
            as={AlertCircleIcon}
          />
          <FormControlErrorText color='#512095'>
            {emailErrorText}
          </FormControlErrorText>
        </FormControlError>
      </FormControl>

      <FormControl isDisabled={false} isInvalid={invalidPassword} isReadOnly={false} isRequired={true} >
        <Animatable.View animation={invalidPassword ? "shake" : null}>
          <Input
            p={5}
            backgroundColor='rgba(255,255,255,0.2)'
            borderWidth={2}
            borderColor={invalidPassword ? '#512095' : 'white'}
            $focus-borderColor={invalidPassword ? '#512095' : 'white'}
          >
            <InputField
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              fontSize={'$xl'}
              autoCapitalize='none'
              color='white'
              placeholderTextColor={'rgba(255,255,255,0.5)'}
              value={password}
              onChange={(newValue) => {
                setPassword(newValue.nativeEvent.text);
                setInvalidPassword(false);
              }}
            />
            <InputSlot pr="$3" onPress={handleShowPassword}>
              <InputIcon
                as={showPassword ? EyeIcon : EyeOffIcon}
                color="white"
              />
            </InputSlot>
          </Input>
        </Animatable.View>
        <FormControlError mb={-24}>
          <FormControlErrorIcon
            color='#512095'
            as={AlertCircleIcon}
          />
          <FormControlErrorText color='#512095'>
            At least 8 characters are required.
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
    </Box>

  )
}

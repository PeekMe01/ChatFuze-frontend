import { SelectInput, SelectIcon, Icon, SelectItem, SelectDragIndicator, Radio, CircleIcon, AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View, Select, SelectTrigger, ChevronDownIcon, SelectContent, SelectDragIndicatorWrapper, SelectPortal, SelectBackdrop, RadioGroup, HStack, RadioIndicator, RadioIcon, RadioLabel, Heading, ToastTitle, ToastDescription } from '@gluestack-ui/themed';
import React, { useEffect, useRef, useState } from 'react';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform, StyleSheet } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Buttons from './Buttons';

export default function SecondPage(props) {


  const {
    email,
    OTP,
    setOTP,
    invalidOTP,
    setInvalidOTP,
    signUpProgress,
    setSignUpProgress,
    changePage,
    setChangePage,
  } = props;

  return (
    <>
      <Heading color='white' textAlign='center'>OTP sent to</Heading>
      <Heading color='white' textAlign='center' fontWeight='regular' size='s'>{email.length <= 30 ? email.toLowerCase() : email.substring(0, 30).toLowerCase() + '...'}</Heading>
      <Box h="$32" w="$72" style={{ display: 'flex', justifyContent: 'center' }}>



        <FormControl isDisabled={false} isInvalid={invalidOTP} isReadOnly={false} isRequired={true}>
          <Animatable.View animation={invalidOTP ? "shake" : null}>
            <FormControlLabel mb="$2">
              <FormControlLabelText color='white'>Enter OTP</FormControlLabelText>
            </FormControlLabel>
            <Input
              p={5}
              borderWidth={2}
              backgroundColor='rgba(255,255,255,0.2)'
              borderColor={invalidOTP ? '#512095' : 'white'}
              $focus-borderColor={invalidOTP ? '#512095' : 'white'}
            >
              <InputField
                keyboardType="number-pad"
                placeholder="OTP"
                fontSize={'$xl'}
                color='white'
                placeholderTextColor={'rgba(255,255,255,0.5)'}
                value={OTP}
                onChange={(newValue) => {
                  setOTP(newValue.nativeEvent.text);
                  setInvalidOTP(false);
                }}
              />
            </Input>
          </Animatable.View>
          <FormControlError mb={-24}>
            <FormControlErrorIcon
              as={AlertCircleIcon}
              color="#512095"
            />
            <FormControlErrorText color="#512095">
              OTP is incorrect
            </FormControlErrorText>
          </FormControlError>
        </FormControl>
      </Box>
    </>

  )
}
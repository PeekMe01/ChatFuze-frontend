import {CircleIcon,Radio,SelectDragIndicator,SelectItem,Icon,SelectIcon, SelectInput,AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View, Select, SelectTrigger, ChevronDownIcon, SelectContent, SelectDragIndicatorWrapper, SelectPortal, SelectBackdrop, RadioGroup, HStack, RadioIndicator, RadioIcon, RadioLabel, Image } from '@gluestack-ui/themed';
import React, { useEffect, useRef, useState } from 'react';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Platform, StyleSheet } from 'react-native';
import { Camera, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Buttons from './Buttons';
import { useFonts } from 'expo-font';
import {
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';

export default function SecondPage(props) {

  const { 
    image,
    setImage,
    invalidImage,
    setInvalidImage,
    signUpProgress,
    setSignUpProgress,
    changePage,
    setChangePage,
    setOpenCamera,
    openCamera,
    permission,
    requestPermission,
  } = props;

  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'),
    Roboto_100Thin,
    Roboto_100Thin_Italic,
    Roboto_300Light,
    Roboto_300Light_Italic,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_500Medium_Italic,
    Roboto_700Bold,
    Roboto_700Bold_Italic,
    Roboto_900Black,
    Roboto_900Black_Italic,
  });

  return (
    <Box h='$48' w="$72" mb={50} style={{ display: 'flex', gap: 10 }}>
      <FormControl isDisabled={false} isInvalid={invalidImage} isReadOnly={false} isRequired={true}>
        <Animatable.View animation={null} style={{ gap:10 }}>
          {!image&&
          <>
            <Text size='xl' color='white' fontFamily='Roboto_400Regular'>
              Please upload your ID photo
            </Text>
            <Text color='white' fontFamily='Roboto_300Light'>
              We need your ID to verify your age and country.
            </Text>
          </>}
          <Button
            isDisabled={false}
            size="lg"
            mb="$4"
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
            onPress={()=>{setOpenCamera(true);setImage(null); setInvalidImage(false); if(permission&&!permission.granted){requestPermission()}}}
            >
            <ButtonText fontSize="$xl" fontWeight="$medium">
              Upload ID
            </ButtonText>
          </Button>
        </Animatable.View>
        <FormControlError marginTop={-10}>
          <FormControlErrorIcon
            color='#512095'
            as={AlertCircleIcon}
          />
          <FormControlErrorText color='#512095'>
            Please upload a photo of your id.
          </FormControlErrorText>
      </FormControlError>
      </FormControl>
      {image&&
      <FormControl>
        <View width={'$72'} height={'$48'}>
          <Image
          borderWidth={3}
          borderColor='#2cd6d3'
          borderRadius={30}
          flex={1}
          w={'$full'}
          source={image}
          alt='photo_id'
          />
        </View>
       
      </FormControl>
      }
    </Box>
  )
}
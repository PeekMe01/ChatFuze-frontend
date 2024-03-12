import { AlertCircleIcon, Box, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, View, Select, SelectTrigger, ChevronDownIcon, SelectContent, SelectDragIndicatorWrapper, SelectPortal, SelectBackdrop, RadioGroup, HStack, RadioIndicator, RadioIcon, RadioLabel } from '@gluestack-ui/themed';
import React, { useEffect, useRef, useState } from 'react';
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
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import Buttons from './Buttons';

export default function SecondPage(props) {

  const handleUpload = async () => {
    //const response = await launchCamera({maxHeight: 500, maxWidth: 500})
    console.log('jo')
  }

  useEffect(() => {
    (async () => {
        MediaLibrary.requestPermissionsAsync();
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
    })();
  }, [])

  const { 
    image,
    setImage,
    invalidImage,
    setInvalidImage,
    signUpProgress,
    setSignUpProgress,
    changePage,
    setChangePage,
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
            <Animatable.View animation={null}>
              <Button onPress={handleUpload} backgroundColor='#2cb5d6'>
                <ButtonText fontSize="$xl" fontWeight="$medium">
                    Upload ID
                  </ButtonText>
              </Button>
              
            </Animatable.View>
          </FormControl>
          {/* <FormControl>
            <View style={styles.container}>
                <Camera
                    style={styles.camera}
                    type={type}
                    flasMode={flash}
                    ref={cameraRef}
                >
                    <View>
                        <Buttons title={'Take a picture'} icon="camera"/> 
                    </View>
                </Camera>
            </View>
            
          </FormControl> */}
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
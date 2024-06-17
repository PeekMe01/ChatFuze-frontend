import { useToast, Toast, HStack, Spinner, AlertCircleIcon, Box, Button, ButtonText, Center, CloseIcon, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, Icon, ImageBackground, Input, InputField, InputIcon, InputSlot, Pressable, Text, ToastDescription, ToastTitle, VStack, View } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';
import { Image, TouchableHighlight } from 'react-native';
import { AppLoading } from 'expo';
import * as Animatable from 'react-native-animatable';
import API_URL from '../Config'
import logo from '../../assets/img/Logo/Logo_WithoutBackground.png'
import api from '../Config'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from "../../config/firebase";

export default function Login(props) {
  const toast = useToast()
  const [email, setEmail] = useState();
  const [invalidEmail, setInvalidEmail] = useState(false);
  
  const [password, setPassword] = useState();
  const [invalidPassword, setInvalidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false)

  const [attemptingLogin, setAttemptingLogin] = useState(false);
  const [onForgotPasswordPage, setOnForgotPasswordPage] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  
  const [changingPage, setChangingPage] = useState(false)
  const [nextPressed, setNextPressed] = useState(false);

  const [fontsLoaded] = useFonts({
    'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'),
  });

  const {
    loggedIn,
    setLoggedIn,
    setLoginPage,
    setSignupPage,
    setWelcomePage,
    welcomePage
  } = props


  const handleShowPassword = () => {
    setShowPassword((showState) => {
      return !showState
    })
  }

  const handleForgotPasswordPageChange = () => {
    setChangingPage(true);

    setTimeout(() => {
      setOnForgotPasswordPage(!onForgotPasswordPage);
      setChangingPage(false)
    }, 100);
  }

  const handlePasswordReset = async () => {
    let emailGood = false;
    setNextPressed(true);

    if (!email || (email && !email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
      setInvalidEmail(true)
    } else {
      setInvalidEmail(false)
      emailGood = true;
    }

    if (emailGood) {
      try {
        const data = { email }
        const response = await api.post(`/Accounts/resetpassword`, data);
        if (response) {
          setChangingPage(true);

          setTimeout(() => {
            setOnForgotPasswordPage(!onForgotPasswordPage);
            setForgotPasswordSuccess(true);
            setChangingPage(false)
            setNextPressed(false);
          }, 100);
        }

      } catch (error) {
        toast.show({
          duration: 5000,
          placement: "top",
          render: ({ id }) => {
            const toastId = "toast-" + id
            return (
              <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                <VStack space="xs">
                  <ToastTitle>Error</ToastTitle>
                  <ToastDescription>
                    There was an error send the reset email password!
                  </ToastDescription>
                </VStack>
                <Pressable mt="$1" onPress={() => toast.close(id)}>
                  <Icon as={CloseIcon} color="$black" />
                </Pressable>
              </Toast>
            )
          },
        })
        setNextPressed(false);
      }
    }

    setTimeout(() => {
      setNextPressed(false);
    }, 1000);

  }

  const handleGoBackToLogin = () => {
    setChangingPage(true);

    setTimeout(() => {
      setOnForgotPasswordPage(false);
      setForgotPasswordSuccess(false);
      setChangingPage(false)
    }, 100);
  }

  const getStarted = () => {
    setChangingPage(true);

    setTimeout(() => {
      setWelcomePage(false)
      setChangingPage(false)
    }, 500)
  }

  const handleLogin = async () => {
    let emailGood = false;
    let passwordGood = false;

    if (!email || (email && !email.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))) {
      setInvalidEmail(true)
    } else {
      setInvalidEmail(false)
      emailGood = true;
    }
    if ((password && password.length < 8) || !password) {
      setInvalidPassword(true)
    } else {
      setInvalidPassword(false)
      passwordGood = true;
    }
    if (emailGood && passwordGood) {
      setAttemptingLogin(true)
      const data = { email, password }
      try {
        const response = await api.post(`/Accounts/login`, data);
        if (response) {
          setChangingPage(true);
          toast.show({
            duration: 5000,
            placement: "top",
            render: ({ id }) => {
              const toastId = "toast-" + id
              return (
                <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
                  <VStack space="xs">
                    <ToastTitle>Success</ToastTitle>
                    <ToastDescription>
                      You have succesfully logged in to your account
                    </ToastDescription>
                  </VStack>
                  <Pressable mt="$1" onPress={() => toast.close(id)}>
                    <Icon as={CloseIcon} color="$black" />
                  </Pressable>
                </Toast>
              )
            },
          })
          setTimeout(async function () {
            const { token, id } = response.data;
            await AsyncStorage.setItem('userToken', token);
            await AsyncStorage.setItem('id', String(id));
            setLoggedIn(true);
            setChangingPage(false);
            setAttemptingLogin(false);
          }, 100);
        }

      } catch (error) {
        console.log(error);
        toast.show({
          duration: 5000,
          placement: "top",
          render: ({ id }) => {
            const toastId = "toast-" + id
            return (
              <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                <VStack space="xs">
                  <ToastTitle>Invalid Credentials</ToastTitle>
                  <ToastDescription>
                    Email or password are incorrect
                  </ToastDescription>
                </VStack>
                <Pressable mt="$1" onPress={() => toast.close(id)}>
                  <Icon as={CloseIcon} color="$black" />
                </Pressable>
              </Toast>
            )
          },
        })
      }
      setAttemptingLogin(false)
    }
  }

  if (!fontsLoaded) {
    return (
      <HStack space="sm">
        <Spinner size="large" color="#321bb9" />
      </HStack>
    )
  } else if (onForgotPasswordPage) {
    return (
      <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
        <View>
          <Center>
            <Animatable.Text animation="bounceIn" easing="ease-out">
              <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                Enter your email
              </Text>
            </Animatable.Text>
            <Divider my="$10" />


            <Box h="$20" w="$72" style={{ display: 'flex', gap: 30 }}>
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
                    as={AlertCircleIcon}
                  />
                  <FormControlErrorText>
                    Invalid Email
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>
            </Box>
            <Button
              isDisabled={nextPressed}
              size="lg"
              mb="$4"
              w={'100%'}
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
              onPress={() => handlePasswordReset()}
            >
              <ButtonText fontSize="$xl" fontWeight="$medium">
                Next
              </ButtonText>
            </Button>
            <Button
              isDisabled={nextPressed}
              size="lg"
              mb="$4"
              w={'100%'}
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
              onPress={() => handleForgotPasswordPageChange()}
            >
              <ButtonText fontSize="$xl" fontWeight="$medium">
                Cancel
              </ButtonText>
            </Button>

          </Center>
        </View>
      </Animatable.View>
    )
  } else if (forgotPasswordSuccess) {
    return (
      <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
        <View w={'$72'} gap={20}>
          <Text size='5xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
            Success!
          </Text>
          <Text color='white' fontWeight='$hairline' fontFamily='ArialRoundedMTBold'>
            A link for reseting your password has been sent to your email.
          </Text>
          <Button
            isDisabled={attemptingLogin}
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
            onPress={() => handleGoBackToLogin()}
          >
            <ButtonText fontSize="$xl" fontWeight="$medium">
              Back to login
            </ButtonText>
          </Button>
        </View>
      </Animatable.View>
    )
  } else if (welcomePage) {
    return (
      <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
        <View width={'100%'}>
          <Box h="$56" w="$96" style={{ display: 'flex', gap: 30, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={logo}
              style={{ width: '100%', height: '100%' }}
            />
            <Button
              isDisabled={attemptingLogin}
              size="lg"
              mb="$4"
              width={'80%'}
              borderRadius={40}
              hardShadow='1'
              top={'50%'}
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
              onPress={() => getStarted()}
            >
              <ButtonText fontSize="$xl" fontWeight="$medium">
                Get Started
              </ButtonText>
            </Button>
          </Box>
        </View>
      </Animatable.View>
    )
  }
  else {
    return (
      <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
        <View>
          <Center>
            <Animatable.Text animation="bounceIn" easing="ease-out">
              <Text size='5xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                LOGIN
              </Text>
            </Animatable.Text>
            <Divider my="$10" />


            <Box h="$32" w="$72" style={{ display: 'flex', gap: 30 }}>
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
                    Invalid Email
                  </FormControlErrorText>
                </FormControlError>
              </FormControl>

              <FormControl isDisabled={false} isInvalid={invalidPassword} isReadOnly={false} isRequired={true} >
                <Animatable.View animation={invalidPassword ? "shake" : null}>
                  <Input
                    p={5}
                    backgroundColor='rgba(255,255,255,0.2)'
                    borderWidth={2}
                    borderColor={invalidEmail ? '#512095' : 'white'}
                    $focus-borderColor={invalidEmail ? '#512095' : 'white'}
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

                {/* <FormControlHelper style={{ alignItems: 'center' }} paddingTop={10}>
                  <FormControlHelperText paddingVertical={10} color='#2cb5d6' size='l' textAlign='left' onPress={() => handleForgotPasswordPageChange()}>
                    Forgot Password?
                  </FormControlHelperText>
                </FormControlHelper> */}
              </FormControl>
              <TouchableHighlight underlayColor='transparent' onPress={() => handleForgotPasswordPageChange()}>
                <Text paddingBottom={10} marginTop={-10} color='#2cb5d6'>
                  Forgot Password?
                </Text>
              </TouchableHighlight>
            </Box>

            <FormControl m={10} mt={40}  >
              <Button
                isDisabled={attemptingLogin}
                size="lg"
                mb="$4"
				 marginTop={5}
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
                onPress={handleLogin}
              >
                <ButtonText fontSize="$xl" fontWeight="$medium">
                  Login
                </ButtonText>
              </Button>

              <FormControlHelper style={{ alignItems: 'center', justifyContent: 'center' }}>
                <FormControlHelperText color='rgba(255,255,255,0.7)' >
                  Don't have an account? <FormControlHelperText color='#2cb5d6' fontWeight='$semibold' onPress={() => { setLoginPage(false); setSignupPage(true) }}>Create one</FormControlHelperText>
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
          </Center>
        </View>
      </Animatable.View>
    )
  }
}

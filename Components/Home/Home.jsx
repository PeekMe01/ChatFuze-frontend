import { Icon, Pressable, ToastDescription, Toast, InputIcon, Box, Button, ButtonText, Center, CloseIcon, Divider, FlatList, HStack, Image, ImageBackground, Input, InputField, InputSlot, ScrollView, Spinner, Switch, Text, ToastTitle, VStack, View, useToast } from '@gluestack-ui/themed'
import { useFonts } from 'expo-font';
import React, { useContext, useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import Autocomplete from 'react-native-autocomplete-input';
import { useIsFocused, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../Config';
import { Keyboard, StyleSheet, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Scroll } from '@react-three/drei';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { RequestContext } from './RequestProvider';
import userimg from '../../assets/img/user.png'
import { database } from "../../config/firebase";
import { query, collection, getDocs, where,doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
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
import { useUnreadMessages } from '../UnreadMessages/UnreadMessagesProvider';

const Home = ({ navigation , setLoggedIn, setLoginPage, setSignupPage}) => {
  // Get the route object
  const route = useRoute();
  // Extract parameters from the route
  const { disconnetedDueToMatchLeaving, disconnetedDueToMeLeaving ,roomID } = route.params || {};

  const { roomIDForListeners, setRoomIDForListeners } = useUnreadMessages();

  useEffect(() => {
    console.log('it did change')
  }, [roomIDForListeners])

  useEffect(() => {
    if (disconnetedDueToMatchLeaving) {
      alert("Your match has disconnected from the room.")
    }

    if (disconnetedDueToMeLeaving) {
      alert("You have disconnected from the room. your rank has descreased by 2%.")
    }

    if(roomID){
      console.log('ihihihih')
      setRoomIDForListeners(roomID)
    }
  }, [roomID])


  const toast = useToast()

  const [changingPage, setChangingPage] = useState(false)
  const [user, setUser] = useState();
  const [rankName, setRankName] = useState();
  const [leaderboardnumber, setLeaderboardnumber] = useState();
  const [roomCount, setRoomCount] = useState();
  const [ageRange, setAgeRange] = useState([18, 60])

  const data = ['Education and Learning', 'Sports and Physical Activities', 'Entertainment and Media', 'Music and Performing Arts',
    'Technology and Gaming', 'Cooking and Foods', 'Art and Creativity',
    'Health and Wellness', 'Business and Finance'];

  const [query, setQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredData, setFilteredData] = useState(data);
  const [focused, setFocused] = useState(false);

  const [location, setLocation] = useState('local');
  const [backgroundColoroption, setBackgroundColorOption] = useState('local')

  const [preferedGender, setPreferedGender] = useState("both")
  const [backgroundColorGender, setBackGroundColorGender] = useState("both")

  const [attemptingJoinRoom, setAttemptingJoinRoom] = useState(false);

  const { requestID, setRequestID } = useContext(RequestContext);
  const { userId, setUserId } = useContext(RequestContext);

  const [userHasAnIdVerificationRequest, setUserHasAnIdVerificationRequest] = useState(false);
  const [userAlreadyVerified, setUserAlreadyVerified] = useState(false);
 function getCurrentDateTime() {
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1; // Months are zero-indexed, so we add 1
        let year = currentDate.getFullYear();
        let hours = currentDate.getHours();
        let minutes = currentDate.getMinutes();
        let seconds = currentDate.getSeconds();

        // Format the date and time
        let formattedDate = `${year}-${month}-${day}`;
        let formattedTime = `${hours}:${minutes}:${seconds}`;

        // Concatenate date and time
        let dateTime = `${formattedDate} ${formattedTime}`;

        // Return the concatenated date and time
        return dateTime;
    }
  const checkIfUserHasAnIdVerificationRequest = async () => {
    const data = {
      userid: await AsyncStorage.getItem('id'),
    }
    try {
      const response = await api.post(`/Accounts/checkIdVerification`, data);
      if (response) {
        setUserAlreadyVerified(response.data.userAlreadyVerified)
        setUserHasAnIdVerificationRequest(response.data.hasIDVerificationRequest)
      }
    } catch (error) {
      console.log("checkIfUserHasAnIdVerificationRequest" + error)
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
                  There was an error checking for your verification status
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
  }
  const isFocused = useIsFocused();
  useEffect(() => {
    checkIfUserHasAnIdVerificationRequest();
  }, [isFocused])

  const handleSelect = (item) => {
    setSelectedItems([...selectedItems, item]);
    setFilteredData(filteredData.filter((dataItem) => dataItem !== item));
    setQuery('');
  };

  const renderSuggestion = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelect(item)}>
      <Text style={styles.suggestion}>{item}</Text>
    </TouchableOpacity>
  );

  async function fetchData() {
    try {
      const data = await AsyncStorage.getItem('id')
      setUserId(data);
      const response = await api.get(`/settings/getinsight/${data}`);
      setUser(response.data.user);
      setRankName(response.data.rankname);
      setLeaderboardnumber(response.data.leaderboardnumber);
      setRoomCount(response.data.roomCount)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    fetchData();
  }, [!user || isFocused]);

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

  const renderItem = ({ item, index, length }) => {
    return (
      <TouchableHighlight onPress={() => handleSelect(item)} underlayColor={'#ffffff50'} style={{ borderBottomRightRadius: index == length - 1 ? 20 : 0, borderBottomLeftRadius: index == length - 1 ? 20 : 0 }} >
        <Text padding={15} backgroundColor={'white'} borderBottomRightRadius={index == length - 1 ? 20 : 0} borderBottomLeftRadius={index == length - 1 ? 20 : 0} color='black'>
          {item}
        </Text>
      </TouchableHighlight>

    )
  }

  const handleDeleteItem = (item) => {
    setSelectedItems(selectedItems.filter((dataItem) => dataItem !== item))
    setFilteredData([...filteredData, item])
  }

  const renderSelectedItems = ({ item, index }) => {
    return (
      <View backgroundColor='#51209585' flexDirection='row' alignItems='center' justifyContent='center' padding={5} paddingHorizontal={7} margin={5} borderWidth={1} borderColor='white' borderRadius={50}>
        <Text paddingHorizontal={5} size='md' color='white' key={index}>
          {item}
        </Text>
        <TouchableHighlight style={{ borderRadius: 40 }} underlayColor={'#ffffff50'} onPress={() => handleDeleteItem(item)}>
          <MaterialCommunityIcons padding={1} name='close' size={20} color={'white'} />
        </TouchableHighlight>
      </View>

    )
  }

  const joinRoom = async () => {
    setAttemptingJoinRoom(true);
    try {
      const data = {
        userid: await AsyncStorage.getItem('id'),
        intrests: selectedItems,
        maximumAge: ageRange[1],
        minimumAge: ageRange[0],
        gender: preferedGender,
        country: location == 'local' ? user.country : 'global'
      }

      const response = await api.post(`/home/addrequest`, data);
      setRequestID(response.data.data)

      if (response) {
        navigation.push('MatchMakingScreen');
        setTimeout(() => {
          setAttemptingJoinRoom(false);
        }, 2000);
      }

    } catch (error) {
      setAttemptingJoinRoom(false);
      console.log(error)
      toast.show({
        duration: 5000,
        placement: "top",
        render: ({ id }) => {
          const toastId = "toast-" + id
          return (
            <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
              <VStack space="xs">
                <ToastTitle>Success</ToastTitle>
                <ToastDescription>
                  There was an error while sending your request to the server.
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
  }

  if (!fontsLoaded || !user) {
    return (
      <ImageBackground
        source={require('../../assets/img/HomePage1.png')}
        style={{ flex: 1, resizeMode: 'cover' }}
      >
        <Center h={'$full'}>
          <HStack space="sm" justifyContent='center' alignItems='center'>
            <Text color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
          </HStack>
        </Center>
      </ImageBackground>
    )
  }

  return (
    <ImageBackground
      source={require('../../assets/img/HomePage1.png')}
      style={{ flex: 1, resizeMode: 'cover' }}
    >
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}  >
        <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500} >
          <View margin={'5%'} marginTop={'10%'} justifyContent='center' alignItems='center'>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false} >
              <View gap={5} display='flex' flexDirection='row' >
                {user.imageurl ? (
                  <Image
                    alt='profilePic'
                    border
                    zIndex={-1}
                    borderRadius="$full"
                    style={{ width: 60, height: 60 }}
                    source={{ uri: user.imageurl }}
                  />
                ) : (
                  <Image
                    alt='profilePic'
                    border
                    zIndex={-1}
                    borderRadius="$full"
                    style={{ width: 60, height: 60 }}
                    source={userimg}
                  />
                )}
                <Text size='4xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                  Welcome Back!
                </Text>
              </View>
            </ScrollView>
            <Divider backgroundColor='white' marginVertical={10} />
			
			{user.isbanned && <Box style={{ display: 'flex', gap: 20, marginVertical: '2%' }}>
  <Text style={{ alignSelf: 'center', fontSize: 24, color: 'white', fontFamily: 'Roboto_300Light' }}>
    Your Account Has Been Banned! 😢
  </Text>
  <Text style={{ alignSelf: 'flex-start', marginBottom: '1%', fontSize: 20, color: 'white', fontFamily: 'Roboto_300Light' }}>
     Please check your email for more info about your ban.
  </Text>
    <Button
                                    bg="rgba(81, 32, 149,1)"
									$active={{
                bg: "rgba(81, 32, 149,0.5)",
              }}
                                    onPress={async () => {
                                        try {
                                            const userToken = await AsyncStorage.getItem('userToken');
                                            const userId = await AsyncStorage.getItem('id');
                                            if (userToken) {
                                                let active;
                                                active = false;
                                                try {
                                                    // Check if the document already exists
                                                    const docRef = doc(database, 'status', userId);
                                                    const docSnapshot = await getDoc(docRef);

                                                    if (docSnapshot.exists()) {
                                                        // Update the existing document
                                                        let datetime = getCurrentDateTime();
                                                        await updateDoc(docRef, { active, datetime });
                                                    } else {
                                                        // If the document doesn't exist, create it
                                                      let datetime = getCurrentDateTime();
														await setDoc(docRef, { active, datetime });
                                                    }

                                                } catch (error) {
                                                    console.error('Error occurred while updating user status:', error);
                                                }
                                            }
											await AsyncStorage.removeItem('userToken');
                                            await AsyncStorage.removeItem('id');
											setLoggedIn(false);
                                            setLoginPage(true);
                                            setSignupPage(false);

                                        } catch (error) {
                                            console.error('Logout failed:', error);
                                        }
                                    }}
                                >
                                    <ButtonText>Logout</ButtonText>
                                </Button>
</Box>
}
            {userAlreadyVerified && !user.isbanned && <Box style={{ display: 'flex', gap: 20, marginVertical: '2%' }} >
              <Text alignSelf='center' size='xl' color='white' fontFamily='Roboto_300Light' >
                Ready to join a room?
              </Text>
              <Text alignSelf='flex-start' marginBottom={'1%'} size='xl' color='white' fontFamily='Roboto_300Light'>
                Pick some interests
              </Text>
              <View width={'100%'}>
                <Input
                  w={'$full'}
                  marginBottom={'4%'}
                  borderColor='white'
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                >
                  <InputField
                    value={query}
                    placeholder="Enter interests here"
                    color='white'
                    placeholderTextColor={"#ffffff50"}
                    onChangeText={(text) => {setQuery(text); setFocused(text==""?true:false)}}
                  />
                  <InputSlot onPress={() => setQuery('')}>
                    <InputIcon
                      padding={13}
                      marginRight={7}
                      as={query ? CloseIcon : null}
                      color="white"
                    />
                  </InputSlot>
                </Input>
                {query && (
                  <FlatList
                    keyboardShouldPersistTaps='handled'
                    style={{
                      position: 'absolute',
                      top: 60,
                      width: '100%',
                      zIndex: 100,
                      height: 'auto',
                      maxHeight: '150%',
                      marginTop: -20,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                      borderColor: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }}
                    showsVerticalScrollIndicator={false}
                    data={filteredData.filter((item) =>  item.toLowerCase().includes(query.toLowerCase()))}
                    renderItem={(props) => renderItem({ ...props, length: filteredData.filter((item) => item.toLowerCase().includes(query.toLowerCase())).length })}
                  />
                )}
                {focused && (
                  <FlatList
                    keyboardShouldPersistTaps='handled'
                    style={{
                      position: 'absolute',
                      top: 60,
                      width: '100%',
                      zIndex: 100,
                      height: 'auto',
                      maxHeight: '150%',
                      marginTop: -20,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                      borderColor: 'white',
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    }}
                    showsVerticalScrollIndicator={false}
                    data={filteredData.filter((item) =>  item.toLowerCase().includes(query.toLowerCase()))}
                    renderItem={(props) => renderItem({ ...props, length: filteredData.filter((item) => item.toLowerCase().includes(query.toLowerCase())).length })}
                  />
                )}
                {selectedItems.length > 0 ?
                  <FlatList
                    data={selectedItems}
                    renderItem={renderSelectedItems}
                    horizontal={true}
                    marginTop={-10}
                    showsHorizontalScrollIndicator={false}
                    keyboardShouldPersistTaps='handled'
                    fadingEdgeLength={100}
                  /> :
                  <View opacity={0}>
                    <View backgroundColor='#51209585' flexDirection='row' alignItems='center' justifyContent='center' padding={5} paddingHorizontal={7} margin={5} borderWidth={1} borderColor='white' borderRadius={50}>
                      <Text paddingHorizontal={5} size='md' color='white'>
                        ni
                      </Text>
                      <TouchableHighlight style={{ borderRadius: 40 }} underlayColor={'#ffffff50'}>
                        <MaterialCommunityIcons padding={1} name='close' size={20} color={'white'} />
                      </TouchableHighlight>
                    </View>
                  </View>
                }
              </View>

              <View alignItems='center' gap={10} style={{ marginTop: '-5%', marginBottom: '-2%' }}>
                <Text alignSelf='flex-start' size='xl' color='white' fontFamily='Roboto_300Light'>
                  Pick an age range
                </Text>
                <MultiSlider
                  sliderLength={300}
                  trackStyle={{ backgroundColor: "white" }}
                  selectedStyle={{ backgroundColor: '#512095' }}
                  values={ageRange}
                  isMarkersSeparated={true}
                  min={18}
                  max={60}
                  onValuesChangeFinish={setAgeRange}
                  showSteps={true}
                  showStepMarkers={true}
                  smoothSnapped={true}
                  customMarkerRight={(e) => {
                    return (
                      <Text backgroundColor='#51209585' paddingHorizontal={9} paddingVertical={7} borderRadius={'$full'} color='white'>{e.currentValue}</Text>
                    )
                  }}
                  customMarkerLeft={(e) => {
                    return (
                      <Text backgroundColor='#51209585' paddingHorizontal={9} paddingVertical={7} borderRadius={'$full'} color='white'>{e.currentValue}</Text>
                    )
                  }}
                />
              </View>

              <View gap={10}>
                <Text size='xl' color='white' fontFamily='Roboto_300Light'>
                  Pick a location
                </Text>
                <View alignItems='flex-start'>
                  <View justifyContent='center' alignItems='center' flexDirection='row' gap={20}>
                    <TouchableOpacity style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => { setLocation('local'); setBackgroundColorOption('local') }}
                    >
                      <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColoroption === 'local' ? 'white' : 'transparent'}>Local</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => { setLocation('global'); setBackgroundColorOption('global') }}
                    >
                      <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColoroption === 'global' ? 'white' : 'transparent'}>Global</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View gap={10}>
                <Text size='xl' color='white' fontFamily='Roboto_300Light'>
                  Pick a gender
                </Text>
                <View alignItems='flex-start'>
                  <View justifyContent='center' alignItems='center' flexDirection='row' gap={20}>
                    <TouchableOpacity style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => { setPreferedGender('both'); setBackGroundColorGender('both') }}
                    >
                      <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColorGender === 'both' ? 'white' : 'transparent'}>Both</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => { setPreferedGender('Male'); setBackGroundColorGender('Male') }}
                    >
                      <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColorGender === 'Male' ? 'white' : 'transparent'}>Male</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                      onPress={() => { setPreferedGender('Female'); setBackGroundColorGender('Female') }}
                    >
                      <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColorGender === 'Female' ? 'white' : 'transparent'}>Female</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <Button
                isDisabled={attemptingJoinRoom}
                size="lg"
                mb="$4"
                borderRadius={40}
                hardShadow='1'
                bgColor="#512095"
                $active={{
                  bg: "#51209595",
                }}
                onPress={joinRoom}
              >
                <ButtonText fontSize="$xl" fontWeight="$medium" >
                  Jump In
                </ButtonText>
              </Button>
            </Box>}
            {userHasAnIdVerificationRequest && !userAlreadyVerified && !user.isbanned && <View alignItems='center' justifyContent='center' margin={10} marginTop={'20%'}>
              <Text size='xl' color='white' textAlign='center' fontFamily='Roboto_400Regular'>
                You're ID verification request is being processed...
              </Text>
            </View>}
            {!userHasAnIdVerificationRequest && !userAlreadyVerified && !user.isbanned &&
              <View w={'$full'} margin={50}>
                <Text size='xl' color='white' textAlign='center' fontFamily='Roboto_400Regular'>
                  You need to be verified in order to join rooms.
                </Text>
                <Box style={{ display: 'flex', gap: 20, marginVertical: 20 }} h={'$96'}>
                  <Button
                    size="lg"
                    mb="$4"
                    borderRadius={40}
                    hardShadow='1'
                    bgColor="#512095"
                    $active={{
                      bg: "#51209595",
                    }}
                    onPress={() => navigation.navigate('HomeVerification')}
                  >
                    <ButtonText fontSize="$xl" fontWeight="$medium" >
                      Get Verified
                    </ButtonText>
                  </Button>
                </Box>
              </View>}
          </View>
        </Animatable.View>
      </TouchableWithoutFeedback>
    </ImageBackground>
  )
}

export default Home
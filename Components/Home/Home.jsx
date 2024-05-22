import { Box, Button, ButtonText, Center, CloseIcon, Divider, FlatList, HStack, Image, ImageBackground, Input, InputField, InputSlot, ScrollView, Spinner, Switch, Text, ToastTitle, VStack, View, useToast } from '@gluestack-ui/themed'
import { useFonts } from 'expo-font';
import React, { useContext, useEffect, useState } from 'react'
import * as Animatable from 'react-native-animatable';
import Autocomplete from 'react-native-autocomplete-input';
import userimg from '../../assets/img/user.png'
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
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../Config';
import { Keyboard, StyleSheet, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { InputIcon } from '@gluestack-ui/themed';
import { Scroll } from '@react-three/drei';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Toast } from '@gluestack-ui/themed';
import { ToastDescription } from '@gluestack-ui/themed';
import { Pressable } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';
import { RequestContext } from './RequestProvider';

const Home = ({navigation}) => {

    const toast = useToast()

    const [changingPage, setChangingPage] = useState(false)
    const [user, setUser] = useState();
    const [rankName, setRankName] = useState();
    const [leaderboardnumber, setLeaderboardnumber] = useState();
    const [roomCount, setRoomCount] = useState();
    const [ageRange, setAgeRange] = useState([18,40])

    const data = ['Apple', 'Banana', 'Orange', 'Grapes', 'Pineapple', 'James', 'Tech'];
    
    const [query, setQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [filteredData, setFilteredData] = useState(data);

    const [location,setLocation]=useState('local');
    const [backgroundColoroption,setBackgroundColorOption]=useState('local')

    const [preferedGender, setPreferedGender] = useState("both")
    const [backgroundColorGender, setBackGroundColorGender] = useState("both")

    const [attemptingJoinRoom, setAttemptingJoinRoom] = useState(false);

    const { requestID, setRequestID } = useContext(RequestContext);

    const handleSelect = (item) => {
        setSelectedItems([...selectedItems, item]);
        setFilteredData(filteredData.filter((dataItem) => dataItem !== item));
        setQuery('');
        console.log(selectedItems)
    };

    const renderSuggestion = ({ item }) => (
        <TouchableOpacity onPress={() => handleSelect(item)}>
        <Text style={styles.suggestion}>{item}</Text>
        </TouchableOpacity>
    );

    async function fetchData(){
        try {
             const data = await AsyncStorage.getItem('id')
             const response = await api.get(`/settings/getinsight/${data}`);
             // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
             setUser(response.data.user);
             setRankName(response.data.rankname);
             setLeaderboardnumber(response.data.leaderboardnumber);
             setRoomCount(response.data.roomCount)
            //  console.log(response.data.user)
         } catch (error) {
             console.log(error)
         }
     }
    const isFocused = useIsFocused();
    useEffect(() => {
        fetchData();
    }, [!user||isFocused]);

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory)
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

    const renderItem = ({item, index, length}) =>{
        // borderBottomLeftRadius={index==length-1?20:0}
        return(
            <TouchableHighlight onPress={() => handleSelect(item)} underlayColor={'#ffffff50'} style={{  borderBottomRightRadius:index==length-1?20:0, borderBottomLeftRadius:index==length-1?20:0 }} >
                <Text padding={15} backgroundColor={'white'} borderBottomRightRadius={index==length-1?20:0} borderBottomLeftRadius={index==length-1?20:0} color='black'>
                    {item}
                </Text>
            </TouchableHighlight>
            
        )
    }

    const handleDeleteItem = (item) => {
        setSelectedItems(selectedItems.filter((dataItem) => dataItem !== item))
        setFilteredData([...filteredData, item])
    }

    const renderSelectedItems = ({item, index}) => {
        // {selectedItems&&selectedItems.length>0&&selectedItems.map((item,index)=>{
        //     console.log(item)
            return(
                <View backgroundColor='#51209585' flexDirection='row' alignItems='center' justifyContent='center' padding={5} paddingHorizontal={7} margin={5} borderWidth={1} borderColor='white' borderRadius={50}>
                    <Text paddingHorizontal={5} size='md' color='white' key={index}>
                        {item}
                    </Text>
                    <TouchableHighlight style={{ borderRadius:40 }} underlayColor={'#ffffff50'} onPress={()=>handleDeleteItem(item)}>
                        <MaterialCommunityIcons padding={1} name='close' size={20} color={'white'}/>
                    </TouchableHighlight>
                </View>
                
            )
        // })}
    }

    const joinRoom = async () =>{
      setAttemptingJoinRoom(true);
      try {
        const data = {
          userid: await AsyncStorage.getItem('id'),
          intrests: selectedItems,
          maximumAge: ageRange[1],
          minimumAge: ageRange[0],
          gender: preferedGender,
          country: location=='local'?user.country:'global'
        }

        const response = await api.post(`/home/addrequest`, data);
        setRequestID(response.data.data)

        if(response){
          navigation.push('MatchMakingScreen');
          setAttemptingJoinRoom(false);
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

    if (!fontsLoaded||!user) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <Center h={'$full'}>
                    <HStack space="sm" justifyContent='center' alignItems='center'>
                        <Text  color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
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
<TouchableWithoutFeedback onPress={ () => { Keyboard.dismiss() } }>
  <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
    <View margin={30} marginTop={40} justifyContent='center' alignItems='center'>
      <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false}>
        <View gap={10} display='flex' flexDirection='row'>
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
      <Box style={{ display: 'flex', gap: 20, marginVertical: 20 }} h={'$96'}>
        <Text alignSelf='center' size='xl' color='white' fontFamily='Roboto_300Light'>
          Ready to join a room?
        </Text>
        <Text alignSelf='flex-start' marginBottom={-20} size='xl' color='white' fontFamily='Roboto_300Light'>
            Pick some interests
          </Text>
        <View width={'100%'}>
          <Input
            w={'$full'}
            marginVertical={20}
            borderColor='white'
          >
            <InputField
              value={query}
              placeholder="Enter interests here"
              color='white'
              placeholderTextColor={"#ffffff50"}
              onChangeText={(text) => setQuery(text)}
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
                top: 80, // Adjust this value to position the FlatList as needed
                width: '100%',
                zIndex: 100,
                height: 'auto',
                maxHeight: '150%',
                marginTop: -20,
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                borderColor: 'white',
                backgroundColor: 'rgba(0, 0, 0, 0.8)', // Adjust the background color as needed
              }}
              showsVerticalScrollIndicator={false}
              data={filteredData.filter((item) => item.toLowerCase().includes(query.toLowerCase()))}
              renderItem={(props) => renderItem({ ...props, length: filteredData.filter((item) => item.toLowerCase().includes(query.toLowerCase())).length })}
            />
          )}
          {selectedItems.length>0?
          <FlatList
            data={selectedItems}
            renderItem={renderSelectedItems}
            horizontal={true}
            marginTop={-10}
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'
            fadingEdgeLength={100}
        />:
        <View marginTop={-10} opacity={0}>
          <View backgroundColor='#51209585' flexDirection='row' alignItems='center' justifyContent='center' padding={5} paddingHorizontal={7} margin={5} borderWidth={1} borderColor='white' borderRadius={50}>
              <Text paddingHorizontal={5} size='md' color='white'>
                  ni
              </Text>
              <TouchableHighlight style={{ borderRadius:40 }} underlayColor={'#ffffff50'}>
                  <MaterialCommunityIcons padding={1} name='close' size={20} color={'white'}/>
              </TouchableHighlight>
          </View>
        </View>
        }
        </View>

        <View alignItems='center' gap={10}>
          <Text alignSelf='flex-start' size='xl' color='white' fontFamily='Roboto_300Light'>
            Pick an age range
          </Text>
          <MultiSlider
          sliderLength={300}
          trackStyle={{ backgroundColor:"white" }}
          selectedStyle={{  backgroundColor: '#512095' }}
          values={ageRange}
            isMarkersSeparated={true}
            min={18}
            max={40}
            onValuesChangeFinish={setAgeRange}
            showSteps={true}
            showStepMarkers={true}
            smoothSnapped={true}
            customMarkerRight={(e)=>{
              return(
                <Text backgroundColor='#51209585' paddingHorizontal={9} paddingVertical={7} borderRadius={'$full'} color='white'>{e.currentValue}</Text>
              )
            }}
            customMarkerLeft={(e)=>{
              return(
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
              <TouchableOpacity style={{textAlign:'center',alignItems:'center',justifyContent:'center'}}
                  onPress={()=>{setLocation('local'); setBackgroundColorOption('local')}}
              >
                  <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColoroption==='local'?'white':'transparent'}>Local</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{textAlign:'center',alignItems:'center',justifyContent:'center'}}
                    onPress={()=>{setLocation('global'); setBackgroundColorOption('global')}}
              >
                  <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColoroption==='global'?'white':'transparent'}>Global</Text>
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
              <TouchableOpacity style={{textAlign:'center',alignItems:'center',justifyContent:'center'}}
                  onPress={()=>{setPreferedGender('both'); setBackGroundColorGender('both')}}
              >
                  <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColorGender==='both'?'white':'transparent'}>Both</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{textAlign:'center',alignItems:'center',justifyContent:'center'}}
                    onPress={()=>{setPreferedGender('Male'); setBackGroundColorGender('Male')}}
              >
                  <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColorGender==='Male'?'white':'transparent'}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{textAlign:'center',alignItems:'center',justifyContent:'center'}}
                    onPress={()=>{setPreferedGender('Female'); setBackGroundColorGender('Female')}}
              >
                  <Text textAlign='center' size='lg' color='white' fontFamily='Roboto_300Light' borderWidth={2} borderRadius={30} paddingHorizontal={20} paddingVertical={5} borderColor={backgroundColorGender==='Female'?'white':'transparent'}>Female</Text>
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
          <ButtonText fontSize="$xl" fontWeight="$medium">
            Jump In
          </ButtonText>
        </Button>
      </Box>
    </View>
  </Animatable.View>
  </TouchableWithoutFeedback>
</ImageBackground>

  )
}

export default Home
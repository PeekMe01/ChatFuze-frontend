import React from 'react'
import { useState ,useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import api from '../Config'
import userimg from '../../assets/img/user.png'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AntDesign } from '@expo/vector-icons';
import {  ScrollView, TouchableHighlight,TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import { AlertCircleIcon,Image, Box,HStack, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, ToastDescription, ToastTitle, VStack, View, Spinner } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Messages = ({navigation }) => {
    const [friendsuser,setfriendsuser]=useState([]);
    const [loading,setIsLoading]=useState(true)
 

    useEffect(() => {
        const fetchData = async () => {
          try {
            const userId = await AsyncStorage.getItem('id');
            const response = await api.get(`/messages/friends/${userId}`);
            setfriendsuser(response.data);
            setIsLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        const unsubscribe = navigation.addListener('focus', () => {
          fetchData(); 
        });
      
        return unsubscribe;
      }, [navigation]);
    const renderItem = ({ item, index }) => {
          return (
            <TouchableOpacity key={index} style={{ flexDirection: 'row', alignItems:'flex-end', padding: 10,borderBottomWidth:1,borderColor:'white'}}
            onPress={()=>{  navigation.push('Chat', { 
            user: item,
        });}}
             >
            {item.imageurl?<Text>profile image</Text>:<Image source={userimg} alt='' style={{ borderRadius: 40 }} />}
              <View style={{ flexDirection: 'column', paddingHorizontal: 20, flex: 1, padding: 10, borderRadius: 30}}>
              <Text size='2xl' color='white' fontWeight='$bold' fontFamily='ArialRoundedMTBold' paddingTop={10}>
                    {item.username}
                </Text>
                <Text fontWeight='$bold' fontFamily='ArialRoundedMTBold'  style={{ color: '#2cd6d3' }}>{item.active===true?'Online':'Offline'}</Text>
              </View>
              <AntDesign style={{alignSelf:'center'}} name="arrowright" size={24} color="white" />
            </TouchableOpacity>
          );
      };


    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory)
    });
    const [changingPage, setChangingPage] = useState(false)
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                    <HStack space="sm">
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
            </ImageBackground>
        ) 
    }
    if(loading){
        
            return (
                <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',marginTop:10 }}>
                    <ActivityIndicator size="large" color="purple" />
                    <Text>Loading...</Text>
                </View>
                </ImageBackground>
            );
        
    }
    else{
  return (
    <ImageBackground
    source={require('../../assets/img/HomePage1.png')}
    style={{ flex:1 ,resizeMode: 'cover'}}
>
    <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
        <View margin={30}>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false} style={{marginBottom:70}}>
                <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={10}>
                    Messages
                </Text>
            </ScrollView>
            
              {friendsuser.length>=1? <FlatList style={{height:550}}
                    data={friendsuser}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    fadingEdgeLength={100}
                /> :<>
                <Text size='2xl' color='white' fontWeight='$bold' fontFamily='ArialRoundedMTBold' style={{textAlign:'center' }}>No Friends Available!</Text>
                </>}
                   
        </View>
    </Animatable.View>
</ImageBackground>
  )
  }
}

export default Messages
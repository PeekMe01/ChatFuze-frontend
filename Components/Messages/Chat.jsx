import React, { useRef } from 'react'
import { useState ,useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import api from '../Config'
import userimg from '../../assets/img/user.png'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

import {  ScrollView, TextInput,TouchableHighlight,TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import { AlertCircleIcon,Image, Box,HStack, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, ToastDescription, ToastTitle, VStack, View, Spinner } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Chat = ({navigation,route}) => {
    const flatListRef = useRef(null);
    const scrollToEnd = () => {
        flatListRef.current.scrollToEnd({ animated: true });
      };
    const { user } = route.params;
    const[userid,setuserid]=useState();
    const [messages,setmessages]=useState([])
    const[textmsg,settextmsg]=useState('');
    const [loading,setIsLoading]=useState(true)
    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory)
    });

    useEffect(()=>{
        const fetchData = async () => {
            try {
                const userId = await AsyncStorage.getItem('id');
                setuserid(userId);
                const response = await api.get(`/messages/friendss/${userId}/${user.idusers}`);
                setmessages(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    },[])

    const renderItem = ({ item, index }) => {
        const textStyle = {
            color: item.senderid === user.idusers ? 'black' : 'white',
            textAlign: item.senderid === user.idusers ? 'left' : 'right',
        };
    
        return (
            <View style={{ marginBottom: 20 }}>
                {item.senderid === user.idusers ? (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 20, marginRight: 5 }}>
                            <Text style={textStyle}>{item.message}</Text>
                        </View>
                        <View style={{ flex: 1 }} /> 
                    </View>
                ) : (
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <View style={{ flex: 1 }} /> 
                        <View style={{ backgroundColor: 'gray', padding: 10, borderRadius: 20, marginLeft: 5 }}>
                            <Text style={textStyle}>{item.message}</Text>
                        </View>
                    </View>
                )}
            </View>
        );
    };
    
    
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
        <View margin={20}>
                 <View style={{marginVertical:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                        <View style={{flexDirection:'row',alignItems:'flex-end' ,columnGap:10}}>
                        <AntDesign name="arrowleft" size={30} color="white" style={{alignSelf:'center'}} onPress={()=>navigation.goBack()}/>
                        {user.imageurl?<Text>profile image</Text>:<Image source={userimg} alt='' style={{ borderRadius: 50,width:60,height:60 }} />}
                            <TouchableOpacity style={{paddingRight:50}} onPress={()=>{
                                 navigation.push('ProfileMessages', { 
                                                    user: user,
                                                    userid:userid
                                                });
                            }}>
                            <Text size='2xl' color='white'   fontFamily='ArialRoundedMTBold' paddingTop={10}>
                                {user.username}
                            </Text>
                                <Text  fontFamily='ArialRoundedMTBold'  style={{ color: '#2cd6d3',fontSize:15}}>{user.active===true?'online':'offline'}</Text>
              
                            </TouchableOpacity>
                        </View>
                        <View style={{flexDirection:'row',columnGap:20}}>
                        <Ionicons name="call" size={24} color="white" />
                        <FontAwesome name="video-camera" size={24} color="white" />
                        </View>

                 </View>
                 
                 <FlatList style={{height:620,marginVertical:20}}
                    data={messages}
                    ref={flatListRef}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    fadingEdgeLength={100}
                    onLayout={() => {
        setTimeout(() => {
            flatListRef.current.scrollToEnd({ animated: true });
        }, 100);
    }}
                />
                <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'}}>
                 <TextInput   
                        style={{
                            borderWidth: 1,
                            borderTopColor: 'gray',
                            borderBottomColor: 'gray',
                            borderLeftColor: 'gray',
                            backgroundColor:'gray',
                            borderTopLeftRadius: 20,
                            borderRightColor: 'white',
                            borderBottomLeftRadius: 20, 
                            paddingHorizontal: 20,
                            paddingVertical:10,
                            marginBottom: 10,
                            color:'white',
                            fontSize:15,
                            width:'85%'
                        }}
                        placeholder="Message ..."
                        placeholderTextColor="white"
                        value={textmsg}
                        onChangeText={(text) => settextmsg(text)}
                        />
                        <FontAwesome name="send" size={30} color="white"  style={{backgroundColor:'gray',borderColor: 'gray',padding:10,borderTopRightRadius: 20,borderBottomRightRadius: 20}}
                          onPress={() => {  
                                        setmessages([...messages, textmsg]); 
                                        settextmsg(''); 
                                            }}
                        />
                </View>
        </View>
    </Animatable.View>
</ImageBackground>
  )
}
}

export default Chat
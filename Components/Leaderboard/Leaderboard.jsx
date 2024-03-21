import React from 'react'
import { useState ,useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import axios from 'axios';
import API_URL from '../Config'
import {  ScrollView, TouchableHighlight,TouchableOpacity,FlatList } from 'react-native';
import { AlertCircleIcon,Image, Box,HStack, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, ToastDescription, ToastTitle, VStack, View } from '@gluestack-ui/themed';
const Leaderboard = () => {
    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory)
    });
    const [option,setOption]=useState('Local');
    const [backgroundColoroption,setBackgroundColorOption]=useState('local')
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
    const renderItem = ({ item, index }) => {
        index=index+3;
          return (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10}}>
              <Text size='2xl' color='white'  fontWeight='$light' fontFamily='ArialRoundedMTBold'>{index + 1}</Text>
              <View style={{ marginLeft: 20, backgroundColor: '#F5F5F5', flexDirection: 'row', paddingHorizontal: 20, flex: 1, padding: 10, borderRadius: 30, justifyContent: 'space-between' }}>
                <Text style={{ color: '#727386' }}>{item.username}</Text>
                <Text style={{ color: '#2cd6d3' }}>{item.rankpoints} pts</Text>
              </View>
            </View>
          );
        
      };
      
    const Local=()=>{
        const [data, setData] = useState([]);
            const [topdata,setTopData]=useState([]);
            useEffect(() => {
                fetchData();
            }, []);
    
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/leaderboard/local/1`);
                    setTopData(response.data.slice(0,3));
                    setData(response.data.slice(3));
                    
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            
                return (
                    <View style={{height:530}}>
                    <View style={{flexDirection:'row',height:250,justifyContent:'center',gap:9,marginBottom:20}}>
                         
                        <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                            <Text color='white' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>2</Text>
                            <Image source={require('../../assets/img/rank2.png')} alt='' style={{borderRadius:40}}/>
                            {topdata.map((data,index) => (
                            <View key={data.id} style={{alignItems:'center'}}>
                            {index === 1 && (
                                            <>
                                                <Text style={{ color: 'white' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                                <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                            </>
                                        )}
                            </View>
                        ))} 
                        </View>
                        <View style={{justifyContent:'flex-start',alignItems:'center'}}>
                            <Text color='gold' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>1</Text>
                            <Image source={require('../../assets/img/rank1.jpeg')} alt='' style={{borderRadius:40}}/>
                            {topdata.map((data,index) => (
                            <View key={data.id} style={{alignItems:'center'}}>
                            {index === 0 && (
                                            <>
                                                <Text style={{ color: 'white' }} fontWeight='$light'  fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                                <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                            </>
                                        )}
                            </View>
                        ))} 
                        </View>
                        <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                            <Text color='white' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>3</Text>
                            <Image source={require('../../assets/img/rank3.png')} alt='' style={{borderRadius:40}}/>
                            {topdata.map((data,index) => (
                            <View key={data.id} style={{alignItems:'center'}}>
                            {index === 2 && (
                                            <>
                                                <Text style={{ color: 'white' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                                <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                            </>
                                        )}
                            </View>
                        ))} 
                        </View>
                    </View>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                );
        
    }
    const Global=()=>{
        const [data, setData] = useState([]);
        const [topdata,setTopData]=useState([]);
        useEffect(() => {
            fetchData();
        }, []);

        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_URL}/leaderboard/global`);
                setTopData(response.data.slice(0,3));
                setData(response.data.slice(3));
                
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        
            return (
                <View style={{height:530}}>
                <View style={{flexDirection:'row',height:250,justifyContent:'center',gap:9,marginBottom:20}}>
                     
                    <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                        <Text color='white' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>2</Text>
                        <Image source={require('../../assets/img/rank2.png')} alt='' style={{borderRadius:40}}/>
                        {topdata.map((data,index) => (
                        <View key={data.id} style={{alignItems:'center'}}>
                        {index === 1 && (
                                        <>
                                            <Text style={{ color: 'white' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                            <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                        </>
                                    )}
                        </View>
                    ))} 
                    </View>
                    <View style={{justifyContent:'flex-start',alignItems:'center'}}>
                        <Text color='gold' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>1</Text>
                        <Image source={require('../../assets/img/rank1.jpeg')} alt='' style={{borderRadius:40}}/>
                        {topdata.map((data,index) => (
                        <View key={data.id} style={{alignItems:'center'}}>
                        {index === 0 && (
                                        <>
                                            <Text style={{ color: 'white' }} fontWeight='$light'  fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                            <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                        </>
                                    )}
                        </View>
                    ))} 
                    </View>
                    <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                        <Text color='white' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>3</Text>
                        <Image source={require('../../assets/img/rank3.png')} alt='' style={{borderRadius:40}}/>
                        {topdata.map((data,index) => (
                        <View key={data.id} style={{alignItems:'center'}}>
                        {index === 2 && (
                                        <>
                                            <Text style={{ color: 'white' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                            <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                        </>
                                    )}
                        </View>
                    ))} 
                    </View>
                </View>
                    <FlatList
                        data={data}
                        renderItem={renderItem}
                        keyExtractor={item => item.id}
                    />
                </View>
            );
        }
        const Friends=()=>{
            const [data, setData] = useState([]);
            const [topdata,setTopData]=useState([]);
            useEffect(() => {
                fetchData();
            }, []);
    
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${API_URL}/leaderboard/friends/1`);
                    setTopData(response.data.slice(0,3));
                    setData(response.data.slice(3));
                    
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            
                return (
                    <View style={{height:530}}>
                    <View style={{flexDirection:'row',height:250,justifyContent:'center',gap:9,marginBottom:20}}>
                         
                        <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                            <Text color='white' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>2</Text>
                            <Image source={require('../../assets/img/rank2.png')} alt='' style={{borderRadius:40}}/>
                            {topdata.map((data,index) => (
                            <View key={data.id} style={{alignItems:'center'}}>
                            {index === 1 && (
                                            <>
                                                <Text style={{ color: 'white' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                                <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                            </>
                                        )}
                            </View>
                        ))} 
                        </View>
                        <View style={{justifyContent:'flex-start',alignItems:'center'}}>
                            <Text color='gold' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>1</Text>
                            <Image source={require('../../assets/img/rank1.jpeg')} alt='' style={{borderRadius:40}}/>
                            {topdata.map((data,index) => (
                            <View key={data.id} style={{alignItems:'center'}}>
                            {index === 0 && (
                                            <>
                                                <Text style={{ color: 'white' }} fontWeight='$light'  fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                                <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                            </>
                                        )}
                            </View>
                        ))} 
                        </View>
                        <View style={{justifyContent:'flex-end',alignItems:'center'}}>
                            <Text color='white' size='3xl' fontWeight='$light' fontFamily='ArialRoundedMTBold'>3</Text>
                            <Image source={require('../../assets/img/rank3.png')} alt='' style={{borderRadius:40}}/>
                            {topdata.map((data,index) => (
                            <View key={data.id} style={{alignItems:'center'}}>
                            {index === 2 && (
                                            <>
                                                <Text style={{ color: 'white' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.username}</Text>
                                                <Text style={{ color: '#2cd6d3' }} fontWeight='$light' fontFamily='ArialRoundedMTBold'>{data.rankpoints} pts</Text>
                                            </>
                                        )}
                            </View>
                        ))} 
                        </View>
                    </View>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={item => item.id}
                        />
                    </View>
                );
            }
  return (
    <ImageBackground
        source={require('../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        {/* <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}> */}
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} >
                <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' paddingTop={10}>
                    Leaderboard
                </Text>
            <View style={{flex:1,flexDirection:'row',marginTop:30,marginBottom:10,justifyContent:'space-between'}}>
                <TouchableOpacity style={{padding:20,backgroundColor:backgroundColoroption==='local'?'#bcbcbc':'#727386',borderRadius:10}}
                    onPress={()=>{setOption('local'); setBackgroundColorOption('local')}}
                >
                   <Text color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'> Local</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding:20,backgroundColor:backgroundColoroption==='global'?'#bcbcbc':'#727386',borderRadius:10}}
                     onPress={()=>{setOption('global'); setBackgroundColorOption('global')}}
                >
                   <Text color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'> Global</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{padding:20,backgroundColor:backgroundColoroption==='friends'?'#bcbcbc':'#727386',borderRadius:10}}
                     onPress={()=>{setOption('friends'); setBackgroundColorOption('friends')}}
                >
                   <Text color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'> Friends</Text>
                </TouchableOpacity>

            </View>
                </ScrollView>
                {option === "local" ? <Local/> : option === "global" ? <Global/> : <Friends/>}

            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

export default Leaderboard
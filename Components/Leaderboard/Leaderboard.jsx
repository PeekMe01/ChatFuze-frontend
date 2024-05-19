import React from 'react'
import { useState ,useEffect} from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import api from '../Config'
import {  ScrollView, TouchableHighlight,TouchableOpacity,FlatList,ActivityIndicator } from 'react-native';
import { AlertCircleIcon,Image, Box,HStack, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, ToastDescription, ToastTitle, VStack, View, Spinner } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const Leaderboard = () => {
    const isFocused = useIsFocused();
    const [user, setUser] = useState();

    async function fetchData(){
        try {
             const data = await AsyncStorage.getItem('id')
             const response = await api.get(`/settings/getinsight/${data}`);
             // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
             setUser(response.data.user);
         } catch (error) {
             console.log(error)
         }
     }
     
    useEffect(() => {
        fetchData();
    }, [!user]);

    const [fontsLoaded] = useFonts({
        'Roboto_300Light': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory)
    });
    const [option,setOption]=useState('local');
    const [backgroundColoroption,setBackgroundColorOption]=useState('local')
    const [changingPage, setChangingPage] = useState(false)
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <Center h={'$full'}>
                    <HStack space="sm">
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
                </Center>
            </ImageBackground>
        ) 
    }
    const renderItem = ({ item, index, length }) => {
        // index=index+3;
        // console.log(length)
        // console.log(index)
          return (
            // <View key={index} style={{ flexDirection: 'row', justifyContent:'space-between' ,alignItems: 'center', padding: 10}}>
            //   <Text size='3xl' width={'15%'} color={item.idusers==user.idusers?'#512095':'white'} style={{textAlign:'center'}} fontWeight='$light' fontFamily='Roboto_300Light'>{index + 1}</Text>
            //   <View style={{ marginLeft: 20, backgroundColor: '#F5F5F570', flexDirection: 'row', paddingHorizontal: 20, padding: 10, borderRadius: 30, justifyContent: 'space-between', width: '80%'}}>
            //     <Text color={item.idusers==user.idusers?'#512095':'#727386'} fontWeight={item.idusers==user.idusers?'bold':'$normal'}>{item.username}</Text>
            //     <Text color={item.idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={item.idusers==user.idusers?'bold':'$normal'}>{item.rankpoints} pts</Text>
            //   </View>
            // </View>
            <View height={'$16'}>
                <View borderBottomRightRadius={index==length-1?20:0} borderTopLeftRadius={index==0?20:0} borderBottomLeftRadius={index==length-1?20:0} borderTopRightRadius={index==0?20:0} key={index} height={'100%'} style={{ flexDirection: 'row', justifyContent:'space-between' ,alignItems: 'center'}} backgroundColor={item.idusers==user.idusers?'#FFFFFF50':'transparent'}>
                    <Text w={'$10'} textAlign='center' paddingHorizontal={10} color={item.idusers==user.idusers?'#512095':'white'} fontWeight={item.idusers==user.idusers?'bold':'$normal'}>{index+1}</Text>
                    <Image marginHorizontal={10} source={item.imageurl?item.imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40, width: 50, height: 50 }} />
                    <View flex={1}>
                        <Text color={item.idusers==user.idusers?'#512095':'white'} fontWeight={item.idusers==user.idusers?'bold':'$normal'}>{item.username}{item.idusers==user.idusers?' (You)':null}</Text>
                    </View>
                    <Text paddingHorizontal={10} color={item.idusers==user.idusers?'#512095':'white'} fontWeight={item.idusers==user.idusers?'bold':'$normal'}>{item.rankpoints} pts</Text>
                </View>

                <Divider backgroundColor='white'/>
            </View>
          );
      };
      
    const Local=()=>{
        const [data, setData] = useState([]);
            const [topdata,setTopData]=useState([]);
            const [isLoading, setIsLoading] = useState(true);
            useEffect(() => {
                fetchData();
            }, [isFocused]);
    
            const fetchData = async () => {
                try {
                    const userId = await AsyncStorage.getItem('id');
                    const response = await api.get(`/leaderboard/local/${userId}`);
                    // setTopData(response.data.slice(0,3));
                    setData(response.data);
                    setIsLoading(false);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            if (isLoading||!data||!user) {
                return (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Center h={'$96'}>
                            <HStack space="sm" justifyContent='center' alignItems='center'>
                                <Text  color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                            </HStack>
                        </Center>
                    </View>
                );
            }else
                return (
                //     <View style={{ height: '75%' }}>
                //      <View style={{flexDirection:'row',justifyContent:"center",gap:9,marginBottom:20}}>
                
                            
                //      {  
                //     topdata.length >=2 ? (
                //         <View style={{ justifyContent:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //         <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>2</Text>
                //         <Image source={topdata[1].imageurl?topdata[1].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //         {topdata.length >= 2 ? (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].username}</Text>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].rankpoints} pts</Text>
                //                 </View>
                //             ) : (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                 </View>
                //             )}
                //     </View>
                //     ):
                //     <View style={{ justifyContent:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //         <Text color={'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>2</Text>
                //         <Image source={require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //         {topdata.length >= 2 ? (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].username}</Text>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].rankpoints} pts</Text>
                //                 </View>
                //             ) : (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                 </View>
                //             )}
                //     </View>             
                        
                //     }
              
      
                
                //   <View style={{ justifyContent:'flex-start', alignItems: 'center',marginTop: -25  }} >
                //       <Text color='gold' size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>1</Text>
                //       <Image source={topdata[0].imageurl?topdata[0].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       <View style={{ alignItems: 'center' }}>
                //         <Text color={topdata[0].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[0].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[0].username}</Text>
                //         <Text color={topdata[0].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[0].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[0].rankpoints} pts</Text>
                //       </View>
                //   </View>
              
                //   {topdata.length >= 3 ?
                //   <View style={{ alignSelf:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>3</Text>
                //       <Image source={topdata[2].imageurl?topdata[2].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       {topdata.length >= 3 ? (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].username}</Text>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].rankpoints} pts</Text>
                //                   </View>
                //               ) : (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                   </View>
                //               )}
                //     </View>
                //     :
                //     <View style={{ alignSelf:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //       <Text color={'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>3</Text>
                //       <Image source={require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       {topdata.length >= 3 ? (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].username}</Text>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].rankpoints} pts</Text>
                //                   </View>
                //               ) : (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                   </View>
                //               )}
                //     </View>
                // }
              
      
                //     </View>
                //         <FlatList
                //             data={data}
                //             renderItem={renderItem}
                //             showsVerticalScrollIndicator={false}
                //             fadingEdgeLength={100}
                //         />
                //     </View>
                // );
                <FlatList
                    data={data}
                    renderItem={(props) => renderItem({ ...props, length: data.length })}
                    showsVerticalScrollIndicator={false}
                    fadingEdgeLength={100}
                    style={{ 
                        height: '75%',
                     }}
                />
            )
    }
    const Global=()=>{
        const [data, setData] = useState([]);
        // const [topdata,setTopData]=useState([]);
        const [isLoading, setIsLoading] = useState(true);
        useEffect(() => {
            fetchData();
        }, [isFocused]);

        const fetchData = async () => {
            try {
                const response = await api.get(`/leaderboard/global`);
                // setTopData(response.data.slice(0,3));
                setData(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (isLoading||!data||!user) {
            return (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Center h={'$96'}>
                        <HStack space="sm" justifyContent='center' alignItems='center'>
                            <Text  color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                        </HStack>
                    </Center>
                </View>
            );
        }
            return (
                // <View style={{ height: '75%' }}>
                //  <View style={{flexDirection:'row',justifyContent:"center",gap:9,marginBottom:20}}>
                
                           
                                  
                //  {  
                //     topdata.length >=2 ? (
                //         <View style={{ justifyContent:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //         <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} size='3xl' fontFamily='Roboto_300Light'>2</Text>
                //         <Image source={topdata[1].imageurl?topdata[1].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //         {topdata.length >= 2 ? (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].username}</Text>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].rankpoints} pts</Text>
                //                 </View>
                //             ) : (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                 </View>
                //             )}
                //     </View>
                //     ):
                //     <View style={{ justifyContent:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //         <Text color={'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>2</Text>
                //         <Image source={topdata[1].imageurl?topdata[1].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //         {topdata.length >= 2 ? (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].username}</Text>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].rankpoints} pts</Text>
                //                 </View>
                //             ) : (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                 </View>
                //             )}
                //     </View>             
                        
                //     }
              
      
                
                //   <View style={{ justifyContent:'flex-start', alignItems: 'center',marginTop: -25  }} >
                //       <Text color='gold' size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>1</Text>
                //       <Image source={topdata[0].imageurl?topdata[0].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       <View style={{ alignItems: 'center' }}>
                //         <Text color={topdata[0].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[0].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[0].username}</Text>
                //         <Text color={topdata[0].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[0].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[0].rankpoints} pts</Text>
                //       </View>
                //   </View>
              
                //   {topdata.length >= 3 ?
                //   <View style={{ alignSelf:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>3</Text>
                //       <Image source={topdata[2].imageurl?topdata[2].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       {topdata.length >= 3 ? (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].username}</Text>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].rankpoints} pts</Text>
                //                   </View>
                //               ) : (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                   </View>
                //               )}
                //     </View>
                //     :
                //     <View style={{ alignSelf:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //       <Text color={'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>3</Text>
                //       <Image source={require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       {topdata.length >= 3 ? (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].username}</Text>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].rankpoints} pts</Text>
                //                   </View>
                //               ) : (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                   </View>
                //               )}
                //     </View>
                // }
              
      
                // </View>
                //     <FlatList
                //         data={data}
                //         renderItem={renderItem}
                //         showsVerticalScrollIndicator={false}
                //         fadingEdgeLength={100}
                //     />
                // </View>

                <FlatList
                    data={data}
                    renderItem={(props) => renderItem({ ...props, length: data.length })}
                    showsVerticalScrollIndicator={false}
                    fadingEdgeLength={100}
                    style={{ 
                        height: '75%',
                     }}
                />
            );
        }
        const Friends=()=>{
            const [data, setData] = useState([]);
            const [topdata,setTopData]=useState([]);
            const [isLoading, setIsLoading] = useState(true);
            useEffect(() => {
                fetchData();
            }, [isFocused]);
    
            const fetchData = async () => {
                try {
                    const userId = await AsyncStorage.getItem('id');
                    const response = await api.get(`/leaderboard/friends/${userId}`);
                    // setTopData(response.data.slice(0,3));
                    setData(response.data);
                    setIsLoading(false)
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };
            if (isLoading||!data||!user) {
                return (
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Center h={'$96'}>
                            <HStack space="sm" justifyContent='center' alignItems='center'>
                                <Text  color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                            </HStack>
                        </Center>
                    </View>
                );
            }
                return (
                //     <View style={{ height: '75%' }}>
                //     <View style={{flexDirection:'row',justifyContent:"center",gap:9,marginBottom:20}}>
                
                //     {  
                //     topdata.length >=2 ? (
                //         <View style={{ justifyContent:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //         <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>2</Text>
                //         <Image source={topdata[1].imageurl?topdata[1].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //         {topdata.length >= 2 ? (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].username}</Text>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].rankpoints} pts</Text>
                //                 </View>
                //             ) : (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                 </View>
                //             )}
                //     </View>
                //     ):
                //     <View style={{ justifyContent:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //         <Text color={'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>2</Text>
                //         <Image source={require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //         {topdata.length >= 2 ? (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].username}</Text>
                //                     <Text color={topdata[1].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[1].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[1].rankpoints} pts</Text>
                //                 </View>
                //             ) : (
                //                 <View style={{ alignItems: 'center' }}>
                //                     <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                 </View>
                //             )}
                //     </View>             
                        
                //     }
              
      
                
                //   <View style={{ justifyContent:'flex-start', alignItems: 'center',marginTop: -25  }} >
                //       <Text color='gold' size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>1</Text>
                //       <Image source={topdata[0].imageurl?topdata[0].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       <View style={{ alignItems: 'center' }}>
                //         <Text color={topdata[0].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[0].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[0].username}</Text>
                //         <Text color={topdata[0].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[0].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[0].rankpoints} pts</Text>
                //       </View>
                //   </View>
              
                //   {topdata.length >= 3 ?
                //   <View style={{ alignSelf:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>3</Text>
                //       <Image source={topdata[2].imageurl?topdata[2].imageurl:require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       {topdata.length >= 3 ? (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].username}</Text>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].rankpoints} pts</Text>
                //                   </View>
                //               ) : (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                   </View>
                //               )}
                //     </View>
                //     :
                //     <View style={{ alignSelf:'flex-end', alignItems: 'center', marginTop: 30 }} >
                //       <Text color={'white'} size='3xl' fontWeight='$light' fontFamily='Roboto_300Light'>3</Text>
                //       <Image source={require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40 }} />
                //       {topdata.length >= 3 ? (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'white'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].username}</Text>
                //                       <Text color={topdata[2].idusers==user.idusers?'#512095':'#2cd6d3'} fontWeight={topdata[2].idusers==user.idusers?'bold':'$light'} fontFamily='Roboto_300Light'>{topdata[2].rankpoints} pts</Text>
                //                   </View>
                //               ) : (
                //                   <View style={{ alignItems: 'center' }}>
                //                       <Text style={{ color: 'red' }} fontWeight='$light' fontFamily='Roboto_300Light'>Not Available</Text>
                //                   </View>
                //               )}
                //     </View>
                // }
                                
                        
                //     </View>
                //         <FlatList
                //             data={data}
                //             renderItem={renderItem}
                //             showsVerticalScrollIndicator={false}
                //             fadingEdgeLength={100}
                //         />
                //     </View>

                    <FlatList
                        data={data}
                        renderItem={(props) => renderItem({ ...props, length: data.length })}
                        showsVerticalScrollIndicator={false}
                        fadingEdgeLength={100}
                        style={{ 
                            height: '75%',
                        }}
                    />
                );
            }
  return (
    <ImageBackground
        source={require('../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        {/* <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}> */}
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30}>
                <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                <Text size='4xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                    Leaderboard
                </Text>
            <View style={{flex:1,flexDirection:'row',marginTop:30,marginBottom:10,justifyContent:'space-between'}}>
                <TouchableOpacity style={{paddingVertical:10,paddingHorizontal:20,textAlign:'center',alignItems:'center',justifyContent:'center',borderRadius:10}}
                    onPress={()=>{setOption('local'); setBackgroundColorOption('local')}}
                >
                   <Text size='lg' color='white' fontFamily='Roboto_400Regular' borderBottomWidth={2} paddingHorizontal={10} paddingBottom={5} borderBottomColor={backgroundColoroption==='local'?'white':'transparent'}>Local</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{paddingVertical:10,paddingHorizontal:20,borderRadius:10}}
                     onPress={()=>{setOption('global'); setBackgroundColorOption('global')}}
                >
                   <Text size='lg' color='white' fontFamily='Roboto_400Regular' borderBottomWidth={2} paddingHorizontal={10} paddingBottom={5} borderBottomColor={backgroundColoroption==='global'?'white':'transparent'}>Global</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{paddingVertical:10,paddingHorizontal:20,borderRadius:10}}
                     onPress={()=>{setOption('friends'); setBackgroundColorOption('friends')}}
                >
                   <Text size='lg' color='white' fontFamily='Roboto_400Regular'  borderBottomWidth={2} paddingHorizontal={10} paddingBottom={5} borderBottomColor={backgroundColoroption==='friends'?'white':'transparent'}>Friends</Text>
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
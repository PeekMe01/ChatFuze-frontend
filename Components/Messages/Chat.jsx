// import React, { useRef } from 'react'
// import { useState ,useEffect} from 'react';
// import * as Animatable from 'react-native-animatable';
// import { useFonts } from 'expo-font';
// import api from '../Config'
// import userimg from '../../assets/img/user.png'
// import Icon from 'react-native-vector-icons/MaterialIcons';
// import { Ionicons } from '@expo/vector-icons';
// import { AntDesign } from '@expo/vector-icons';
// import { FontAwesome } from '@expo/vector-icons';
// import { Feather } from '@expo/vector-icons';

// import {  ScrollView, TextInput,TouchableHighlight,TouchableOpacity,FlatList,ActivityIndicator,KeyboardAvoidingView,Platform  } from 'react-native';
// import { AlertCircleIcon,Image, Box,HStack, Button, ButtonText, Center, Divider, EyeIcon, EyeOffIcon, FormControl, FormControlError, FormControlErrorIcon, FormControlErrorText, FormControlHelper, FormControlHelperText, FormControlLabel, FormControlLabelText, ImageBackground, Input, InputField, InputIcon, InputSlot, Text, ToastDescription, ToastTitle, VStack, View, Spinner } from '@gluestack-ui/themed';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { SafeAreaView } from 'react-native';
// const Chat = ({navigation,route}) => {
//     const [inputMessage, setInputMessage] = useState('');
//     const sendMessage = () => {
//         // Implement logic to send message
//         // Add the inputMessage to your messages array or send it via API
//         // Clear the input field after sending
//         setInputMessage('');
//     };

//     navigation.setOptions({ headerShown: true })
//     navigation.setOptions({
//         headerTransparent: true,
//         headerLeft: () => null, // Remove the default back button
//         headerTintColor: 'white',
//         headerTitle: () => (
//             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, width: '100%' }}>
//               <View style={{ flexDirection: 'row', alignItems: 'center', }}>
//                 <AntDesign name="arrowleft" size={30} color="white" onPress={() => navigation.goBack()} marginLeft={-20} />
//                 {user.imageurl ? <Text>profile image</Text> : <Image source={userimg} alt='' style={{ borderRadius: 50, width: 60, height: 60, marginLeft: 10 }} />}
//                 <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
//                   navigation.push('ProfileMessages', {
//                     user: user,
//                     userid: userid
//                   });
//                 }}>
//                   <Text size='2xl' color='white' fontFamily='ArialRoundedMTBold' paddingTop={10}>
//                     {user.username}
//                   </Text>
//                   <Text fontFamily='ArialRoundedMTBold' style={{ color: '#2cd6d3', fontSize: 15 }}>{user.active === true ? 'online' : 'offline'}</Text>
//                 </TouchableOpacity>
//               </View>
//               <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
//                 <Ionicons name="call" size={24} color="white" style={{ marginRight: 20 }} />
//                 <FontAwesome name="video-camera" size={24} color="white" />
//               </View>
//             </View>
//           ),
//       });
      
//     const flatListRef = useRef(null);
//     const scrollToEnd = () => {
//         flatListRef.current.scrollToEnd({ animated: true });
//       };
//     const { user } = route.params;
//     const[userid,setuserid]=useState();
//     const [messages,setmessages]=useState([])
//     const[textmsg,settextmsg]=useState('');
//     const [loading,setIsLoading]=useState(true)
//     const [fontsLoaded] = useFonts({
//         'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory)
//     });

//     useEffect(()=>{
//         const fetchData = async () => {
//             try {
//                 const userId = await AsyncStorage.getItem('id');
//                 setuserid(userId);
//                 const response = await api.get(`/messages/friendss/${userId}/${user.idusers}`);
//                 setmessages(response.data);
//                 setIsLoading(false)
//             } catch (error) {
//                 console.error('Error fetching data:', error);
//             }
//         };
//         fetchData();
//     },[])

//     const renderItem = ({ item, index }) => {
//         const textStyle = {
//             color: item.senderid === user.idusers ? 'black' : 'white',
//             textAlign: item.senderid === user.idusers ? 'left' : 'right',
//         };
    
//         return (
//             <View style={{ marginBottom: 20 }}>
//                 {item.senderid === user.idusers ? (
//                     <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
//                         <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 20, marginRight: 5 }}>
//                             <Text style={textStyle}>{item.message}</Text>
//                         </View>
//                         <View style={{ flex: 1 }} /> 
//                     </View>
//                 ) : (
//                     <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
//                         <View style={{ flex: 1 }} /> 
//                         <View style={{ backgroundColor: 'gray', padding: 10, borderRadius: 20, marginLeft: 5 }}>
//                             <Text style={textStyle}>{item.message}</Text>
//                         </View>
//                     </View>
//                 )}
//             </View>
//         );
//     };
    
    
//     const [changingPage, setChangingPage] = useState(false)
//     if (!fontsLoaded) {
//         return (
//             <ImageBackground
//                 source={require('../../assets/img/HomePage1.png')}
//                 style={{ flex:1 ,resizeMode: 'cover'}}
//             >
//                     <HStack space="sm">
//                         <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
//                     </HStack>
//             </ImageBackground>
//         ) 
//     }
//     if(loading){
        
//         return (
//             <ImageBackground
//             source={require('../../assets/img/HomePage1.png')}
//             style={{ flex:1 ,resizeMode: 'cover'}}
//         >
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',marginTop:10 }}>
//                 <ActivityIndicator size="large" color="purple" />
//                 <Text>Loading...</Text>
//             </View>
//             </ImageBackground>
//         );
    
// }
// else{
//   return (
//         <ImageBackground
//             source={require('../../assets/img/HomePage1.png')}
//             style={{ flex:1 ,resizeMode: 'cover'}}
//         >
//             <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}> 
//                 <View margin={20} paddingTop={90}>
//                     <FlatList
//                         data={messages}
//                         ref={flatListRef}
//                         style={{ height: '92%' }}
//                         renderItem={renderItem}
//                         showsVerticalScrollIndicator={false}
//                         fadingEdgeLength={100}
//                         onLayout={() => {
//                             setTimeout(() => {
//                                 flatListRef.current.scrollToEnd({ animated: false });
//                             }, 0);
//                         }}
//                     />
//                     <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'}}>
//                         <TextInput   
//                             style={{
//                                 borderWidth: 1,
//                                 borderTopColor: 'gray',
//                                 borderBottomColor: 'gray',
//                                 borderLeftColor: 'gray',
//                                 backgroundColor:'gray',
//                                 borderTopLeftRadius: 20,
//                                 borderRightColor: 'white',
//                                 borderBottomLeftRadius: 20, 
//                                 paddingHorizontal: 20,
//                                 paddingVertical:10,
//                                 marginBottom: 10,
//                                 color:'white',
//                                 fontSize:15,
//                                 width:'85%'
//                             }}
//                             placeholder="Message ..."
//                             placeholderTextColor="white"
//                             value={textmsg}
//                             onChangeText={(text) => settextmsg(text)}
//                             />
//                             <FontAwesome name="send" size={30} color="white"  style={{backgroundColor:'gray',borderColor: 'gray',padding:10,borderTopRightRadius: 20,borderBottomRightRadius: 20}}
//                                 onPress={() => {  
//                                             setmessages([...messages, textmsg]); 
//                                             settextmsg(''); 
//                                                 }}
//                             />
//                     </View>
//                 </View>
//             </Animatable.View>
//     </ImageBackground>
//   )
// }
// }

// export default Chat

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, ImageBackground, Text, View, Input, HStack, Spinner, Center } from "@gluestack-ui/themed";
import React, { useRef } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useState, useCallback, useEffect, useLayoutEffect } from 'react'
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import userimg from '../../assets/img/user.png'
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAvoidingView, Platform, TextInput } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, addDoc, orderBy, query, onSnapshot, where } from 'firebase/firestore';
import { database } from "../../config/firebase";

export default function Chat({navigation,route}) {
    const[loggedInUserID, setLoggedInUserID] = useState();

    // Get the safe area insets
    const insets = useSafeAreaInsets();

    // Get the height of the camera cutout
    const cameraCutoutHeight = insets.top;
    const { receivingUser } = route.params;

    const [messages, setMessages] = useState([])
    const headerHeight = useHeaderHeight();

    useEffect(()=>{
        getLoggedInUserId()
    }, [])

    getLoggedInUserId = async () => {
        const userId = await AsyncStorage.getItem('id');
        setLoggedInUserID(userId)
    }

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: true })
        navigation.setOptions({
            headerTransparent: true,
            headerLeft: () => null, // Remove the default back button
            headerTintColor: 'white',
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, width: '100%' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <AntDesign name="arrowleft" size={30} color="white" onPress={() => navigation.goBack()} marginLeft={-20} />
                    {receivingUser.imageurl ? <Text>profile image</Text> : <Image source={userimg} alt='' style={{ borderRadius: 50, width: 60, height: 60, marginLeft: 10 }} />}
                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => {
                      navigation.push('ProfileMessages', {
                        user: receivingUser,
                      });
                    }}>
                      <Text size='2xl' color='white' fontFamily='ArialRoundedMTBold' paddingTop={10}>
                        {receivingUser.username}
                      </Text>
                      <Text fontFamily='ArialRoundedMTBold' style={{ color: '#2cd6d3', fontSize: 15 }}>{receivingUser.active === true ? 'online' : 'offline'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 'auto' }}>
                    <Ionicons name="call" size={24} color="white" style={{ marginRight: 20 }} />
                    <FontAwesome name="video-camera" size={24} color="white" />
                  </View>
                </View>
              ),
          });
    })

    useEffect(() => {
        const collectionRef = collection(database, 'chats');

        const receivingUserId = receivingUser.idusers; // Example receiving user ID
        const currentUserID = loggedInUserID; // Example current user ID

        if(loggedInUserID){
            console.log(parseInt(receivingUserId))
            console.log(parseInt(currentUserID))
            // const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
            const q = query(
                collectionRef, 
                where('receivingUser', 'in', [parseInt(receivingUserId),parseInt(currentUserID)]), // Filter by receiving user
                where('user._id', 'in', [parseInt(receivingUserId),parseInt(currentUserID)]), // Filter by current user
                orderBy('createdAt', 'desc')
            );

            console.log(q)

            const unsubscribe = onSnapshot(q, snapshot => {
                console.log('snapshot');
                console.log("snap docs: " + snapshot.docs)
                setMessages(
                    snapshot.docs.map(doc => ({
                        _id: doc.id,
                        createdAt: doc.data().createdAt.toDate(),
                        text: doc.data().text,
                        user: doc.data().user
                    }))
                )
            })
            return () => unsubscribe();  
        }
    }, [loggedInUserID, receivingUser]);

    // useEffect(() => {
    //     setMessages([
    //       {
    //         _id: 1,
    //         text: 'Hello developer',
    //         createdAt: new Date(),
    //         user: {
    //           _id: 2,
    //           name: 'React Native',
    //         },
    //       },
          
    //     ])
    //   }, [])

      const onSend = useCallback((messages = []) => {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, messages),
        )
        const { _id, createdAt, text, user } = messages[0];
        console.log(user)
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user,
            receivingUser: receivingUser.idusers
        });
      }, [])

    // Create a ref for the FlatList inside GiftedChat
    const messageContainerRef = useRef(null); 
    // const textInputRef = useRef(null); 

    const flatList = messageContainerRef.current;
    // const input = textInputRef.current;
        // Check if the FlatList exists
    if (flatList) {
        // Change the style of the FlatList
        flatList.setNativeProps({
            style: {
                // backgroundColor: 'red',
                marginTop: headerHeight + cameraCutoutHeight,
                marginBottom: 30,
                paddingHorizontal: 10
                // Add more styles as needed
            },
            fadingEdgeLength: 100
        });
    };

    // if (input) {
    //     // Change the style of the FlatList
    //     input.setNativeProps({
    //         style: {
    //             backgroundColor: 'red',
    //             // marginTop: headerHeight + cameraCutoutHeight,
    //             // Add more styles as needed
    //         },
    //         fadingEdgeLength: 100
    //     });
    // };

    // useEffect(() => {
    //     changeFlatListStyle();
    // }, []);

    // // Function to change the style of the FlatList
    // const changeFlatListStyle = () => {
    //     // Access the current property of the ref to get the actual FlatList component
        
    //     }
    if(!loggedInUserID){
        return (
                <ImageBackground
                    source={require('../../assets/img/HomePage1.png')}
                    style={{ flex:1 ,resizeMode: 'cover'}}
                >
                    <Center flex={1}>
                        <HStack alignItems='center' gap={10}>
                            <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                        </HStack>
                    </Center>
                </ImageBackground>
            ) 
    }else{
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <View style={{ flex: 1 }}>
                    <GiftedChat
                        messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: parseInt(loggedInUserID),
                        }}
                        messageContainerRef={messageContainerRef}
                        renderAvatarOnTop={true}
                        // textInputRef={textInputRef}
                        // renderInputToolbar={() => {
                        //     return (
                        //         <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between', bottom: 20, paddingHorizontal: 20, alignSelf: 'center'}}>
                        //             <TextInput
                        //             style={{
                        //                     flex:1,
                        //                     borderWidth: 1,
                        //                     borderTopColor: 'gray',
                        //                     borderBottomColor: 'gray',
                        //                     borderLeftColor: 'gray',
                        //                     backgroundColor:'gray',
                        //                     borderTopLeftRadius: 20,
                        //                     borderRightColor: 'white',
                        //                     borderBottomLeftRadius: 20, 
                        //                     paddingHorizontal: 20,
                        //                     paddingVertical:10,
                        //                     marginBottom: 10,
                        //                     color:'white',
                        //                     fontSize:15,
                        //                 }}
                        //                 placeholder="Message ..."
                        //                 placeholderTextColor="white"
                        //             />
                        //             <FontAwesome name="send" size={30} color="white"  style={{backgroundColor:'gray',borderColor: 'gray',padding:10,borderTopRightRadius: 20,borderBottomRightRadius: 20}}
                        //                 onPress={() => {  
                        //                     // setmessages([...messages, textmsg]); 
                        //                     // settextmsg(''); 
                        //                     onSend()
                        //                 }}
                        //             />
                        //         </View>
                        //     )
                        // }}
                        // renderAvatar={(props) =>{
                        //     return <View></View>;
                        //   }}
                        renderAvatar = {null}
                    />
                    {
                        Platform.OS === 'android' && <KeyboardAvoidingView behavior="padding" />
                    }
                </View>
            </ImageBackground>
        )
    }
}
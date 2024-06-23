import React from 'react'
import { useState, useEffect } from 'react';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import api from '../Config'
import { ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Image, HStack, Center, Divider, ImageBackground, Text, View, Spinner, Box, Button, ButtonText } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from "../../config/firebase";

const Leaderboard = ({setLoggedIn, setLoginPage, setSignupPage}) => {
    const isFocused = useIsFocused();
    const [user, setUser] = useState();
    const [option, setOption] = useState('local');
    const [backgroundColoroption, setBackgroundColorOption] = useState('local')
    const [changingPage, setChangingPage] = useState(false)
    const [fontsLoaded] = useFonts({
        'Roboto_300Light': require('../../assets/fonts/ARLRDBD.ttf'),
    });
    async function fetchData() {
        try {
            const data = await AsyncStorage.getItem('id')
            const response = await api.get(`/settings/getinsight/${data}`);
            setUser(response.data.user);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [!user||isFocused]);

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

    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
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
        return (
            <View height={'$16'}>
                <View borderBottomRightRadius={index == length - 1 ? 20 : 0} borderTopLeftRadius={index == 0 ? 20 : 0} borderBottomLeftRadius={index == length - 1 ? 20 : 0} borderTopRightRadius={index == 0 ? 20 : 0} key={index} height={'100%'} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} backgroundColor={item.idusers == user.idusers ? '#FFFFFF50' : 'transparent'}>
                    <Text w={'$10'} textAlign='center' paddingHorizontal={10} color={item.idusers == user.idusers ? '#512095' : 'white'} fontWeight={item.idusers == user.idusers ? 'bold' : '$normal'}>{index + 1}</Text>
                    <Image marginHorizontal={10} source={item.imageurl ? item.imageurl : require('../../assets/img/user.png')} alt='' style={{ borderRadius: 40, width: 50, height: 50 }} />
                    <View flex={1}>
                        <Text color={item.idusers == user.idusers ? '#512095' : 'white'} fontWeight={item.idusers == user.idusers ? 'bold' : '$normal'}>{item.username}{item.idusers == user.idusers ? ' (You)' : null}</Text>
                    </View>
                    <Text paddingHorizontal={10} color={item.idusers == user.idusers ? '#512095' : 'white'} fontWeight={item.idusers == user.idusers ? 'bold' : '$normal'}>{item.rankpoints} pts</Text>
                </View>
                <Divider backgroundColor='white' />
            </View>
        );
    };

    const Local = () => {
        const [data, setData] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        useEffect(() => {
            fetchData();
        }, [isFocused]);

        const fetchData = async () => {
            try {
                const userId = await AsyncStorage.getItem('id');
                const response = await api.get(`/leaderboard/local/${userId}`);
                setData(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (isLoading || !data || !user) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Center h={'$96'}>
                        <HStack space="sm" justifyContent='center' alignItems='center'>
                            <Text color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                        </HStack>
                    </Center>
                </View>
            );
        } else
            return (
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
    const Global = () => {
        const [data, setData] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        useEffect(() => {
            fetchData();
        }, [isFocused]);

        const fetchData = async () => {
            try {
                const response = await api.get(`/leaderboard/global`);
                setData(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (isLoading || !data || !user) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Center h={'$96'}>
                        <HStack space="sm" justifyContent='center' alignItems='center'>
                            <Text color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                        </HStack>
                    </Center>
                </View>
            );
        }
        return (
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
    const Friends = () => {
        const [data, setData] = useState([]);
        const [isLoading, setIsLoading] = useState(true);
        useEffect(() => {
            fetchData();
        }, [isFocused]);

        const fetchData = async () => {
            try {
                const userId = await AsyncStorage.getItem('id');
                const response = await api.get(`/leaderboard/friends/${userId}`);
                setData(response.data);
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        if (isLoading || !data || !user) {
            return (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Center h={'$96'}>
                        <HStack space="sm" justifyContent='center' alignItems='center'>
                            <Text color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                        </HStack>
                    </Center>
                </View>
            );
        }
        return (

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

    if(user){
        if(user.isbanned){
            return(
                <ImageBackground
                    source={require('../../assets/img/HomePage1.png')}
                    style={{ flex: 1, resizeMode: 'cover' }}
                >
                    <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                        <View margin={30}>
                            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false} style={{ marginBottom: 0}}>
                                <Text size='4xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                                    Leaderboard
                                </Text>
                            </ScrollView>
                        </View>
                        <View justifyContent='center' alignItems='center'>
                            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false} >
                                <View gap={5} display='flex' flexDirection='row' >
                                <Box style={{ display: 'flex', gap: 20, marginVertical: '2%' }}>
                                <Text style={{ alignSelf: 'center', fontSize: 24, color: 'white', fontFamily: 'Roboto_300Light' }}>
                                    Your Account Has Been Banned!
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
                                </View>
                            </ScrollView>
                        </View>
                        
                        
                    </Animatable.View>
                </ImageBackground>
            )
        }
    }

    return (
        <ImageBackground
            source={require('../../assets/img/HomePage1.png')}
            style={{ flex: 1, resizeMode: 'cover' }}
        >
            <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500}>
                <View margin={30}>
                    <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false}>
                        <Text size='4xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                            Leaderboard
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', marginTop: 30, marginBottom: 10, justifyContent: 'space-between' }}>
                            <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 20, textAlign: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                                onPress={() => { setOption('local'); setBackgroundColorOption('local') }}
                            >
                                <Text size='lg' color='white' fontFamily='Roboto_400Regular' borderBottomWidth={2} paddingHorizontal={10} paddingBottom={5} borderBottomColor={backgroundColoroption === 'local' ? 'white' : 'transparent'}>Local</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }}
                                onPress={() => { setOption('global'); setBackgroundColorOption('global') }}
                            >
                                <Text size='lg' color='white' fontFamily='Roboto_400Regular' borderBottomWidth={2} paddingHorizontal={10} paddingBottom={5} borderBottomColor={backgroundColoroption === 'global' ? 'white' : 'transparent'}>Global</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10 }}
                                onPress={() => { setOption('friends'); setBackgroundColorOption('friends') }}
                            >
                                <Text size='lg' color='white' fontFamily='Roboto_400Regular' borderBottomWidth={2} paddingHorizontal={10} paddingBottom={5} borderBottomColor={backgroundColoroption === 'friends' ? 'white' : 'transparent'}>Friends</Text>
                            </TouchableOpacity>

                        </View>
                    </ScrollView>
                    {option === "local" ? <Local /> : option === "global" ? <Global /> : <Friends />}

                </View>
            </Animatable.View>
        </ImageBackground>
    )
}

export default Leaderboard
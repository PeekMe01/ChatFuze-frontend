import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, ButtonText, HStack, ImageBackground, Spinner } from '@gluestack-ui/themed'
import { Center } from '@gluestack-ui/themed'
import { Text } from '@gluestack-ui/themed'
import { View } from '@gluestack-ui/themed'
import { Animated, BackHandler, StyleSheet, TouchableHighlight, TouchableOpacity } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'
import { FontAwesome6 } from '@expo/vector-icons'
import { RequestContext } from './RequestProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../Config'
import { API_URL } from '../Config'
import io from 'socket.io-client';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { database } from "../../config/firebase";

const socket = io.connect(`${API_URL}`);

export default function MatchMakingScreen({navigation}) {
    const [attemptingCancel, setAttemptingCancel] = useState(false);
    const [dots, setDots] = useState('');
    const { requestID, setRequestID } = useContext(RequestContext);
    const { userId, setUserID } = useContext(RequestContext);
    const [foundMatch, setFoundMatch ] = useState(false);
    const [foundNoMatch, setFoundNoMatch ] = useState(false);
    useEffect(() => {
        const handleRoomCreated = async (data) => {
            if(data.userdid1==userId || data.userdid2==userId){
                console.log(data.userdid1==userId?data.userdid2:data.userdid1)
                setFoundMatch(true);
                socket.emit('roomCreated',data);
                try {
                    // Check if a room with the same roomID already exists
                    const roomQuery = query(
                        collection(database, 'rooms'),
                        where('roomID', '==', data.idmessages)
                    );
                    const roomQuerySnapshot = await getDocs(roomQuery);
                    if (roomQuerySnapshot.empty) {
                        // If room doesn't exist, create a new document
                        await addDoc(collection(database, 'rooms'), {
                            user1ID: data.userdid1,
                            user2ID: data.userdid2,
                            roomID: data.idmessages,
                            roomStatus: true
                        });
                        console.log('Room created in Firestore');
                    } else {
                        console.log('Room already exists in Firestore');
                    }
                } catch (error) {
                    console.log(error)
                }
                setTimeout(() => {
                    navigation.push("ChatRoom", {
                        receiverID: data.userdid1==userId?data.userdid2:data.userdid1,
                        roomID: data.idmessages,
                        startingTime: data.createdAt
                    });
                }, 2000); 
            }
        };

        // const handleRoomClosed = (data) => {
        //     if(data.idmessages==id)
        //         console.log('Room closed', data);
        // };
        socket.on('roomCreated', handleRoomCreated);
        // socket.on('roomClosed', handleRoomClosed);

        return () => {
            socket.off('roomCreated', handleRoomCreated);
        };
        
    }, [socket]);

    // send the id to the server to start looking for a person who wants you as much you want them.
     useEffect( () => {
        startMatchMaking();
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            cancelRequest
          );
    
          return () => backHandler.remove();
    }, [])

    const startMatchMaking = async () => {
        
            // console.log(requestID.id)
            setTimeout(async () => {
                try {
                    const response = await api.get(`/home/matching/${requestID.id}`)
                    if(response){
                        // if(response.status==420){
                        //     console.log("No matching user found")
                        // }
                    }
                } catch (error) {
                    setFoundNoMatch(true)
                    setTimeout(() => {
                        navigation.goBack();
                        console.log("No matching user found")
                    }, 2000);
                }
            }, 1000); 
    }


    const tips = [
        'Tip: Be polite and respectful.',
        'Tip: Avoid sharing personal information.',
        'Tip: Use proper grammar and spelling.',
        'Tip: Be mindful of the other person’s feelings.',
        'Tip: Keep the conversation light and friendly.',
        'Tip: Avoid controversial topics.',
        'Tip: Use emojis to convey emotions.',
        'Tip: Take turns in the conversation.',
        'Tip: Ask open-ended questions to keep the chat going.',
        'Tip: Don’t be afraid to end the conversation if it gets uncomfortable.',
        'Tip: Be genuine and authentic.',
        'Tip: Respect the other person’s boundaries.',
        'Tip: Use humor appropriately.',
        'Tip: Avoid using too many abbreviations.',
        'Tip: Listen as much as you talk.',
        'Tip: Share interesting stories or experiences.',
        'Tip: Be patient and give thoughtful responses.',
        'Tip: Avoid spamming or sending too many messages at once.',
        'Tip: If you disagree, do so respectfully.',
        'Tip: Have fun and enjoy the conversation!'
      ];

      const getRandomTipIndex = (currentIndex) => {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * tips.length);
        } while (randomIndex === currentIndex);
        return randomIndex;
    };

      const [currentTipIndex, setCurrentTipIndex] = useState(() => getRandomTipIndex(-1));
        const scaleAnim = useRef(new Animated.Value(1)).current;

        const switchTip = () => {
            // Inflate animation
            Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: 100,
                useNativeDriver: true,
            }),
            // Deflate animation
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            ]).start(() => {
            // Update tip after animation completes
            // setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
            const newTipIndex = getRandomTipIndex(currentTipIndex);
            setCurrentTipIndex(newTipIndex);
            });
        };

    useEffect(() => {
        const interval = setInterval(() => {
        setDots((prevDots) => {
            if (prevDots === '') return '.';
            if (prevDots === '.') return '..';
            if (prevDots === '..') return '...';
            return '';
        });
        }, 500); // Change the speed of the animation here (500ms in this example)

        return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, []);

    const cancelRequest = async () => {
        setAttemptingCancel(true);
        navigation.goBack();
        try {
            const data = await AsyncStorage.getItem('id');
            const response = await api.delete(`/home/RemoveRequest/${data}`);

            if(response){
                console.log(response)
            }
        } catch (error) {
            console.log(error)
        }
        setTimeout(() => {
            setAttemptingCancel(false);
        }, 1000);
    }

    return (
        <ImageBackground
            source={require('../../assets/img/HomePage1.png')}
            style={{ flex:1 ,resizeMode: 'cover'}}
        >
            <Center h={'$full'} marginBottom={-100}>

                <View flexDirection='row' padding={20} gap={30}>
                    <FontAwesome6 name='user-large' size={70} color={foundNoMatch?'#ccc':'#512095'}/>
                    <FontAwesome6 name='user-large' size={70} color={foundMatch?'#512095':'#ccc'}/>
                </View>

                <Text fontFamily='Roboto_400Regular' color='white' size='xl'>{foundMatch?"User found!":foundNoMatch?"No match found.":`Looking for a user${dots}`}</Text>

                <View display='flex' flexDirection='column' gap={50} justifyContent='center' marginTop={40}>
                <Button
                    isDisabled={attemptingCancel}
                    size="lg"
                    mb="$4"
                    borderRadius={40}
                    hardShadow='1'
                    bgColor="#512095"
                    $active={{
                        bg: "#51209595",
                    }}
                    onPress={cancelRequest}
                    >
                    <ButtonText fontSize="$xl" fontFamily='Roboto_500Medium'>
                        Cancel
                    </ButtonText>
                    </Button>
                </View>
            </Center>
            <View marginHorizontal={20}>
                <TouchableOpacity onPress={switchTip} activeOpacity={0.7}>
                    <Animated.View style={[styles.tipContainer, { transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.tipText}>{tips[currentTipIndex]}</Text>
                    </Animated.View>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    tipContainer: {
      padding: 20,
      backgroundColor: '#cccccc70',
      borderRadius: 10,
    },
    tipText: {
      color: 'white',
      fontSize: 16,
      textAlign: 'center',
    },
  });
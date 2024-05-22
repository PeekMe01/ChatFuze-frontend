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

const socket = io.connect(`${API_URL}`);

export default function MatchMakingScreen({navigation}) {
    const [attemptingCancel, setAttemptingCancel] = useState(false);
    const [dots, setDots] = useState('');

    const { requestID, setRequestID } = useContext(RequestContext);

    let id=requestID; //room id
    useEffect(() => {
        const handleRoomCreated = (data) => {
        console.log('Joined room',data);
        navigation.push('ChatRoom', { 
            receivingUser: {"active": true, "bio": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.jrejfjejdsjvoekgkrodjwpc", "country": "Congo", "createdAt": null, "dateOfBirth": "2000-01-01T00:00:00.000Z", "email": "user1@gmail.com", "facebooklink": null, "gender": "Male", "idusers": 1, "imageurl": "https://firebasestorage.googleapis.com/v0/b/chatfuze-e6658.appspot.com/o/ChatFuze%2FProfile%2F11716367377958.jpg?alt=media&token=6f614cda-a1eb-4829-a0c5-f4d2d5ec0333", "instagramlink": null, "password": "$2b$10$aqCf.2qvFFPMk8oCErtcXecEMCYL.0uU93S6hR2pLPOMv2hAJm3mi", "rankid": 1, "rankpoints": 0, "updatedAt": "2024-05-22T08:42:59.000Z", "username": "user1", "verified": false},
        });
        socket.emit('roomCreated',data);
        };

        const handleRoomClosed = (data) => {
            if(data.idmessages==id)
                console.log('Room closed', data);
        };
        socket.on('roomCreated', handleRoomCreated);
        socket.on('roomClosed', handleRoomClosed);
        
    }, [requestID]);

    // send the id to the server to start looking for a person who wants you as much you want them.
    useEffect(() => {
        startMatchMaking();

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            cancelRequest
          );
    
          return () => backHandler.remove();
    }, [requestID])

    const startMatchMaking = async () => {
        try {
            console.log(requestID.id)
            const response = await api.get(`/home/matching/${requestID.id}`)
            if(response){
                // if(response.status==420){
                //     console.log("No matching user found")
                // }
            }
        } catch (error) {
            navigation.goBack();
            console.log("No matching user found")
        }
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

      const [currentTipIndex, setCurrentTipIndex] = useState(0);
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
            setCurrentTipIndex((prevIndex) => (prevIndex + 1) % tips.length);
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

                <Text fontFamily='Roboto_400Regular' color='white' size='xl'>Looking for a user{dots}</Text>

                <View flexDirection='row' padding={50} gap={30}>
                    <FontAwesome6 name='user-large' size={70} color='#512095'/>
                    <FontAwesome6 name='user-large' size={70} color='#ccc'/>
                </View>
                <View display='flex' flexDirection='column' gap={50} justifyContent='center'>
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
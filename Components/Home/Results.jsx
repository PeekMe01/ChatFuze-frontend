import { ButtonText, Center, Divider, HStack, Spinner, View } from '@gluestack-ui/themed'
import { Text } from '@gluestack-ui/themed'
import { ScrollView } from '@gluestack-ui/themed';
import { ImageBackground } from '@gluestack-ui/themed'
import { useFonts } from 'expo-font';
import React, { useEffect, useState }from 'react'
import * as Animatable from 'react-native-animatable';
import { collection, addDoc, orderBy, query, onSnapshot, where , doc, getDoc, setDoc, updateDoc, getDocs} from 'firebase/firestore';
import { database } from "../../config/firebase";
import HorizontalNumberPicker from './HorizontalNumberPicker';
import { SafeAreaView } from '@gluestack-ui/themed';
import { Button } from '@gluestack-ui/themed';
import { AlertDialog } from '@gluestack-ui/themed';
import { AlertDialogBody } from '@gluestack-ui/themed';
import { AlertDialogBackdrop } from '@gluestack-ui/themed';
import { AlertDialogFooter} from '@gluestack-ui/themed';
import { AlertDialogContent } from '@gluestack-ui/themed';
import { AlertDialogHeader } from '@gluestack-ui/themed';
import { Heading } from '@gluestack-ui/themed';
import { ButtonGroup } from '@gluestack-ui/themed';
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

export default function Results({navigation, route}) {
    // const { receiverID, senderID, roomID} = route.params;

    const [receiverMessages, setReceiverMessages] = useState({count: 0, totalCharacters: 0});
    const [senderMessages, setSenderMessages] = useState({count: 0, totalCharacters: 0});

    const [selectedIndex, setSelectedIndex] = useState(0);

    const [backToHomePressed, setBackToHomePressed] = useState(false)

    const [showAlertDialog, setShowAlertDialog] = useState(false)

    const handleAddFriend = () => {
        console.log('Pressed add friend')
        setShowAlertDialog(false)
        setBackToHomePressed(false)
        navigation.navigate('HomeScreen')
    }

    const handleBackToHome = () => {
        setBackToHomePressed(true)
        if(selectedIndex>=6){
            setShowAlertDialog(true)
        }else{
            setTimeout(() => {
                navigation.navigate('HomeScreen')
                setBackToHomePressed(false)
            }, 1000); 
        }
    }

    useEffect(()=>{
        getMessagesCounts();
    }, [])

    const getMessagesCounts = async () => {
        try {
            const getMyMessagesQuery = query(
                collection(database, 'roomChats'),
                where('receivingUser', '==',parseInt(receiverID)) ,
                where('roomID', '==',parseInt(roomID)) 
            );
            const getMatchMessagesQuery = query(
                collection(database, 'roomChats'),
                where('receivingUser', '==',parseInt(senderID)) ,
                where('roomID', '==',parseInt(roomID)) 
            );
    
            // // Execute the queries and count the number of documents returned
            // const getMyMessagesSnapshot = await getDocs(getMyMessagesQuery);
            // const getMatchMessagesSnapshot = await getDocs(getMatchMessagesQuery);
    
            // setSenderMessages(getMyMessagesSnapshot.size);
            // setReceiverMessages(getMatchMessagesSnapshot.size);
    
            // Function to get the total number of characters in the text field for a given query
            const getTotalCharacters = async (query) => {
                const querySnapshot = await getDocs(query);
                let totalCharacters = 0;
    
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.text) {
                        totalCharacters += data.text.length;
                    }
                });
    
                return { count: querySnapshot.size, totalCharacters };
            };
    
            // Get counts and total characters for both queries
            const myMessagesResult = await getTotalCharacters(getMyMessagesQuery);
            const matchMessagesResult = await getTotalCharacters(getMatchMessagesQuery);
            setReceiverMessages(matchMessagesResult)
            setSenderMessages(myMessagesResult)
    
            console.log("My messages count: " + myMessagesResult.count);
            console.log("My messages total characters: " + myMessagesResult.totalCharacters);
            console.log("Match messages count: " + matchMessagesResult.count);
            console.log("Match messages total characters: " + matchMessagesResult.totalCharacters); 
        } catch (error) {
            
        }
    }

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

    return (
        <ImageBackground
          source={require('../../assets/img/HomePage1.png')}
          style={{ flex: 1, resizeMode: 'cover' }}
        >
            <AlertDialog
                isOpen={showAlertDialog}
                onClose={() => {
                    setShowAlertDialog(false)
                    setBackToHomePressed(false)
                }}
            >
                <AlertDialogBackdrop />
                <AlertDialogContent>
                <AlertDialogHeader>
                <Heading size='lg' color='#512095'>High Rating</Heading>
                </AlertDialogHeader>
                <AlertDialogBody>
                    <Text size="sm">
                    You have given this user a high rating, do you want to add him as a friend? He will need to add you as well in order to become friends.
                    </Text>
                </AlertDialogBody>
                <AlertDialogFooter>
                    <ButtonGroup space="lg">
                        <Button
                            variant="outline"
                            action="secondary"
                            borderWidth={2}
                            onPress={() => {
                                setShowAlertDialog(false)
                                setBackToHomePressed(false)
                                navigation.navigate('HomeScreen')
                            }}
                        >
                            <ButtonText>No</ButtonText>
                        </Button>
                        <Button
                            bg="#512095"
                            action="negative"
                            onPress={() => {
                                handleAddFriend()
                            }}
                        >
                            <ButtonText>Add Friend</ButtonText>
                        </Button>
                    </ButtonGroup>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
            <Animatable.View animation={changingPage ? "fadeOut" : "fadeIn"} duration={500} style={{ flex: 1 }}>
            <View margin={30}>
              <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator={false}>
                <Text textAlign='center' size='5xl' color='white' fontFamily='Roboto_500Medium' paddingTop={10}>
                  Results
                </Text>
                <Divider />
              </ScrollView>
              <View height={'50%'} marginTop={-150}>
                <Text size='lg' color='white' fontFamily='Roboto_300Light' paddingTop={10}>
                    You have sent {senderMessages.count} {senderMessages.count === 1 ? "message" : "messages"}.
                </Text>
                <Text size='lg' color='white' fontFamily='Roboto_300Light' paddingTop={10} style={{ marginBottom: 20 }}>
                    Your match has sent {receiverMessages.count} {receiverMessages.count === 1 ? "message" : "messages"}.
                </Text>
                <Divider />
                <Text size='lg' color='white' fontFamily='Roboto_300Light' paddingVertical={20}>
                    {senderMessages.totalCharacters>receiverMessages.totalCharacters?"You have carried the conversation.":"Your match has carried the conversation."}
                </Text>
                <Divider />
                <Text size='2xl' textAlign='center' color='white' fontFamily='Roboto_300Light' paddingTop={10} style={{ marginBottom: 20 }}>
                    Rate your match from 1 to 10
                </Text>
                <View style={{ height: 150 }}>
                    <HorizontalNumberPicker selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
                </View>
                <Button
                    isDisabled={backToHomePressed}
                    size="lg"
                    mb="$4"
                    borderRadius={40}
                    hardShadow='1'
                    bgColor="#512095"
                    $active={{
                        bg: "#51209595",
                    }}
                    onPress={handleBackToHome}
                >
                    <ButtonText fontSize="$xl" fontWeight="$medium" >
                        Back to home
                    </ButtonText>
                </Button>
            </View>
            </View>
          </Animatable.View>
        </ImageBackground>
      );
}
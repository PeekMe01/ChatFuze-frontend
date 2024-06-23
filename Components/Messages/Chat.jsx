import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image, ImageBackground, Text, View, HStack, Spinner, Center } from "@gluestack-ui/themed";
import React, { useRef, useState, useCallback, useEffect, useLayoutEffect } from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import userimg from '../../assets/img/user.png'
import { useHeaderHeight } from '@react-navigation/elements';
import { TextInput, StyleSheet, Platform, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { collection, addDoc, orderBy, query, onSnapshot, where, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { database } from "../../config/firebase";

const error = console.error; console.error = (...args) => { if (/defaultProps/.test(args[0])) return; error(...args); };

export default function Chat({ navigation, route }) {
    const [text, setText] = useState('');
    const [loggedInUserID, setLoggedInUserID] = useState();
    const [typing, setTyping] = useState(false)
    const [receiverTyping, setReceiverTyping] = useState(false);

    const timeoutRef = useRef(null);
    const clearTypingTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };
    const updateTyping = async (typing) => {
        try {
            let senderid = loggedInUserID
            let receiverid = receivingUser.idusers
            const docId = `${senderid}_${receiverid}`;
            const docRef = doc(database, 'typing', docId);

            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                await updateDoc(docRef, {
                    typing: typing
                });
            } else {
                await setDoc(docRef, {
                    senderid: parseInt(senderid),
                    receiverid: parseInt(receiverid),
                    typing: typing
                });
            }

        } catch (error) {
            console.error('Error occurred while updating user typing status:', error);
        }
    }
    const isFirstInput = useRef(true);

    const onInputTextChanged = text => {
        clearTypingTimeout();
        setTyping(true);

        if (isFirstInput.current) {
            isFirstInput.current = false;
        } else {
            if (!typing) {
                updateTyping(true);
            }
        }

        timeoutRef.current = setTimeout(() => {
            setTyping(false);
            updateTyping(false);
        }, 3000);
    };
    useEffect(() => {
        if (!loggedInUserID || !receivingUser?.idusers) {
            return;
        }

        const senderid = loggedInUserID;
        const receiverid = receivingUser.idusers;
        const docId = `${receiverid}_${senderid}`;

        const typingStatusQuery = query(
            collection(database, 'typing'),
            where('receiverid', '==', parseInt(senderid)),
            where('senderid', '==', parseInt(receiverid))
        );

        // Set up a real-time listener for the query
        const unsubscribe = onSnapshot(typingStatusQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const data = change.doc.data();
                    setReceiverTyping(data.typing);
                }
            });
        });

        // Cleanup function to unsubscribe from the listener
        return () => {
            unsubscribe();
        };
    }, [loggedInUserID, receivingUser]);


    function getFormattedTimeDifference(datetime) {
        // Parse the given datetime string
        let givenDatetime = new Date(datetime);

        // Get the current date and time
        let currentDate = new Date();

        // Calculate the difference in milliseconds
        let difference = currentDate - givenDatetime;

        // Convert milliseconds to days, hours, minutes, and seconds
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Construct the formatted string
        let formattedTimeDifference = '';
        if (days > 0) formattedTimeDifference += `${days} day${days > 1 ? 's' : ''} `;
        if (hours > 0) formattedTimeDifference += `${hours}h `;
        // if (minutes > 0) formattedTimeDifference += `${minutes}min `;
        if (days == 0) {
            if (minutes > 0) {
                formattedTimeDifference += `${minutes}min`
            }
        }

        // Append a message if formattedTimeDifference is empty
        if (formattedTimeDifference === '') {
            formattedTimeDifference = "just now";
        }

        return formattedTimeDifference.trim();
    }
    // Get the safe area insets
    const insets = useSafeAreaInsets();

    // Get the height of the camera cutout
    const cameraCutoutHeight = insets.top;
    const { receivingUser } = route.params;
    const [userStatus, setUserStatus] = useState(false)

    const [messages, setMessages] = useState([])
    const headerHeight = useHeaderHeight();

    useEffect(() => {
        getLoggedInUserId()
    }, [])

    useEffect(() => {
        clearUnreadMessages()
    }, [messages])

    const clearUnreadMessages = async () => {
        try {
            let receiverid = loggedInUserID;
            let senderid = receivingUser.idusers;

            if (receiverid) {
                const docId = `${senderid}_${receiverid}`;
                const docRef = doc(database, 'unread', docId);

                const docSnapshot = await getDoc(docRef);

                if (docSnapshot.exists()) {
                    // Update the existing document

                    await updateDoc(docRef, { messages: 0 });
                } else {
                    // If the document doesn't exist, create it
                    await setDoc(docRef, { senderID: parseInt(senderid), receiverID: parseInt(receiverid), messages: 0 });
                }

            }
        } catch (error) {
            console.error('Error occurreeEed while updating user status:', error);
        }
    }

    getLoggedInUserId = async () => {
        const userId = await AsyncStorage.getItem('id');
        setLoggedInUserID(userId)
    }

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: true })
        navigation.setOptions({
            headerTransparent: true,
            headerLeft: () => null,
            headerTintColor: 'white',
            headerTitle: () => (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomColor: 'white', paddingTop: 30, width: '100%', borderBottomWidth: .5, paddingBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <AntDesign name="arrowleft" size={25} color="white"  onPress={() => navigation.goBack()} padding={15} />
                        {receivingUser.imageurl ? <Image
                            alt='profilePic'
                            w={140}
                            h={140}
                            zIndex={-1}
                            style={{ width: 50, height: 50 }}
                            borderRadius="$full"
                            source={{
                                uri: receivingUser.imageurl,
                            }}
                        /> : <Image source={userimg} alt='' style={{ borderRadius: 50, width: 50, height: 50, marginLeft: 1 }} />}
                        <TouchableOpacity style={{ marginLeft: 10, width: '100%', display: 'flex', flexDirection: 'column' }} onPress={() => {
                            navigation.push('ProfileMessages', {
                                user: receivingUser,
                            });
                        }}>
                            <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
                                {/* {receivingUser.username} */}
                                {receivingUser.username.length <= 10 ? receivingUser.username : receivingUser.username.substring(0, 10) + '...'}
                            </Text>
                            <Text size='sm' fontFamily='Roboto_400Regular' style={{ color: userStatus === true ? '#2cd6d3' : '#727386' }}>
                                {userStatus === true
                                    ? 'online'
                                    : getFormattedTimeDifference(receivingUser.datetime) === "just now"
                                        ? 'last seen just now'
                                        : 'last seen ' + getFormattedTimeDifference(receivingUser.datetime) + ' ago'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ),
        });
    })

    useEffect(() => {
        const collectionRef = collection(database, 'chats');

        const receivingUserId = receivingUser.idusers; // Example receiving user ID
        const currentUserID = loggedInUserID; // Example current user ID

        if (loggedInUserID) {
            // const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
            const q = query(
                collectionRef,
                where('receivingUser', 'in', [parseInt(receivingUserId), parseInt(currentUserID)]), // Filter by receiving user
                where('user._id', 'in', [parseInt(receivingUserId), parseInt(currentUserID)]), // Filter by current user
                orderBy('createdAt', 'desc')
            );


            const unsubscribe = onSnapshot(q, snapshot => {
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

    const updateFriendStatus = (userId, userStatus, datetime) => {
        setUserStatus(userStatus)
        receivingUser.datetime = datetime
    };

    useEffect(() => {
        if (!receivingUser?.idusers) return;

        // Create a query for the friend's status document
        const friendStatusQuery = query(
            collection(database, 'status'),
            where('userId', '==', receivingUser.idusers) // Assuming 'userId' is the field storing the user ID in the 'status' documents
        );

        // Set up a real-time listener for the query
        const unsubscribe = onSnapshot(friendStatusQuery, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added' || change.type === 'modified') {
                    const friendData = change.doc.data();
                    updateFriendStatus(friendData.userId, friendData.active, friendData.datetime);
                    // Update UI or perform actions based on friend's status change
                }
            });
        });

        // Cleanup subscription on unmount or when receivingUser.idusers changes
        return () => unsubscribe();
    }, [receivingUser?.idusers, updateFriendStatus]);


    const onSend = useCallback(async (messages = []) => {
        setMessages(previousMessages =>
            GiftedChat.append(previousMessages, messages),
        )
        const { _id, createdAt, text, user } = messages[0];
        addDoc(collection(database, 'chats'), {
            _id,
            createdAt,
            text,
            user,
            receivingUser: receivingUser.idusers
        });
        try {
            // Check if the document already exists
            const docRef = doc(database, 'unread', user._id + '_' + receivingUser.idusers);
            const docSnapshot = await getDoc(docRef);
            if (docSnapshot.exists()) {
                await updateDoc(docRef, { messages: docSnapshot.data().messages + 1 });
            } else {
                await setDoc(docRef, { senderID: parseInt(user._id), receiverID: parseInt(receivingUser.idusers), messages: 1 });
            }
        } catch (error) {
            console.error(error);
        }
    }, [])

    // Create a ref for the FlatList inside GiftedChat
    const messageContainerRef = useRef(null);

    const flatList = messageContainerRef.current;
    // Check if the FlatList exists
    if (flatList) {
        flatList.setNativeProps({
            style: {
                marginTop: headerHeight + cameraCutoutHeight,
                marginBottom: 30,
                paddingHorizontal: 10
            },
            fadingEdgeLength: 100
        });
    };
    const customtInputToolbar = (props) => {


        const handleSend = () => {
            if (text.trim().length > 0) {
                props.onSend([{ text: text.trim(), user: props.user, createdAt: new Date() }], true);
                setText('');
            }
        };

        return (
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Type a message..."
                    multiline={true}
                    value={text}
                    onChangeText={setText}
                />
                {text.trim().length > 0 && ( // Show icon only when text is not empty
                    <TouchableOpacity onPress={handleSend} style={styles.iconContainer}>
                        <Ionicons name="send" size={24} color="#512095" />
                    </TouchableOpacity>
                )}
            </View>
        );
    };
    if (!loggedInUserID) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <Center flex={1}>
                    <HStack alignItems='center' gap={10}>
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
                </Center>
            </ImageBackground>
        )
    } else {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex: 1, resizeMode: 'cover' }}
            >
                <View style={{ flex: 1 }}>
                    <GiftedChat
                        messages={messages.sort((a, b) => b.createdAt - a.createdAt)}
                        onSend={messages => onSend(messages)}
                        user={{
                            _id: parseInt(loggedInUserID),
                        }}
                        messageContainerRef={messageContainerRef}
                        renderAvatar={null}
                        onInputTextChanged={onInputTextChanged}
                        isTyping={receiverTyping}
                        scrollToBottom={true}
                    />
                </View>
            </ImageBackground>
        )
    }
}


const styles = StyleSheet.create({
    // container: {
    //   flexDirection: 'row',
    //     position:'absolute',
    //     bottom:'0%',
    // },
    // input: {
    //     flex: 1,
    //     borderRadius: 10,
    //     fontSize: 16,
    //     paddingLeft:10,
    //     paddingRight: 40,
    //     paddingVertical: 10,
    //     backgroundColor: 'white',
    //   },
    //   iconContainer: {
    //     position: 'absolute',
    //     right: 10,
    //     bottom: '0%',
    //     transform: [{ translateY: -12 }],
    //   },
    //   iconContainer: {
    //     justifyContent: 'center',
    //     alignItems: 'center',

    //     paddingHorizontal: 10,
    //     backgroundColor: 'white',
    //     borderRadius: 10,
    //   },
});
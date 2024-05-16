import React, { useEffect, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { Box, Center, HStack, Image, ImageBackground, Spinner, Text, View, ScrollView, VStack, ToastTitle, ToastDescription, useToast, Pressable, CloseIcon } from '@gluestack-ui/themed';
import { useFonts } from 'expo-font';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../Config';
import * as Animatable from 'react-native-animatable';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions, StyleSheet } from 'react-native';
import userimg from '../../../assets/img/user.png'
import { Toast } from '@gluestack-ui/themed';
import { Icon } from '@gluestack-ui/themed';

var img = null;

const ChangeProfilePicture = ({navigation, imagePickerOpen, setImagePickerOpen}) => {

    const toast = useToast()
    const storage = getStorage();

    const [image, setImage] = useState(null);
    const [user, setUser] = useState(null);
    const [changingPage, setChangingPage] = useState(false);
    const [clickedButton, setClickedButton] = useState(false);
    const [changedPic, setChangedPic] = useState(false);

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
    // const isFocused = useIsFocused();

    useEffect(() => {
        setImagePickerOpen(true)
        fetchData();
    }, [!user]);

    const openImageLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 0.5,
        });
    
        if (!result.canceled && result.assets && result.assets.length > 0) {
          const selectedAsset = result.assets[0];
          if (selectedAsset && selectedAsset.uri) {
            setImage(selectedAsset.uri);
            uploadImage(selectedAsset.uri);
          } else {
            console.error('Error: Selected asset or its URI is null.');
          }
        }
      };

      const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }
    
      const uploadImage = async (imageUri) => {
        var downloadUrl;
        try {
            const resp = await fetch(imageUri);
            const blob = await resp.blob();
            const storageRef = ref(storage, 'ChatFuze/Profile/' + Date.now() + '.jpg');
            console.log("store:"+storageRef)
            await uploadBytes(storageRef, blob);
            downloadUrl = await getDownloadURL(storageRef);
        } catch (error) {
            console.log('there was an error connecting to firebase.')
            console.log(error)
        }

        try {
            // 
            const userid = await AsyncStorage.getItem('id');
            const data = {
                userid: userid,
                profileURL: downloadUrl,
            }

            const response = await api.put(`/settings/updateProfilePicture`, data);

            if(response){
                setChangedPic(true)
                img=downloadUrl
                toast.show({
                    duration: 5000,
                    placement: "top",
                    render: ({ id }) => {
                        const toastId = "toast-" + id
                        return (
                        <Toast nativeID={toastId} action="success" variant="solid" marginTop={40}>
                            <VStack space="xs">
                            <ToastTitle>Success</ToastTitle>
                            <ToastDescription>
                                You have succesfully updated your profile picture!
                            </ToastDescription>
                            </VStack>
                            <Pressable mt="$1" onPress={() => toast.close(id)}>
                                <Icon as={CloseIcon} color="$black" />
                            </Pressable>
                        </Toast>
                        )
                    },
                })
            }
        } catch (error) {
            console.log(error)
            toast.show({
                duration: 5000,
                placement: "top",
                render: ({ id }) => {
                    const toastId = "toast-" + id
                    return (
                    <Toast nativeID={toastId} action="error" variant="solid" marginTop={40}>
                        <VStack space="xs">
                        <ToastTitle>Error</ToastTitle>
                        <ToastDescription>
                            There was an error updating your profile picture!
                        </ToastDescription>
                        </VStack>
                        <Pressable mt="$1" onPress={() => toast.close(id)}>
                            <Icon as={CloseIcon} color="$black" />
                        </Pressable>
                    </Toast>
                    )
                },
            })
        }
        // return downloadUrl;
      };


    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
    });
    if (!fontsLoaded||!user) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <Center h={'$full'}>
                    <HStack space="sm" justifyContent='center' alignItems='center'>
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
                </Center>
            </ImageBackground>
        ) 
    }


  return (
    <ImageBackground
        source={require('../../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        <View margin={30} marginBottom={100}>
            <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                    <MaterialIcons name="arrow-back" size={30} color="white"/>
                </TouchableHighlight>
                <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                    Change Profile Picture
                </Text>
            </View>
            <View gap={20}>
                <Center>
                    <Box h="$96" w="$64" style={{ display: 'flex', gap: 20, justifyContent: 'center', alignItems: 'center'}}>
                    {img?
                    <Image
                        alt='profilePic'
                        borderColor='white'
                        borderWidth={2}
                        border
                        w={140}
                        h={140}
                        borderRadius="$full"
                        source={{
                            uri: img,
                        }}
                    />:
                    user.imageurl?
                        <Image
                            alt='profilePic'
                            borderColor='white'
                            borderWidth={2}
                            border
                            w={140}
                            h={140}
                            borderRadius="$full"
                            source={{
                                uri: user.imageurl,
                            }}
                        />
                        :<Image
                            alt='profilePic'
                            borderColor='white'
                            borderWidth={2}
                            border
                            w={140}
                            h={140}
                            borderRadius="$full"
                            source={userimg}
                        />}
                    <TouchableHighlight
                        onPress={()=>{openImageLibrary()}}
                        style={styles.centered}
                        underlayColor={'transparent'}
                    >
                        <Text style={styles.edittext}>Edit</Text>
                    </TouchableHighlight>
                    </Box>
                </Center>
            </View>
        </View>
    </ImageBackground>
  )
}

export default ChangeProfilePicture

// const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    position: 'relative',
    flex: 1,
    // height: windowHeight,
  },
  content: {
    width: '100%',
    paddingHorizontal: 7,
  },
  centered: {
    alignItems: 'center',
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 100,
    marginBottom: 10,
  },
  edittext: {
    color: 'white',
    fontSize: 18,
    paddingVertical: 16,
    paddingHorizontal: 40,
    // borderColor: 'white',
    // borderWidth: 1
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#2A3A43',
    borderBottomWidth: 1,
    borderBottomColor: '#DFE7EB',
    paddingHorizontal: 1,
    color: '#fff',
  },
  media: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 5,
  },
});

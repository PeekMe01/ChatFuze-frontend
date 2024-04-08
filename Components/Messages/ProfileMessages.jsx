import React, { useState,useEffect } from 'react'
import { AlertDialogContent,AlertDialogHeader ,AlertDialogCloseButton,RefreshControl,Toast,Select,ChevronDownIcon,SelectTrigger,SelectItem,SelectDragIndicator,SelectIcon,SelectInput,SelectContent,SelectDragIndicatorWrapper, SelectPortal, SelectBackdrop, VStack, View, AddIcon, Center, Divider, HStack, Image, ImageBackground, Spinner, Text ,useToast,ToastTitle,ToastDescription,AlertDialog, AlertDialogBackdrop, AlertDialogBody, AlertDialogFooter,Heading,CloseIcon,ButtonGroup,ButtonText,Button} from '@gluestack-ui/themed';
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ScrollView, TouchableHighlight,TouchableOpacity,TextInput,TouchableWithoutFeedback ,Keyboard } from 'react-native';
import api from '../Config'
import beginnerRank from '../../assets/img/RankFrames/Beginner.png'
import amateurRank from '../../assets/img/RankFrames/Amateur.png'
import expertRank from '../../assets/img/RankFrames/Expert.png'
import masterRank from '../../assets/img/RankFrames/Master.png'
import champRank from '../../assets/img/RankFrames/Champ.png'
import superstarRank from '../../assets/img/RankFrames/Superstar.png'
export default function ProfileMessages({navigation, route}) {

    const { user,userid } = route.params;
    const [showAlertDialog, setShowAlertDialog] = useState(false)
    const [showAlertReport, setshowAlertReport] = useState(false)
    const [refreshing, setRefreshing] = React.useState(false);
    const [clickedButton, setClickedButton] = useState(false);
    const [friend, setFriend] = useState();
    const [rankName, setRankName] = useState();
    const [leaderboardnumber, setLeaderboardnumber] = useState();
    const [roomCount, setRoomCount] = useState();
    const [ reportCategory,setreportCategory]=useState();
    const [ invalidreport,setInvalidReport]=useState(false);
    const [message,setmessage]=useState('');
    const[invalidtext,setinvalidtext]=useState(false)
    const [disablebutton,setdisablebutton]=useState(false);
    const[disabledeletebutton,setdisabledeletebutton]=useState(false)
    async function fetchData(){
        try {
             const data = user.idusers;
             const response = await api.get(`/settings/getinsight/${data}`);
             // const {roomCount, friendsCount, leaderboardnumber,rankname} = response;
             setFriend(response.data.user);
             setRankName(response.data.rankname);
             setLeaderboardnumber(response.data.leaderboardnumber);
             setRoomCount(response.data.roomCount)
             console.log(response.data.user)
         } catch (error) {
             console.log(error)
         }
     }
     
    useEffect(() => {
        fetchData();
    }, []);

    
    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        setFriend();
        setTimeout(() => {
          setRefreshing(false);
        }, await fetchData());
        
      }, []);
  
    const [changePage, setChangePage] = useState(0);
    const [changingPage, setChangingPage] = useState(false)

    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }
    const toast = useToast()
    const removefriend =async()=>{
        try {
            setdisabledeletebutton(true)
            const response = await api.post(`/messages/removefriend`, {
                usersid1: userid,
                usersid2: user.idusers
            });
            setTimeout(() => {
                setdisabledeletebutton(false);
            }, 1000);
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
                        {user.username} has been removed from your friend list...
                        </ToastDescription>
                        </VStack>
                    </Toast>
                    )
                },
            })
            navigation.navigate('MessagesStack')
            
        } catch (error) {
            console.error('Error deleting friend:', error);
        }
    }

    const submitreport=async()=>{
        try {
            if(reportCategory && message!==''){
                setdisablebutton(true)
                const response = await api.post(`/reports/submitreport`, {
                    categoryname: reportCategory,
                    message: message,
                    reporterid:userid,
                    reportedid:user.idusers ,
                });
                setshowAlertReport(false)
                setTimeout(() => {
                    setdisablebutton(false);
                }, 1000);
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
                                You have succesfully Submitted your report...
                            </ToastDescription>
                            </VStack>
                        </Toast>
                        )
                    },
                })
            }else{
                if(!reportCategory)
                    setInvalidReport(true)
                if(message==="")
                    setinvalidtext(true)
            }
            }  catch (error) {
                console.error('Error deleting friend:', error);
            }
    }
    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../assets/fonts/ARLRDBD.ttf'), // Assuming your font file is in assets/fonts directory
    });

    function calculateAge(dateOfBirth) {
        var today = new Date();
        var birthDate = new Date(dateOfBirth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
    
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
    
        return age;
    }

    function formatDateOfBirth(dateOfBirth) {
        var birthDate = new Date(dateOfBirth);
        var day = birthDate.getDate();
        var monthIndex = birthDate.getMonth();
        var year = birthDate.getFullYear();
        
        var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        return day + ' ' + months[monthIndex] + ' ' + year;
    }

    if (!fontsLoaded||!friend) {
        return (
            <ImageBackground
                source={require('../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                <Center h={'$full'}>
                    <HStack space="sm" justifyContent='center' alignItems='center'>
                        <Text  color='#ffffff50'>LOADING...</Text><Spinner size="large" color="#321bb980" />
                    </HStack>
                </Center>
            </ImageBackground>
        ) 
    }
    const dismissKeyboard = () => {
        Keyboard.dismiss();
      };
  return (
  
    <ImageBackground
        source={require('../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
        <AlertDialog
            isOpen={showAlertDialog}
            onClose={() => {
            setShowAlertDialog(false)
            }}
        >
            <AlertDialogBackdrop />
            <AlertDialogContent>
            <AlertDialogHeader>
                <Heading size="lg" color='#512095'>Remove Friend?</Heading>
                <AlertDialogCloseButton>
                <Icon as={CloseIcon} />
                </AlertDialogCloseButton>
            </AlertDialogHeader>
            <AlertDialogBody>
                <Text size="sm">
                Are you sure you want to Remove this Friend?
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
                    }}
                >
                    <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                    bg="#512095"
                    action="negative"
                    onPress={() => {
                        removefriend()
                    }}
                    disabled={disabledeletebutton}
                >
                 <ButtonText>Remove</ButtonText>
                 </Button>
                </ButtonGroup>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
            {/* report friend */}
                <AlertDialog
            isOpen={showAlertReport}
            onClose={() => {
                setshowAlertReport(false)
            }}
        >
            <AlertDialogBackdrop />
            <AlertDialogContent>
  <TouchableWithoutFeedback onPress={dismissKeyboard}>
    <View> 
      <AlertDialogHeader>
        <Heading size="lg" color='#512095'>Report Friend?</Heading>
        <AlertDialogCloseButton>
          <Icon as={CloseIcon} />
        </AlertDialogCloseButton>
      </AlertDialogHeader>
      <AlertDialogBody>
        <Select
          style={{ borderWidth: 2, borderColor:invalidreport?'red':'#ccc',  borderRadius: 5 }}
          selectedValue={reportCategory}
          onValueChange={(value) => { setreportCategory(value); setInvalidReport(false) }}
        >
          <SelectTrigger size="md" borderColor='rgba(255,255,255,0)'>
            <SelectInput placeholderTextColor='grey' placeholder="Select Report Category"  style={{ color: 'grey' }} />
            <SelectIcon mr="$3">
              <Icon as={ChevronDownIcon} style={{ color: 'white' }} />
            </SelectIcon>
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop />
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
              <SelectItem label="Abuse" value="Abuse" />
              <SelectItem label="Spam" value="Spam" />
              <SelectItem label="Hate Speech" value="Hate Speech" />
              <SelectItem label="Inappropriate Speech" value="Inappropriate Speech" />
            </SelectContent>
          </SelectPortal>
        </Select>
        <TextInput
          placeholder="Type your message..."
          multiline
          numberOfLines={4}
          style={{
            marginVertical:10,
            borderWidth: 1,
            borderColor: invalidtext?'red':'#ccc',
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 8,
            fontSize: 16,
            minHeight: 100,
            textAlignVertical: 'top',
          }}
          value={message}
          onChangeText={(text) => {
                                setmessage(text);
                                setinvalidtext(false);
                                }}
        />
      </AlertDialogBody>
      <AlertDialogFooter>
        <ButtonGroup space="lg">
          <Button
            variant="outline"
            action="secondary"
            borderWidth={2}
            onPress={() => {
              setshowAlertReport(false)
            }}
           
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            bg="#512095"
            action="negative"
            onPress={() => {
                    submitreport();
            }}
            disabled={disablebutton}
          >
            <ButtonText>Report</ButtonText>
          </Button>
        </ButtonGroup>
      </AlertDialogFooter>
    </View>
  </TouchableWithoutFeedback>
</AlertDialogContent>
        </AlertDialog>
            <View margin={30} >
                <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false} refreshControl={<RefreshControl  colors={["#321bb9"]} refreshing={refreshing} onRefresh={onRefresh}/>}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                        <Icon name="arrow-back" size={30} color="white"/>
                    </TouchableHighlight>
                    <Text size='4xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Profile
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: '15%'}}>
                    <Image
                        alt='profilePic'
                        borderColor='white'
                        borderWidth={2}
                        border
                        w={140}
                        h={140}
                        zIndex={-1}
                        borderRadius="$full"
                        source={{
                            uri: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
                        }}
                    />

                    <Image
                        marginTop={-160}
                        alt='profilePic'
                        borderColor='white'
                        w={180}
                        h={180}
                        source={
                            rankName=="Beginner"?beginnerRank:
                            rankName=="Amateur"?amateurRank:
                            rankName=="Expert"?expertRank:
                            rankName=="Master"?masterRank:
                            rankName=="Champ"?champRank:
                            superstarRank
                        }
                    />
                    {/* </ImageBackground> */}
                    <View style={{ backgroundColor: '#512095', paddingHorizontal: '10%', paddingVertical: '1%', borderRadius: 30, marginTop: -20 }}>
                        <Text color='white'>{rankName} ({friend.rankpoints})</Text>
                    </View>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center' margin={20} gap={5}>
                        <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold' >{friend.username}, {calculateAge(friend.dateOfBirth)}</Text>
                        <Icon name="verified" size={24} color={friend.verified?"#2cd6d3":"#bcbcbc"}/>
                    </View>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'  gap={20}>
                    <TouchableOpacity  style={{backgroundColor:'#512095',padding:10}} onPress={()=>setShowAlertDialog(true)} >
                        <Text style={{color:'white'}}>Remove Friend</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style={{backgroundColor:'#512095',paddingHorizontal:20, paddingVertical:10}}>
                        <Text style={{color:'white'}} onPress={()=>setshowAlertReport(true)}  >Reports</Text>
                    </TouchableOpacity>
                    </View>
                </View>

                <Divider marginVertical={10}/>

                <View style={{ alignItems: 'center', flexDirection: 'column', marginTop: 0, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Bio
                    </Text>
                    <Text color='white' fontWeight='$light' textAlign='center'>
                        {!friend.bio?"No bio yet!":friend.bio}
                    </Text>
                </View>

                <Divider marginVertical={10}/>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Gender
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Icon name={friend.gender=="Male"?"male":"female"} size={30} color="white"/>
                        <Text color='white' fontWeight='$light'>
                            {friend.gender}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Global ranking spot
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Text color='white' fontWeight='$light'>
                            #{leaderboardnumber}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Total chat rooms joined
                    </Text>
                    <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                        <Text color='white' fontWeight='$light'>
                            {roomCount}
                        </Text>
                    </View>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 10, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Country of residence
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        {friend.country}
                    </Text>
                </View>

                <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
                    <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
                        Birthday
                    </Text>
                    <Text color='white' fontWeight='$light'>
                        {/* 17 April 2003 */}
                        {formatDateOfBirth(friend.dateOfBirth)}
                    </Text>
                </View>                
                </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
     
  )
}

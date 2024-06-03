import { View,AddIcon, Divider, HStack, Image, ImageBackground, Spinner, Text,Box } from '@gluestack-ui/themed';
import React ,{ useState }  from 'react'
import * as Animatable from 'react-native-animatable';
import { useFonts } from 'expo-font';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Button, ScrollView, TouchableHighlight } from 'react-native';
import logo from '../../../assets/img/Logo/Logo_WithoutBackground.png';
import { AntDesign } from '@expo/vector-icons';
export default function AboutUs({navigation}) {

    const [changingPage, setChangingPage] = useState(false)
    const [clickedButton, setClickedButton] = useState(false);

    const handleGoBackPressed = () => {
        setClickedButton(true);
        navigation.goBack();
        setTimeout(() => {
            setClickedButton(false);
        }, 1000);
    }

    const [fontsLoaded] = useFonts({
        'ArialRoundedMTBold': require('../../../assets/fonts/ARLRDBD.ttf'), 
    });
    if (!fontsLoaded) {
        return (
            <ImageBackground
                source={require('../../../assets/img/HomePage1.png')}
                style={{ flex:1 ,resizeMode: 'cover'}}
            >
                    <HStack space="sm">
                        <Text>LOADING...</Text><Spinner size="large" color="#321bb9" />
                    </HStack>
            </ImageBackground>
        ) 
    }

  return (
    <ImageBackground
        source={require('../../../assets/img/HomePage1.png')}
        style={{ flex:1 ,resizeMode: 'cover'}}
    >
        <Animatable.View animation={changingPage?"fadeOut":"fadeIn"} duration={500}>
            <View margin={30} marginBottom={100}>
            <ScrollView fadingEdgeLength={100} showsVerticalScrollIndicator = {false}>
                <View paddingTop={30} display='flex' flexDirection='row' alignItems='center' gap={10}>
                    <TouchableHighlight onPress={()=>{handleGoBackPressed()}} underlayColor={'transparent'} disabled={clickedButton}>
                    <AntDesign  name="arrowleft" size={25} color="white"   />
                    </TouchableHighlight>
                    <Text size='3xl' color='white' fontFamily='Roboto_500Medium'>
                        About us
                    </Text>
                </View>
                <View alignItems='center' justifyContent='center' margin={10} marginTop={40}>
                    <Image source={logo}
                    alt='company_logo'
                    backgroundColor='white'
                    w={'$72'}
                    h={'$72'}
                    borderRadius={30}
                    borderColor='#bcbcbc'
                    borderWidth={5}
                    />
                </View>

                <Text size='3xl' color='white' fontFamily='Roboto_500Medium' padding={30} textAlign='center'>
                    ChatFuze
                </Text>
                
                <Text color='white' fontFamily='Roboto_400Regular' size='lg' textAlign='left'>
                    ChatFuze is a forward-thinking Lebanese website development company that specializes in creating customized digital solutions for businesses. With a focus on creativity and quality, we design and develop visually appealing, user-friendly websites tailored to meet the unique needs of our clients. 
                </Text>
                <Text>
                    
                </Text>
                <Text color='white' fontFamily='Roboto_400Regular' size='lg' textAlign='left'>
                    Our team of experts collaborates closely with each client to understand their goals and deliver websites that not only look great but also drive engagement and growth. Whether you need a new website, an e-commerce platform, or a website redesign, ChatFuze has the expertise to bring your vision to life and enhance your online presence. 
                </Text>
            </ScrollView>
            </View>
        </Animatable.View>
    </ImageBackground>
  )
}

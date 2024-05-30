import { Link, LinkText, Text, View } from '@gluestack-ui/themed';
import React from 'react'
import { Linking, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather'

export default function SocialMedia({instagram,facebook}) {
  return (
    <View style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 10}}>
        <Text size='2xl' color='white' fontFamily='Roboto_400Regular'>
            Social Links
        </Text>
        {instagram&&<TouchableHighlight onPress={()=>{}} style={{ borderRadius: 10, padding: 5 }} underlayColor={'#51209550'}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10}}>
                <Icon name="instagram" size={30} color="white"/>
                <Text color='white' fontFamily='Roboto_300Light' size='lg'>
                    {/* @daher.ralph */}
                    {instagram}
                </Text>
            </View>
        </TouchableHighlight>}
        
        {facebook&&
        <Link href={facebook}>
        <TouchableHighlight onPress={()=>{Linking.openURL(facebook)}} style={{ borderRadius: 10, padding: 5 }} underlayColor={'#51209550'}>
            <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                <Icon name="facebook" size={30} color="white" style={{paddingRight: 10}}/><LinkText textDecorationLine='none' color='white' fontFamily='Roboto_300Light' size='lg'>Visit Profile </LinkText><Feather name="link" size={20} color="white"/>
            </View>
        </TouchableHighlight>
        </Link>}

        {!facebook&&!instagram&&
        <View>
            <Text color='white' fontFamily='Roboto_300Light' size='lg'>Socials have not been linked yet!</Text>
        </View>
        }
    </View>
  )
}



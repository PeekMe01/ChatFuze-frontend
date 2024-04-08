import { Link, LinkText, Text, View } from '@gluestack-ui/themed';
import React from 'react'
import { Linking, TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather'

export default function SocialMedia({instagram,facebook}) {
  return (
    <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
        <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
            Social Links
        </Text>
        {instagram&&<TouchableHighlight onPress={()=>{}} style={{ borderRadius: 10, padding: 5 }} underlayColor={'#51209550'}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10}}>
                <Icon name="instagram" size={30} color="white"/>
                <Text color='white' fontWeight='$light'>
                    {/* @daher.ralph */}
                    {instagram}
                </Text>
            </View>
        </TouchableHighlight>}
        
        {facebook&&
        <Link href={facebook}>
        <TouchableHighlight onPress={()=>{Linking.openURL(facebook)}} style={{ borderRadius: 10, padding: 5 }} underlayColor={'#51209550'}>
            <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
                <Icon name="facebook" size={30} color="white" style={{paddingRight: 10}}/><LinkText textDecorationLine='none' color='white' fontWeight='$light'>Visit Profile </LinkText><Feather name="link" size={20} color="white"/>
            </View>
        </TouchableHighlight>
        </Link>}

        {!facebook&&!instagram&&
        <View>
            <Text color='white' fontWeight='$light'>Socials have not been linked yet!</Text>
        </View>
        }
    </View>
  )
}

{/* <Link href={user.facebooklink}>
    <TouchableHighlight onPress={()=>{Linking.openURL(user.facebooklink)}} style={{ borderRadius: 10}} underlayColor={'#51209550'}>
        <View display='flex' flexDirection='row' justifyContent='center' alignItems='center'>
            <LinkText textDecorationLine='none' color='white' fontWeight='$light'>Visit Profile </LinkText><Feather name="link" size={20} color="white"/>
        </View>
    </TouchableHighlight>
</Link> */}

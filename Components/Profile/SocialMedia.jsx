import { Text, View } from '@gluestack-ui/themed';
import React from 'react'
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function SocialMedia() {
  return (
    <View style={{ alignItems: 'flex-start', flexDirection: 'column', marginTop: 20, gap: 10}}>
        <Text size='2xl' color='white' fontWeight='$light' fontFamily='ArialRoundedMTBold'>
            Social Links
        </Text>
        <TouchableHighlight onPress={()=>{}} style={{ borderRadius: 10, padding: 5 }} underlayColor={'#51209550'}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10}}>
                <Icon name="instagram" size={30} color="white"/>
                <Text color='white' fontWeight='$light'>
                    @daher.ralph
                </Text>
            </View>
        </TouchableHighlight>
        
        <TouchableHighlight onPress={()=>{}} style={{ borderRadius: 10, padding: 5 }} underlayColor={'#51209550'}>
            <View style={{ alignItems: 'center', flexDirection: 'row', gap: 10}}>
                <Icon name="facebook" size={30} color="white"/>
                <Text color='white' fontWeight='$light'>
                    Ralph Daher
                </Text>
            </View>
        </TouchableHighlight>
    </View>
  )
}

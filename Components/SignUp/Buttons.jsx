import * as React from 'react'
import {Text, TouchableOpacity, StyleSheet} from 'react-native'
import { Entypo } from '@expo/vector-icons'

export default function Buttons({title, onPress, icon, color}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
        <Entypo name={icon} size={28} color={color?color:'#f1f1f1'}/>
        <Text style={styles.text}>{title}</Text>
      
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        height: 40,
        flexDirection: 'row',
        alignItems: 'center'
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
        color: 'red',
        marginLeft: 10
    }
})

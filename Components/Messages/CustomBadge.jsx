import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CustomBadge = ({ focused, totalUnreadMessages }) => {
  return (
    <View style={{ position: 'relative' }}>
      <MaterialCommunityIcons name="message" size={30} color="white" />
      {totalUnreadMessages > 0 && (
        <View style={[styles.badge, focused ? styles.focusedBadge : styles.defaultBadge]}>
          <Text style={styles.badgeText}>{totalUnreadMessages}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    right: -10,
    top: -5,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  defaultBadge: {
    backgroundColor: '#512095',
  },
  focusedBadge: {
    marginBottom: 15,
    backgroundColor: '#512095',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default CustomBadge;
import React, { useState, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = 100;

const HorizontalNumberPicker = ({ selectedIndex, setSelectedIndex }) => {
  const flatListRef = useRef(null);

  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_WIDTH);
    setSelectedIndex(index);
  };

  const handleItemPress = (index) => {
    flatListRef.current.scrollToIndex({ animated: true, index });
    setSelectedIndex(index);
  };

  const renderItem = ({ item, index }) => {
    const isSelected = index === selectedIndex;
    return (
      <View style={[styles.itemContainer, isSelected && styles.selectedItem]}>
        <Text
          style={[styles.itemText, isSelected && styles.selectedItemText]}
          onPress={() => handleItemPress(index)}
        >
          {item}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={numbers}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        onScroll={handleScroll}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: '60%',
    marginLeft: '-30%'
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100
  },
  selectedItem: {
    backgroundColor: '#51209520',
    borderRadius: 1000
  },
  itemText: {
    fontSize: 24,
    color: '#ffffff50',
  },
  selectedItemText: {
    color: '#512095',
    fontWeight: 'bold',
  },
});

export default HorizontalNumberPicker;

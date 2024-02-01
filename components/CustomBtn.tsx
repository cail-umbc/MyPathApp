import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomBtn = ({ title, onPress }) => {
  return (
    <TouchableOpacity
      accessible={true}
      accessibilityRole="button"
      style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomBtn;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#127ACC',
    padding: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textTransform: 'none', // Disable automatic capitalization
    fontSize: 19,
  },
});


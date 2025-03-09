import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const HeadTrackingButton = ({ isActive, onToggle }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        { backgroundColor: isActive ? 'red' : 'green' }
      ]} 
      onPress={onToggle}
    >
      <Text style={styles.buttonText}>
        {isActive ? 'Disable' : 'Enable'} Tracking
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    marginRight: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default HeadTrackingButton;
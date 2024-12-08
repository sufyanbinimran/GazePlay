import React, { useState, useRef, useEffect } from 'react';
import { Animated, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const colorFamilies = {
  blues: [
    '#1E88E5', 
    '#1976D2', 
    '#1565C0', 
    '#0D47A1', 
    '#82B1FF', 
    '#2962FF', 
  ],
  greens: [
    '#43A047', 
    '#2E7D32', 
    '#1B5E20', 
    '#00C853', 
    '#00E676', 
    '#64DD17', 
  ],
  reds: [
    '#E53935', 
    '#D32F2F', 
    '#C62828', 
    '#B71C1C', 
    '#FF8A80', 
    '#FF1744', 
  ],
  yellows: [
    '#FDD835', 
    '#FBC02D', 
    '#F9A825', 
    '#F57F17', 
    '#FFFF00', 
    '#FFD600', 
  ],
  purples: [
    '#8E24AA', 
    '#6A1B9A', 
    '#4A148C', 
    '#AA00FF', 
    '#E040FB', 
    '#D500F9', 
  ],
  oranges: [
    '#FB8C00', 
    '#EF6C00', 
    '#E65100', 
    '#FF9100', 
    '#FFAB40', 
    '#FF6D00', 
  ],
  grays: [
    '#757575', 
    '#616161', 
    '#424242', 
    '#9E9E9E', 
    '#BDBDBD', 
    '#78909C', 
  ],
};

const animations = {
  bounce: (animatedValue) =>
    Animated.loop(
      Animated.sequence([
        Animated.spring(animatedValue, {
          toValue: 1.2,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(animatedValue, {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ])
    ),
  shake: (animatedValue) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ])
    ),
  rotate: (rotateValue) =>
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ),
};

const AnimatedIcon = ({ name, size, color, animationType = 'bounce' }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const shakeValue = useRef(new Animated.Value(0)).current;
  const rotateValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let animation;
    switch (animationType) {
      case 'bounce':
        animation = animations.bounce(scaleValue);
        break;
      case 'shake':
        animation = animations.shake(shakeValue);
        break;
      case 'rotate':
        animation = animations.rotate(rotateValue);
        break;
    }
    animation.start();
    return () => animation.stop();
  }, [animationType]);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const getAnimatedStyle = () => {
    switch (animationType) {
      case 'bounce':
        return { transform: [{ scale: scaleValue }] };
      case 'shake':
        return { transform: [{ translateX: shakeValue }] };
      case 'rotate':
        return { transform: [{ rotate: spin }] };
      default:
        return {};
    }
  };

  return (
    <Animated.View style={getAnimatedStyle()}>
      <Icon name={name} size={size} color={color} />
    </Animated.View>
  );
};

const allIcons = [
  { id: 'i', icon: 'account', text: 'I', color: colorFamilies.blues[0], animationType: 'bounce' },
  { id: 'you', icon: 'hand-pointing-right', text: 'You', color: colorFamilies.purples[1], animationType: 'bounce' },
  { id: 'it', icon: 'cube-outline', text: 'It', color: colorFamilies.oranges[2], animationType: 'rotate' },
  { id: 'can', icon: 'check-circle-outline', text: 'Can', color: colorFamilies.greens[3], animationType: 'bounce' },
  { id: 'do', icon: 'run', text: 'Do', color: colorFamilies.reds[4], animationType: 'shake' },
  { id: 'have', icon: 'bag-personal', text: 'Have', color: colorFamilies.yellows[5], animationType: 'bounce' },
  { id: 'want', icon: 'star-circle-outline', text: 'Want', color: colorFamilies.purples[0], animationType: 'bounce' },
  { id: 'like', icon: 'thumb-up-outline', text: 'Like', color: colorFamilies.blues[2], animationType: 'bounce' },
  { id: 'help', icon: 'handshake', text: 'Help', color: colorFamilies.greens[4], animationType: 'rotate' },
  { id: 'not', icon: 'cancel', text: 'Not', color: colorFamilies.reds[1], animationType: 'shake' },
  { id: 'stop', icon: 'stop-circle-outline', text: 'Stop', color: colorFamilies.reds[5], animationType: 'shake' },
  { id: 'more', icon: 'plus-circle-outline', text: 'More', color: colorFamilies.oranges[3], animationType: 'rotate' },
  { id: 'and', icon: 'ampersand', text: 'And', color: colorFamilies.yellows[2], animationType: 'bounce' },
  { id: 'the', icon: 'play', text: 'The', color: colorFamilies.purples[4], animationType: 'shake' },
  { id: 'that', icon: 'arrow-right-box', text: 'That', color: colorFamilies.blues[5], animationType: 'rotate' },

  // Phrase items
  { id: 'hi', icon: 'hand-wave', text: 'Hi!', color: colorFamilies.yellows[0], animationType: 'shake' },
  { id: 'bye', icon: 'exit-run', text: 'Bye!', color: colorFamilies.oranges[1], animationType: 'bounce' },
  { id: 'havegoodday', icon: 'weather-sunny', text: 'Have good day', color: colorFamilies.yellows[3], animationType: 'rotate' },
  { id: 'howareyou', icon: 'comment-question-outline', text: 'How are you?', color: colorFamilies.purples[2], animationType: 'bounce' },
  { id: 'howsitgoing', icon: 'account-question-outline', text: "How's it going?", color: colorFamilies.blues[3], animationType: 'bounce' },

  // Communication items
  { id: 'yes', icon: 'emoticon-happy-outline', text: 'Yes', color: colorFamilies.greens[0], animationType: 'bounce' },
  { id: 'ok', icon: 'gesture-ok', text: 'Ok', color: colorFamilies.greens[5], animationType: 'bounce' },
  { id: 'maybe', icon: 'swap-vertical-circle-outline', text: 'Maybe', color: colorFamilies.oranges[4], animationType: 'rotate' },
  { id: 'no', icon: 'close-circle', text: 'No', color: colorFamilies.reds[0], animationType: 'shake' },
  { id: 'wait', icon: 'hand-wave', text: 'Wait', color: colorFamilies.oranges[5], animationType: 'shake' },
];

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextIcon = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % allIcons.length);
  };

  const prevIcon = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + allIcons.length) % allIcons.length);
  };

  const currentIcon = allIcons[currentIndex];

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: `${currentIcon.color}22` }]}>
        <Text style={styles.title}>{currentIcon.text}</Text>
        <View style={styles.iconContainer}>
          <AnimatedIcon
            name={currentIcon.icon}
            size={100}
            color={currentIcon.color}
            animationType={currentIcon.animationType}
          />
        </View>
      </View>
      <View style={styles.navigation}>
        <TouchableOpacity 
          onPress={prevIcon} 
          style={[styles.navButton, { backgroundColor: currentIcon.color }]}
        >
          <Text style={styles.buttonText}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={nextIcon} 
          style={[styles.navButton, { backgroundColor: currentIcon.color }]}
        >
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  card: {
    width: '100%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2D3436',
  },
  iconContainer: {
    marginVertical: 30,
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  navButton: {
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
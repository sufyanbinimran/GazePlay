import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen({ navigation }) {
  const logoScale = React.useRef(new Animated.Value(0.6)).current;
  const logoOpacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 2,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient 
      colors={['#4A90E2', '#50C878']} 
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.logoContainer, 
          { 
            transform: [{ scale: logoScale }],
            opacity: logoOpacity 
          }
        ]}
      >
        <View style={styles.eyeContainer}>
          <Text style={styles.eyeIcon}>👁️</Text>
          <View style={styles.eyeGlint} />
        </View>
        <Text style={styles.title}>GazePlay</Text>
        <Text style={styles.subtitle}>Empowering Communication</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  eyeContainer: {
    position: 'relative',
    backgroundColor: 'white',
    borderRadius: 120,
    width: 180,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  eyeIcon: {
    fontSize: 100,
    zIndex: 10,
  },
  eyeGlint: {
    position: 'absolute',
    top: 40,
    right: 50,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  title: {
    fontSize: 52,
    fontWeight: '700',
    color: 'white',
    marginTop: 20,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 22,
    color: '#F0F8FF',
    fontWeight: '300',
    marginTop: 10,
    letterSpacing: 1,
  },
});
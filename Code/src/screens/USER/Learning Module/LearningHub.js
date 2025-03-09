import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function LearningHub({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Learning Hub</Text>
        <Text style={styles.headerSubtitle}>Your learning journey starts here</Text>
      </View>
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={[styles.gameCard, styles.cardShadow]}
          onPress={() => navigation.navigate('WordTrackingGame')}
        >
          <View style={styles.iconContainer}>
            <Icon name="gamepad-variant" size={32} color="#ffffff" />
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Word Tracking Game</Text>
            <Text style={styles.gameDescription}>
              Enhance your vocabulary and tracking skills
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.gameCard, styles.cardShadow, { backgroundColor: '#4CAF50', marginTop: 16 }]}
          onPress={() => navigation.navigate('IconQuizGame')}
        >
          <View style={styles.iconContainer}>
            <Icon name="puzzle-outline" size={32} color="#ffffff" />
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Icon Learning Game</Text>
            <Text style={styles.gameDescription}>
              Learn icons through animation
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.gameCard, styles.cardShadow, { backgroundColor: '#9C27B0', marginTop: 16 }]}
          onPress={() => navigation.navigate('StoryGame')}
        >
          <View style={styles.iconContainer}>
            <Icon name="book-open-variant" size={32} color="#ffffff" />
          </View>
          <View style={styles.gameInfo}>
            <Text style={styles.gameTitle}>Story Game</Text>
            <Text style={styles.gameDescription}>
              Explore interactive stories and improve comprehension
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 16, 
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  content: {
    padding: 16,
  },
  gameCard: {
    backgroundColor: '#2196F3',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardShadow: {  
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  gameDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
});
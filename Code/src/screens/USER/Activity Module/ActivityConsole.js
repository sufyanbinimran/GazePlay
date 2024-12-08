import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Activity, MapPin, Zap, BookOpen, MessageCircle } from 'lucide-react-native';

export default function ActivityConsole({ navigation }) {
  const activityItems = [
    {
      id: 1,
      title: 'Personal Activities',
      icon: <Activity size={24} color="#ffffff" />,
      description: 'Track and manage your daily activities',
      backgroundColor: '#4CAF50',
    },
    {
      id: 2,
      title: 'QuickPhrases',
      icon: <MessageCircle size={24} color="#ffffff" />,
      description: 'Quickly access and share pre-defined phrases',
      backgroundColor: '#673AB7',
    },
    {
      id: 3,
      title: 'QuickFires',
      icon: <Zap size={24} color="#ffffff" />,
      description: 'Quick tasks and challenges',
      backgroundColor: '#FF9800',
    },
    {
      id: 4,
      title: 'Places',
      icon: <MapPin size={24} color="#ffffff" />,
      description: 'Discover and save important locations',
      backgroundColor: '#2196F3',
    },
    {
      id: 5,
      title: 'Topics',
      icon: <BookOpen size={24} color="#ffffff" />,
      description: 'Browse through various topics',
      backgroundColor: '#9C27B0',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Activity Console</Text>
          <Text style={styles.headerSubtitle}>Choose your activity type</Text>
        </View>

        <View style={styles.cardsContainer}>
          {activityItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.card, { backgroundColor: item.backgroundColor }]}
              onPress={() => {
                navigation.navigate(`${item.title.replace(/\s+/g, '')}Screen`);
              }}
            >
              <View style={styles.cardContent}>
                <View style={styles.iconContainer}>{item.icon}</View>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  cardsContainer: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardContent: {
    padding: 20,
  },
  iconContainer: {
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
});
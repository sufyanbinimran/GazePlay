import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function TopicsScreen() {
  const topicCategories = [
    {
      id: 'aboutMe',
      title: 'About Me',
      icon: 'account',
      backgroundColor: '#2C3E50',
      items: [
        { name: 'My Profile', icon: 'account-details' },
        { name: 'My Likes', icon: 'thumb-up' },
        { name: 'My Dislikes', icon: 'thumb-down' },
        { name: 'My Family', icon: 'account-group' }
      ]
    },
    {
      id: 'bubbles',
      title: 'Bubbles',
      icon: 'message-text',
      backgroundColor: '#8E44AD',
      items: [
        { name: 'Greetings', icon: 'hand-wave' },
        { name: 'Questions', icon: 'help-circle' },
        { name: 'Answers', icon: 'check-circle' },
        { name: 'Common Phrases', icon: 'text-box' }
      ]
    },
    {
      id: 'myEmotions',
      title: 'My Emotions',
      icon: 'emoticon-outline',
      backgroundColor: '#E74C3C',
      items: [
        { name: 'Happy', icon: 'emoticon-happy' },
        { name: 'Sad', icon: 'emoticon-sad' },
        { name: 'Angry', icon: 'emoticon-angry' },
        { name: 'Excited', icon: 'emoticon-excited' },
        { name: 'Tired', icon: 'emoticon-tired' }
      ]
    },
    {
      id: 'needs',
      title: 'Needs',
      icon: 'hand-heart',
      backgroundColor: '#16A085',
      items: [
        { name: 'Food', icon: 'food' },
        { name: 'Drink', icon: 'cup-water' },
        { name: 'Rest', icon: 'sleep' },
        { name: 'Help', icon: 'hand-pointing-up' }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Topics</Text>
        <Text style={styles.headerSubtitle}>Browse and learn communication topics</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.categoryContainer}>
          {topicCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.backgroundColor }]}
              onPress={() => console.log(`Selected category: ${category.title}`)}
            >
              <View style={styles.categoryHeader}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name={category.icon} 
                    size={32} 
                    color="#FFF"
                  />
                </View>
                <Text style={styles.categoryTitle}>{category.title}</Text>
              </View>
              
              <View style={styles.itemsContainer}>
                {category.items.map((item, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.itemButton}
                    onPress={() => console.log(`Selected item: ${item.name}`)}
                  >
                    <MaterialCommunityIcons 
                      name={item.icon} 
                      size={20} 
                      color="#FFF"
                      style={styles.itemIcon}
                    />
                    <Text style={styles.itemText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
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
  scrollView: {
    flex: 1,
  },
  categoryContainer: {
    padding: 16,
  },
  categoryCard: {
    borderRadius: 15,
    marginBottom: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -8,
    marginRight: -8,
  },
  itemButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 12,
    margin: 8,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemIcon: {
    marginRight: 8,
  },
  itemText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
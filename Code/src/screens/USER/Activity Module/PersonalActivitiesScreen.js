import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function PersonalActivitiesScreen() {
  const communicationItems = [
    { id: 'i', icon: 'account', iconType: 'material-community', text: 'I' },
    { id: 'you', icon: 'account', iconType: 'material-community', text: 'you' },
    { id: 'it', icon: 'cube-outline', iconType: 'material-community', text: 'it' },
    { id: 'can', icon: 'thumb-up', iconType: 'material', text: 'can' },
    { id: 'do', icon: 'hand', iconType: 'material-community', text: 'do' },
    { id: 'have', icon: 'hand-okay', iconType: 'material-community', text: 'have' },
    { id: 'want', icon: 'heart', iconType: 'material-community', text: 'want' },
    { id: 'like', icon: 'heart-outline', iconType: 'material-community', text: 'like' },
    { id: 'help', icon: 'help-circle', iconType: 'material-community', text: 'help' },
    { id: 'not', icon: 'close', iconType: 'material', text: 'not' },
    { id: 'stop', icon: 'hand', iconType: 'material', text: 'stop' },
    { id: 'more', icon: 'plus', iconType: 'material-community', text: 'more' },
    { id: 'and', icon: 'plus', iconType: 'material-community', text: 'and' },
    { id: 'the', icon: 'arrow-right', iconType: 'material-community', text: 'the' },
    { id: 'that', icon: 'arrow-right-circle', iconType: 'material-community', text: 'that' },
  ];

  const getIcon = (item) => {
    if (item.iconType === 'material-community') {
      return <MaterialCommunityIcons name={item.icon} size={24} color="#000" />;
    }
    return <MaterialIcons name={item.icon} size={24} color="#000" />;
  };

  const getBackgroundColor = (id) => {
    const colorMap = {
      i: '#FFD700', // Yellow
      you: '#FFD700',
      it: '#FFD700',
      can: '#90EE90', // Green
      do: '#90EE90',
      have: '#90EE90',
      want: '#87CEEB', // Blue
      like: '#87CEEB',
      help: '#87CEEB',
      not: '#FFB6C6', // Red
      stop: '#FFB6C6',
      more: '#FFB6C6',
      and: '#FFA500', // Orange
      the: '#FFA500',
      that: '#FFA500',
    };
    return colorMap[id] || '#FFFFFF';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Communication Board</Text>
          <Text style={styles.headerSubtitle}>Tap icons to communicate</Text>
        </View>

        <View style={styles.grid}>
          {communicationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.gridItem,
                { backgroundColor: getBackgroundColor(item.id.toLowerCase()) }
              ]}
              onPress={() => console.log(item.text)}
            >
              <View style={styles.iconContainer}>
                {getIcon(item)}
              </View>
              <Text style={styles.itemText}>{item.text}</Text>
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  gridItem: {
    width: '33.33%',
    padding: 8,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  iconContainer: {
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
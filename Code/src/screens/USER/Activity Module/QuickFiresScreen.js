import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function QuickFiresScreen() {
  const [pressedId, setPressedId] = useState(null);

  // Color families object with multiple shades
  const colorFamilies = {
    yellows: ['#FFD700', '#FFC107', '#FFE082', '#FFB900', '#FFD54F'],
    greens: ['#90EE90', '#4CAF50', '#81C784', '#66BB6A', '#A5D6A7'],
    blues: ['#87CEEB', '#2196F3', '#64B5F6', '#42A5F5', '#90CAF9'],
    reds: ['#FFB6C6', '#EF5350', '#E57373', '#FF8A80', '#FF80AB'],
    oranges: ['#FFA500', '#FF9800', '#FFB74D', '#FFA726', '#FFCC80'],
  };

  const communicationItems = [
    { id: 'yes', icon: 'emoticon-happy-outline', text: 'Yes', color: colorFamilies.greens[0] },
    { id: 'ok', icon: 'gesture-ok', text: 'Ok', color: colorFamilies.greens[1] },
    { id: 'maybe', icon: 'swap-vertical-circle-outline', text: 'Maybe', color: colorFamilies.yellows[0] },
    { id: 'good', icon: 'thumb-up-outline', text: 'Good', color: colorFamilies.greens[2] },
    { id: 'right', icon: 'emoticon-happy-outline', text: 'Right', color: colorFamilies.greens[3] },
    { id: 'sure', icon: 'account-outline', text: 'Sure', color: colorFamilies.greens[4] },
    { id: 'no', icon: 'close-circle', text: 'No', color: colorFamilies.reds[0] },
    { id: 'idontknow', icon: 'help-circle-outline', text: "I don't know", color: colorFamilies.yellows[1] },
    { id: 'noway', icon: 'account-remove-outline', text: 'No way', color: colorFamilies.reds[1] },
    { id: 'bad', icon: 'thumb-down-outline', text: 'Bad', color: colorFamilies.reds[2] },
    { id: 'really', icon: 'alert-circle-outline', text: 'Really', color: colorFamilies.yellows[2] },
    { id: 'dont', icon: 'hand-back-left-outline', text: "Don't", color: colorFamilies.reds[3] },
    { id: 'wait', icon: 'hand-wave', text: 'Wait', color: colorFamilies.blues[0] },
    { id: 'comehere', icon: 'gesture-tap', text: 'Come here', color: colorFamilies.blues[1] },
    { id: 'look', icon: 'eye-outline', text: 'Look', color: colorFamilies.blues[2] },
    { id: 'here', icon: 'arrow-down-circle-outline', text: 'Here', color: colorFamilies.oranges[0] },
    { id: 'there', icon: 'arrow-right-circle-outline', text: 'There', color: colorFamilies.oranges[1] },
    { id: 'mom', icon: 'account-child-outline', text: 'Mom', color: colorFamilies.oranges[2] },
    { id: 'please', icon: 'hand-peace-variant', text: 'Please', color: colorFamilies.blues[3] },
    { id: 'thankyou', icon: 'account-multiple-outline', text: 'Thank you', color: colorFamilies.yellows[3] },
    { id: 'yourewelcome', icon: 'account-check-outline', text: "You're welcome", color: colorFamilies.yellows[4] },
    { id: 'sorry', icon: 'emoticon-sad-outline', text: 'Sorry', color: colorFamilies.reds[4] },
    { id: 'excuseme', icon: 'account-voice', text: 'Excuse me', color: colorFamilies.blues[4] }
  ];

  const handlePress = (id) => {
    setPressedId(id);
    console.log(`Selected: ${id}`);
    setTimeout(() => setPressedId(null), 200);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Communication</Text>
        <Text style={styles.headerSubtitle}>Tap to express yourself</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.grid}>
          {communicationItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.gridItem,
                { backgroundColor: item.color },
                pressedId === item.id && styles.pressedItem
              ]}
              onPress={() => handlePress(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons 
                  name={item.icon} 
                  size={32} 
                  color="#000"
                />
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
    padding: 16,
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
    marginTop: 4,
  },
  scrollView: {
    backgroundColor: '#f5f5f5',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  gridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pressedItem: {
    transform: [{ scale: 0.95 }],
    opacity: 0.7,
  },
  iconContainer: {
    marginBottom: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
});
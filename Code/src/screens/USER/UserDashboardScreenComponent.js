import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Activity, BookOpen, Users } from 'lucide-react-native';

export default function UserDashboard({ navigation }) {
  const menuItems = [
    {
      id: 1,
      title: 'Activity\nConsole',
      icon: <Activity color="white" size={40} strokeWidth={1.5} />,
      onPress: () => navigation.navigate('ActivityConsole'),
      backgroundColor: '#4CAF50' // green
    },
    {
      id: 2,
      title: 'Learning\nHub',
      icon: <BookOpen color="white" size={40} strokeWidth={1.5} />,
      onPress: () => navigation.navigate('LearningHub'),
      backgroundColor: '#2196F3' // blue
    },
    {
      id: 3,
      title: 'Quick\nContacts',
      icon: <Users color="white" size={40} strokeWidth={1.5} />,
      onPress: () => navigation.navigate('QuickContacts'),
      backgroundColor: '#FF9800' // orange
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Top section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome!</Text>
        <Text style={styles.subText}>What would you like to do today?</Text>
      </View>

      {/* Center section with icons */}
      <View style={styles.centerContainer}>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.menuItem, { backgroundColor: item.backgroundColor }]}
              onPress={item.onPress}
            >
              {item.icon}
              <Text style={styles.menuText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bottom space */}
      <View style={styles.bottomSpace} />
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#666666',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  menuContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  menuItem: {
    width: '28%',
    aspectRatio: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    textAlign: 'center',
  },
  bottomSpace: {
    flex: 0.2,
  }
});
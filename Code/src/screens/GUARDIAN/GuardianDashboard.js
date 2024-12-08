import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function GuardianDashboard({ navigation }) {
  const dashboardItems = [
    {
      id: 1,
      title: 'Monitor Progress',
      icon: 'chart-line',
      description: 'Track your child\'s learning journey',
      backgroundColor: '#4CAF50', // Green
      onPress: () => navigation.navigate('MonitorProgress')
    },
    {
      id: 3,
      title: 'Call Permission',
      icon: 'phone-lock',
      description: 'Manage call permissions',
      backgroundColor: '#FF9800', 
      onPress: () => navigation.navigate('CallPermission')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Guardian Dashboard</Text>
        <Text style={styles.subText}>Manage and monitor your child's activities</Text>
      </View>

      <View style={styles.cardsContainer}>
        {dashboardItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { backgroundColor: item.backgroundColor }]}
            onPress={item.onPress}
          >
            <View style={styles.cardContent}>
              <View style={styles.iconWrapper}>
                <Icon name={item.icon} size={32} color="#ffffff" />
              </View>
              <View style={styles.textContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  subText: {
    fontSize: 16,
    color: '#666666',
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
});
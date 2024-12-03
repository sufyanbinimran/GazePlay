import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { BarChart, LineChart, PieChart } from 'react-native-chart-kit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function MonitorProgress() {
  const [selectedCategory, setSelectedCategory] = useState('Learning');

  const learningProgressData = {
    labels: ['Personal Activities','Quickfires', 'Places Visited'],
    datasets: [{
      data: [75, 85, 60]
    }]
  };

  const activityCompletionData = [
    {
      name: 'Completed',
      population: 65,
      color: '#4CAF50',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    },
    {
      name: 'Pending',
      population: 35,
      color: '#FF9800',
      legendFontColor: '#7F7F7F',
      legendFontSize: 15
    }
  ];

  const timeSpentData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      data: [2, 3, 2.5, 4, 3.5, 1.5]
    }]
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Child's Progress</Text>
      </View>

      <ScrollView>
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Activity Progress</Text>
          <BarChart
            data={learningProgressData}
            width={350}
            height={220}
            yAxisLabel="%"
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(33, 150, 243, ${opacity})`,
            }}
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Alphabets Tracking </Text>
          <PieChart
            data={activityCompletionData}
            width={350}
            height={220}
            chartConfig={{
              color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Screen Time </Text>
          <LineChart
            data={timeSpentData}
            width={350}
            height={220}
            yAxisLabel="hrs "
            chartConfig={{
              backgroundColor: '#ffffff',
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
            }}
          />
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
    color: '#333333',
  },
  chartSection: {
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333333',
  },
});
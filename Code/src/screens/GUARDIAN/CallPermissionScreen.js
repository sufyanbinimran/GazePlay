import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CallPermissionScreen = () => {
  const [callRequests, setCallRequests] = useState([
    { 
      id: '1', 
      childName: 'Emma', 
      phoneNumber: '+1 (555) 123-4567', 
      timestamp: '2:15 PM',
      status: 'pending'
    },
    { 
      id: '2', 
      childName: 'Jack', 
      phoneNumber: '+1 (555) 987-6543', 
      timestamp: '1:45 PM',
      status: 'pending'
    }
  ]);

  const handleGrantPermission = (id) => {
    const updatedRequests = callRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'granted' } 
        : request
    );
    setCallRequests(updatedRequests);
  };

  const handleRemovePermission = (id) => {
    const updatedRequests = callRequests.map(request => 
      request.id === id 
        ? { ...request, status: 'denied' } 
        : request
    );
    setCallRequests(updatedRequests);
  };

  const renderCallRequest = ({ item }) => (
    <View style={styles.requestContainer}>
      <View style={styles.requestDetails}>
        <Text style={styles.childName}>{item.childName}</Text>
        <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
      <View style={styles.actionButtons}>
        {item.status === 'pending' && (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.grantButton]}
              onPress={() => handleGrantPermission(item.id)}
            >
              <Icon name="check" size={20} color="white" />
              <Text style={styles.actionButtonText}>Grant</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.removeButton]}
              onPress={() => handleRemovePermission(item.id)}
            >
              <Icon name="close" size={20} color="white" />
              <Text style={styles.actionButtonText}>Remove</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'granted' && (
          <Text style={styles.grantedStatus}>Permission Granted</Text>
        )}
        {item.status === 'denied' && (
          <Text style={styles.removedStatus}>Permission Denied</Text>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Call Permissions</Text>
        <Text style={styles.headerSubtitle}>Manage your child's call requests</Text>
      </View>
      <FlatList
        data={callRequests}
        renderItem={renderCallRequest}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pending call requests</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
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
  },
  requestContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  requestDetails: {
    flex: 2,
  },
  childName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  phoneNumber: {
    fontSize: 15,
    color: '#666',
  },
  timestamp: {
    fontSize: 13,
    color: '#999',
  },
  actionButtons: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginVertical: 4,
    width: '100%',
  },
  grantButton: {
    backgroundColor: '#4CAF50',
  },
  removeButton: {
    backgroundColor: '#F44336',
  },
  actionButtonText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  grantedStatus: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  removedStatus: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
  },
});

export default CallPermissionScreen;
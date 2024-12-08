import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  Modal, 
  Alert,
  ScrollView 
} from 'react-native';
import { MapPin, Plus, Trash2 } from 'lucide-react-native';

export default function PlacesScreen() {
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: 'Home',
      address: '123 Main Street, City',
    },
    {
      id: 2,
      name: 'Therapy Center',
      address: '456 Care Avenue, City',
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newPlace, setNewPlace] = useState({ 
    name: '', 
    address: '',
    latitude: null,
    longitude: null 
  });

  const addPlace = () => {
    if (!newPlace.name || !newPlace.address) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const placeEntry = {
      id: places.length + 1,
      name: newPlace.name,
      address: newPlace.address,
    };

    setPlaces([...places, placeEntry]);
    setNewPlace({ name: '', address: '' });
    setModalVisible(false);
  };

  const deletePlace = (id) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this place?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => setPlaces(places.filter(place => place.id !== id)) 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Important Places</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Plus size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.placesContainer}>
        {places.map((place) => (
          <View key={place.id} style={styles.placeCard}>
            <View style={styles.placeInfo}>
              <MapPin size={24} color="#2196F3" />
              <View style={styles.placeDetails}>
                <Text style={styles.placeName}>{place.name}</Text>
                <Text style={styles.placeAddress}>{place.address}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => deletePlace(place.id)}>
              <Trash2 size={20} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Place</Text>
            <TextInput
              style={styles.input}
              placeholder="Place Name (e.g., Home, Therapy Center)"
              value={newPlace.name}
              onChangeText={(text) => setNewPlace({...newPlace, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Address"
              value={newPlace.address}
              onChangeText={(text) => setNewPlace({...newPlace, address: text})}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={addPlace}
              >
                <Text style={styles.buttonText}>Add Place</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  placesContainer: {
    padding: 16,
  },
  placeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  placeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  placeDetails: {
    marginLeft: 12,
    flex: 1,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  placeAddress: {
    fontSize: 14,
    color: '#666',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
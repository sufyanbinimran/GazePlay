import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  Alert, 
  FlatList, 
  Platform 
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const apiBaseURL = Platform.select({
  ios: 'http://localhost:5001',
  android: 'http://10.0.2.2:5001',
  default: 'http://localhost:5001'
});


const validatePhoneNumber = (phoneNumber) => {
  const cleanedNumber = phoneNumber.replace(/\D/g, '');


  const pakistaniNumberRegex = /^92\d{10}$/;

  if (!pakistaniNumberRegex.test(cleanedNumber)) {
    const possibleFormats = /^(?:0092|\+92|0)?(3\d{9})$/;
    const match = phoneNumber.match(possibleFormats);
    if (match) {
     
      const formattedNumber = `+92${match[1]}`;
      return {
        isValid: true,
        formattedNumber: formattedNumber,
        error: null
      };
    }
    return {
      isValid: false,
      formattedNumber: null,
      error: 'Invalid Pakistani phone number. Must be in the format +923XXYYYYYYY.'
    };
  }

  
  const formattedNumber = `+92 ${cleanedNumber.slice(2, 5)} ${cleanedNumber.slice(5)}`;
  return {
    isValid: true,
    formattedNumber: formattedNumber,
    error: null
  };
};

export default function QuickContacts() {
  const navigation = useNavigation();
  const [contacts, setContacts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load  token
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading token:', error);
        Alert.alert('Authentication Error', 'Failed to load authentication token');
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  // Fetch contacts 
  useEffect(() => {
    const fetchContacts = async () => {
      if (!token) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(`${apiBaseURL}/contacts`, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        console.log('Fetched contacts response:', response.data);
        
        if (response.data.status === 'ok') {
          setContacts(response.data.data || []);
        } else {
          Alert.alert('Error', 'Failed to fetch contacts');
        }
      } catch (error) {
        console.error('Fetch contacts error:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to fetch contacts');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContacts();
  }, [token]);

  const addContact = async () => {
    if (!newContact.name || !newContact.phone) {
        Alert.alert('Error', 'Please enter both name and phone number');
        return;
    }

    const { isValid, formattedNumber, error } = validatePhoneNumber(newContact.phone);
    if (!isValid) {
        Alert.alert('Invalid Phone Number', error);
        return;
    }

    // Check existing phone number 
    const duplicate = contacts.some(contact => contact.phoneNumber === formattedNumber);
    if (duplicate) {
        Alert.alert('Duplicate Error', 'This phone number already exists in your contacts.');
        return;
    }

    if (!token) {
        Alert.alert('Error', 'Authentication token not found');
        return;
    }

    try {
        const response = await axios.post(`${apiBaseURL}/contacts`, 
            { name: newContact.name, phoneNumber: formattedNumber }, 
            { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );

        if (response.data.status === 'ok') {
            // Add the new contact in list
            setContacts(prevContacts => [...prevContacts, { ...response.data.data, phoneNumber: formattedNumber }]);
            setNewContact({ name: '', phone: '' });  
            setModalVisible(false); 
            Alert.alert('Success', 'Contact added successfully');
        } else {
            Alert.alert('Error', response.data.data || 'Failed to add contact');
        }
    } catch (error) {
        console.error('Add contact error:', error.response ? error.response.data : error.message);
        Alert.alert('Error', 'Failed to add contact');
    }
};


 
  const deleteContact = async (contactId) => {
    if (!token) {
      Alert.alert('Error', 'No authentication token found');
      return;
    }

    try {
      const response = await axios.delete(`${apiBaseURL}/contacts/${contactId}`, { 
        headers: { 'Authorization': `Bearer ${token}` } 
      });

      if (response.data.status === 'ok') {
        setContacts(contacts.filter(contact => contact._id !== contactId));
        Alert.alert('Success', 'Contact deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete contact');
      }
    } catch (error) {
      console.error('Delete contact error:', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'Failed to delete contact');
    }
  };

  
  const renderContactItem = ({ item }) => (
    <View style={styles.contactCard}>
      <TouchableOpacity 
        style={styles.contactContent} 
        onPress={() => {
          console.log(`Dialing ${item.name}`);
        }}
      >
        <Icon name="phone" size={24} color="#ffffff" />
        <View style={styles.contactTextContainer}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phoneNumber}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.deleteIcon} 
        onPress={() => {
          Alert.alert(
            'Delete Contact', 
            `Are you sure you want to delete ${item.name}?`,
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deleteContact(item._id) }
            ]
          );
        }}
      >
        <Icon name="delete" size={24} color="#FF0000" />
      </TouchableOpacity>
    </View>
  );

  // Render
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Contacts</Text>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => setModalVisible(true)}
        >
          <Icon name="plus" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading contacts...</Text>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text>No contacts found. Add a new contact!</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderContactItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.contactsContainer}
        />
      )}

      {/* Add Contact Modal */}
      <Modal 
        visible={isModalVisible} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Contact</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Name" 
              value={newContact.name} 
              onChangeText={(text) => setNewContact({ ...newContact, name: text })} 
            />
            <TextInput 
              style={styles.input} 
              placeholder="Phone Number" 
              value={newContact.phone} 
              onChangeText={(text) => setNewContact({ ...newContact, phone: text })} 
              keyboardType="phone-pad" 
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton} 
                onPress={addContact}
              >
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 10,
  },
  contactsContainer: {
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  contactContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  contactTextContainer: {
    marginLeft: 15,
  },
  contactName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contactPhone: {
    color: '#e0e0e0',
    fontSize: 14,
  },
  deleteIcon: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
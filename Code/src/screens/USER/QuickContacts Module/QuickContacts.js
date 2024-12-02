import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function QuickContacts() {
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Father',
      phone: '+92 300 1234567',
      iconName: 'phone',
      backgroundColor: '#4CAF50',
    },
    {
      id: 2,
      name: 'Mother',
      phone: '+92 342 7654321',
      iconName: 'heart',
      backgroundColor: '#E91E63',
    }
  ]);

  const [isModalVisible, setModalVisible] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });

  const countryCodes = {
    Pakistan: '+92',
    India: '+91',
    Bangladesh: '+880',
    United_States: '+1',
    United_Kingdom: '+44',
  };

  const validatePhoneNumber = (phone, countryCode) => {
    const phoneRegex = {
      '+92': /^(\+92|0)?3\d{9}$/, // Pakistan: 11 digits starting with 03
      '+91': /^(\+91|0)?[6-9]\d{9}$/, // India: 10 digits starting with 6-9
      '+880': /^(\+880|0)?1\d{9}$/, // Bangladesh: 11 digits starting with 01
      '+1': /^(\+1|0)?[2-9]\d{9}$/, // US: 10 digits
      '+44': /^(\+44|0)?[7-9]\d{9}$/ // UK: 10 digits
    };

    return phoneRegex[countryCode] ? phoneRegex[countryCode].test(phone.replace(/\s/g, '')) : false;
  };

  const addContact = () => {
    const { name, phone } = newContact;
    const countryCode = Object.values(countryCodes).find(code => phone.startsWith(code));

    if (!name || !phone) {
      Alert.alert('Error', 'Please enter both name and phone number');
      return;
    }

    if (!countryCode || !validatePhoneNumber(phone, countryCode)) {
      Alert.alert('Error', 'Invalid phone number format');
      return;
    }

    const newContactItem = {
      id: contacts.length + 1,
      name,
      phone,
      iconName: 'account-plus',
      backgroundColor: `#${Math.floor(Math.random()*16777215).toString(16)}`,
    };

    setContacts([...contacts, newContactItem]);
    setNewContact({ name: '', phone: '' });
    setModalVisible(false);
  };

  const dialContact = (contact) => {
    console.log(`Dialing ${contact.name} at ${contact.phone}`);
    // Implement actual dialing logic here
  };

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

      <View style={styles.contactsContainer}>
        {contacts.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={[styles.contactCard, { backgroundColor: contact.backgroundColor }]}
            onPress={() => dialContact(contact)}
          >
            <View style={styles.contactContent}>
              <View style={styles.iconContainer}>
                <Icon name={contact.iconName} size={24} color="#ffffff" />
              </View>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Contact</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newContact.name}
              onChangeText={(text) => setNewContact({...newContact, name: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (+92 300 1234567)"
              value={newContact.phone}
              onChangeText={(text) => setNewContact({...newContact, phone: text})}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    padding: 10,
  },
  contactsContainer: {
    padding: 16,
  },
  contactCard: {
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contactContent: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4CAF50',
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
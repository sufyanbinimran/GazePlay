import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  Modal 
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function PersonalActivitiesScreen() {
  const [selectedPhrases, setSelectedPhrases] = useState([]);
  const [spokenMessage, setSpokenMessage] = useState('');
  const [isMessageModalVisible, setIsMessageModalVisible] = useState(false);

  const communicationItems = [
    { id: 'i', icon: 'account', iconType: 'material-community', text: 'I' },
    { id: 'you', icon: 'hand-pointing-right', iconType: 'material-community', text: 'you' },
    { id: 'it', icon: 'cube-outline', iconType: 'material-community', text: 'it' },
    { id: 'can', icon: 'check-circle-outline', iconType: 'material-community', text: 'can' },
    { id: 'do', icon: 'run', iconType: 'material-community', text: 'do' },
    { id: 'have', icon: 'bag-personal', iconType: 'material-community', text: 'have' },
    { id: 'want', icon: 'star-circle-outline', iconType: 'material-community', text: 'want' },
    { id: 'like', icon: 'thumb-up-outline', iconType: 'material-community', text: 'like' },
    { id: 'help', icon: 'handshake', iconType: 'material-community', text: 'help' },
    { id: 'not', icon: 'cancel', iconType: 'material-community', text: 'not' },
    { id: 'stop', icon: 'stop-circle-outline', iconType: 'material-community', text: 'stop' },
    { id: 'more', icon: 'plus-circle-outline', iconType: 'material-community', text: 'more' },
    { id: 'and', icon: 'ampersand', iconType: 'text', text: 'and' },
    { id: 'the', icon: 'play', iconType: 'material-community', text: 'the' },
    { id: 'that', icon: 'arrow-right-box', iconType: 'material-community', text: 'that' },
  ];
  
  const getIcon = (item) => {
    if (item.iconType === 'material-community') {
      return <MaterialCommunityIcons name={item.icon} size={24} color="#000" />;
    }
    return <MaterialIcons name={item.icon} size={24} color="#000" />;
  };

  const getBackgroundColor = (id) => {
    const colorMap = {
      i: '#FFD700', 
      you: '#FFD700',
      it: '#FFD700',
      can: '#90EE90', 
      do: '#90EE90',
      have: '#90EE90',
      want: '#87CEEB',
      like: '#87CEEB',
      help: '#87CEEB',
      not: '#FFB6C6', 
      stop: '#FFB6C6',
      more: '#FFB6C6',
      and: '#FFA500', 
      the: '#FFA500',
      that: '#FFA500',
    };
    return colorMap[id] || '#FFFFFF';
  };

  const handlePress = (item) => {
    setSelectedPhrases([...selectedPhrases, item]);
  };

  const clearPhrases = () => {
    setSelectedPhrases([]);
  };

  const speakPhrases = () => {
    const message = selectedPhrases.map(phrase => phrase.text).join(' ');
    setSpokenMessage(message);
    setIsMessageModalVisible(true);

    console.log('Speaking:', message);
  };

  const removeLastPhrase = () => {
   
    const newPhrases = [...selectedPhrases];
    newPhrases.pop();
    setSelectedPhrases(newPhrases);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom Modal for Spoken Message */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isMessageModalVisible}
        onRequestClose={() => setIsMessageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Formed Sentence</Text>
            <Text style={styles.modalMessage}>{spokenMessage}</Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setIsMessageModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => {
            
                  console.log('Speaking:', spokenMessage);
                }}
              >
                <Text style={styles.modalButtonText}>Speak</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Communication Bar */}
      <View style={styles.communicationBar}>
        <ScrollView 
          style={styles.phrasesScrollView}
          contentContainerStyle={styles.phrasesContainer}
        >
          <View style={styles.phrasesWrapper}>
            {selectedPhrases.map((phrase, index) => (
              <TouchableOpacity 
                key={`${phrase.id}-${index}`} 
                style={[
                  styles.phraseChip, 
                  { backgroundColor: getBackgroundColor(phrase.id) }
                ]}
              >
                {getIcon(phrase)}
                <Text style={styles.phraseText}>{phrase.text}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.controls}>
          <TouchableOpacity onPress={removeLastPhrase} style={styles.controlButton}>
            <MaterialCommunityIcons name="backspace" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearPhrases} style={styles.controlButton}>
            <MaterialCommunityIcons name="delete" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={speakPhrases} style={styles.controlButton}>
            <MaterialCommunityIcons name="volume-high" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

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
              onPress={() => handlePress(item)}
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
  communicationBar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 8,
    maxHeight: 200, 
  },
  phrasesScrollView: {
    maxHeight: 180, 
  },
  phrasesContainer: {
    paddingRight: 8, 
  },
  phrasesWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  phraseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 4,
  },
  phraseText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  controls: {
    position: 'absolute',
    right: 8,
    top: 8,
    flexDirection: 'row',
  },
  controlButton: {
    padding: 8,
    marginLeft: 8,
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
  modalMessageText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalMessage: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

});
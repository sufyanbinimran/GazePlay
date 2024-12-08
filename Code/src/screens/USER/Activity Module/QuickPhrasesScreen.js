import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Modal } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function QuickPhrasesScreen() {
  const [pressedId, setPressedId] = useState(null);
  const [phrases, setPhrases] = useState([]);
  const [spokenSentence, setSpokenSentence] = useState('');
  const [showSentenceModal, setShowSentenceModal] = useState(false);

  const colorFamilies = {
    grays: ['#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E', '#757575'],
    yellows: ['#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58', '#FFEB3B'],
    blues: ['#E3F2FD', '#BBDEFB', '#90CAF9', '#64B5F6', '#42A5F5'],
  };

  const phraseItems = [
    // Greetings
    { id: 'hi', icon: 'hand-wave', text: 'Hi!', color: colorFamilies.yellows[0] },
    { id: 'bye', icon: 'exit-run', text: 'Bye!', color: colorFamilies.yellows[1] },
    { id: 'havegoodday', icon: 'weather-sunny', text: 'Have good day', color: colorFamilies.yellows[2] },
    
    // Questions
    { id: 'howareyou', icon: 'comment-question-outline', text: 'How are you?', color: colorFamilies.blues[0] },
    { id: 'howsitgoing', icon: 'account-question-outline', text: "How's it going?", color: colorFamilies.blues[1] },
    { id: 'whatsnew', icon: 'message-question-outline', text: "What's new?", color: colorFamilies.blues[2] },
    { id: 'whatsup', icon: 'message-text-outline', text: "What's up?", color: colorFamilies.blues[3] },
    
    // Time-related
    { id: 'fewminutes', icon: 'clock-outline', text: 'Few minutes?', color: colorFamilies.grays[0] },
    { id: 'later', icon: 'clock-time-four-outline', text: 'Later', color: colorFamilies.grays[1] },
    { id: 'hangon', icon: 'hand-back-right', text: 'Hang on', color: colorFamilies.grays[2] },
    
    // Responses
    { id: 'awesome', icon: 'emoticon-excited-outline', text: 'Awesome!', color: colorFamilies.yellows[3] },
    { id: 'prettygood', icon: 'thumb-up-outline', text: 'Pretty good', color: colorFamilies.yellows[4] },
    { id: 'wow', icon: 'star-circle-outline', text: 'Wow! Cool!', color: colorFamilies.blues[4] },
    
    // Computer-related
    { id: 'usecomputer', icon: 'laptop', text: 'Use computer', color: colorFamilies.grays[3] },
    
    // Preferences
    { id: 'ilikethat', icon: 'thumb-up', text: 'I like that', color: colorFamilies.yellows[0] },
    { id: 'dontlike', icon: 'thumb-down', text: "Don't like", color: colorFamilies.grays[4] },
    { id: 'definitely', icon: 'check-circle-outline', text: 'Definitely', color: colorFamilies.yellows[1] },
    { id: 'iwantto', icon: 'hand-pointing-right', text: 'I want to', color: colorFamilies.yellows[2] },
    { id: 'dontwantto', icon: 'hand-pointing-left', text: "Don't want to", color: colorFamilies.grays[0] },
    
    // Negative responses
    { id: 'noway', icon: 'close-circle-outline', text: 'No way!', color: colorFamilies.grays[1] },
    { id: 'notgood', icon: 'thumb-down-outline', text: 'Not good', color: colorFamilies.grays[2] },
    { id: 'nofair', icon: 'alert-circle-outline', text: 'No fair!', color: colorFamilies.grays[3] },
    { id: 'makesmemad', icon: 'emoticon-angry-outline', text: 'Makes me mad', color: colorFamilies.grays[4] },
  ];

  const handlePress = (item) => {
    setPressedId(item.id);
    
    setPhrases([...phrases, item]);
    
    setTimeout(() => setPressedId(null), 200);
  };

  const clearText = () => {
    const newPhrases = phrases.slice(0, -1);
    setPhrases(newPhrases);
  };

  const speakText = () => {
    const message = phrases.map(phrase => phrase.text).join(' ');
    
    setSpokenSentence(message);
    setShowSentenceModal(true);

    console.log('Speaking:', message);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Phrases</Text>
        <Text style={styles.headerSubtitle}>Tap icons to communicate</Text>
      </View>

      {/* Communication Bar */}
      <View style={styles.communicationBar}>
        <ScrollView 
          style={styles.phrasesScrollView}
          contentContainerStyle={styles.phrasesContainer}
        >
          <View style={styles.phrasesWrapper}>
            {phrases.map((phrase, index) => (
              <View 
                key={`${phrase.id}-${index}`} 
                style={[
                  styles.phraseChip, 
                  { backgroundColor: phrase.color }
                ]}
              >
                <MaterialCommunityIcons name={phrase.icon} size={20} color="#000" />
                <Text style={styles.phraseChipText}>{phrase.text}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
        
        <View style={styles.communicationControls}>
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={clearText}
            disabled={phrases.length === 0}
          >
            <MaterialCommunityIcons 
              name="delete" 
              size={24} 
              color={phrases.length === 0 ? "#ccc" : "#666"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.controlButton} 
            onPress={speakText}
            disabled={phrases.length === 0}
          >
            <MaterialCommunityIcons 
              name="volume-high" 
              size={24} 
              color={phrases.length === 0 ? "#ccc" : "#666"} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.grid}>
          {phraseItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.gridItem,
                { backgroundColor: item.color },
                pressedId === item.id && styles.pressedItem
              ]}
              onPress={() => handlePress(item)}
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

      {/* spoken sentence */}
      <Modal
        transparent={true}
        visible={showSentenceModal}
        animationType="slide"
        onRequestClose={() => setShowSentenceModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Your Sentence</Text>
            <Text style={styles.modalSentence}>{spokenSentence}</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowSentenceModal(false)}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
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
    paddingRight: 50,
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
  phraseChipText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  communicationControls: {
    position: 'absolute',
    right: 8,
    top: 8,
    flexDirection: 'row',
  },
  controlButton: {
    padding: 8,
    marginLeft: 8,
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
 
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333'
  },
  modalSentence: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666'
  },
  modalCloseButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2
  },
  modalCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
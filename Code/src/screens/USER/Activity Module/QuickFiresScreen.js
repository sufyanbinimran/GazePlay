import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export default function QuickFiresScreen() {
  const [pressedId, setPressedId] = useState(null);
  const [selectedPhrases, setSelectedPhrases] = useState([]);
  const [message, setMessage] = useState('');
  const [isMessageVisible, setIsMessageVisible] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.5))[0];

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



  const formSentence = (phrases) => {
    if (phrases.length === 0) return '';
    const sentence = phrases
      .map(phrase => phrase.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  };

  const handlePress = (id) => {
    setPressedId(id);
    const selectedItem = communicationItems.find(item => item.id === id);
    if (selectedItem) {
      const updatedPhrases = [...selectedPhrases, selectedItem];
      setSelectedPhrases(updatedPhrases);
      setMessage(formSentence(updatedPhrases));
    }
    setTimeout(() => setPressedId(null), 200);
  };

  const removePhrase = (index) => {
    const updatedPhrases = selectedPhrases.filter((_, i) => i !== index);
    setSelectedPhrases(updatedPhrases);
    setMessage(formSentence(updatedPhrases));
  };

  const clearPhrases = () => {
    setSelectedPhrases([]);
    setMessage('');
  };

  const showMessage = () => {
    if (!message) return;
    
    setIsMessageVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

   
    setTimeout(() => {
      hideMessage();
    }, 2000);
  };

  const hideMessage = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.5,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsMessageVisible(false);
      
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {isMessageVisible && (
        <Animated.View 
          style={[
            styles.messageOverlay,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <View style={styles.messageContent}>
            <Text style={styles.messageText}>{message}</Text>
            <MaterialCommunityIcons name="volume-high" size={24} color="#fff" style={styles.messageIcon} />
          </View>
        </Animated.View>
      )}

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quick Communication</Text>
        <Text style={styles.headerSubtitle}>Tap to express yourself</Text>
      </View>

      <View style={styles.communicationBar}>
        <View style={styles.controls}>
          <TouchableOpacity onPress={showMessage} style={styles.controlButton}>
            <MaterialCommunityIcons name="volume-high" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearPhrases} style={styles.controlButton}>
            <MaterialCommunityIcons name="delete" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.phraseScrollView}>
          <View style={styles.communicationContent}>
            {selectedPhrases.map((phrase, index) => (
              <View key={`${phrase.id}-${index}`} style={styles.phraseChipContainer}>
                <TouchableOpacity
                  style={[styles.phraseChip, { backgroundColor: phrase.color }]}
                >
                  <MaterialCommunityIcons name={phrase.icon} size={20} color="#000" />
                  <Text style={styles.phraseText}>{phrase.text}</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => removePhrase(index)}
                  style={styles.deleteButton}
                >
                  <MaterialCommunityIcons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
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
                <MaterialCommunityIcons name={item.icon} size={32} color="#000" />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%',
  },
  modalText: {
    color: '#fff',
    fontSize: 18,
    marginRight: 10,
    flexShrink: 1,
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
    padding: 16,
    maxHeight: 200,
  },
  communicationContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    paddingTop: 40,
  },
  phraseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  phraseText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  removeIcon: {
    marginLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 8,
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
  phraseScrollView: {
    maxHeight: 100,
  }, messageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  messageContent: {
    backgroundColor: '#2196F3',
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  messageText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginRight: 15,
    flex: 1,
  },
  messageIcon: {
    marginLeft: 10,
  },
  phraseChipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  phraseChip: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  deleteButton: {
    marginLeft: -10,
    marginTop: -10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 2,
  },
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
    padding: 16,
    maxHeight: 200,
  },
  communicationContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    paddingTop: 40,
  },
  phraseText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#333',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 8,
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
  },
  controlButton: {
    padding: 8,
    marginHorizontal: 8,
  },
});
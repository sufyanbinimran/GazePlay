import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, ScrollView,
  SafeAreaView, Dimensions, Platform
} from 'react-native';
import * as Speech from 'expo-speech';
import io from 'socket.io-client';
import { FontAwesome5 } from '@expo/vector-icons'; // Make sure to install expo-vector-icons
import SERVER_CONFIG from '../../config';

const socket = io(SERVER_CONFIG.SOCKET_URL);
const { width } = Dimensions.get('window');

const GeminiStoryButton = () => {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState(null);
  const [isTrackingEnabled, setIsTrackingEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const emotionTimerRef = useRef(null);
  const scrollViewRef = useRef(null);
  const emotionColors = {
    'Happy': '#4CAF50',
    'Neutral': '#2196F3',
    'Angry': '#FF5722',
    'Sad': '#FF5722', // Same color as Angry
    'Surprised': '#9C27B0',
    'Fearful': '#FFC107'
  };

  const hardCodedPrompt = 
    "براہ کرم اردو (نستعلیق رسم الخط) میں بچوں کے لیے ایک تعلیمی اور تفریحی کہانی تخلیق کریں جو دماغی فالج والے بچوں کے لیے موزوں ہو۔ کہانی نرم، معاون، اور سیکھنے کے تجربے کو فروغ دینے والی ہونی چاہیے۔";

  const relaxingPrompt = 
    "براہ کرم اردو (نستعلیق رسم الخط) میں بچوں کے لیے ایک پرسکون کہانی تخلیق کریں جو انہیں آرام دینے اور پرسکون کرنے میں مدد دے۔ کہانی نرم اور سکون بخش ہونی چاہیے۔";

  // Socket.IO listener for emotion detection
  useEffect(() => {
    socket.on('eye_tracking', (data) => {
      if (data.emotion) {
        // Treat "Sad" and "Angry" as the same emotional state
        const detectedEmotion = data.emotion === 'Sad' ? 'Angry' : data.emotion;
        setCurrentEmotion(detectedEmotion);
        
        if (detectedEmotion === 'Angry') {
          if (!emotionTimerRef.current) {
            emotionTimerRef.current = setTimeout(() => {
              fetchRelaxingStory();
            }, 5000); // 5 seconds
          }
        } else {
          if (emotionTimerRef.current) {
            clearTimeout(emotionTimerRef.current);
            emotionTimerRef.current = null;
          }
        }
      }
    });

    return () => {
      socket.off('eye_tracking');
      if (emotionTimerRef.current) {
        clearTimeout(emotionTimerRef.current);
      }
    };
  }, []);

  // Auto-scroll for story text
  useEffect(() => {
    if (scrollViewRef.current && story) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [story]);

  // Check if speech is still playing
  useEffect(() => {
    let interval;
    if (isSpeaking) {
      interval = setInterval(async () => {
        const speaking = await Speech.isSpeakingAsync();
        if (!speaking) {
          setIsSpeaking(false);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSpeaking]);

  // Function to start tracking and emotion detection
  const handleStartTracking = () => {
    socket.emit('start_tracking');
    socket.emit('start_emotion_detection');
    setIsTrackingEnabled(true);
  };

  // Function to stop tracking and emotion detection
  const handleStopTracking = () => {
    socket.emit('stop_tracking');
    socket.emit('stop_emotion_detection');
    setIsTrackingEnabled(false);
    setCurrentEmotion(null);
    if (emotionTimerRef.current) {
      clearTimeout(emotionTimerRef.current);
      emotionTimerRef.current = null;
    }
  };

  // Function to fetch a relaxing story from Gemini API
  const fetchRelaxingStory = async () => {
    setLoading(true);
    setStory(''); // Clear previous story

    // Stop any ongoing speech before starting the new story
    stopSpeech();

    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyBpYLXU5whto25ex-sVtj8Rw3dluaedGww'
        },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: relaxingPrompt }] 
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error: ${response.status}`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const generatedStory = data.candidates && data.candidates[0] && 
                            data.candidates[0].content && 
                            data.candidates[0].content.parts && 
                            data.candidates[0].content.parts[0].text;
                            
      if (generatedStory) {
        setStory(generatedStory);
        startSpeech(generatedStory);
      } else {
        setStory('No story was generated. Please try again.');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setStory('An error occurred while fetching the story. Please try again later.');
    }
    setLoading(false);
  };

  // Function to fetch story from Gemini API
  const fetchStoryFromGemini = async () => {
    setLoading(true);
    setStory(''); // Clear previous story
    
    // Stop any ongoing speech
    stopSpeech();
    
    try {
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyBpYLXU5whto25ex-sVtj8Rw3dluaedGww'
        },
        body: JSON.stringify({
          contents: [{ 
            parts: [{ text: hardCodedPrompt }] 
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error: ${response.status}`, errorText);
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      const generatedStory = data.candidates && data.candidates[0] && 
                            data.candidates[0].content && 
                            data.candidates[0].content.parts && 
                            data.candidates[0].content.parts[0].text;
                            
      if (generatedStory) {
        setStory(generatedStory);
        startSpeech(generatedStory);
      } else {
        setStory('No story was generated. Please try again.');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setStory('An error occurred while fetching the story. Please try again later.');
    }
    setLoading(false);
  };

  // Function to start speech
  const startSpeech = (text) => {
    Speech.speak(text, {
      language: 'ur',  // Set to Urdu
      pitch: 1.0,
      rate: 0.9,
      onStart: () => setIsSpeaking(true),
      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  // Function to stop speech
  const stopSpeech = () => {
    Speech.stop();
    setIsSpeaking(false);
  };

  // Function to restart speech
  const restartSpeech = () => {
    if (story) {
      startSpeech(story);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Interactive Story Generator</Text>
      </View>
      
      {/* Emotion Monitoring Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Emotion Monitoring</Text>
        <TouchableOpacity 
          style={[
            styles.button, 
            { backgroundColor: isTrackingEnabled ? '#FF5722' : '#4CAF50' }
          ]} 
          onPress={isTrackingEnabled ? handleStopTracking : handleStartTracking}
        >
          <FontAwesome5 
            name={isTrackingEnabled ? 'eye-slash' : 'eye'} 
            size={18} 
            color="white" 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>
            {isTrackingEnabled ? 'Stop Monitoring' : 'Start Monitoring'}
          </Text>
        </TouchableOpacity>

        {/* Emotion Display */}
        {currentEmotion && (
          <View style={[
            styles.emotionBadge, 
            { backgroundColor: emotionColors[currentEmotion] || '#999' }
          ]}>
            <FontAwesome5 
              name={
                currentEmotion === 'Happy' ? 'smile' : 
                currentEmotion === 'Angry' ? 'angry' : 
                currentEmotion === 'Sad' ? 'sad-tear' :
                currentEmotion === 'Surprised' ? 'surprise' :
                currentEmotion === 'Fearful' ? 'grimace' : 'meh'
              } 
              size={16} 
              color="white" 
            />
            <Text style={styles.emotionText}>
              {currentEmotion}
            </Text>
          </View>
        )}
      </View>

      {/* Story Generation Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Story Generator</Text>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2196F3' }]} 
          onPress={fetchStoryFromGemini}
          disabled={loading}
        >
          <FontAwesome5 
            name="book" 
            size={18} 
            color="white" 
            style={styles.buttonIcon} 
          />
          <Text style={styles.buttonText}>Generate Story</Text>
        </TouchableOpacity>
      </View>

      {/* Loading indicator */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Creating story...</Text>
        </View>
      )}

      {/* Story Display */}
      {story !== '' && (
        <View style={styles.storyOuterContainer}>
          <View style={styles.storyHeader}>
            <Text style={styles.storyHeaderText}>Your Story</Text>
            
            <View style={styles.audioControls}>
              {isSpeaking ? (
                <TouchableOpacity onPress={stopSpeech} style={styles.audioButton}>
                  <FontAwesome5 name="pause" size={16} color="#F44336" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={restartSpeech} style={styles.audioButton}>
                  <FontAwesome5 name="play" size={16} color="#4CAF50" />
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          <ScrollView 
            style={styles.storyContainer} 
            contentContainerStyle={styles.storyContentContainer}
            ref={scrollViewRef}
          >
            <Text style={styles.storyText}>{story}</Text>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#3f51b5',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emotionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
  },
  emotionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  storyOuterContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f2f5',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  storyHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  audioControls: {
    flexDirection: 'row',
  },
  audioButton: {
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    marginLeft: 8,
  },
  storyContainer: {
    flex: 1,
  },
  storyContentContainer: {
    padding: 16,
    paddingBottom: 24,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default GeminiStoryButton;
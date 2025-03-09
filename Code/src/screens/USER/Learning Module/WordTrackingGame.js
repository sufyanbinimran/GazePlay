import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  PanResponder,
  Dimensions,
} from 'react-native';


const SCREEN_WIDTH = Dimensions.get('window').width;
// Significantly increased checkpoint radius for better camera detection with eye blinks
const CHECKPOINT_RADIUS = 60;  // Increased from 40
const REQUIRED_CHECKPOINTS = 1;


const ALPHABETS = [
    {
      letter: 'A',
      word: 'Apple',
      color: '#FF6B6B',
      checkpoints: [
        { x: 150, y: 80, reached: false },   // top
        { x: 90, y: 240, reached: false },   // bottom left
        { x: 215, y: 240, reached: false },  // bottom right
        { x: 110, y: 150, reached: false },  // middle line left
        { x: 190, y: 150, reached: false },  // middle line right
      ]
    },
    {
      letter: 'B',
      word: 'Ball',
      color: '#4ECDC4',
      checkpoints: [
        { x: 100, y: 80, reached: false },    // top
        { x: 100, y: 240, reached: false },   // bottom
        { x: 150, y: 80, reached: false },   // top curve start
        { x: 200, y: 100, reached: false },  // top curve middle
        { x: 150, y: 160, reached: false },  // middle
        { x: 200, y: 180, reached: false },  // bottom curve middle
        { x: 150, y: 240, reached: false },  // bottom curve end
      ]
    },
    {
      letter: 'C',
      word: 'Cat',
      color: '#FFD93D',
      checkpoints: [
        { x: 200, y: 90, reached: false },   // top curve
        { x: 125, y: 90, reached: false },   // top
        { x: 90, y: 150, reached: false },   // middle
        { x: 125, y: 230, reached: false },  // bottom
        { x: 200, y: 225, reached: false },  // bottom curve
      ]
    },
    {
      letter: 'D',
      word: 'Dog',
      color: '#95E1D3',
      checkpoints: [
        { x: 100, y: 80, reached: false },    // top left
        { x: 150, y: 80, reached: false },   // top curve
        { x: 200, y: 150, reached: false },  // middle curve
        { x: 150, y: 230, reached: false },  // bottom curve
        { x: 100, y: 230, reached: false },   // bottom left
      ]
    },
    {
      letter: 'E',
      word: 'Elephant',
      color: '#F38181',
      checkpoints: [
        { x: 110, y: 80, reached: false },    // top left
        { x: 200, y: 80, reached: false },   // top right
        { x: 110, y: 150, reached: false },   // middle left
        { x: 180, y: 155, reached: false },  // middle right
        { x: 110, y: 230, reached: false },   // bottom left
        { x: 200, y: 230, reached: false },  // bottom right
      ]
    },
    {
      letter: 'F',
      word: 'Fish',
      color: '#6C5CE7',
      checkpoints: [
        { x: 110, y: 80, reached: false },    // top left
        { x: 200, y: 80, reached: false },   // top right
        { x: 110, y: 160, reached: false },   // middle left
        { x: 190, y: 160, reached: false },  // middle right
        { x: 110, y: 230, reached: false },   // bottom
      ]
    },
    {
      letter: 'G',
      word: 'Goat',
      color: '#A8E6CF',
      checkpoints: [
        { x: 200, y: 100, reached: false },   // top curve
        { x: 125, y: 90, reached: false },   // top
        { x: 90, y: 150, reached: false },   // middle left
        { x: 125, y: 230, reached: false },  // bottom
        { x: 200, y: 225, reached: false },  // bottom curve
        { x: 200, y: 170, reached: false },  // middle right
        { x: 150, y: 170, reached: false },  // middle hook
      ]
    },
    {
      letter: 'H',
      word: 'House',
      color: '#FF8B94',
      checkpoints: [
        { x: 90, y: 80, reached: false },    // top left
        { x: 90, y: 230, reached: false },   // bottom left
        { x: 90, y: 150, reached: false },   // middle left
        { x: 200, y: 150, reached: false },  // middle right
        { x: 200, y: 80, reached: false },   // top right
        { x: 200, y: 230, reached: false },  // bottom right
      ]
    },
    {
      letter: 'I',
      word: 'Ice cream',
      color: '#DCC6E0',
      checkpoints: [
        { x: 150, y: 80, reached: false },   // top
        { x: 150, y: 150, reached: false },  // middle
        { x: 150, y: 230, reached: false },  // bottom
      ]
    },
    {
      letter: 'J',
      word: 'Jellyfish',
      color: '#FAD02E',
      checkpoints: [
        { x: 190, y: 80, reached: false },   // top
        { x: 190, y: 200, reached: false },  // vertical line
        { x: 150, y: 235, reached: false },  // curve
        { x: 110, y: 225, reached: false },  // hook end
      ]
    },
    {
      letter: 'K',
      word: 'Kite',
      color: '#FF9A8B',
      checkpoints: [
        { x: 100, y: 90, reached: false },    // top
        { x: 100, y: 230, reached: false },   // bottom
        { x: 100, y: 150, reached: false },   // middle
        { x: 200, y: 80, reached: false },   // top arm
        { x: 200, y: 230, reached: false },  // bottom arm
      ]
    },
    {
      letter: 'L',
      word: 'Lion',
      color: '#98DDCA',
      checkpoints: [
        { x: 110, y: 90, reached: false },    // top
        { x: 110, y: 230, reached: false },   // bottom vertical
        { x: 200, y: 230, reached: false },  // bottom horizontal
      ]
    },
    {
      letter: 'M',
      word: 'Monkey',
      color: '#FF8C69',
      checkpoints: [
        { x: 70, y: 230, reached: false },   // left bottom
        { x: 70, y: 80, reached: false },    // left top
        { x: 150, y: 230, reached: false },  // middle peak
        { x: 230, y: 80, reached: false },   // right top
        { x: 230, y: 230, reached: false },  // right bottom
      ]
    },
    {
      letter: 'N',
      word: 'Nest',
      color: '#7FB5FF',
      checkpoints: [
        { x: 90, y: 230, reached: false },   // left bottom
        { x: 90, y: 90, reached: false },    // left top
        { x: 200, y: 230, reached: false },  // right bottom
        { x: 200, y: 90, reached: false },   // right top
      ]
    },
    {
      letter: 'O',
      word: 'Orange',
      color: '#FFB347',
      checkpoints: [
        { x: 150, y: 80, reached: false },   // top
        { x: 210, y: 150, reached: false },  // right
        { x: 150, y: 230, reached: false },  // bottom
        { x: 90, y: 150, reached: false },   // left
      ]
    },
    {
      letter: 'P',
      word: 'Penguin',
      color: '#98B4D4',
      checkpoints: [
        { x: 100, y: 80, reached: false },    // top left
        { x: 100, y: 230, reached: false },   // bottom
        { x: 150, y: 80, reached: false },   // top curve start
        { x: 200, y: 130, reached: false },  // curve middle
        { x: 150, y: 170, reached: false },  // curve end
      ]
    },
    {
      letter: 'Q',
      word: 'Queen',
      color: '#C3B1E1',
      checkpoints: [
        { x: 150, y: 80, reached: false },   // top
        { x: 210, y: 150, reached: false },  // right
        { x: 150, y: 230, reached: false },  // bottom
        { x: 90, y: 150, reached: false },   // left
        { x: 200, y: 260, reached: false },  // tail
      ]
    },
    {
      letter: 'R',
      word: 'Rabbit',
      color: '#FF9AA2',
      checkpoints: [
        { x: 110, y: 80, reached: false },    // top left
        { x: 110, y: 230, reached: false },   // bottom
        { x: 150, y: 80, reached: false },   // top curve
        { x: 200, y: 130, reached: false },  // curve middle
        { x: 150, y: 170, reached: false },  // curve end
        { x: 200, y: 230, reached: false },  // leg
      ]
    },
    {
      letter: 'S',
      word: 'Snake',
      color: '#B5EAD7',
      checkpoints: [
        { x: 200, y: 100, reached: false },   // top curve
        { x: 110, y: 100, reached: false },   // top
        { x: 150, y: 160, reached: false },  // middle
        { x: 110, y: 220, reached: false },  // bottom
        { x: 200, y: 225, reached: false },  // bottom curve
      ]
    },
    {
      letter: 'T',
      word: 'Tiger',
      color: '#FFB7B2',
      checkpoints: [
        { x: 90, y: 90, reached: false },    // top left
        { x: 210, y: 90, reached: false },   // top right
        { x: 150, y: 90, reached: false },   // top middle
        { x: 150, y: 230, reached: false },  // bottom
      ]
    },
    {
      letter: 'U',
      word: 'Umbrella',
      color: '#A0E7E5',
      checkpoints: [
        { x: 100, y: 90, reached: false },    // left top
        { x: 100, y: 200, reached: false },   // left curve
        { x: 150, y: 240, reached: false },  // bottom
        { x: 200, y: 200, reached: false },  // right curve
        { x: 200, y: 90, reached: false },   // right top
      ]
    },
    {
      letter: 'V',
      word: 'Violin',
      color: '#FBE7C6',
      checkpoints: [
        { x: 90, y: 80, reached: false },    // left top
        { x: 150, y: 230, reached: false },  // bottom
        { x: 210, y: 80, reached: false },   // right top
      ]
    },
    {
      letter: 'W',
      word: 'Whale',
      color: '#B4F8C8',
      checkpoints: [
        { x: 70, y: 90, reached: false },    // far left top
        { x: 100, y: 230, reached: false },  // first bottom
        { x: 150, y: 130, reached: false },  // middle top
        { x: 200, y: 230, reached: false },  // second bottom
        { x: 230, y: 90, reached: false },   // far right top
      ]
    },
    {
      letter: 'X',
      word: 'X-ray',
      color: '#FFC5BF',
      checkpoints: [
        { x: 100, y: 80, reached: false },    // top left
        { x: 200, y: 240, reached: false },  // bottom right
        { x: 200, y: 80, reached: false },   // top right
        { x: 100, y: 240, reached: false },   // bottom left
      ]
    },
    {
      letter: 'Y',
      word: 'Yacht',
      color: '#A6E3E9',
      checkpoints: [
        { x: 90, y: 80, reached: false },    // left top
        { x: 150, y: 170, reached: false },  // middle
        { x: 200, y: 80, reached: false },   // right top
        { x: 150, y: 240, reached: false },  // bottom
      ]
    },
    {
      letter: 'Z',
      word: 'Zebra',
      color: '#DEFCF9',
      checkpoints: [
        { x: 90, y: 90, reached: false },    // top left
        { x: 190, y: 90, reached: false },   // top right
        { x: 90, y: 240, reached: false },   // bottom left
        { x: 200, y: 240, reached: false },  // bottom right
      ]
    },
  ];
  
  
  export default function LetterTracingGame({ navigation }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [tracedPath, setTracedPath] = useState([]);
    const [isDrawing, setIsDrawing] = useState(false);
    const [showWord, setShowWord] = useState(false);
    const [checkpoints, setCheckpoints] = useState([...ALPHABETS[currentIndex].checkpoints]);
    const completionTimeout = useRef(null);
  
    useEffect(() => {
      setCheckpoints([...ALPHABETS[currentIndex].checkpoints]);
      setTracedPath([]);
      setShowWord(false);
  
      return () => {
        if (completionTimeout.current) {
          clearTimeout(completionTimeout.current);
        }
      };
    }, [currentIndex]);
  
    const checkCompletion = (updatedCheckpoints) => {
      const allReached = updatedCheckpoints.every(cp => cp.reached);
  
      if (allReached) {
        setShowWord(true);
  
        if (completionTimeout.current) {
          clearTimeout(completionTimeout.current);
        }
  
        completionTimeout.current = setTimeout(() => {
          if (currentIndex < ALPHABETS.length - 1) {
            setCurrentIndex(prev => prev + 1);
          }
        }, 2000);
      }
    };
  
    const checkPointReached = (point) => {
      let updatedCheckpoints = [...checkpoints];
      let changed = false;
  
      updatedCheckpoints = updatedCheckpoints.map((checkpoint) => {
        if (!checkpoint.reached) {
          const distance = Math.sqrt(
            Math.pow(point.x - checkpoint.x, 2) + 
            Math.pow(point.y - checkpoint.y, 2)
          );
          if (distance < CHECKPOINT_RADIUS) {
            changed = true;
            return { ...checkpoint, reached: true };
          }
        }
        return checkpoint;
      });
  
      if (changed) {
        setCheckpoints(updatedCheckpoints);
        checkCompletion(updatedCheckpoints);
      }
    };
  
    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        setIsDrawing(true);
        const point = {
          x: evt.nativeEvent.locationX,
          y: evt.nativeEvent.locationY,
        };
        setTracedPath([point]);
        checkPointReached(point);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (isDrawing) {
          const point = {
            x: evt.nativeEvent.locationX,
            y: evt.nativeEvent.locationY,
          };
          setTracedPath(prev => [...prev, point]);
          checkPointReached(point);
        }
      },
      onPanResponderRelease: () => {
        setIsDrawing(false);
        checkCompletion(checkpoints);
      },
    });
  
    const handleReset = () => {
      setTracedPath([]);
      setCheckpoints([...ALPHABETS[currentIndex].checkpoints]);
      setShowWord(false);
      if (completionTimeout.current) {
        clearTimeout(completionTimeout.current);
      }
    };
  
    const handlePrevious = () => {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };
  
    const handleNext = () => {
      if (currentIndex < ALPHABETS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Trace the Letter!</Text>
        </View>
  
        {/* Progress indicator */}
        <View style={styles.progressBar}>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {ALPHABETS.length}
          </Text>
        </View>
  
        {/* Main letter display and tracing area */}
        <View style={styles.letterContainer}>
          {/* Background letter */}
          <Text style={[
            styles.outlineLetter,
            { color: ALPHABETS[currentIndex].color + '80' } // Adjusted opacity to '80'
          ]}>
            {ALPHABETS[currentIndex].letter}
          </Text>
  
          {/* Tracing canvas */}
          <View
            style={styles.tracingCanvas}
            {...panResponder.panHandlers}
          >
            {/* Traced path points */}
            {tracedPath.map((point, index) => (
              <View
                key={index}
                style={[
                  styles.tracedPoint,
                  {
                    left: point.x - 10,
                    top: point.y - 10,
                    backgroundColor: ALPHABETS[currentIndex].color,
                  }
                ]}
              />
            ))}
            
            {/* Checkpoints */}
            {checkpoints.map((checkpoint, index) => (
              <View
                key={`checkpoint-${index}`}
                style={[
                  styles.checkpoint,
                  {
                    left: checkpoint.x - 20,
                    top: checkpoint.y - 20,
                    backgroundColor: checkpoint.reached ? '#4CAF50' : '#FF0000',
                  }
                ]}
              />
            ))}
          </View>
        </View>
  
        {/* Word display */}
        {showWord && (
          <View style={styles.wordContainer}>
            <Text style={[styles.wordText, { color: ALPHABETS[currentIndex].color }]}>
              {ALPHABETS[currentIndex].letter} for {ALPHABETS[currentIndex].word}
            </Text>
          </View>
        )}
  
        {/* Control buttons */}
        <View style={styles.controls}>
          <TouchableOpacity 
            style={[styles.button, { opacity: currentIndex > 0 ? 1 : 0.5 }]} 
            onPress={handlePrevious}
            disabled={currentIndex === 0}
          >
            <Text style={styles.buttonText}>Previous</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleReset}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
  
          <TouchableOpacity 
            style={[styles.button, { opacity: currentIndex < ALPHABETS.length - 1 ? 1 : 0.5 }]} 
            onPress={handleNext}
            disabled={currentIndex === ALPHABETS.length - 1}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
        
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Touch and trace the letter by following the red dots. They will turn green when reached!
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    header: {
      padding: 20,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#333',
    },
    progressBar: {
      padding: 10,
      alignItems: 'center',
    },
    progressText: {
      fontSize: 16,
      color: '#666',
    },
    letterContainer: {
      width: 300,
      height: 300,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
    },
    outlineLetter: {
      fontSize: 250,
      fontWeight: 'bold',
      position: 'absolute',
    },
    tracingCanvas: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'transparent',
    },
    tracedPoint: {
      position: 'absolute',
      width: 20,
      height: 20,
      borderRadius: 10,
      opacity: 0.8,
    },
    checkpoint: {
      position: 'absolute',
      width: 40,
      height: 40,
      borderRadius: 20,
      opacity: 1,
      borderWidth: 3,
      borderColor: 'white',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 8,
    },
    wordContainer: {
      alignItems: 'center',
      padding: 20,
    },
    wordText: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 20,
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
    },
    button: {
      backgroundColor: '#4CAF50',
      padding: 15,
      borderRadius: 10,
      minWidth: 100,
      alignItems: 'center',
    },
    buttonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    instructionsContainer: {
      position: 'absolute',
      bottom: 80,
      left: 0,
      right: 0,
      alignItems: 'center',
      padding: 10,
    },
    instructionsText: {
      fontSize: 14,
      color: '#666',
      textAlign: 'center',
    },
  }); 
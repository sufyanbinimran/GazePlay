import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
 return (
   <View style={styles.container}>
     <View style={styles.headerContainer}>
       <Text style={styles.title}>Who Are You?</Text>
       <Text style={styles.subtitle}>Choose your role to get started</Text>
     </View>

     {/* Guardian Button */}
     <TouchableOpacity
       style={styles.buttonContainer}
       onPress={() => navigation.navigate('LoginSignup', { userType: 'Guardian' })}
     >
       <View style={styles.button}>
         <View style={styles.iconContainer}>
           <Text style={styles.emoji}>👥</Text>
         </View>
         <View style={styles.buttonTextContainer}>
           <Text style={styles.buttonTitle}>Guardian</Text>
           <Text style={styles.buttonSubtitle}>Parent, Teacher, or Caregiver</Text>
         </View>
       </View>
     </TouchableOpacity>

     {/* User Button */}
     <TouchableOpacity
       style={styles.buttonContainer}
       onPress={() => navigation.navigate('LoginSignup', { userType: 'User' })}
     >
       <View style={styles.button}>
         <View style={styles.iconContainer}>
           <Text style={styles.emoji}>👨‍🎓</Text>
         </View>
         <View style={styles.buttonTextContainer}>
           <Text style={styles.buttonTitle}>User</Text>
           <Text style={styles.buttonSubtitle}>Student or Learner</Text>
         </View>
       </View>
     </TouchableOpacity>
   </View>
 );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  emoji: {
    fontSize: 32,
  },
  buttonTextContainer: {
    flex: 1,
  },
  buttonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  buttonSubtitle: {
    fontSize: 14,
    color: '#666666',
  },
});

export default WelcomeScreen;
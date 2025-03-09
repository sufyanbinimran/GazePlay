import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SERVER_CONFIG from './config';


export default function LoginSignupScreen({ route, navigation }) {
  const { userType } = route.params;
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  const [isAdditionalInfo, setIsAdditionalInfo] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [condition, setCondition] = useState('');
  const [communicationMethod, setCommunicationMethod] = useState('');
  const [familyInfo, setFamilyInfo] = useState('');
  const [likes, setLikes] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  

  const [isLoading, setIsLoading] = useState(false);
  
  const [tempUserData, setTempUserData] = useState(null);

  
  const role = userType.toLowerCase();

  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    
    setEmailError('');
    return true;
  };
  
  const [passwordRequirements, setPasswordRequirements] = useState({
    minLength: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false
  }); 

  
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const lowercase = /[a-z]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[~`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?_]/.test(password);
  
    setPasswordRequirements({
      minLength,
      lowercase,
      uppercase,
      number,
      specialChar
    });
  
    if (minLength && lowercase && uppercase && number && specialChar) {
      setPasswordError('');
      return true;
    } else {
      setPasswordError('Please fulfill all password requirements.');
      return false;
    }
  };

  
  const handlePasswordChange = (text) => {
    setPassword(text);
    validatePassword(text);
  };

  
  const handleEmailChange = (text) => {
    setEmail(text);
    validateEmail(text);
  };

  const handleLogin = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      Alert.alert('Validation Error', 'Please check your email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${SERVER_CONFIG.API_URL}/login`, {
        email: email,
        password: password,
        loginAsRole: role
      });
  
      
      if (response.data.status === 'ok') {
        await AsyncStorage.setItem('userToken', response.data.token);
        
        if (role === 'user') {
          navigation.replace('UserDashboard');
        } else if (role === 'guardian') {
          navigation.replace('GuardianDashboard');
        } else if (role === 'admin') {
          navigation.replace('AdminDashboard');
        } else {
          Alert.alert('Success', `${role} logged in successfully`);
        }
      } else {
        Alert.alert('Error', response.data.data || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.data || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${SERVER_CONFIG.API_URL}/send-verification`, {
        email: email
      });
      
      if (response.data.status === 'ok') {
        setTempUserData({
          name,
          email,
          password,
          role
        });
        setIsVerification(true);
        Alert.alert('Success', 'Verification code sent to your email');
      } else {
        Alert.alert('Error', response.data.data || 'Failed to send verification code');
      }
    } catch (error) {
      console.error('Verification error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.data || 'An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignup = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }

    setIsLoading(true);
    try {
      const verifyResponse = await axios.post(`${SERVER_CONFIG.API_URL}/verify-email`, {
        email: tempUserData.email,
        code: verificationCode
      });

      if (verifyResponse.data.status === 'ok') {
        if (role === 'guardian') {
          // For guardians, directly proceed with registration
          await handleGuardianRegistration();
        } else {
          // For other users, show additional info screen
          setIsVerification(false);
          setIsAdditionalInfo(true);
        }
        setVerificationCode('');
      } else {
        Alert.alert('Error', 'Invalid verification code');
      }
    } catch (error) {
      console.error('Verification error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.data || 'An error occurred during verification');
    } finally {
      setIsLoading(false);
    }
  };
  const handleGuardianRegistration = async () => {
    setIsLoading(true);
    try {
      const registerResponse = await axios.post(`${SERVER_CONFIG.API_URL}/register`, {
        ...tempUserData,
        isVerified: true
      });

      if (registerResponse.data.status === 'ok') {
        Alert.alert('Success', 'Guardian registered successfully', [
          {
            text: 'OK',
            onPress: () => {
              setIsVerification(false);
              setIsLogin(true);
              setEmail('');
              setPassword('');
              setName('');
              setVerificationCode('');
              setTempUserData(null);
            }
          }
        ]);
      } else {
        Alert.alert('Error', registerResponse.data.data || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.data || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };


  const handleAdditionalInfo = async () => {
    if (!age.trim()) {
      Alert.alert('Error', 'Age is required');
      return;
    }

    setIsLoading(true);
    try {
      const registerResponse = await axios.post(`${SERVER_CONFIG.API_URL}/register`, {
        ...tempUserData,
        age,
        condition,
        communicationMethod,
        familyInfo,
        likes,
        dislikes,
        isVerified: true
      });

      if (registerResponse.data.status === 'ok') {
        Alert.alert('Success', `${userType} registered successfully`, [
          {
            text: 'OK',
            onPress: () => {
              setIsAdditionalInfo(false);
              setIsLogin(true);
              setEmail('');
              setPassword('');
              setName('');
              setAge('');
              setCondition('');
              setCommunicationMethod('');
              setFamilyInfo('');
              setLikes('');
              setDislikes('');
              setVerificationCode('');
              setTempUserData(null);
            }
          }
        ]);
      } else {
        Alert.alert('Error', registerResponse.data.data || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.data || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${SERVER_CONFIG.API_URL}/forgot-password`, {
        email: email
      });

      if (response.data.status === 'ok') {
        Alert.alert(
          'Success',
          'Password reset instructions have been sent to your email.',
          [
            {
              text: 'OK',
              onPress: () => {
                setIsForgotPassword(false);
                setEmail('');
              }
            }
          ]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.data || 'An error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderVerificationScreen = () => (
    <>
      <Text style={styles.title}>Email Verification</Text>
      <Text style={styles.subtitle}>
        Please enter the verification code sent to your email
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Verification Code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleVerifyAndSignup}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, isLoading && styles.disabledText]}>
            {isLoading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, isLoading && styles.disabledButton]}
          onPress={async () => {
            setIsLoading(true);
            try {
              await axios.post(`${SERVER_CONFIG.API_URL}/send-verification`, {
                email: tempUserData.email
              });
              Alert.alert('Success', 'New verification code sent');
            } catch (error) {
              Alert.alert('Error', 'Failed to resend verification code');
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
        >
          <Text style={[styles.secondaryButtonText, isLoading && styles.disabledText]}>
            Resend Code
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tertiaryButton}
          onPress={() => {
            setIsVerification(false);
            setVerificationCode('');
            setTempUserData(null);
          }}
          disabled={isLoading}
        >
          <Text style={[styles.tertiaryButtonText, isLoading && styles.disabledText]}>
            Back
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderForgotPasswordScreen = () => (
    <>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you instructions to reset your password.
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, emailError ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isLoading}
        />
        {emailError && <Text style={styles.errorText}>{emailError}</Text>}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, isLoading && styles.disabledText]}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={() => {
            setIsForgotPassword(false);
            setEmail('');
            setEmailError('');
          }}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  const renderAdditionalInfoScreen = () => (
    <>
      <Text style={styles.title}>Additional Information</Text>
      <Text style={styles.subtitle}>
        Please provide additional details to complete your signup
      </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
          editable={!isLoading}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Condition"
          value={condition}
          onChangeText={setCondition}
          editable={!isLoading}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Communication Method"
          value={communicationMethod}
          onChangeText={setCommunicationMethod}
          editable={!isLoading}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Family Information"
          value={familyInfo}
          onChangeText={setFamilyInfo}
          multiline
          numberOfLines={3}
          editable={!isLoading}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Likes"
          value={likes}
          onChangeText={setLikes}
          multiline
          numberOfLines={3}
          editable={!isLoading}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Dislikes"
          value={dislikes}
          onChangeText={setDislikes}
          multiline
          numberOfLines={3}
          editable={!isLoading}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={handleAdditionalInfo}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, isLoading && styles.disabledText]}>
            {isLoading ? "Completing..." : "Complete Signup"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton]}
          onPress={() => {
            setIsAdditionalInfo(false);
            setIsVerification(true);
            setAge('');
            setCondition('');
            setCommunicationMethod('');
            setFamilyInfo('');
            setLikes('');
            setDislikes('');
          }}
          disabled={isLoading}
          >
          <Text style={styles.secondaryButtonText}>
            Back to Verification
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
    const renderLoginSignupScreen = () => (
      <>
        <Text style={styles.title}>
          {userType} {isLogin ? 'Login' : 'Signup'} Screen
        </Text>
  
        <View style={styles.segmentedControlContainer}>
          <TouchableOpacity
            style={[styles.segmentedControlButton, isLogin ? styles.activeSegment : styles.inactiveSegment]}
            onPress={() => setIsLogin(true)}
          >
            <Text style={[styles.segmentedControlText, isLogin ? styles.activeSegmentText : styles.inactiveSegmentText]}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentedControlButton, !isLogin ? styles.activeSegment : styles.inactiveSegment]}
            onPress={() => setIsLogin(false)}
          >
            <Text style={[styles.segmentedControlText, !isLogin ? styles.activeSegmentText : styles.inactiveSegmentText]}>
              Signup
            </Text>
          </TouchableOpacity>
        </View>
  
        <Text style={styles.roleText}>Signing in as: {userType}</Text>
  
        {!isLogin && (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              editable={!isLoading}
            />
          </View>
        )}
  
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, emailError ? styles.inputError : null]}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            editable={!isLoading}
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>
  
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, passwordError ? styles.inputError : null]}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={handlePasswordChange}
            editable={!isLoading}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />
          <TouchableOpacity
            style={styles.inputIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Text>{passwordVisible ? '👁️' : '👁️‍🗨️'}</Text>
          </TouchableOpacity>
          {passwordFocused && (
            <View>
              <Text
                style={{
                  color: passwordRequirements.minLength ? 'green' : 'red',
                }}
              >
                • Minimum 8 characters
              </Text>
              <Text
                style={{
                  color: passwordRequirements.lowercase ? 'green' : 'red',
                }}
              >
                • At least 1 lowercase letter
              </Text>
              <Text
                style={{
                  color: passwordRequirements.uppercase ? 'green' : 'red',
                }}
              >
                • At least 1 uppercase letter
              </Text>
              <Text
                style={{
                  color: passwordRequirements.number ? 'green' : 'red',
                }}
              >
                • At least 1 number
              </Text>
              <Text
                style={{
                  color: passwordRequirements.specialChar ? 'green' : 'red',
                }}
              >
                • At least 1 special character
              </Text>
            </View>
          )}
        </View>
  
        {isLogin && (
          <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
            <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}
  
        <TouchableOpacity
          style={[styles.button, isLoading && styles.disabledButton]}
          onPress={isLogin ? handleLogin : handleSignup}
          disabled={isLoading}
        >
          <Text style={[styles.buttonText, isLoading && styles.disabledText]}>
            {isLogin ? 'Login' : 'Signup'}
          </Text>
        </TouchableOpacity>
      </>
    );
  
    return (
      <View style={styles.container}>
        {isVerification 
          ? renderVerificationScreen()
          : isForgotPassword 
            ? renderForgotPasswordScreen() 
            : isAdditionalInfo && role !== 'guardian'
              ? renderAdditionalInfoScreen()
              : renderLoginSignupScreen()
        }
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      backgroundColor: '#FAFBFF',
    },
  
    title: {
      fontSize: 32,
      fontWeight: '800',
      color: '#1A1A2F',
      marginBottom: 16,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 17,
      color: '#4A4B57',
      textAlign: 'center',
      marginBottom: 36,
      lineHeight: 24,
      width: '90%',
      letterSpacing: 0.2,
    },
  
    inputContainer: {
      width: '85%',
      marginBottom: 24,
    },
    input: {
      width: '100%',
      padding: 16,
      backgroundColor: '#FFFFFF',
      borderWidth: 1.5,
      borderColor: '#E4E9F2',
      borderRadius: 16,
      fontSize: 16,
      color: '#2D2D3A',
      shadowColor: '#8F9BB3',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2,
    },
    inputError: {
      borderColor: '#FF3D71',
      borderWidth: 2,
      backgroundColor: '#FFF2F2',
    },
    errorText: {
      color: '#FF3D71',
      fontSize: 14,
      marginTop: 8,
      marginLeft: 4,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    inputIcon: {
      position: 'absolute',
      right: 16,
      top: 16,
    },
  
    buttonContainer: {
      alignItems: 'center',
      marginTop: 16,
      width: '100%',
      gap: 16,
    },
    button: {
      width: '40%',
      paddingVertical: 14,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#3366FF', 
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 4.65,
      elevation: 8,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600',
    },
    disabledButton: {
      backgroundColor: '#B0C4DE', 
    },
    disabledText: {
      color: '#FFFFFF', 
    },
    secondaryButton: {
      width: '40%',
      paddingVertical: 14,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E4E9F2',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.15,
      shadowRadius: 4.65,
      elevation: 6,
    },
    secondaryButtonText: {
      color: '#3366FF',
      fontSize: 17,
      fontWeight: '600',
    },
    tertiaryButton: {
      width: '40%',
      paddingVertical: 14,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent', 
    },
    tertiaryButtonText: {
      color: '#4A4B57', 
      fontSize: 17,
      fontWeight: '600',
    },  
    forgetPasswordText: {
      fontSize: 15,
      color: '#3366FF',
      marginBottom: 24,
      fontWeight: '600',
      letterSpacing: 0.2,
    },
    roleText: {
      fontSize: 16,
      color: '#4A4B57',
      marginBottom: 28,
      fontStyle: 'italic',
      textAlign: 'center',
      letterSpacing: 0.2,
    },
  
    segmentedControlContainer: {
      flexDirection: 'row',
      width: '85%',
      backgroundColor: '#F0F3FA',
      borderRadius: 12,
      padding: 4,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: '#E4E9F2',
    },
    segmentedControlButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    segmentedControlText: {
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 0.3,
    },
    activeSegment: {
      backgroundColor: '#3366FF',
    },
    inactiveSegment: {
      backgroundColor: 'transparent',
    },
    activeSegmentText: {
      color: '#FFFFFF',
    },
    inactiveSegmentText: {
      color: '#8F9BB3',
    },
    inputIcon: {
      position: 'absolute',
      right: 16,
      top: 16,
      height: 24,
      width: 24,
      alignItems: 'center',
      justifyContent: 'center'
    }
  });
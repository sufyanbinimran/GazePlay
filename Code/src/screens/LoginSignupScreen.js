// Import necessary components and libraries
import React, { useState } from 'react';
import { View, Text, TextInput,  Button, StyleSheet,  TouchableOpacity, Alert 
} 
from 'react-native';
import axios from 'axios';

// Main component declaration
export default function LoginSignupScreen({ route, navigation }) {
  // Get userType from navigation params
  const { userType } = route.params;
  
  // State declarations
  // Screen control states
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isVerification, setIsVerification] = useState(false);
  
  // Form input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  
  // Error states
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Temporary storage for user data during verification
  const [tempUserData, setTempUserData] = useState(null);

  // Convert userType to lowercase for API requests
  const role = userType.toLowerCase();

  // Email validation function
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

  // Password validation function
  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`!@#$%^&*()-_+={}[\]|\\;:"<>,./?])[A-Za-z\d~`!@#$%^&*()-_+={}[\]|\\;:"<>,./?]{8,}$/;
    
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    
    if (!passwordRegex.test(password)) {
      setPasswordError(
        'Password must contain:\n' +
        '• At least 1 lowercase letter\n' +
        '• At least 1 uppercase letter\n' +
        '• At least 1 number\n' +
        '• At least 1 special character\n' +
        '• Minimum 8 characters'
      );
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  // Handle real-time password validation
  const handlePasswordChange = (text) => {
    setPassword(text);
    validatePassword(text);
  };

  // Handle real-time email validation
  const handleEmailChange = (text) => {
    setEmail(text);
    validateEmail(text);
  };

  // Handle login submission
  const handleLogin = async () => {
    // Validate fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
  
    if (!isEmailValid || !isPasswordValid) {
      return;
    }
  
    setIsLoading(true);
    try {
      const response = await axios.post('http://10.54.15.74:5001/login', {
        email: email,
        password: password,
        loginAsRole: role
      });
      
      if (response.data.status === 'ok') {
        if (role === 'user') {
          navigation.replace('UserDashboard');
        } else if (role === 'guardian') {
          navigation.replace('GuardianDashboard');
        } else if (role === 'admin') {
          navigation.replace('AdminDashboard');
        }
        else {
          Alert.alert('Success', `${userType} logged in successfully`);
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
  // Handle initial signup attempt
  const handleSignup = async () => {
    // Validate all fields
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
      // Request email verification
      const response = await axios.post('http://10.54.15.74:5001/send-verification', {
        email: email
      });
      
      if (response.data.status === 'ok') {
        // Store user data temporarily
        setTempUserData({
          name,
          email,
          password,
          role
        });
        // Show verification screen
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

  // Handle verification and complete signup
  const handleVerifyAndSignup = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }

    setIsLoading(true);
    try {
      // First verify the code
      const verifyResponse = await axios.post('http://10.54.15.74:5001/verify-email', {
        email: tempUserData.email,
        code: verificationCode
      });

      if (verifyResponse.data.status === 'ok') {
        // If verification successful, proceed with registration
        const registerResponse = await axios.post('http://10.54.15.74:5001/register', {
          ...tempUserData,
          isVerified: true
        });

        if (registerResponse.data.status === 'ok') {
          Alert.alert('Success', `${userType} registered successfully`, [
            {
              text: 'OK',
              onPress: () => {
                // Reset all states and show login screen
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

  // Handle forgot password request
  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post('http://10.54.15.74:5001/forgot-password', {
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

  // Render verification screen
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

      <Button
        title={isLoading ? "Verifying..." : "Verify & Complete Signup"}
        onPress={handleVerifyAndSignup}
        disabled={isLoading}
      />

      {/* Resend code button */}
      <TouchableOpacity 
        onPress={async () => {
          setIsLoading(true);
          try {
            await axios.post('http://10.54.15.74:5001/send-verification', {
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
        <Text style={styles.resendCodeText}>Resend Code</Text>
      </TouchableOpacity>

      {/* Back button */}
      <Button
        title="Back"
        onPress={() => {
          setIsVerification(false);
          setVerificationCode('');
          setTempUserData(null);
        }}
        disabled={isLoading}
      />
    </>
  );

  // Render forgot password screen
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
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>

      <View style={{ gap: 16 }}>
        <Button
          title={isLoading ? "Sending..." : "Send Reset Link"}
          onPress={handleForgotPassword}
          disabled={isLoading}
        />

        <Button
          title="Back to Login"
          onPress={() => {
            setIsForgotPassword(false);
            setEmail('');
            setEmailError('');
          }}
          disabled={isLoading}
        />
      </View>
    </>
);

  // Render main login/signup screen
  const renderLoginSignupScreen = () => (
    <>
      <Text style={styles.title}>
        {userType} {isLogin ? 'Login' : 'Signup'} Screen
      </Text>

      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setIsLogin(true)}>
          <Text style={[styles.toggleText, isLogin && styles.activeToggle]}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsLogin(false)}>
          <Text style={[styles.toggleText, !isLogin && styles.activeToggle]}>Signup</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.roleText}>
        Signing in as: {userType}
      </Text>

      {/* Name input - only show on signup */}
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

      {/* Email input */}
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
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      </View>
      
      {/* Password input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, passwordError ? styles.inputError : null]}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
          editable={!isLoading}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
      </View>

      {/* Forgot password link - only show on login */}
      {isLogin && (
        <TouchableOpacity onPress={() => setIsForgotPassword(true)}>
          <Text style={styles.forgetPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      )}
      
      {/* Login/Signup button */}
      <Button
        title={isLogin ? 'Login' : 'Signup'}
        onPress={isLogin ? handleLogin : handleSignup}
        disabled={isLoading}
      />
    </>
  );

  // Main render method
  return (
    <View style={styles.container}>
      {isVerification 
        ? renderVerificationScreen()
        : isForgotPassword 
          ? renderForgotPasswordScreen() 
          : renderLoginSignupScreen()
      }
    </View>
  );
}

const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FAFBFF',
  },

  // Typography Styles
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

  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    backgroundColor: '#F3F5FF',
    borderRadius: 16,
    padding: 6,
    width: '85%',
    shadowColor: '#8F9BB3',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 15,
    flex: 1,
    textAlign: 'center',
    padding: 12,
    borderRadius: 12,
    fontWeight: '500',
    color: '#8F9BB3',
    letterSpacing: 0.3,
  },
  activeToggle: {
    backgroundColor: '#3366FF',
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Input Styles
  inputContainer: {
    width: '85%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    color: '#4A4B57',
    marginBottom: 8,
    marginLeft: 4,
    fontWeight: '600',
    letterSpacing: 0.2,
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

  // Button Styles
  button: {
    width: '85%',
    marginVertical: 12,
    backgroundColor: '#3366FF',
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#3366FF',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  disabledButton: {
    backgroundColor: '#EEF1F8',
    shadowOpacity: 0,
  },
  disabledText: {
    color: '#8F9BB3',
  },

  // Additional Links & Text
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
  resendCodeText: {
    fontSize: 15,
    color: '#3366FF',
    fontWeight: '600',
    marginVertical: 16,
    letterSpacing: 0.2,
  },

  // Divider Styles
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#EEF1F8',
  },
  dividerText: {
    color: '#4A4B57',
    paddingHorizontal: 16,
    fontSize: 15,
    letterSpacing: 0.2,
  },

  // Social Buttons
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '85%',
    marginTop: 12,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    borderWidth: 1.5,
    borderColor: '#EEF1F8',
    shadowColor: '#8F9BB3',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  // Utility Styles
  centerText: {
    textAlign: 'center',
  },
  marginTop: {
    marginTop: 16,
  },
  marginBottom: {
    marginBottom: 16,
  },
  boldText: {
    fontWeight: '700',
    color: '#1A1A2F',
    letterSpacing: 0.2,
  },
});
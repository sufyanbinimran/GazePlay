import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/SplashScreen'; // Splash screen
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginSignupScreen from './src/screens/LoginSignupScreen';
import UserDashboardScreenComponent from './src/screens/USER/UserDashboardScreenComponent';
import ActivityConsole from './src/screens/USER/Activity Module/ActivityConsole';
import PlacesScreen from './src/screens/USER/Activity Module/PlacesScreen'; 
import LearningHub from './src/screens/USER/Learning Module/LearningHub';
import QuickContacts from './src/screens/USER/QuickContacts Module/QuickContacts';
import GuardianDashboard from './src/screens/GUARDIAN/GuardianDashboard';
import MonitorProgress from './src/screens/GUARDIAN/MonitorProgress';
import CallPermissionScreen from './src/screens/GUARDIAN/CallPermissionScreen'; 
import PersonalActivitiesScreen from './src/screens/USER/Activity Module/PersonalActivitiesScreen.js';
import QuickFiresScreen from './src/screens/USER/Activity Module/QuickFiresScreen.js';
import TopicsScreen from './src/screens/USER/Activity Module/TopicsScreen.js';
import WordTrackingGame from './src/screens/USER/Learning Module/WordTrackingGame';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTintColor: '#333',
          headerBackTitleVisible: false,
        }}
      >
        {/* Splash Screen */}
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Authentication Flow */}
        <Stack.Screen 
          name="Welcome" 
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="LoginSignup" 
          component={LoginSignupScreen}
          options={{ headerShown: false }}
        />

        {/* User Flow */}
        <Stack.Screen 
          name="UserDashboard" 
          component={UserDashboardScreenComponent}
          options={{ headerShown: false }}
        />
         <Stack.Screen 
          name="PlacesScreen" 
          component={PlacesScreen}
          options={{ 
            title: 'Important Places',
            headerTitleAlign: 'center'
          }}
        />
        <Stack.Screen 
          name="TopicsScreen" 
          component={TopicsScreen}
          options={{
            title: 'Communication Topics',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen 
          name="ActivityConsole" 
          component={ActivityConsole}
          options={{ title: 'Activities' }}
        />
        <Stack.Screen 
          name="LearningHub" 
          component={LearningHub}
          options={{ title: 'Learning' }}
        />
        <Stack.Screen 
          name="QuickContacts" 
          component={QuickContacts}
          options={{ title: 'Quick Contacts' }}
        />
        <Stack.Screen 
          name="PersonalActivitiesScreen" 
          component={PersonalActivitiesScreen}
          options={{ title: 'Personal Activities' }}
        />
        <Stack.Screen 
          name="QuickFiresScreen" 
          component={QuickFiresScreen}
          options={{ title: 'Quick Fires' }}
        />
        <Stack.Screen 
          name="WordTrackingGame" 
          component={WordTrackingGame}
          options={{ 
            title: 'Word Tracking Game',
            headerTitleAlign: 'center',
            headerStyle: {
              backgroundColor: '#f5f5f5',
              elevation: 0,
              shadowOpacity: 0,
            },
          }}
        />

        {/* Guardian Flow */}
        <Stack.Screen 
          name="GuardianDashboard" 
          component={GuardianDashboard}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="MonitorProgress" 
          component={MonitorProgress}
          options={{ 
            title: 'Child Progress',
            headerTitleAlign: 'center'
          }}
        />
         <Stack.Screen 
          name="CallPermission" 
          component={CallPermissionScreen}
          options={{ 
            title: 'Call Permissions',
            headerTitleAlign: 'center'
          }}
        />
     
         
      </Stack.Navigator>
    </NavigationContainer>
  );
}

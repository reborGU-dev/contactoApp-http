
import React from 'react';
import { StatusBar } from 'expo-status-bar';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme
} from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import ContactListScreen from './src/screens/ContactListScreen';
import NewContactScreen from './src/screens/NewContactScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import EditContactScreen from './src/screens/EditContactScreen';
import InfoScreen from './src/screens/InfoScreen';
import HelpScreen from './src/screens/HelpScreen';

import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { ContactsProvider } from './src/context/ContactsContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// navegacion inferior
function Tabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,

        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },

        tabBarLabelStyle: {
          fontSize: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={ContactListScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="NewContact"
        component={NewContactScreen}
        options={{
          title: 'Nuevo Contacto',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="person-add-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// contendor principal que consume el tema global
function AppContent() {
  const { colors, isDarkMode } = useTheme();

  const navigationTheme = {
    ...(isDarkMode ? DarkTheme : DefaultTheme),

    colors: {
      ...(isDarkMode ? DarkTheme.colors : DefaultTheme.colors),

      primary: colors.primary,
      background: colors.background,
      card: colors.white,
      text: colors.text,
      border: colors.border,
      notification: colors.primary,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
        >
          <StatusBar style={isDarkMode ? 'light' : 'dark'} />

          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.white,
              },
              headerTintColor: colors.text,
              headerTitleStyle: {
                color: colors.text,
              },
              contentStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
            />

            <Stack.Screen
              name="EditContact"
              component={EditContactScreen}
              options={{ title: 'Editar contacto' }}
            />

            <Stack.Screen
              name="Info"
              component={InfoScreen}
              options={{ title: 'Información' }}
            />

            <Stack.Screen
              name="Help"
              component={HelpScreen}
              options={{ title: 'Ayuda' }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <ContactsProvider>
          <AppContent />
        </ContactsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initDB } from './dal/DBHelper';
import LoginActivity from './screens/LoginActivity';
import ScoreActivity from './screens/ScoreActivity';

type Screen = 'LOGIN' | 'SCORE';

export default function StudentManager() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('LOGIN');
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        // Init Database
        await initDB();

        // Check Login Session (SharedPreferences equivalent)
        const loginData = await AsyncStorage.getItem('LOGIN');
        if (loginData) {
          const session = JSON.parse(loginData);
          if (session.isLogin) {
            setCurrentScreen('SCORE');
          }
        }
      } catch (e) {
        console.error('Failed to initialize StudentManager:', e);
      } finally {
        setIsInitializing(false);
      }
    };

    bootstrap();
  }, []);

  if (isInitializing) {
    return (
      <View style={styles.initializing}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'LOGIN' ? (
        <LoginActivity onLoginSuccess={() => setCurrentScreen('SCORE')} />
      ) : (
        <ScoreActivity onLogout={() => setCurrentScreen('LOGIN')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  initializing: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
});

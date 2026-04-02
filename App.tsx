import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { loadSavedLocale } from './src/i18n';
import AppNavigator from './src/navigation/AppNavigator';
import LoadingSpinner from './src/components/LoadingSpinner';
import { useNotifications } from './src/hooks/useNotifications';

export default function App() {
  const [ready, setReady] = useState(false);
  useNotifications();

  useEffect(() => {
    loadSavedLocale().finally(() => setReady(true));
  }, []);

  if (!ready) return <LoadingSpinner />;

  return (
    <>
      <StatusBar style="dark" />
      <AppNavigator />
    </>
  );
}

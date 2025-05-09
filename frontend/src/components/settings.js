import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, useColorScheme } from 'react-native'; // Utilisation de useColorScheme intégré

const SettingsPage = () => {
  const systemTheme = useColorScheme(); // Récupère le thème du système (light ou dark)
  const [isDarkMode, setIsDarkMode] = useState(systemTheme === 'dark'); // Initialisation avec le thème du système

  // Fonction pour basculer entre les modes
  const toggleDarkMode = () => {
    setIsDarkMode(previousState => !previousState);
  };

  // Définir les styles en fonction du mode
  const styles = createStyles(isDarkMode);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose your Theme</Text>

      {/* Switch pour changer de thème */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
};

// Créer des styles dynamiques en fonction du mode
const createStyles = (isDarkMode) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#121212' : '#f0f4f8', // Change de couleur de fond en fonction du mode
    },
    title: {
      fontSize: 30,
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#333', // Change la couleur du texte
      marginBottom: 20,
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    settingText: {
      fontSize: 18,
      color: isDarkMode ? '#ffffff' : '#333', // Change la couleur du texte
    },
  });
};

export default SettingsPage;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';


const JournalEntryScreen = ({ route, navigation }) => {
  const { userId, existingEntry } = route.params;
  const [content, setContent] = useState(existingEntry ? existingEntry.content : '');

  const isEditing = !!existingEntry;

  const handleSave = async () => {
    if (!content.trim()) {
      Alert.alert("Le contenu est vide !");
      return;
    }

    const payload = {
      userId,
      content,
      date: existingEntry?.date || new Date(), // Nouvelle date si création
    };

     const url = 'http://192.168.1.6:5000/api/journal';

    // const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

     navigation.navigate("Journal",{userId:userId });
  
    } catch (error) {
      Alert.alert("Erreur", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isEditing ? "update your journal" : "new journal"}</Text>
      <TextInput
        multiline
        placeholder="write here ..."
        value={content}
        onChangeText={setContent}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveText}>{isEditing ? "update" : "save"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default JournalEntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
    color: '#5C8EFF',
    fontWeight: '600',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#5C8EFF',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

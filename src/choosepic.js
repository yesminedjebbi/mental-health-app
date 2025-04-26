import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { useNavigation } from '@react-navigation/native'; // Importer useNavigation

const ProfilePictureSelector = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation(); // Créer une instance de navigation

  const imageList = [
    { id: 1, file: require('../assets/profile.jpg'), name: 'profile1.jpg' },
    { id: 2, file: require('../assets/profile2.jpg'), name: 'profile2.jpg' },
    { id: 3, file: require('../assets/profile3.jpg'), name: 'profile3.jpg' },
    { id: 4, file: require('../assets/profile4.jpg'), name: 'profile4.jpg' },
    { id: 5, file: require('../assets/profile5.jpg'), name: 'profile5.jpg' },
    { id: 6, file: require('../assets/profile6.jpg'), name: 'profile6.jpg' },
    { id: 7, file: require('../assets/profile7.jpg'), name: 'profile7.jpg' },
  ];

  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  const handleNext = async () => {
    if (!selectedImage) {
      Alert.alert('Erreur', 'Veuillez sélectionner une photo de profil');
      return;
    }

    try {
      const asset = Asset.fromModule(selectedImage.file);
      await asset.downloadAsync();

      const fileUri = asset.localUri || asset.uri;

      const formData = new FormData();
      formData.append('profilePicture', {
        uri: fileUri,
        type: 'image/jpeg',
        name: selectedImage.name,
      });
      formData.append('_id', '67e5cc1d674becc4c1004208');

      const response = await axios.post('http://192.168.1.169:5000/uploadProfilePicture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.message) {
        Alert.alert('Succès', 'Photo de profil mise à jour !');
        // Rediriger l'utilisateur vers la page de profil après un upload réussi
        navigation.navigate('ProfilePage', { imageUrl: fileUri }); // Passer l'image à la page de profil
      } else {
        Alert.alert('Erreur', 'Échec de l’envoi de la photo.');
      }
    } catch (error) {
      console.error('Erreur lors de l’envoi :', error);
      Alert.alert('Erreur', 'Une erreur est survenue.');
    }
  };

  const handleBack = () => {
    console.log('Back button pressed');
    navigation.goBack(); // Retour à la page précédente
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Choisissez votre photo de profil</Text>

      <View style={styles.profilePictureContainer}>
        <Text style={styles.selectedText}>Image sélectionnée :</Text>
        {selectedImage ? (
          <Image source={selectedImage.file} style={styles.selectedProfileImage} />
        ) : (
          <Text style={styles.placeholderText}>Aucune sélection</Text>
        )}
      </View>

      <View style={styles.imageContainer}>
        {imageList.map((image) => (
          <TouchableOpacity
            key={image.id}
            style={[
              styles.imageOption,
              selectedImage?.id === image.id && styles.selectedImage,
            ]}
            onPress={() => handleImageSelect(image)}
          >
            <Image source={image.file} style={styles.imageOptionStyle} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleBack}>
          <Text style={styles.buttonText}>Retour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedText: {
    fontSize: 18,
    color: '#46a7b0',
    marginBottom: 10,
  },
  selectedProfileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  imageOption: {
    margin: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    overflow: 'hidden',
  },
  selectedImage: {
    borderColor: '#3b82f6',
  },
  imageOptionStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 30,
  },
  button: {
    backgroundColor: '#96d2d8',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfilePictureSelector;

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ProfilePictureSelector = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigation = useNavigation();

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
      Alert.alert('Error', 'Please choose a picture for your profile');
      return;
    }

    try {
      const response = await axios.post('http://192.168.1.174:5000/api/updateProfilePicture', {
        _id: '67e5cc1d674becc4c1004208',
        profilePicture: selectedImage.name, // Envoie juste le nom du fichier
      });

      if (response.data.message) {
        Alert.alert('Success', 'Profile picture updated!');
        navigation.navigate('ProfilePage', { 
          imageUrl: selectedImage.name, // ✅ correction ici
          imageFile: selectedImage.file 
        });
      } else {
        Alert.alert('Error', 'Failure sending the picture');
      }
    } catch (error) {
      console.error('Failure sending:', error);
      Alert.alert('Error', 'Error has been detected');
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Choose your profile picture</Text>

      <View style={styles.profilePictureContainer}>
        <Text style={styles.selectedText}>Selected image:</Text>
        {selectedImage ? (
          <Image source={selectedImage.file} style={styles.selectedProfileImage} />
        ) : (
          <Text style={styles.placeholderText}>No selection</Text>
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
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

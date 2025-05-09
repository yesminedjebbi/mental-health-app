import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ProfilePictureSelector = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, username,interests } = route.params;
  const [selectedImage, setSelectedImage] = useState(null);

  const imageList = [
    { id: 1, file: require('../../assets/profile.jpg'), name: 'profile1.jpg' },
    { id: 2, file: require('../../assets/profile2.jpg'), name: 'profile2.jpg' },
    { id: 3, file: require('../../assets/profile3.jpg'), name: 'profile3.jpg' },
    { id: 4, file: require('../../assets/profile4.jpg'), name: 'profile4.jpg' },
    { id: 5, file: require('../../assets/profile5.jpg'), name: 'profile5.jpg' },
    { id: 6, file: require('../../assets/profile6.jpg'), name: 'profile6.jpg' },
    { id: 7, file: require('../../assets/profile7.jpg'), name: 'profile7.jpg' },
  ];
  const handleNext = async () => {
    if (!selectedImage) {
      return Alert.alert('Error', 'Please choose a picture');
    }
    try {
      const res = await fetch('http://192.168.1.6:5000/api/updateProfilePicture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: userId, profilePicture: selectedImage.name })
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      Alert.alert('Success', 'Profile updated');
      navigation.replace('Profile', {
        userId,
        username,
        imageUrl: selectedImage.name,
        interests
      });
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Choose your profile picture</Text>
      <View style={styles.preview}>
        {selectedImage ? (
          <Image source={selectedImage.file} style={styles.previewImage} />
        ) : (
          <Text style={styles.placeholder}>No selection</Text>
        )}
      </View>
      <View style={styles.grid}>
        {imageList.map(img => (
          <TouchableOpacity
            key={img.id}
            style={[
              styles.thumb,
              selectedImage?.id === img.id && styles.thumbSelected
            ]}
            onPress={() => setSelectedImage(img)}
          >
            <Image source={img.file} style={styles.thumbImage} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btn}>
          <Text style={styles.btnText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.btn}>
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  preview: { alignItems: 'center', marginBottom: 20 },
  previewImage: { width: 150, height: 150, borderRadius: 75 },
  placeholder: { fontSize: 16, color: '#888' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  thumb: { margin: 10, borderRadius: 10, borderWidth: 2, borderColor: '#ccc' },
  thumbSelected: { borderColor: '#3b82f6' },
  thumbImage: { width: 100, height: 100, borderRadius: 50 },
  buttons: { flexDirection: 'row', marginTop: 30, width: '100%', justifyContent: 'space-between' },
  btn: { flex: 1, marginHorizontal: 5, backgroundColor: '#96d2d8', padding: 15, alignItems: 'center', borderRadius: 25 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});

export default ProfilePictureSelector;

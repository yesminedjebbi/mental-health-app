import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get('window');

const ProfilePage = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const [profileImage, setProfileImage] = useState(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];

  useEffect(() => {
    if (route.params?.imageUrl) {
      setProfileImage(route.params.imageUrl);
    }
  }, [route.params?.imageUrl]);

  const toggleMenu = () => {
    if (isMenuVisible) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsMenuVisible(false));
    } else {
      setIsMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const getLocalImage = (imageName) => {
    switch (imageName) {
      case 'profile.jpg':
        return require('../assets/profile.jpg');
      case 'profile2.jpg':
        return require('../assets/profile2.jpg');
      case 'profile3.jpg':
        return require('../assets/profile3.jpg');
      case 'profile4.jpg':
        return require('../assets/profile4.jpg');
      case 'profile5.jpg':
        return require('../assets/profile5.jpg');
      case 'profile6.jpg':
        return require('../assets/profile6.jpg');
      default:
        return require('../assets/profile7.jpg'); // Image par défaut
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        {/* Menu Icon */}
        <View style={styles.topBarContainer}>
          <TouchableOpacity style={styles.iconContainerLeft} onPress={toggleMenu}>
            <Icon name="menu" size={30} color="black" />
          </TouchableOpacity>
        </View>

        {/* Notification Icon */}
        <View style={styles.topBarContainerRight}>
          <TouchableOpacity style={styles.iconContainerRight}>
            <Icon name="notifications" size={30} color="black" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.headerText}>Welcome!</Text>

        {/* Affichage de l'image de profil */}
        <View style={styles.profileContainer}>
          {profileImage ? (
            <Image source={getLocalImage(profileImage)} style={styles.profileImage} />
          ) : (
            <Text style={styles.placeholderText}>Aucune image de profil</Text>
          )}
        </View>

        <View style={styles.asymmetricShape} />

        <View style={styles.content}>
          <Text style={styles.title}>My activities</Text>
        </View>

        <View style={styles.boxes}>
          <View style={[styles.box, { backgroundColor: '#ffbbf4' }]} />
          <View style={[styles.box, { backgroundColor: '#ffbbf4' }]} />
          <View style={[styles.box, { backgroundColor: '#ffbbf4' }]} />
          <View style={[styles.box, { backgroundColor: '#ffbbf4' }]} />
        </View>

        {/* Side Menu */}
        {isMenuVisible && (
          <Animated.View style={[styles.sideMenu, { transform: [{ translateX: slideAnim }] }]}>
            <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
              <Icon name="close" size={30} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('settings')}>
              <Text style={styles.menuItem}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => alert('Edit Profile clicked')}>
              <Text style={styles.menuItem}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Feedback')}>
              <Text style={styles.menuItem}>Feedback</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 50,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 20,
    paddingTop: 100,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 80,
    marginBottom: 10,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholderText: {
    fontSize: 18,
    color: '#888',
  },
  topBarContainer: {
    position: 'absolute',
    left: 20,
    top: 30,
    zIndex: 1,
    paddingTop: 80,
  },
  topBarContainerRight: {
    position: 'absolute',
    right: 20,
    top: 30,
    zIndex: 1,
    paddingTop: 80,
  },
  iconContainerLeft: {
    paddingLeft: 10,
  },
  iconContainerRight: {
    paddingRight: 10,
  },
  asymmetricShape: {
    width: width,
    height: 200,
    borderBottomLeftRadius: 800,
    borderBottomRightRadius: 800,
    position: 'absolute',
    top: 0,
    zIndex: 0,
  },
  content: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#ea50b0',
    fontWeight: 'bold',
  },
  boxes: {
    marginTop: 10,
    alignItems: 'center',
  },
  box: {
    width: 350,
    height: 80,
    marginVertical: 10,
    borderRadius: 50,
    borderColor: 'white',
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 1,
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    zIndex: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: 'white',
    paddingTop: 100,
    paddingHorizontal: 20,
    elevation: 10,
    zIndex: 100,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 2, height: 0 },
    shadowRadius: 5,
  },
  menuItem: {
    fontSize: 18,
    marginVertical: 15,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 10,
  },
});

export default ProfilePage;

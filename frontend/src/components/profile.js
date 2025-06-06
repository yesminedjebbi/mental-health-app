import React, { useEffect, useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
  StatusBar,
  Platform,
  Pressable,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const ProfilePage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, imageUrl, username,interests} = route.params;
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current;
  const menuScaleAnim = useRef(new Animated.Value(0.9)).current;
  const menuOpacityAnim = useRef(new Animated.Value(0)).current;
  const bgBlurAnim = useRef(new Animated.Value(0)).current;

  // Stats fictives pour la démonstration
  const userStats = {
    postsCount: 143,
    followers: 2845,
    following: 426,
  };
  
  // Gradient colors
  const gradientColors = ['#4A66DB', '#1E3A8A'];

  // Animation d'entrée du profil
  const profileOpacity = useRef(new Animated.Value(0)).current;
  const profileTranslateY = useRef(new Animated.Value(50)).current;

  // → redirige si pas d'image
  useEffect(() => {
    if (!imageUrl) {
      navigation.replace('ChoosePic', { userId, username,interests });
    }
    
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(profileOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(profileTranslateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, [imageUrl]);
  useEffect(() => {
    console.log("Interests received in ProfilePage:", interests);
  }, []);

  const toggleMenu = () => {
    if (isMenuVisible) {
      // Fermer le menu
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -width * 0.7,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(menuScaleAnim, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(menuOpacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true
        }),
        Animated.timing(bgBlurAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false
        })
      ]).start(() => setIsMenuVisible(false));
    } else {
      // Ouvrir le menu
      setIsMenuVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(menuScaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(menuOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(bgBlurAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false
        })
      ]).start();
    }
  };

  const getLocalImage = (imageName) => {
    switch (imageName) {
      case 'profile.jpg':
        return require('../../assets/profile.jpg');
      case 'profile2.jpg':
        return require('../../assets/profile2.jpg');
      case 'profile3.jpg':
        return require('../../assets/profile3.jpg');
      case 'profile4.jpg':
        return require('../../assets/profile4.jpg');
      case 'profile5.jpg':
        return require('../../assets/profile5.jpg');
      case 'profile6.jpg':
        return require('../../assets/profile6.jpg');
      default:
        return require('../../assets/profile7.jpg'); 
    }
  };

  const MenuItem = ({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.menuListItem} onPress={onPress}>
      <Icon name={icon} size={22} color="#5F6EF0" style={styles.menuIcon} />
      <Text style={styles.menuItemText}>{label}</Text>
      <Icon name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  const StatItem = ({ value, label }) => (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Gradient background instead of image */}
      <View style={styles.backgroundContainer}>
        <LinearGradient
          colors={gradientColors}
          style={styles.gradient}
        />
      </View>

      {/* Header with menu button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={toggleMenu}>
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.notificationBtn}>
          <Icon name="notifications" size={24} color="#fff" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      {/* Contenu principal animé */}
      <Animated.View 
        style={[
          styles.profileContent,
          { 
            opacity: profileOpacity,
            transform: [{ translateY: profileTranslateY }]
          }
        ]}
      >
        <View style={styles.profileCard}>
          {/* Image de profil */}
          <View style={styles.profileImageContainer}>
            <Image
              source={getLocalImage(imageUrl)}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.editBtn}>
              <Icon name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* User info */}
          <Text style={styles.usernameText}>{username || 'User'}</Text>
         
          {/* Action buttons */}
          <View style={styles.actionBtnsRow}>
            <TouchableOpacity style={styles.primaryBtn}>
              <Text style={styles.primaryBtnText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryBtn}>
              <Icon name="share-social" size={20} color="#5F6EF0" />
            </TouchableOpacity>
          </View>
        </View>

       

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>My interests</Text>
          </View>
          <View style={styles.interestsContainer}>

  {interests && interests.length > 0 ? (
    interests.map((item, index) => (
      <Text key={index} style={styles.interestItem}>• {item}</Text>
    ))
  ) : (
    <Text style={styles.noInterests}>No interests found.</Text>
  )}
</View>
        </View>
      </Animated.View>

      {/* Fond semi-transparent quand menu ouvert */}
      {isMenuVisible && (
        <Pressable 
          style={styles.menuBackdrop} 
          onPress={toggleMenu}
        />
      )}

      {/* Menu latéral */}
      <Animated.View 
        style={[
          styles.sideMenu, 
          { 
            transform: [
              { translateX: slideAnim },
              { scale: menuScaleAnim }
            ],
            opacity: menuOpacityAnim
          }
        ]}
      >
        <View style={styles.menuHeader}>
          <Image 
            source={getLocalImage(imageUrl)}
            style={styles.menuProfileImage}
          />
          <View>
            <Text style={styles.menuUsername}>{username || 'User'}</Text>
          </View>
        </View>

        <ScrollView style={styles.menuItems}>
          <MenuItem icon="home" label="Home" onPress={() => navigation.navigate('Home', {userId})} />
          <MenuItem icon="person" label="My Profile" onPress={() => {toggleMenu()}} />
          <MenuItem icon="settings" label="Settings" onPress={() => navigation.navigate('settings')} />
          <MenuItem icon="notifications" label="Notifications" onPress={() => alert('Notifications')} />
          <MenuItem icon="chatbubble-ellipses" label="Messages" onPress={() => alert('Messages')} />
          <MenuItem icon="heart" label="Favorites" onPress={() => alert('Favorites')} />
          <MenuItem icon="bookmark" label="Saved" onPress={() => alert('Saved')} />
          <MenuItem icon="help-circle" label="Help" onPress={() => alert('Help')} />
          <MenuItem icon="chatbox" label="Feedback" onPress={() => navigation.navigate('feedback')} />
        </ScrollView>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Login')}>
          <Icon name="log-out" size={20} color="#FF5A5A" />
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundContainer: {
    height: height * 0.28,
    width: width,
    position: 'absolute',
    top: 0,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
    height: 90,
    marginTop: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  notificationBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  notificationBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF5A5A',
    position: 'absolute',
    top: 10,
    right: 12,
  },
  profileContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: height * 0.15,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginTop: -60,
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#fff',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5F6EF0',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  usernameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#eee',
  },
  actionBtnsRow: {
    flexDirection: 'row',
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: '#5F6EF0',
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  secondaryBtn: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#555',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  interestsContainer: {
    flexDirection: 'column',
    gap: 8, // React Native 0.71+ only; if earlier version, use marginBottom in child
  },
  interestItem: {
    fontSize: 16,
    color: '#555',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  noInterests: {
    fontStyle: 'italic',
    color: '#999',
  },
  menuBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 10,
  },
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    paddingVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 20,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  menuUsername: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuEmail: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  menuItems: {
    flex: 1,
    paddingTop: 10,
  },
  menuListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  menuIcon: {
    marginRight: 15,
  },
  menuItemText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0',
  },
  logoutText: {
    fontSize: 16,
    color: '#FF5A5A',
    marginLeft: 15,
    fontWeight: '500',
  },
});

export default ProfilePage;
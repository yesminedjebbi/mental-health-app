import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import BottomNavbar from './BottomNavbar';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const quotes = [
  "It is better to conquer yourself than to win a thousand battles.",
  "Every day may not be good, but there is something good in every day.",
  "Your mental health is a priority, not a luxury.",
  "Peace begins with a smile.",
  "Self-care is how you take your power back."
];

const getColorForEmotion = emotion => {
  switch (emotion) {
    case 'Happiness':    return ['#68E3A6', '#4DD790'];  // green gradient
    case 'Depression':   return ['#A68EEC', '#8A6CE7'];  // purple gradient
    case 'Anxiety':      return ['#FFAD8F', '#FF906D'];  // orange gradient
    case 'Loneliness':   return ['#75CCFF', '#5BABFC'];  // blue gradient
    case 'Anger':        return ['#FF9393', '#FF7676'];  // red gradient
    default:             return ['#E5E7EB', '#D1D5DB'];  // light gray gradient
  }
};

const getIconForEmotion = emotion => {
  switch (emotion) {
    case 'Happiness':    return "smile-beam";
    case 'Depression':   return "cloud-rain";
    case 'Anxiety':      return "bolt";
    case 'Loneliness':   return "user-alt-slash";
    case 'Anger':        return "fire";
    default:             return "question-circle";
  }
};

const HomePage = ({ route, navigation }) => {
  const { userId } = route.params;
  const [userName, setUserName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [interests, setInterests] = useState([]);
  const [mentalState, setMentalState] = useState({
    Happiness: 0, Depression: 0, Anxiety: 0, Loneliness: 0, Anger: 0
  });
  const [historyData, setHistoryData] = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('Happiness');
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [timeOfDay, setTimeOfDay] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuAnimation = useRef(new Animated.Value(-300)).current;

  // Set greeting based on time of day
  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setTimeOfDay('morning');
    else if (hours < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  // Récupération des infos utilisateur
  useEffect(() => {
    fetch(`http://192.168.1.6:5000/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.name || 'User');
        setImageUrl(data.profilePicture || '');
        setInterests(data.interests);
        if (data.mentalHealth) {
          setMentalState(data.mentalHealth);
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Error', "Could not retrieve user data.");
      });
  }, [userId]);

  // Récupération de l'historique
  useEffect(() => {
    fetch(`http://192.168.1.6:5000/api/users/${userId}/history`)
      .then(res => res.json())
      .then(data => {
        setHistoryData(data.historiqueEtatMental || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingHistory(false));
  }, [userId]);

  // Find dominant emotion
  const dominantEmotion = Object.entries(mentalState).reduce(
    (max, [emotion, value]) => value > max.value ? {emotion, value} : max, 
    {emotion: 'Happiness', value: 0}
  ).emotion;

  // Toggle menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    Animated.timing(menuAnimation, {
      toValue: menuOpen ? -300 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Logout function
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            // Add actual logout logic here - clear tokens, etc.
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }], // Replace with your login screen name
            });
          }
        }
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      
      {/* Background gradient */}
      <LinearGradient
        colors={['#6C63FF', '#4A148C']}
        style={styles.headerGradient}
      />

      {/* Side Menu */}
      <Animated.View 
        style={[
          styles.sideMenu,
          { transform: [{ translateX: menuAnimation }] }
        ]}
      >
        <LinearGradient
          colors={['#6C63FF', '#4A148C']}
          style={styles.menuHeader}
        >
          <View style={styles.menuProfileSection}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.menuProfileImage} />
            ) : (
              <View style={styles.menuProfileImagePlaceholder}>
                <Ionicons name="person" size={40} color="#fff" />
              </View>
            )}
            <Text style={styles.menuUserName}>{userName}</Text>
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.menuItems}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigation.navigate("Home", { userId });
            }}
          >
            <Ionicons name="home-outline" size={24} color="#4A148C" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigation.navigate("Profile", { userId, username: userName, imageUrl, interests });
            }}
          >
            <Ionicons name="person-outline" size={24} color="#4A148C" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Profile</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              navigation.navigate("Journal", { userId });
            }}
          >
            <Ionicons name="book-outline" size={24} color="#4A148C" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Journal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              // Add logic to navigate to Analytics if you have one
              Alert.alert("Coming Soon", "Analytics feature is coming soon!");
            }}
          >
            <Ionicons name="bar-chart-outline" size={24} color="#4A148C" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => {
              toggleMenu();
              // Add logic to navigate to Settings if you have one
              Alert.alert("Coming Soon", "Settings feature is coming soon!");
            }}
          >
            <Ionicons name="settings-outline" size={24} color="#4A148C" style={styles.menuItemIcon} />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity 
            style={[styles.menuItem, styles.logoutItem]}
            onPress={() => {
              toggleMenu();
              handleLogout();
            }}
          >
            <MaterialIcons name="logout" size={24} color="#FF5252" style={styles.menuItemIcon} />
            <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
      
      {/* Overlay when menu is open */}
      {menuOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1}
          onPress={toggleMenu}
        />
      )}

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
          <Ionicons name="menu" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>ZenLy</Text>
        </View>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate("Profile", { userId, username: userName, imageUrl, interests })}
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={28} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <ScrollView 
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContent}>
          <Text style={styles.greeting}>Good {timeOfDay}, {userName}!</Text>
        </View>

        {/* Current mental state */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Current Mental State</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {Object.entries(mentalState).map(([emotion, value]) => (
              <LinearGradient
                key={emotion}
                colors={getColorForEmotion(emotion)}
                style={styles.card}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.cardIcon}>
                  <FontAwesome5 name={getIconForEmotion(emotion)} size={20} color="#fff" />
                </View>
                <Text style={styles.emotion}>{emotion}</Text>
                <Text style={styles.value}>{value.toFixed(1)}%</Text>
              </LinearGradient>
            ))}
          </ScrollView>
        </View>

        {/* Daily quote */}
        <View style={styles.quoteContainer}>
          <LinearGradient
            colors={['#FFFFFF', '#F7F9FF']}
            style={styles.quoteBox}
          >
            <View style={styles.quoteIconContainer}>
              <Ionicons name="chatbubble-ellipses" size={22} color="#6C63FF" />
            </View>
            <Text style={styles.quoteTitle}>Daily Inspiration</Text>
            <Text style={styles.quoteText}>{quote}</Text>
          </LinearGradient>
        </View>

        {/* Journal button */}
        <TouchableOpacity
          style={styles.journalButton}
          onPress={() => navigation.navigate("Journal", { userId })}
        >
          <LinearGradient
            colors={['#6C63FF', '#5C8EFF']}
            style={styles.journalButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="book-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.journalButtonText}>Open Journal</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Mental state history */}
        {loadingHistory ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6C63FF" />
            <Text style={styles.loadingText}>Loading your data...</Text>
          </View>
        ) : historyData.length > 0 && (
          <View style={styles.historySection}>
            <Text style={styles.sectionTitle}>Emotional History</Text>
            <Text style={styles.historySubtitle}>Track your {selectedEmotion.toLowerCase()} over time</Text>
            
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.emotionButtonsRow}
            >
              {['Happiness','Depression','Anxiety','Loneliness','Anger'].map(em => (
                <TouchableOpacity
                  key={em}
                  style={[
                    styles.emotionButton,
                    selectedEmotion === em && { backgroundColor: getColorForEmotion(em)[0] }
                  ]}
                  onPress={() => setSelectedEmotion(em)}
                >
                  <FontAwesome5 
                    name={getIconForEmotion(em)} 
                    size={14} 
                    color={selectedEmotion === em ? '#fff' : '#6C63FF'} 
                    style={styles.emotionButtonIcon}
                  />
                  <Text 
                    style={[
                      styles.emotionButtonText,
                      selectedEmotion === em && styles.emotionButtonTextActive
                    ]}
                  >
                    {em}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: historyData.slice(-4).map(q => {
                    const date = new Date(q.date);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }),
                  datasets: [{ 
                    data: historyData.map(q => q.etat[selectedEmotion] || 0),
                    color: (opacity = 1) => getColorForEmotion(selectedEmotion)[0], 
                    strokeWidth: 3 
                  }],
                }}
                width={width - 40}
                height={220}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 1,
                  color: (opacity = 1) => `rgba(108, 99, 255, ${opacity})`,
                  labelColor: () => '#7B7B7B',
                  propsForDots: { 
                    r: "6", 
                    strokeWidth: "2", 
                    stroke: getColorForEmotion(selectedEmotion)[1] 
                  },
                  propsForBackgroundLines: {
                    strokeDasharray: '', 
                    stroke: "#E9ECF2",
                    strokeWidth: 1
                  },
                }}
                style={styles.chart}
                bezier
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLines={false}
                withHorizontalLines={true}
              />
            </View>
          </View>
        )}
        
       

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNavbar navigation={navigation} userId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFBFF',
  },
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 250,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  sideMenu: {
    position: 'absolute',
    width: 300,
    height: '100%',
    backgroundColor: '#fff',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 20,
  },
  menuHeader: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  menuProfileSection: {
    alignItems: 'center',
  },
  menuProfileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  menuProfileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  menuUserName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  menuItems: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuItemIcon: {
    marginRight: 20,
  },
  menuItemText: {
    fontSize: 16,
    color: '#2E3A59',
    fontWeight: '500',
  },
  logoutItem: {
    marginTop: 10,
  },
  logoutText: {
    color: '#FF5252',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E9ECF2',
    marginVertical: 10,
    marginHorizontal: 20,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 998,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    zIndex: 10,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 1,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    marginTop: 10,
    marginBottom: 20,
    zIndex: 10,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    marginBottom: 20,
  },
  headerCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerCardText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  checkInButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  checkInButtonText: {
    color: '#6C63FF',
    fontWeight: '600',
  },
  sectionContainer: {
    marginBottom: 25,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E3A59',
    marginBottom: 15,
  },
  cardsContainer: {
    paddingVertical: 5,
  },
  card: {
    width: 150,
    borderRadius: 20,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  emotion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  quoteContainer: {
    marginBottom: 25,
  },
  quoteBox: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#EDF1F7',
  },
  quoteIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quoteTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E3A59',
    marginBottom: 10,
  },
  quoteText: {
    fontSize: 15,
    fontStyle: 'italic',
    color: '#4E4B66',
    lineHeight: 22,
  },
  journalButton: {
    marginBottom: 25,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  journalButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
  },
  journalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 10,
    color: '#6C63FF',
    fontSize: 14,
  },
  historySection: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
  },
  historySubtitle: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 15,
  },
  emotionButtonsRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 10,
  },
  emotionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F3FF',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E9ECF2',
  },
  emotionButtonIcon: {
    marginRight: 6,
  },
  emotionButtonText: {
    color: '#6C63FF',
    fontWeight: '600',
    fontSize: 13,
  },
  emotionButtonTextActive: {
    color: '#fff',
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },
  suggestionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 3,
  },
  suggestionsSubtitle: {
    fontSize: 14,
    color: '#8F9BB3',
    marginBottom: 15,
  },
  suggestionsCardsContainer: {
    paddingVertical: 5,
  },
  suggestionCard: {
    width: 140,
    borderRadius: 20,
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  suggestionCardGradient: {
    padding: 16,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suggestionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  suggestionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
});

export default HomePage;
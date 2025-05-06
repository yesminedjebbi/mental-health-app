import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import BottomNavbar from './BottomNavbar';

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
    case 'Happiness':    return '#C8E6C9';
    case 'Depression':   return '#E1BEE7';
    case 'Anxiety':      return '#FFCCBC';
    case 'Loneliness':   return '#BBDEFB';
    case 'Anger':        return '#FFCDD2';
    default:             return '#ECEFF1';
  }
};

const HomePage = ({ route, navigation }) => {
  const { userId } = route.params;
  const [userName, setUserName]     = useState('');
  const [imageUrl, setImageUrl]     = useState('');
  const [mentalState, setMentalState] = useState({
    Happiness: 0, Depression: 0, Anxiety: 0, Loneliness: 0, Anger: 0
  });
  const [historyData, setHistoryData]       = useState([]);
  const [selectedEmotion, setSelectedEmotion] = useState('Happiness');
  const [quote]       = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Récupération des infos utilisateur
  useEffect(() => {
    fetch(`http://192.168.1.6:5000/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUserName(data.name || 'User');
        setImageUrl(data.profilePicture || '');
        if (data.mentalHealth) {
          setMentalState(data.mentalHealth);
        }
      })
      .catch(err => {
        console.error(err);
        Alert.alert('Erreur', "Impossible de récupérer les données utilisateur.");
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

  return (
    <View style={styles.screen}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Ionicons name="menu" size={26} color="#4A4A4A" />
        <Text style={styles.title}>ZenLy</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile", { userId, username: userName, imageUrl })}
        >
          <Ionicons name="person-circle-outline" size={28} color="#4A4A4A" />
        </TouchableOpacity>
      </View>

      {/* Contenu principal */}
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hey, {userName}!</Text>
        <Text style={styles.subtitle}>Your Current Mental State:</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsContainer}
        >
          {Object.entries(mentalState).map(([emotion, value]) => (
            <View
              key={emotion}
              style={[styles.card, { backgroundColor: getColorForEmotion(emotion) }]}
            >
              <Text style={styles.emotion}>{emotion}</Text>
              <Text style={styles.value}>{value.toFixed(1)}%</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.quoteBox}>
          <Text style={styles.quoteText}>{quote}</Text>
        </View>

        <TouchableOpacity
          style={styles.journalButton}
          onPress={() => navigation.navigate("Journal", { userId })}
        >
          <Ionicons name="book-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.journalButtonText}>Go to Journal</Text>
        </TouchableOpacity>

        {loadingHistory ? (
          <ActivityIndicator size="large" color="#4A148C" style={{ marginTop: 30 }} />
        ) : historyData.length > 0 && (
          <View>
            <Text style={styles.historyTitle}>{selectedEmotion} History</Text>
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
                    selectedEmotion === em && styles.emotionButtonActive
                  ]}
                  onPress={() => setSelectedEmotion(em)}
                >
                  <Text style={styles.emotionButtonText}>{em}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <LineChart
              data={{
                labels: historyData.slice(-4).map(q => new Date(q.date).toLocaleDateString()),
                datasets: [{ data: historyData.map(q => q.etat[selectedEmotion] || 0) }],
              }}
              width={width - 40}
              height={260}
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(76,175,80,${opacity})`,
                labelColor: () => '#333',
                propsForDots: { r: "5", strokeWidth: "2", stroke: "#5C8EFF" },
              }}
              style={styles.chart}
              bezier
            />
          </View>
        )}
      </ScrollView>


      <BottomNavbar navigation={navigation} userId={userId} />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff'
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
    backgroundColor: '#fafafa',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 100  // espace pour la barre
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A4A4A'
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#4A148C'
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333'
  },
  cardsContainer: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  card: {
    width: 160,
    borderRadius: 20,
    padding: 20,
    marginRight: 10,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6
  },
  emotion: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6
  },
  value: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111'
  },
  quoteBox: {
    backgroundColor: '#EFF1F3',
    padding: 16,
    marginTop: 30,
    borderRadius: 14
  },
  quoteText: {
    fontStyle: 'italic',
    color: '#444',
    textAlign: 'center',
    fontSize: 16
  },
  journalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C8EFF',
    paddingVertical: 14,
    borderRadius: 18,
    marginTop: 30,
    elevation: 4
  },
  journalButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A148C',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center'
  },
  emotionButtonsRow: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  emotionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ccc',
    marginHorizontal: 5
  },
  emotionButtonActive: {
    backgroundColor: '#5C8EFF'
  },
  emotionButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  chart: {
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 5
  }
});

export default HomePage;

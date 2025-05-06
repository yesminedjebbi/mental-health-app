import React, { useEffect, useState } from 'react';
import { View,Text,FlatList,TouchableOpacity,StyleSheet,StatusBar} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const API_URL = 'http://192.168.1.6:5000/api/journal';

const JournalScreen = ({ route, navigation }) => {
  const [entries, setEntries] = useState([]);
  const { userId } = route.params; 

  const loadHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/${userId}`);
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error("Erreur lors du chargement", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);


  //  Fonction pour rendre chaque élément de la liste
  const renderItem = ({ item }) => {
    const date = new Date(item.date);
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = date.getDate();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('JournalEntry', { userId, existingEntry: item })
        }
      >
        <Text style={styles.date}>{`${month} ${day}`}</Text>
        <Text style={styles.content}>{item.content}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.navigate('Home', { userId })}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.titleCenter}>Your journal</Text>
        <Ionicons name="calendar-outline" size={28} color="#333" />
    </View>
      {/* Liste des entrées */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item._id || `${item.userId}-${item.date}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 80 }}
       
      />

      
      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate('JournalEntry', { userId })
        }
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default JournalScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#7C9DFF',
  },
  card: {
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  content: {
    color: '#333',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#5C8EFF',
    borderRadius: 30,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  titleCenter: {
    fontSize: 22,
    fontWeight: '600',
    color: '#7C9DFF',
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
});

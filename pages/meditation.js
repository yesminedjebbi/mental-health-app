import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MeditationScreen = () => {
  const [meditations, setMeditations] = useState([]);
  const [loading, setLoading] = useState(true);

  const YOUTUBE_API_KEY = "AIzaSyBexDWr3_D_yUi873geYQEHoi6Oxv1-isU"; // 🔁 Replace with your real key

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=guided+meditation&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`
        );
        const json = await response.json();
        setMeditations(json.items);
      } catch (error) {
        console.error("Error fetching meditations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeditations();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{item.snippet.title}</Text>
        <YoutubePlayer height={200} play={false} videoId={item.id.videoId} />
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.header}> Guided Meditations</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : (
          <FlatList
            data={meditations}
            keyExtractor={(item) => item.id.videoId}
            renderItem={renderItem}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
    padding: 16,
    paddingTop: 60,
  },
  header: {
    fontSize: 33,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#4A90E2",
    marginTop:20,
    marginBottom:40,
  },
  card: {
    backgroundColor: "#E3F2FD",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#1E3A8A",
  },
});

export default MeditationScreen;

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";

const LISTEN_NOTES_API_KEY = "c149e767c2d34205bf261c756c9d1929"; // Replace with env variable in real apps

const PodcastScreen = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const soundRef = useRef(null);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch(
          "https://listen-api.listennotes.com/api/v2/search?q=mental+health&type=episode&language=English&len_min=5&len_max=30",
          {
            headers: {
              "X-ListenAPI-Key": LISTEN_NOTES_API_KEY,
            },
          }
        );
        const data = await response.json();
        setPodcasts(data.results);
      } catch (err) {
        console.error("Error fetching podcasts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  const playPodcast = async (item) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setPlayingId(null);
      }

      if (playingId !== item.id) {
        const { sound } = await Audio.Sound.createAsync({ uri: item.audio });
        soundRef.current = sound;
        await sound.playAsync();
        setPlayingId(item.id);
      }
    } catch (error) {
      console.error("Error playing podcast:", error);
    }
  };

  const renderItem = ({ item }) => {
    const isPlaying = playingId === item.id;
    const cleanDescription = item.description_original?.replace(/<[^>]+>/g, "") || "";

    return (
      <TouchableOpacity style={styles.card} onPress={() => playPodcast(item)}>
        <Image source={{ uri: item.image }} style={styles.thumbnail} />
        <View style={styles.content}>
          <Text style={styles.podcastTitle}>{item.title_original}</Text>
          <Text style={styles.description}>{cleanDescription.slice(0, 100)}...</Text>
          <Icon
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={28}
            color="#4A90E2"
            style={{ marginTop: 10 }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recommended Podcasts</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : (
        <FlatList
          data={podcasts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 85,
    color: "#4A90E2",
  },
  card: {
    backgroundColor: "#F5EBE0",
    padding: 15,
    borderRadius: 40,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 13,
    color: "#555",
    marginTop: 5,
  },
});

export default PodcastScreen;
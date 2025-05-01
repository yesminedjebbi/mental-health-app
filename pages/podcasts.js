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

const PodcastScreen = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const soundRef = useRef(null);

  useEffect(() => {
    fetch("http://192.168.1.13:5000/api/podcasts/recommendations")
      .then((res) => res.json())
      .then((data) => setPodcasts(data))
      .catch((err) => console.error("Error fetching podcasts", err))
      .finally(() => setLoading(false));
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

    // Strip HTML tags from description
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
            style={{ marginTop: 10 , color: "#4A90E2"}}
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
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderRadius:40,
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

import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const FREESOUND_API_KEY = "xsWjYHIeqMw90i4asJLPqnUeQRXrF6mIS1mG3UpX"; // Replace with your API key

const MusicPage = ({ navigation }) => {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const soundRef = useRef(null);

  useEffect(() => {
    fetchFreesoundTracks();
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const fetchFreesoundTracks = async () => {
    try {
      const response = await fetch(
        `https://freesound.org/apiv2/search/text/?query=ambient+relaxation&filter=duration:[30 TO 120]&fields=id,name,previews&token=${FREESOUND_API_KEY}`
      );
      const data = await response.json();
      setTracks(data.results);
    } catch (error) {
      console.error("Error fetching music:", error);
    } finally {
      setLoading(false);
    }
  };

  const playTrack = async (track) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        if (playingId === track.id) {
          setPlayingId(null);
          return;
        }
      }
      const { sound } = await Audio.Sound.createAsync({
        uri: track.previews["preview-hq-mp3"],
      });
      soundRef.current = sound;
      await sound.playAsync();
      setPlayingId(track.id);
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const handleGoBack = () => {
    // Stop any playing audio when navigating away
    if (soundRef.current) {
      soundRef.current.unloadAsync();
    }
    navigation.goBack();
  };

  const renderItem = ({ item }) => {
    const isPlaying = playingId === item.id;
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => playTrack(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={isPlaying ? ["#8e9eee", "#7f76f2"] : ["#f0f4ff", "#e6eeff"]}
          style={styles.cardGradient}
        >
          <View style={styles.cardContent}>
            <View style={styles.iconContainer}>
              <Icon
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={46}
                color={isPlaying ? "#ffffff" : "#7f76f2"}
              />
            </View>
            <View style={styles.trackDetails}>
              <Text style={[styles.trackName, isPlaying && styles.playingText]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.trackInfo, isPlaying && styles.playingText]}>
                Ambient Relaxation
              </Text>
            </View>
            <View style={styles.waveformContainer}>
              {isPlaying && (
                <View style={styles.waveform}>
                  {[...Array(4)].map((_, i) => (
                    <View key={i} style={[styles.wave, { height: 12 + Math.random() * 16 }]} />
                  ))}
                </View>
              )}
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f8ff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Icon name="arrow-back" size={28} color="#555" />
        </TouchableOpacity>
        <Text style={styles.title}>Peaceful Sounds</Text>
      </View>
      
      <View style={styles.bannerContainer}>
        <LinearGradient
          colors={["#8e9eee", "#7f76f2"]}
          style={styles.banner}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerText}>Find your calm</Text>
            <Text style={styles.bannerSubtext}>Select a track to begin your relaxation journey</Text>
          </View>
          <View style={styles.bannerImageContainer}>
            <Icon name="musical-notes" size={50} color="rgba(255,255,255,0.85)" />
          </View>
        </LinearGradient>
      </View>
      
      <Text style={styles.sectionTitle}>Relaxation Tracks</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7f76f2" />
          <Text style={styles.loadingText}>Finding peaceful sounds...</Text>
        </View>
      ) : (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
    marginTop:20,
    marginBottom:20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 33,
    fontWeight: "700",
    color: "#4A90E2",
    marginRight:40,
  },
  bannerContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  banner: {
    height: 120,
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
  },
  bannerContent: {
    flex: 2,
    padding: 20,
    justifyContent: "center",
  },
  bannerText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  bannerSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    width: "85%",
  },
  bannerImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 20,
    marginBottom: 15,
    color: "#444",
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    marginBottom: 12,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  cardGradient: {
    borderRadius: 14,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
    width: 50,
    alignItems: "center",
  },
  trackDetails: {
    flex: 1,
    marginRight: 8,
  },
  trackName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  trackInfo: {
    fontSize: 13,
    color: "#666",
  },
  playingText: {
    color: "#fff",
  },
  waveformContainer: {
    width: 60,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  waveform: {
    flexDirection: "row",
    alignItems: "center",
    height: 30,
  },
  wave: {
    width: 3,
    backgroundColor: "rgba(255,255,255,0.8)",
    marginHorizontal: 2,
    borderRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
    fontSize: 16,
  },
});

export default MusicPage;
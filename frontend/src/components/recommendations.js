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
  ScrollView,
} from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/Ionicons";
import YoutubePlayer from "react-native-youtube-iframe";
import { LinearGradient } from "expo-linear-gradient";

// API Keys
const YOUTUBE_API_KEY = "AIzaSyBexDWr3_D_yUi873geYQEHoi6Oxv1-isU"; // Meditation
const FREESOUND_API_KEY = "xsWjYHIeqMw90i4asJLPqnUeQRXrF6mIS1mG3UpX"; // Music
const LISTEN_NOTES_API_KEY = "c149e767c2d34205bf261c756c9d1929"; // Podcast
function capitalizeEmotionKeys(input) {
  const output = {};

  for (const key in input) {
    if (key === "interests") {
      output[key] = input[key]; // garder tel quel
    } else {
      const capitalizedKey = key.charAt(0).toLowerCase() + key.slice(1);
      output[capitalizedKey] = input[key];
    }
  }

  return output;
}

const RecommendedActivitiesScreen = ({route}) => {
  const [meditations, setMeditations] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [aiOutput, setAiOutput] = useState(null);
  const soundRef = useRef(null);
  const { userId} = route.params;
  
  const fetchAndSendData = async () => {
      try {
        setLoading(true);
    //  const userId='68080ceffea02fb14be8fa6f';
        // 1. Fetch mental state
        const userResponse = await fetch(`http://192.168.1.6:5000/api/users/${userId}`);
       const user = await userResponse.json();
      
        const mentalState=await user.mentalHealth;
  
        // 2. Fetch interests
        const interestsData = await user.interests;
  
        // 3. Combine into the correct format
        const combinedInput = {
          ...capitalizeEmotionKeys(mentalState),
          interests: interestsData
        };
  
        console.log('Sending to AI model:', combinedInput);
  
        // 4. Send to the Flask AI model
        const aiRes = await fetch('http://192.168.1.6:5001/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(combinedInput),
        });
  
        const aiData = await aiRes.json();
        
  
        // 5. Save AI output
       setAiOutput(aiData);
       console.log(aiOutput);
      } catch (error) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

  // Set input query for personalized activities
  /* const queries = ["Meditation"]; */
  useEffect(() => {
    fetchAndSendData();  // just fetch AI output first
  }, []);

  useEffect(() => {
    if (!aiOutput) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const queries = aiOutput.predicted_queries;
        const fetchMeditations = async () => {
        
          try {
            const allResults = [];
        
            for (const query of queries) {
              const response = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query+"guided meditation")}&type=video&maxResults=5&key=${YOUTUBE_API_KEY}`
              );
              const json = await response.json();
              allResults.push(...json.items);
            }
        
            // ✅ Remove duplicates by videoId
            const uniqueVideos = Array.from(
              new Map(allResults.map((video) => [video.id.videoId, video])).values()
            );
        
            setMeditations(uniqueVideos);
          } catch (error) {
            console.error("Error fetching meditations:", error);
          } 
        };
        
        const fetchMusic = async () => {
          try {
            const allResults = [];
        
            for (const query of queries) {
              const response = await fetch(
                `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}&filter=duration:[30 TO 120]&fields=id,name,previews&token=${FREESOUND_API_KEY}`
              );
              const data = await response.json();
              allResults.push(...data.results);
            }
        
            setTracks(allResults);
          } catch (error) {
            console.error("Error fetching music:", error);
          }
        };

        const fetchPodcasts = async () => {
          try {
            const allResults = [];
      
            for (const query of queries) {
              const response = await fetch(
                `https://listen-api.listennotes.com/api/v2/search?q=${encodeURIComponent(query)}&type=episode&language=English&len_min=5&len_max=30`,
                {
                  headers: {
                    "X-ListenAPI-Key": LISTEN_NOTES_API_KEY,
                  },
                }
              );
              const data = await response.json();
              allResults.push(...data.results); // Merge all results
            }
      
            setPodcasts(allResults);
          } catch (err) {
            console.error("Error fetching podcasts", err);
          }
        };

        await Promise.all([fetchMeditations(), fetchMusic(), fetchPodcasts()]);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Clean up audio when component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

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
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: track.previews["preview-hq-mp3"] },
        { shouldPlay: true }
      );
      
      soundRef.current = sound;
      setPlayingId(track.id);
      
      // Set up finished playing handler
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
        }
      });
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  const playPodcast = async (item) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        if (playingId === item.id) {
          setPlayingId(null);
          return;
        }
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: item.audio },
        { shouldPlay: true }
      );
      
      soundRef.current = sound;
      setPlayingId(item.id);
      
      // Set up finished playing handler
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setPlayingId(null);
        }
      });
    } catch (error) {
      console.error("Error playing podcast:", error);
    }
  };

  const renderMeditationItem = ({ item }) => {
    return (
      <View style={styles.meditationCard}>
        <View style={styles.thumbnailContainer}>
          <Image 
            source={{ uri: item.snippet.thumbnails.high.url }} 
            style={styles.meditationThumbnail} 
          />
          <View style={styles.playButtonOverlay}>
            <Icon name="play-circle" size={50} color="#FFFFFF" />
          </View>
        </View>
        <View style={styles.meditationContent}>
          <Text style={styles.meditationTitle} numberOfLines={2}>
            {item.snippet.title}
          </Text>
          <Text style={styles.channelName}>
            {item.snippet.channelTitle}
          </Text>
        </View>
        <YoutubePlayer 
          height={0} 
          play={false} 
          videoId={item.id.videoId} 
          webViewStyle={{opacity: 0, height: 0, width: 0}}
        />
      </View>
    );
  };

  const renderMusicItem = ({ item }) => {
    const isPlaying = playingId === item.id;
    
    return (
      <TouchableOpacity onPress={() => playTrack(item)}>
        <LinearGradient
          colors={isPlaying ? ["#4A90E2", "#5A9FF2"] : ["#F8F9FA", "#E9ECEF"]}
          style={styles.musicCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.musicIconContainer}>
            <Icon
              name={isPlaying ? "pause-circle" : "play-circle"}
              size={46}
              color={isPlaying ? "#FFFFFF" : "#4A90E2"}
            />
          </View>
          
          <View style={styles.musicInfo}>
            <Text 
              style={[styles.musicTitle, isPlaying && styles.playingText]} 
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text style={[styles.musicSubtitle, isPlaying && styles.playingSubtext]}>
              Ambient Relaxation
            </Text>
            <View style={styles.musicControls}>
              <View style={[styles.progressBar, { backgroundColor: isPlaying ? '#BBDEFB' : '#DDD' }]}>
                <View style={[styles.progress, { width: '45%', backgroundColor: isPlaying ? '#FFFFFF' : '#4A90E2' }]} />
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderPodcastItem = ({ item }) => {
    const isPlaying = playingId === item.id;
    const cleanDescription = item.description_original?.replace(/<[^>]+>/g, "") || "";

    return (
      <TouchableOpacity 
        style={styles.podcastCard} 
        onPress={() => playPodcast(item)}
        activeOpacity={0.7}
      >
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/120' }} 
          style={styles.podcastImage} 
        />
        
        <View style={styles.podcastContent}>
          <Text style={styles.podcastTitle} numberOfLines={2}>
            {item.title_original}
          </Text>
          <Text style={styles.podcastPublisher} numberOfLines={1}>
            {item.podcast_title_original}
          </Text>
          <Text style={styles.podcastDescription} numberOfLines={2}>
            {cleanDescription}
          </Text>
          
          <View style={styles.podcastFooter}>
            <View style={styles.podcastDuration}>
              <Icon name="time-outline" size={14} color="#888" />
              <Text style={styles.podcastDurationText}>
                {Math.round(item.audio_length_sec / 60)} min
              </Text>
            </View>
            
            <View style={styles.podcastPlayButton}>
              <Icon
                name={isPlaying ? "pause-circle" : "play-circle"}
                size={24}
                color={isPlaying ? "#4A90E2" : "#666"}
              />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#F8FBFF" />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Loading personalized recommendations...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FBFF" />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recommended Activities</Text>
          <Text style={styles.headerSubtitle}>Find your wellness moment</Text>
        </View>
        
        {/* Meditations Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="body-outline" size={22} color="#4A90E2" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Guided Meditations</Text>
          </View>
          <FlatList
            data={meditations.slice(0, 3)}
            keyExtractor={(item) => item.id.videoId}
            renderItem={renderMeditationItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalListContent}
          />
        </View>
        
        
        {/* Podcasts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="mic-outline" size={22} color="#4A90E2" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Podcasts</Text>
          </View>
          <FlatList
            data={podcasts.slice(0, 5)}
            keyExtractor={(item) => item.id}
            renderItem={renderPodcastItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.verticalListContent}
          />
        </View>

                {/* Music Section */}
                <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="musical-notes-outline" size={22} color="#4A90E2" style={styles.sectionIcon} />
            <Text style={styles.sectionTitle}>Relaxation Music</Text>
          </View>
          <FlatList
            data={tracks.slice(0, 5)}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMusicItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={styles.verticalListContent}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FBFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A90E2",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#888",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A2151",
  },
  horizontalListContent: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  verticalListContent: {
    paddingHorizontal: 20,
  },
  
  // Meditation styles
  meditationCard: {
    width: 280,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  thumbnailContainer: {
    position: "relative",
    height: 160,
    width: "100%",        
  },
  meditationThumbnail: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  playButtonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  meditationContent: {
    padding: 12,
  },
  meditationTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A2151",
    marginBottom: 4,
  },
  channelName: {
    fontSize: 13,
    color: "#888",
  },

  // Music styles
  musicCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  musicIconContainer: {
    marginRight: 16,
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
  },
  musicInfo: {
    flex: 1,
  },
  musicTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A2151",
    marginBottom: 4,
  },
  musicSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  playingText: {
    color: "#FFFFFF",
  },
  playingSubtext: {
    color: "#E1F5FE",
  },
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
  },
  progress: {
    height: 4,
    backgroundColor: "#4A90E2",
    borderRadius: 2,
  },

  // Podcast styles
  podcastCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  podcastImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  podcastContent: {
    flex: 1,
    marginLeft: 12,
  },
  podcastTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A2151",
    marginBottom: 2,
  },
  podcastPublisher: {
    fontSize: 13,
    color: "#4A90E2",
    marginBottom: 4,
    fontWeight: "500",
  },
  podcastDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
  },
  podcastFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
  },
  podcastDuration: {
    flexDirection: "row",
    alignItems: "center",
  },
  podcastDurationText: {
    fontSize: 12,
    color: "#888",
    marginLeft: 4,
  },
  podcastPlayButton: {
    height: 28,
    width: 28,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecommendedActivitiesScreen;
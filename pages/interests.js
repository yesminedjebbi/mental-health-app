import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { LinearGradient } from "react-native-linear-gradient";

const interestsList = [
  "Series",
  "Movies",
  "Books",
  "Podcast",
  "Songs",
  "Articles",
  "Drawing",
  "Dance",
  "Sport",
  "Theater",
  "Quotes",
  "Cooking",
];

const InterestSelectionScreen = ({ navigation }) => {
  const [selectedInterests, setSelectedInterests] = useState([]);

  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    );
  };
  const saveInterests = async () => {
    try {
      const response = await fetch("http://192.168.1.13:5000/api/interests/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "12345", interests: selectedInterests }),
      });
      const data = await response.json();
      console.log("Response:", data);
    } catch (error) {
      console.error("Error saving interests:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Background Circles */}
      <View style={styles.circle} />

      {/* Title */}
      <Text style={styles.title}>
        Choose your <Text style={styles.highlight}>interests</Text>
      </Text>
      <Text style={styles.subtitle}>
        Choose which you have more interest to give you best app experience
      </Text>

      {/* Interest Buttons */}
      <FlatList
        data={interestsList}
        keyExtractor={(item) => item}
        numColumns={3}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.interestButton,
              selectedInterests.includes(item) && styles.selectedInterest,
            ]}
            onPress={() => toggleInterest(item)}
          >
            <Text
              style={[
                styles.interestText,
                selectedInterests.includes(item) && styles.selectedText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Next Button */}
      
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => /* navigation.navigate("NextScreen") */ saveInterests()}
      >
        <Text style={styles.nextText}>Next →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 150,
    height: 150,
    backgroundColor: "#E3F2FD",
    borderRadius: 70.5,
  },
  title: {
    marginTop:100,
    fontSize: 35,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
  },
  highlight: {
    color: "#4A90E2",
  },
  subtitle: {
    marginBottom:70,
    fontSize: 14,
    textAlign: "center",
    color: "#777",
    marginVertical: 10,
  },
  listContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },
  interestButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#4A90E2",
    marginHorizontal: 5,
  },
  selectedInterest: {
    backgroundColor: "#FF4081",
    borderColor: "#FF4081",
  },
  interestText: {
    fontSize: 14,
    color: "#4A90E2",
  },
  selectedText: {
    color: "#fff",
  },
  nextButton: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
  nextText: {
    fontSize: 16,
    color: "#4A90E2",
    fontWeight: "bold",
  },
});

export default InterestSelectionScreen; 

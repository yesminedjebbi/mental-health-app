import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const FirstScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate("Signup"); // redirige vers la page principale après 2.5s
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Background Shapes */}
      <View style={styles.topShape} />
      <View style={styles.bottomShape} />

      {/* Logo & Text */}
      <View style={styles.content}>
        <Image
          source={require("../../assets/logo.png")} // ton image de cerveau
          style={styles.logo}
        />
        <Text style={styles.title}>
          <Text style={{ color: "#1A76D2" }}>Zen</Text>
          <Text style={{ color: "#000" }}>ly</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    
  },
  topShape: {
    position: "absolute",
    top: -height * 0.2,
    left: -width * 0.3,
    width: width * 1.2,
    height: height * 0.4,
    backgroundColor: "#E6F3FB",
    borderBottomRightRadius: width,
  },
  bottomShape: {
    position: "absolute",
    bottom: -height * 0.2,
    right: -width * 0.3,
    width: width * 1.2,
    height: height * 0.4,
    backgroundColor: "#E6F3FB",
    borderTopLeftRadius: width,
  },
  content: {
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginTop:-50,
  },
  title: {
    marginTop: -70,
    fontSize: 39,
    letterSpacing: 2,
    fontWeight: "500",
  },
});

export default FirstScreen;

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  FlatList,
} from "react-native";

const techniques = [
  {
    id: "box",
    name: "Box Breathing",
    pattern: ["Inhale", "Hold", "Exhale", "Hold"],
    durations: [4000, 4000, 4000, 4000],
  },
  {
    id: "478",
    name: "4-7-8 Breathing",
    pattern: ["Inhale", "Hold", "Exhale"],
    durations: [4000, 7000, 8000],
  },
  {
    id: "relax",
    name: "Relaxing Breath",
    pattern: ["Inhale", "Exhale"],
    durations: [4000, 6000],
  },
];

const BreathingScreen = () => {
  const [selectedTechnique, setSelectedTechnique] = useState(techniques[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [phase, setPhase] = useState(selectedTechnique.pattern[0]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    let isMounted = true;

    const cyclePhase = () => {
      const duration = selectedTechnique.durations[phaseIndex];
      const nextPhaseIndex = (phaseIndex + 1) % selectedTechnique.pattern.length;
      const nextPhase = selectedTechnique.pattern[phaseIndex];

      if (!isMounted) return;

      setPhase(nextPhase);

      const toValue = nextPhase === "Inhale" ? 1.5 : nextPhase === "Exhale" ? 1 : scaleAnim._value;

      Animated.timing(scaleAnim, {
        toValue,
        duration,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start(() => {
        if (isMounted) {
          setPhaseIndex(nextPhaseIndex);
        }
      });
    };

    cyclePhase();

    return () => {
      isMounted = false;
    };
  }, [phaseIndex, selectedTechnique]);

  const onSelectTechnique = (technique) => {
    setSelectedTechnique(technique);
    setPhaseIndex(0);
    setPhase(technique.pattern[0]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathing Exercises</Text>

      <View style={styles.techniqueContainer}>
        {techniques.map((technique) => (
          <TouchableOpacity
            key={technique.id}
            style={[
              styles.techniqueButton,
              technique.id === selectedTechnique.id && styles.techniqueButtonSelected,
            ]}
            onPress={() => onSelectTechnique(technique)}
          >
            <Text
              style={[
                styles.techniqueButtonText,
                technique.id === selectedTechnique.id && styles.techniqueButtonTextSelected,
              ]}
            >
              {technique.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.animationContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        />
        <Text style={styles.phaseText}>{phase}</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>End Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F2FD",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#4A90E2",
    marginTop: 20,
    marginBottom:50,
  },
  techniqueContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: 60,
    width: '100%',
  },
  techniqueButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#BBDEFB",
    marginHorizontal: 4,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  techniqueButtonSelected: {
    backgroundColor: "#42A5F5",
  },
  techniqueButtonText: {
    color: "#0D47A1",
    fontWeight: "600",
    fontSize: 14,
  },
  techniqueButtonTextSelected: {
    color: "#fff",
  },
  animationContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    width: 300,
    marginBottom: 40,
  },
  circle: {
    backgroundColor: "#ECDFCC",
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.7,
  },
  phaseText: {
    position: "absolute",
    fontSize: 24,
    fontWeight: "600",
    color: "#0D47A1",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3,
    marginTop:40,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BreathingScreen;
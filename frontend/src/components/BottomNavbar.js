import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BottomNavbar = ({ navigation, userId, activeRoute }) => (
  <View style={styles.container}>
    <NavCircle
      icon="bulb-outline"
      onPress={() => navigation.navigate('recomm', { userId })}
      active={activeRoute === 'recomm'}
    />
    <NavCircle
      icon="list-outline"
      onPress={() => navigation.navigate('Activities')}
      active={activeRoute === 'Activities'}
    />
    <NavCircle
      icon="chatbubble-ellipses-outline"
      onPress={() => navigation.navigate('chatbot')}
      active={activeRoute === 'chatbot'}
    />
    <NavCircle
      icon="help-circle-outline"
      onPress={() => navigation.navigate('Quiz', { userId })}
      active={activeRoute === 'Quiz'}
    />
  </View>
);

const NavCircle = ({ icon, onPress, active }) => (
  <TouchableOpacity
    style={[styles.circle, active && styles.circleActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Ionicons
      name={icon}
      size={24}
      color={active ? '#fff' : '#666'}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#e6e6e6',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -1 },
    shadowRadius: 3,
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleActive: {
    backgroundColor: '#007AFF',
    elevation: 4,
    shadowColor: '#007AFF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
});

export default BottomNavbar;

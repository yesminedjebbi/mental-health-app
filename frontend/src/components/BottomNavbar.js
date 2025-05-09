import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BottomNavbar = ({ navigation, userId }) => {
  // Navigation items configuration
  const navItems = [
    {
      name: 'recomm',
      label: 'Recomm',
      icon: 'bulb-outline',
    },
    {
      name: 'Activities',
      label: 'Activities',
      icon: 'list-outline',
    },
    {
      name: 'Home',
      label: '',
      icon: 'home-outline',
      primary: true,
    },
    {
      name: 'chatbot',
      label: 'Chat',
      icon: 'chatbubble-ellipses-outline',
    },
    {
      name: 'Quiz',
      label: 'Quiz',
      icon: 'help-circle-outline',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Curved background for the nav bar */}
      <View style={styles.background}>
        <View style={styles.backgroundCurve} />
      </View>

      {/* Navigation Items */}
      <View style={styles.navItemsContainer}>
        {navItems.map(item => (
          <NavItem
            key={item.name}
            item={item}
            onPress={() => navigation.navigate(item.name, { userId })}
          />
        ))}
      </View>
    </View>
  );
};

const NavItem = ({ item, onPress }) => {
  if (item.primary) {
    return (
      <TouchableOpacity
        style={styles.primaryItemContainer}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#6C63FF', '#4A148C']}
          style={styles.primaryButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons
            name={item.icon}
            size={26}
            color="#fff"
          />
        </LinearGradient>
        <Text style={styles.itemLabel}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.navItemContainer}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={item.icon}
          size={22}
          color="#A0A0A0"
        />
      </View>
      <Text style={styles.itemLabel}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 80,
    paddingHorizontal: 10,
  },
  background: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: '#8F9BB3',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  backgroundCurve: {
    position: 'absolute',
    top: -20,
    left: '50%',
    marginLeft: -35,
    width: 70,
    height: 35,
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
  },
  navItemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 8,
  },
  navItemContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    flex: 1,
  },
  // primaryItemContainer: {
  //   alignItems: 'center',
  //   justifyContent: 'flex-end',
  //   height: '100%',
  //   paddingBottom: 5,
  //   flex: 1,
  // },
  primaryButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: -9,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F7FA',
  },
  itemLabel: {
    fontSize: 11,
    marginTop: 4,
    color: '#A0A0A0',
    fontWeight: '500',
  },
});

export default BottomNavbar;
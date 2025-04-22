import React, { useState } from 'react';
import { Image, View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const SignIn = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.5:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
      Alert.alert('Response', JSON.stringify(data.user._id, null, 2));
      if (response.ok) {
        // Assuming your backend returns a token when successful
        navigation.navigate("Quiz", { userId: data.user._id }); 
      } else {
        Alert.alert('Error', data.message || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    }
  };
  
  
  const togglePasswordVisibility = () => {
    setSecureText(!secureText);
  };

  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/img.png')}
        style={styles.image}
      />

      <Text style={styles.heading}>Welcome back!</Text>
      
      {/* Modify the sentence with inline styling for "well-being" */}
      <Text style={styles.subheading}>
        Our journey to <Text style={styles.wellBeing}>well-being</Text> continues here
      </Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
       <View style={styles.passwordContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={secureText}
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        {/* Eye Icon for toggling password visibility */}
        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eyeIcon}>
          <Icon name={secureText ? 'eye-slash' : 'eye'} size={20} color="gray" />
        </TouchableOpacity>
      </View>
      {/* Sign In Button with the same width as the input fields */}
      <View style={styles.buttonContainer}>
        <Button title="Sign In" onPress={handleSignIn} />
      </View>
      <Text style={styles.signup} >New here? <Text style={styles.linkText} onPress={() => navigation.navigate("Signup")}>Register now</Text></Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6495ED',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 24,
    textAlign: 'center',
  },
  wellBeing: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 4,
    elevation: 1,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
  },
  buttonContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#3B82F6',
    marginTop: 8,
  },
  signup: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 20,
  },
  linkText: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
});


export default SignIn;
import React, { useState } from 'react';
import { Image, View, Text, TextInput, Button, StyleSheet, Alert,TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Assuming your backend returns a token when successful
        Alert.alert('Success', `Welcome, ${data.token ? 'you are logged in!' : ''}`);
        // You can now store the token for future API calls
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
        source={require('../assets/img.jpg')}
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
      <Text style={styles.signup} >New here? Register now</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20, // Adjusted space above the "Welcome back!" text
  },
  heading: {
    fontSize: 35,
    marginBottom: 10, // Reduced the space between "Welcome back!" and the next text
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#6495ed'
  },
  subheading: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20, 
    fontStyle: 'italic',
  },
  wellBeing: {
    color: 'lightblue',
    fontWeight: 'bold',
    fontSize: 15,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    padding: 15,
    marginBottom: 15,
    borderRadius: 5,
    width: 350, 
  },  
  buttonContainer: {
    width: 350, 
    borderRadius: 5,
    backgroundColor:'#6495ed',
  },
  forgotPassword: {
    fontSize: 12,
    color: 'lightblue',
    alignSelf: 'flex-end', 
    marginTop: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  signup:{
    fontSize: 15,
    color:'lightblue',
    marginTop: 10,
  },
  passwordContainer: {
    flexDirection: 'row', // Align the input and the eye icon horizontally
    alignItems: 'center', // Vertically align them
    width: 350,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
});

export default SignIn;






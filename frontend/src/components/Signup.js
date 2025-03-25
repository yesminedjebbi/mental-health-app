import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, View, Text } from 'react-native';
import Checkbox from "expo-checkbox"; 
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function Signup({ navigation }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isChecked, setIsChecked] = useState(false);
  const [secureText, setSecureText] = useState(true);

  const handleSignUp = () => {
    if (!form.name || !form.email || !form.password || !isChecked) {
      alert("Veuillez remplir tous les champs et accepter les conditions.");
      return;
    }
    alert("Compte créé avec succès !");
    navigation.navigate("Login"); // Rediriger vers la page Login
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('../../assets/signup_image.png')}
      />
      <Text style={styles.text}>Welcome <Text style={{ color: "#6495ED" }}>OnBoard!</Text></Text>
      <Text style={styles.label}>Username</Text>
      <TextInput 
        value={form.name}  
        onChangeText={name => setForm({ ...form, name })} 
        style={styles.input}  
        placeholder="Enter your username"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput 
        value={form.email} 
        onChangeText={email => setForm({ ...form, email })}
        style={styles.input}  
        placeholder="Enter your email"
        keyboardType="email-address"
      />
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          onChangeText={password => setForm({ ...form, password })}
          value={form.password}
          autoCorrect={false}
          clearButtonMode="while-editing"
          secureTextEntry={secureText}
          style={ { flex: 1 }}
          placeholder="Enter your password"
        />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon name={secureText ? "eye-off" : "eye"} size={20} color="#6495ED" />
        </TouchableOpacity>
      </View>
      <View style={styles.checkboxContainer}>
        <Checkbox 
          value={isChecked} 
          onValueChange={setIsChecked} 
          color={isChecked ? "#6495ED" : undefined} 
        />
        <Text style={styles.checkboxText}>I accept the terms & Condition</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Lien pour aller à la connexion */}
      <Text style={styles.footerText}>
        Own an Account? <Text style={styles.linkText} onPress={() => navigation.navigate("Login")}>JUMP RIGHT IN</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20, // Ajout d'un padding global pour les éléments à l'intérieur du conteneur
    backgroundColor: '#fff',
    justifyContent: 'center', // Centrer les éléments verticalement
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center', // Centrer l'image horizontalement
    marginBottom: 20, // Espacement sous l'image
  },
  text: {
    fontFamily: "Comfortaa",
    fontSize: 24,
    textAlign: 'center', // Centrer le texte
    marginBottom: 20, // Ajouter un peu d'espace après le texte
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15, // Augmenter l'espacement entre les champs
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Espacement entre la case à cocher et le bouton
  },
  checkboxText: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#6495ED",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20, // Espacement après le bouton
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerText: {
    textAlign: "center",
    marginTop: 20,
  },
  linkText: {
    color: "#6495ED",
    fontWeight: "bold",
  },
});

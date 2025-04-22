import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, View, Text } from 'react-native';
import { Formik } from 'formik';
 import * as Yup from 'yup';
import Checkbox from "expo-checkbox"; 
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
const API_URL='http://192.168.1.5:5000/api/users/signup';


  // Schéma de validation avec Yup
  const SignupSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Required'),
    terms: Yup.boolean()
      .oneOf([true], 'You must accept the terms')
  });


export default function Signup({ navigation }) {
  const [secureText, setSecureText] = useState(true);

  const createQuiz = async (userId) => {
    try {
      const response = await fetch('http://192.168.1.5:5000/api/quiz/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
    } catch (error) {
      console.error("Erreur réseau :", error);
    }
  };

  const handleSignUp = async (values) => {

    try {
      const response = await fetch(API_URL, {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();
     console.log("Réponse backend:", data);
      createQuiz(data.newUser._id);


      if (!response.ok) {
        throw new Error(data.message || "Échec de l'inscription");
      }

      alert("Succès", "Compte créé avec succès !");
      navigation.navigate("Login");
    } catch (error) {
      console.error('Erreur:', error);
      alert("Erreur", error.message || "Une erreur est survenue lors de l'inscription");
    }


  };

  return (
    <View style={styles.container}>
     <Formik
        initialValues={{ name: '', email: '', password: '', terms: false }}
        validationSchema={SignupSchema}
        onSubmit={handleSignUp}>
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched,setFieldValue  }) => (
      <View>
      <Image
        style={styles.image}
        source={require('../../assets/signup_image.png')}
      />
      <Text style={styles.text}>Welcome <Text style={{ color: "#6495ED" }}>OnBoard!</Text></Text>
      <Text style={styles.label}>Username</Text>
      <TextInput 
        value={values.name}  
        onChangeText={handleChange('name')} 
        onBlur={handleBlur('name')}
        style={[styles.input,errors.name && touched.name ? styles.inputError : null]}  
        placeholder="Enter your username"
      />
       {errors.name && touched.name && (
              <Text style={styles.errorText}>{errors.name}</Text>
            )}
      <Text style={styles.label}>Email</Text>
            <TextInput
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
              style={[
                styles.input, 
                errors.email && touched.email ? styles.inputError : null
              ]}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {errors.email && touched.email && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}

            <Text style={styles.label}>Password</Text>
            <View style={[
              styles.passwordContainer,
              errors.password && touched.password ? styles.inputError : null
            ]}>
              <TextInput
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry={secureText}
                style={{ flex: 1 }}
                placeholder="Enter your password"
                autoCapitalize="none"
              />
        <TouchableOpacity onPress={() => setSecureText(!secureText)}>
          <Icon name={secureText ? "eye-off" : "eye"} size={20} color="#6495ED" />
        </TouchableOpacity>
      </View>
      {errors.password && touched.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
        <View style={styles.checkboxContainer}>
              <Checkbox
                value={values.terms}
                onValueChange={(value) => {
                  // Utilisez setFieldValue pour les champs non-textuels
                  setFieldValue('terms', value);
                }}
                color={values.terms ? "#6495ED" : undefined}
              />
              <Text style={styles.checkboxText}>I accept the terms & Condition</Text>
            </View>
            {errors.terms && touched.terms && (
              <Text style={styles.errorText}>{errors.terms}</Text>
            )}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>SIGN UP</Text>
      </TouchableOpacity>

      {/* Lien pour aller à la connexion */}
      <Text style={styles.footerText}>
        Own an Account? <Text style={styles.linkText} onPress={() => navigation.navigate("Login")}>JUMP RIGHT IN</Text>
      </Text>
      </View>
    )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40, 
    backgroundColor: '#fff',
    justifyContent: 'center', 
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    alignSelf: 'center', 
    marginBottom: 20, 
  },
  text: {
    fontFamily: "Comfortaa",
    fontSize: 24,
    textAlign: 'center', 
    marginBottom: 20, 
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
    marginBottom: 15, 
  },
  inputError: {
    borderColor: 'red',
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
    marginBottom: 20, 
  },
  checkboxText: {
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#6495ED",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20, 
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
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 5,
  },
});

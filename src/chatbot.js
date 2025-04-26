// frontend/chatbot.js
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';

const appLogo = require('../assets/logoChat.png');

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: '1', sender: 'bot', text: 'Hello! How can I assist you today?' },
  ]);
  const [inputText, setInputText] = useState('');

  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 4,
      tension: 80,
    }).start();
  }, []);

  const handleSend = async () => {
    if (inputText.trim() === '') return;
  
    console.log('handleSend triggered with:', inputText); // ✅ Log input
  
    const newMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
    };
  
    setMessages(prev => [...prev, newMessage]);
    console.log('User message added:', newMessage); // ✅ Confirm message added
  
    setInputText('');
  
    try {
      const response = await fetch('https://cbc5-35-184-164-126.ngrok-free.app/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: newMessage.text }),
      });
  
      console.log('Raw response:', response); // ✅ Log response object
  
      const data = await response.json();
      console.log('Bot Response Data:', data); // ✅ Show backend response
  
      const botResponse = {
        id: Date.now().toString() + '_bot',
        sender: 'bot',
        text: data.response || 'Bot did not return a valid reply.',
      };
  
      const activityResponse = {
        id: Date.now().toString() + '_activity',
        sender: 'bot',
        text: `Suggested Activity: ${data.activity_suggestion}`,
      };

      // Add both the bot response and the activity suggestion to the messages list
      setMessages(prev => [...prev, botResponse, activityResponse]);
    } catch (error) {
      console.error('API Error:', error); // ✅ Log actual error
  
      const errorMessage = {
        id: Date.now().toString() + '_error',
        sender: 'bot',
        text: `Oops! There was an error: ${error.message}`,
      };
  
      setMessages(prev => [...prev, errorMessage]);
    }
  };


  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage,
      ]}
    >
      {item.sender === 'bot' && (
        <Image source={appLogo} style={styles.botIcon} />
      )}
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  const animatedStyle = {
    transform: [
      {
        scale: headerAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.header, animatedStyle]}>
        Your mental health assistant
      </Animated.Text>

      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          placeholderTextColor="grey"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 35,
    color: '#333',
  },
  chatContainer: { flexGrow: 1, paddingBottom: 10 },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#95c2ff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f5f5f5',
  },
  messageText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 5,
    borderTopWidth: 1,
    borderColor: '#95c2ff',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    borderColor: '#95c2ff',
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#95c2ff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  botIcon: {
    width: 30,
    height: 30,
    marginRight: 8,
    borderRadius: 15,
  },
});

export default Chatbot;

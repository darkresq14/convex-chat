import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const MessageInput = ({
  onSendMessage,
}: {
  onSendMessage: (message: string, image: string | null) => void;
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const captureImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImage(uri);
    }
  };

  const handleSendMessage = () => {
    onSendMessage(newMessage, selectedImage);
    setNewMessage('');
    setSelectedImage(null);
  };

  return (
    <View style={styles.inputContainer}>
      {selectedImage && (
        <Image source={{ uri: selectedImage }} style={{ width: 200, height: 200, margin: 10 }} />
      )}
      <View style={{ flexDirection: 'row' }}>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
          multiline={true}
        />
        <TouchableOpacity style={styles.sendButton} onPress={captureImage}>
          <Ionicons name="add-outline" style={styles.sendButtonText} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={newMessage === ''}
        >
          <Ionicons name="send-outline" style={styles.sendButtonText} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 40,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  sendButton: {
    backgroundColor: '#EEA217',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignSelf: 'center',
  },
  sendButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MessageInput;

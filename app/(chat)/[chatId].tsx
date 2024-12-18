import React from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ChatPage = () => {
  const { chatId } = useLocalSearchParams();
  console.log(chatId);

  return (
    <View>
      <Text>Page</Text>
    </View>
  );
};

export default ChatPage;

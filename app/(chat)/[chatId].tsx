import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  ListRenderItem,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { Ionicons } from '@expo/vector-icons';

const ChatPage = () => {
  const { chatId } = useLocalSearchParams();
  const convex = useConvex();
  const navigation = useNavigation();

  const [user, setUser] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const sendMessage = useMutation(api.messages.sendMessage);
  const messages = useQuery(api.messages.getForId, { chatId: chatId as Id<'groups'> }) ?? [];
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('user');
      setUser(user);
    };

    void loadUser();
  }, []);

  useEffect(() => {
    const loadGroup = async () => {
      const groupInfo = await convex.query(api.groups.getById, {
        id: chatId as Id<'groups'>,
      });

      groupInfo && navigation.setOptions({ headerTitle: groupInfo.name });
    };

    void loadGroup();
  }, [chatId]);

  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSendMessage = async () => {
    Keyboard.dismiss();
    setNewMessage('');

    void sendMessage({
      group_id: chatId as Id<'groups'>,
      content: newMessage,
      user: user ?? 'Anonymous',
    });
  };

  const renderMessage: ListRenderItem<Doc<'messages'>> = ({ item }) => {
    const isMe = item.user === user;

    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.userMessageContainer : styles.otherMessageContainer,
        ]}
      >
        {!!item.content && (
          <Text style={[styles.messageText, isMe && styles.userMessageText]}>{item.content}</Text>
        )}
        <Text style={styles.timestamp}>
          {`${item.user} - ${new Date(item._creationTime).toLocaleString('en-gb', { hour: '2-digit', minute: '2-digit', year: 'numeric', month: '2-digit', day: '2-digit' })}`}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <FlatList
          ref={listRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item._id.toString()}
          ListFooterComponent={<View style={{ padding: 10 }} />}
        />

        <View style={styles.inputContainer}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message..."
              multiline={true}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={newMessage === ''}
            >
              <Ionicons name="send-outline" style={styles.sendButtonText} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EA',
  },
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
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 10,
    maxWidth: '80%',
  },
  userMessageContainer: {
    backgroundColor: '#791363',
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    flexWrap: 'wrap',
  },
  userMessageText: {
    color: '#fff',
  },
  timestamp: {
    fontSize: 12,
    color: '#c7c7c7',
  },
});

export default ChatPage;

import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import MessageInput from '@/components/MessageInput';
import Message from '@/components/Message';
import { Doc, Id } from '@/convex/_generated/dataModel';

const ChatPage = () => {
  const [user, setUser] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { chatId } = useLocalSearchParams();
  const navigation = useNavigation();
  const convex = useConvex();
  const messages = useQuery(api.messages.getForId, { chatId: chatId as Id<'groups'> }) ?? [];
  const sendMessage = useMutation(api.messages.sendMessage);
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

  const handleSendMessage = async (message: string, image: string | null) => {
    if (image && user) {
      setUploading(true);
      const url = `${process.env.EXPO_PUBLIC_CONVEX_SITE}/sendImage?user=${encodeURIComponent(user)}&group_id=${chatId}&content=${encodeURIComponent(message)}`;
      const response = await fetch(image);
      const blob = await response.blob();

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': blob.type,
        },
        body: blob,
      })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setUploading(false);
        });
    } else {
      void sendMessage({
        group_id: chatId as Id<'groups'>,
        content: message,
        user: user ?? 'Anonymous',
      });
    }
  };

  const renderMessage = ({ item }: { item: Doc<'messages'> }) => {
    const isMe = item.user === user;
    return <Message item={item} isMe={isMe} />;
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
        <MessageInput onSendMessage={handleSendMessage} />
      </KeyboardAvoidingView>

      {uploading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: 'rgba(0,0,0,0.4)',
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EA',
  },
});

export default ChatPage;

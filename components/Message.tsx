import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Doc } from '@/convex/_generated/dataModel';

const Message = ({ item, isMe }: { item: Doc<'messages'>; isMe: boolean }) => (
  <View
    style={[
      styles.messageContainer,
      isMe ? styles.userMessageContainer : styles.otherMessageContainer,
    ]}
  >
    {!!item.file && (
      <Image source={{ uri: item.file }} style={{ width: 200, height: 200, margin: 5 }} />
    )}
    {!!item.content && (
      <Text style={[styles.messageText, isMe && styles.userMessageText]}>{item.content}</Text>
    )}
    <Text style={styles.timestamp}>
      {`${item.user} - ${new Date(item._creationTime).toLocaleString('en-gb', {
        hour: '2-digit',
        minute: '2-digit',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}`}
    </Text>
  </View>
);

const styles = StyleSheet.create({
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

export default Message;

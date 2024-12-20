import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAction, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DialogContainer from 'react-native-dialog/lib/Container';
import DialogTitle from 'react-native-dialog/lib/Title';
import DialogDescription from 'react-native-dialog/lib/Description';
import DialogInput from 'react-native-dialog/lib/Input';
import DialogButton from 'react-native-dialog/lib/Button';

const Index = () => {
  const [name, setName] = useState('');
  const [visible, setVisible] = useState(false);
  const [greeting, setGreeting] = useState('');

  const groups = useQuery(api.groups.get) ?? [];
  const greetingAction = useAction(api.greeting.getGreeting);

  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('user');
      if (!user) {
        setVisible(true);
      } else {
        setName(user);
      }
    };

    void loadUser();
  }, []);

  useEffect(() => {
    if (!name) {
      return;
    }
    const loadGreeting = async () => {
      const greeting = await greetingAction({ name });
      setGreeting(greeting);
    };

    void loadGreeting();
  }, [name]);

  const setUser = async () => {
    const r = (Math.random() + 1).toString(36).substring(7);
    const userName = `${name}#${r}`;

    await AsyncStorage.setItem('user', userName);
    setName(userName);
    setVisible(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {greeting && <Text style={{ textAlign: 'center', margin: 10 }}>{greeting}</Text>}

        {groups.map((group) => (
          <Link
            href={{ pathname: '/(chat)/[chatId]', params: { chatId: group._id } }}
            key={group._id}
            style={{ marginBottom: 10 }}
            asChild
          >
            <TouchableOpacity style={styles.group}>
              <Image source={{ uri: group.icon_url }} style={{ width: 50, height: 50 }} />
              <View style={{ flex: 1 }}>
                <Text>{group.name}</Text>
                <Text style={{ color: '#888' }}>{group.description}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>

      <DialogContainer visible={visible}>
        <DialogTitle>Username required</DialogTitle>
        <DialogDescription>Please insert a name to start chatting.</DialogDescription>
        <DialogInput onChangeText={setName} />
        <DialogButton label="Set name" onPress={setUser} />
      </DialogContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#F8F5EA',
  },
  group: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    elevation: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
});

export default Index;

import React, { useState } from 'react';
import { Text, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

const CreateGroup = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [icon, setIcon] = useState('');

  const router = useRouter();
  const startGroup = useMutation(api.groups.create);

  const onCreateGroup = async () => {
    await startGroup({
      name,
      description: desc,
      icon_url: icon,
    });

    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput style={styles.textInput} value={name} onChangeText={setName} />

      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.textInput} value={desc} onChangeText={setDesc} />

      <Text style={styles.label}>Icon URL</Text>
      <TextInput style={styles.textInput} value={icon} onChangeText={setIcon} />

      <TouchableOpacity style={styles.button} onPress={onCreateGroup}>
        <Text style={styles.buttonText}>Create</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F5EA',
    padding: 10,
  },
  label: {
    marginVertical: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    minHeight: 40,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#EEA217',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateGroup;

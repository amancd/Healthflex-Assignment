import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
} from 'react-native';

export default function AddTimerModal({ visible, onClose, onSave, darkTheme }) {
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');

  const themeStyles = darkTheme ? darkStyles : lightStyles;

  return (
    <Modal visible={visible} animationType="slide">
      <View style={themeStyles.container}>
        <Text style={themeStyles.title}>Add Timer</Text>

        <TextInput
          style={themeStyles.input}
          placeholder="Timer Name"
          placeholderTextColor={darkTheme ? '#ccc' : '#999'}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={themeStyles.input}
          placeholder="Duration (seconds)"
          placeholderTextColor={darkTheme ? '#ccc' : '#999'}
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />
        <TextInput
          style={themeStyles.input}
          placeholder="Category"
          placeholderTextColor={darkTheme ? '#ccc' : '#999'}
          value={category}
          onChangeText={setCategory}
        />

        <View style={themeStyles.buttonRow}>
          <View style={themeStyles.buttonWrapper}>
            <Button
              title="Save"
              onPress={() => {
                onSave({ name, duration: parseInt(duration), category });
                onClose();
              }}
              color={darkTheme ? '#4caf50' : undefined}
            />
          </View>
          <View style={themeStyles.buttonWrapper}>
            <Button title="Cancel" color="red" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const baseStyles = {
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    borderBottomWidth: 1,
    marginBottom: 16,
    fontSize: 16,
    paddingVertical: 6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 6,
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#fff' },
  title: { ...baseStyles.title, color: '#000' },
  input: { ...baseStyles.input, color: '#000', borderBottomColor: '#888' },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#1e1e1e' },
  title: { ...baseStyles.title, color: '#fff' },
  input: { ...baseStyles.input, color: '#fff', borderBottomColor: '#ccc' },
});

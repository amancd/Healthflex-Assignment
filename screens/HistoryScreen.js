import React, { useState } from 'react';
import {
  FlatList,
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  Button,
  Share,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const HistoryScreen = ({ darkTheme }) => {
  const [history, setHistory] = useState([]);

useFocusEffect(
  React.useCallback(() => {
    const fetchHistory = async () => {
      const data = await AsyncStorage.getItem('history');
      const parsed = JSON.parse(data || '[]');
      setHistory(parsed);
    };

    fetchHistory();
  }, [])
);

  const themeStyles = darkTheme ? darkStyles : lightStyles;

  const handleExport = async () => {
    try {
      const data = await AsyncStorage.getItem('history');
      const json = JSON.stringify(JSON.parse(data || '[]'), null, 2);

      await Share.share({
        title: 'Exported Timer History',
        message: json,
      });
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <SafeAreaView style={themeStyles.container}>
      <View style={themeStyles.exportWrapper}>
        <TouchableOpacity onPress={handleExport} style={themeStyles.exportButton}>
          <Text style={themeStyles.exportText}>Export JSON</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={themeStyles.list}
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={themeStyles.card}>
            <Text style={themeStyles.name}>{item.name}</Text>
            <Text style={themeStyles.timestamp}>
              Completed at {new Date(item.completedAt).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={themeStyles.emptyText}>No completed timers yet.</Text>
        }
      />
    </SafeAreaView>
  );
};


const baseStyles = {
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 14,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  exportWrapper: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },

  exportButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },

  exportText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
};

const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#f9f9f9',
  },
  card: {
    ...baseStyles.card,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  name: {
    ...baseStyles.name,
    color: '#000',
  },
  timestamp: {
    ...baseStyles.timestamp,
    color: '#333',
  },
  emptyText: {
    ...baseStyles.emptyText,
    color: '#888',
  },
});

const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: '#121212',
  },
  card: {
    ...baseStyles.card,
    borderColor: '#444',
    backgroundColor: '#1e1e1e',
  },
  name: {
    ...baseStyles.name,
    color: '#fff',
  },
  timestamp: {
    ...baseStyles.timestamp,
    color: '#ccc',
  },
  emptyText: {
    ...baseStyles.emptyText,
    color: '#aaa',
  },
});

export default HistoryScreen;

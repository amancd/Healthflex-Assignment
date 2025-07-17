import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function TimerCard({
  timer,
  onStart,
  onPause,
  onReset,
  darkTheme,
}) {
  const { name, remaining, duration, status } = timer;

  const getFormattedTime = (secs) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progress = (1 - remaining / duration) * 100;

  const styles = darkTheme ? darkStyles : lightStyles;

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.status}>{status.toUpperCase()}</Text>
      <Text style={styles.time}>{getFormattedTime(remaining)}</Text>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.buttons}>
        <Button title="Start" onPress={onStart} disabled={status === 'running' || status === 'completed'} />
        <Button title="Pause" onPress={onPause} disabled={status !== 'running'} />
        <Button title="Reset" onPress={onReset} />
      </View>
    </View>
  );
}

const base = {
  card: {
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  status: { marginTop: 4 },
  time: { fontSize: 24, fontWeight: 'bold', marginVertical: 8 },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: { height: '100%' },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
};

const lightStyles = StyleSheet.create({
  ...base,
  card: { ...base.card, backgroundColor: '#fff' },
  status: { ...base.status, color: '#555' },
  progressBar: { ...base.progressBar, backgroundColor: '#eee' },
  progressFill: { ...base.progressFill, backgroundColor: '#4caf50' },
});

const darkStyles = StyleSheet.create({
  ...base,
  card: { ...base.card, backgroundColor: '#1e1e1e' },
  name: { ...base.name, color: '#fff' },
  status: { ...base.status, color: '#ccc' },
  time: { ...base.time, color: '#fff' },
  progressBar: { ...base.progressBar, backgroundColor: '#555' },
  progressFill: { ...base.progressFill, backgroundColor: '#81c784' },
});

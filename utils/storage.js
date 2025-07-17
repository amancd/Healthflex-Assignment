import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTimers = async (timers) => {
  await AsyncStorage.setItem('timers', JSON.stringify(timers));
};

export const loadTimers = async () => {
  const data = await AsyncStorage.getItem('timers');
  return data ? JSON.parse(data) : [];
};

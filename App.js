import React, { useState } from 'react';
import { Appearance, View, Text, Switch, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen'; // create if not already

const Tab = createMaterialTopTabNavigator();

export default function App() {
    const [darkTheme, setDarkTheme] = useState(Appearance.getColorScheme() === 'dark');

  return (
    <NavigationContainer>
      <View style={styles.header}>
        <Text style={styles.title}>Timer App</Text>
        <Switch
          value={darkTheme}
          onValueChange={setDarkTheme}
        />
      </View>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: darkTheme ? '#222' : '#fff' },
          tabBarLabelStyle: { color: darkTheme ? '#fff' : '#000' },
          tabBarIndicatorStyle: { backgroundColor: darkTheme ? '#fff' : '#000' },
        }}
      >
        <Tab.Screen name="Timers">
          {() => <HomeScreen darkTheme={darkTheme} />}
        </Tab.Screen>
        <Tab.Screen name="History">
          {() => <HistoryScreen darkTheme={darkTheme} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    paddingHorizontal: 16,
    paddingTop: 50,
    backgroundColor: '#FE7743',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

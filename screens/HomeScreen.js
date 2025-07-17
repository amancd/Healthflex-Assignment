import React, { useReducer, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  Button,
  TouchableOpacity,
  Switch,
  Appearance,
} from 'react-native';
import TimerCard from '../components/TimerCard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddTimerModal from '../components/AddTimerModal';

const initialState = {
  timers: [],
  history: [],
};

function reducer(state, action) {
  switch (action.type) {
  case 'LOAD_TIMERS':
    return {
      ...state,
      timers: action.payload,
    };
    case 'ADD_TIMER':
      return {
        ...state,
        timers: [
          ...state.timers,
          {
            id: Date.now().toString(),
            name: action.payload.name,
            duration: action.payload.duration,
            remaining: action.payload.duration,
            category: action.payload.category,
            status: 'paused',
            halfwayAlertShown: false,
          },
        ],
      };
    case 'START_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.id && timer.status !== 'completed'
            ? { ...timer, status: 'running' }
            : timer
        ),
      };
    case 'PAUSE_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.id ? { ...timer, status: 'paused' } : timer
        ),
      };
    case 'RESET_TIMER':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.id === action.id
            ? {
                ...timer,
                remaining: timer.duration,
                status: 'paused',
                halfwayAlertShown: false,
              }
            : timer
        ),
      };
    case 'TICK':
      return {
        ...state,
        timers: state.timers.map((timer) => {
          if (timer.status !== 'running') return timer;
          const newRemaining = timer.remaining - 1;

          if (newRemaining <= 0) {
            return {
              ...timer,
              remaining: 0,
              status: 'completed',
              completedAt: new Date().toISOString(),
            };
          }

          return {
            ...timer,
            remaining: newRemaining,
          };
        }),
      };
    case 'BULK_ACTION':
      return {
        ...state,
        timers: state.timers.map((timer) =>
          timer.category === action.category && timer.status !== 'completed'
            ? {
                ...timer,
                status:
                  action.operation === 'start'
                    ? 'running'
                    : action.operation === 'pause'
                    ? 'paused'
                    : 'paused',
                ...(action.operation === 'reset' && {
                  remaining: timer.duration,
                  halfwayAlertShown: false,
                }),
              }
            : timer
        ),
      };
      case 'MARK_TIMER_SAVED':
        return {
          ...state,
          timers: state.timers.map((t) =>
            t.id === action.id ? { ...t, completedAtSaved: true } : t
          ),
        };

    default:
      return state;
  }
}

export default function HomeScreen({ darkTheme, setDarkTheme }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({});
  const [completedTimerName, setCompletedTimerName] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completedTimersShown, setCompletedTimersShown] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');


  useEffect(() => {
    const interval = setInterval(() => dispatch({ type: 'TICK' }), 1000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  const justCompleted = state.timers.find(
    (timer) =>
      timer.remaining === 0 &&
      timer.status === 'completed' &&
      !timer.completedAtSaved // ← Only process if not already saved
  );

  if (justCompleted) {
    setCompletedTimerName(justCompleted.name);
    setShowCompleteModal(true);

    const historyItem = {
      id: justCompleted.id,
      name: justCompleted.name,
      completedAt: justCompleted.completedAt || new Date().toISOString(),
    };

    // Save to AsyncStorage
    AsyncStorage.getItem('history').then((data) => {
      const prev = JSON.parse(data || '[]');
      const updated = [historyItem, ...prev];
      AsyncStorage.setItem('history', JSON.stringify(updated));
    });

    // ✅ Mark this timer as "saved"
    dispatch({
      type: 'MARK_TIMER_SAVED',
      id: justCompleted.id,
    });
  }
}, [state.timers]);



  const groupedTimers = state.timers.reduce((groups, timer) => {
    if (!groups[timer.category]) groups[timer.category] = [];
    groups[timer.category].push(timer);
    return groups;
  }, {});

  const toggleCategory = (cat) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  useEffect(() => {
    AsyncStorage.getItem('timers').then((data) => {
      if (data) {
        const parsed = JSON.parse(data);
        dispatch({ type: 'LOAD_TIMERS', payload: parsed });
      }
    });
  }, []);


const handleAddTimer = ({ name, duration, category }) => {
  if (!name || !duration || !category) return;
  dispatch({
    type: 'ADD_TIMER',
    payload: {
      name,
      duration: parseInt(duration),
      category,
    },
  });
  setModalVisible(false);
};

useEffect(() => {
  AsyncStorage.setItem('timers', JSON.stringify(state.timers));
}, [state.timers]);


  const themeStyles = darkTheme ? darkStyles : lightStyles;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[themeStyles.container]}>
        {/* Top bar and filters */}
        <View style={themeStyles.topBar}>
          <Text style={themeStyles.filterLabel}>Filter:</Text>
          <ScrollView horizontal>
            <TouchableOpacity onPress={() => setSelectedCategoryFilter('All')}>
              <Text style={themeStyles.filterChip}>All</Text>
            </TouchableOpacity>
            {Object.keys(groupedTimers).map((cat) => (
              <TouchableOpacity key={cat} onPress={() => setSelectedCategoryFilter(cat)}>
                <Text style={themeStyles.filterChip}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Timers grouped by category */}
        {Object.keys(groupedTimers)
          .filter((cat) => selectedCategoryFilter === 'All' || selectedCategoryFilter === cat)
          .map((cat) => (
            <View key={cat} style={themeStyles.categorySection}>
              <View style={themeStyles.categoryHeader}>
                <TouchableOpacity onPress={() => toggleCategory(cat)} style={{ flex: 1 }}>
                  <Text style={themeStyles.categoryTitle}>
                    {expandedCategories[cat] ? '▼' : '▶'} {cat}
                  </Text>
                </TouchableOpacity>
                <View style={themeStyles.bulkIcons}>
                  <TouchableOpacity onPress={() => dispatch({ type: 'BULK_ACTION', category: cat, operation: 'start' })}>
                    <Icon name="play-circle-outline" size={28} color="#4caf50" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => dispatch({ type: 'BULK_ACTION', category: cat, operation: 'pause' })}>
                    <Icon name="pause-circle-outline" size={28} color="#ff9800" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => dispatch({ type: 'BULK_ACTION', category: cat, operation: 'reset' })}>
                    <Icon name="restore" size={26} color="#2196f3" />
                  </TouchableOpacity>
                </View>
              </View>

              {expandedCategories[cat] &&
                groupedTimers[cat].map((timer) => (
                  <TimerCard
                    key={timer.id}
                    timer={timer}
                    onStart={() => dispatch({ type: 'START_TIMER', id: timer.id })}
                    onPause={() => dispatch({ type: 'PAUSE_TIMER', id: timer.id })}
                    onReset={() => dispatch({ type: 'RESET_TIMER', id: timer.id })}
                    darkTheme={darkTheme}
                  />
                ))}
            </View>
          ))}

        {/* Timer Completion Modal */}
        <Modal visible={showCompleteModal} transparent animationType="fade">
          <View style={themeStyles.modalOverlay}>
            <View style={themeStyles.completeModal}>
              <Text style={themeStyles.completeText}>🎉 Timer Completed!</Text>
              <Text style={themeStyles.completeText}>{completedTimerName}</Text>
              <Button title="OK" onPress={() => setShowCompleteModal(false)} />
            </View>
          </View>
        </Modal>

        <AddTimerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleAddTimer}
          darkTheme={darkTheme}
        />

      </ScrollView>

      {/* ✅ Floating Add Timer Button (OUTSIDE SCROLLVIEW) */}
      <View style={themeStyles.floatingButtonWrapper}>
        <TouchableOpacity
          style={themeStyles.floatingButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={themeStyles.floatingButtonText}>+ Add Timer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

}

const baseStyles = {
  container: {
    padding: 12,
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  filterLabel: {
    marginRight: 6,
    fontWeight: 'bold',
    color: '#000', // will override in darkStyles
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#ddd', // will override in darkStyles
    marginHorizontal: 4,
    fontSize: 14,
    color: '#000', // for light theme text
  },
  categorySection: {
    marginVertical: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000', // override in dark
  },
  bulkIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completeModal: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  completeText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#000', // override in dark
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff', // override in dark
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000', // override in dark
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#888', // override in dark
    padding: 8,
    marginBottom: 12,
    color: '#000', // override in dark
  },
floatingButtonWrapper: {
  position: 'absolute',
  bottom: 60,
  left: 0,
  right: 0,
  alignItems: 'center',
  justifyContent: 'center',
  paddingHorizontal: 16,
},

floatingButton: {
  backgroundColor: '#FE7743',
  paddingVertical: 14,
  paddingHorizontal: 30,
  borderRadius: 10,
  elevation: 6,
},

floatingButtonText: {
  color: '#ffffff',
  fontWeight: '600',
  fontSize: 17,
  letterSpacing: 0.5,
},
};


const lightStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#f9f9f9' },
});
const darkStyles = StyleSheet.create({
  ...baseStyles,
  container: { ...baseStyles.container, backgroundColor: '#121212' },
  modalContent: { ...baseStyles.modalContent, backgroundColor: '#1e1e1e' },
  modalTitle: { ...baseStyles.modalTitle, color: '#fff' },
  completeModal: { ...baseStyles.completeModal, backgroundColor: '#1e1e1e' },
  completeText: { ...baseStyles.completeText, color: '#fff' },
  categoryTitle: { ...baseStyles.categoryTitle, color: '#fff' },
  filterLabel: { ...baseStyles.filterLabel, color: '#fff' },
  filterChip: {
    ...baseStyles.filterChip,
    backgroundColor: '#444',
    color: '#fff',
  },
  input: {
    ...baseStyles.input,
    color: '#fff',
    borderBottomColor: '#ccc',
  },
});


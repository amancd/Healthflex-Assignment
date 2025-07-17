# React Native Multi-Timer App

A sleek and theme-aware timer app built using **React Native** that supports multiple timers, category grouping, bulk operations, local storage, dark mode, and history tracking with export support.


---

## Features

- 🕒 Add multiple timers with custom name, duration & category  
- ⏯ Start, pause, reset timers individually or in bulk per category  
- 📦 Local data persistence using `AsyncStorage`  
- 🌗 Full dark mode support (auto/adaptive)  
- 📋 Timer completion history with timestamp  
- 📤 Export history as prettified JSON  
- 🎉 On-screen modal when a timer completes  
- 💡 Optimized UI using native components

---

## Screens

- **Home Screen:** Manage and view grouped timers  
- **Add Timer Modal:** Add a new timer with name, duration, and category  
- **History Screen:** View and export completed timers  

---

##  Tech Stack

- ⚛️ React Native (CLI)
- 📦 AsyncStorage for persistent storage
- 🧭 React Navigation for screen management
- 🎨 Dynamic theming with `useColorScheme`
- 🧠 useReducer for timer state management
- 🧪 Tested on Android & iOS

---

## Installation


```bash
git clone https://github.com/amancd/Healthflex-Assignment.git
cd Healthflex-Assignment
npm install
npx expo start
```

## File Structure

```bash
.
├── components/         # TimerCard, AddTimerModal etc.
├── screens/            # HomeScreen, HistoryScreen
├── assets/             # Icons, screenshots
├── App.js              # Entry point
├── .gitignore
└── README.md
```

## Screenshots
<table>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/1b80e62e-6faa-4f75-8dfb-7741f0e08aad" width="200" height="400" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/b60628ce-64bb-4bd5-aeab-f211128413bf" width="200" height="400" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/a5a9f08d-d97c-4ee4-8c02-e4022a56ff86" width="200" height="400" />
    </td>
  </tr>
  <tr>
    <td>
      <img src="https://github.com/user-attachments/assets/4ff3e394-64f3-465a-a598-6fc4c9d7de49" width="200" height="400" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/6f7859e5-bc73-40cf-8788-635f7a72d782" width="200" height="400" />
    </td>
    <td>
      <img src="https://github.com/user-attachments/assets/ce978152-2537-4e92-8e3e-78132721584c" width="200" height="400" />
    </td>
  </tr>
</table>

### Assumptions Made During Development

- Each timer uses `Date.now()` for a unique ID, assuming no two are added at the same millisecond.
- Timer history is stored locally using `AsyncStorage`, without cloud sync.
- User-entered durations are expected to be in **seconds** and are assumed to be valid numbers.
- Dark mode is toggled via a `darkTheme` prop passed down from a parent component or theme context.


# My Chama Money Management App — Frontend (Expo + React Native)

A mobile-first SACCO money management frontend that helps members track contributions, savings, loans, and transactions in one place. Built with **React Native (Expo)** for fast iteration, clean UI, and cross-platform support (iOS + Android).

## Features

- **Authentication flow** (login / logout) - uses clerk
- **Dashboard overview** of balances and recent activity
- **Transactions**: view history, filter by date/type/category
- **Savings & Contributions**: track deposits and member contributions
- **Loans**: view loan status, repayments, and schedules 
- **Analytics**: charts for spending, income vs expenses, and category breakdown 
- **Responsive UI** for different screen sizes
- **Reusable components** + clean folder structure

## Tech Stack

- **React Native (Expo)**
- **TypeScript** *(recommended / if used)*
- **React Navigation**
- **Axios / Fetch** for API requests
- **State management**: Context API / Redux / Zustand *(choose what you use)*
- **Charts**: `react-native-gifted-charts` or `react-native-chart-kit`
- **Styling**: Native styles / Tailwind (NativeWind) *(choose what you use)*

## Getting Started

### Clone the repo
```bash
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
```


### Install dependencies

   ```bash
   npm install @clerk/clerk-expo, @expo/vector-icons, @react-navigation/bottom-tabs, @react-navigation/elements, @react-navigation/native, eslint-config-expo, expo, expo-blur, expo-constants, expo-font, expo-haptics, expo-image, expo-linear-gradient, expo-linking, expo-router, expo-secure-store, expo-splash-screen, expo-status-bar, expo-symbols, expo-system-ui, expo-web-browser, react, react-dom, react-native, react-native-gesture-handler, react-native-gifted-charts, react-native-keyboard-aware-scroll-view, react-native-reanimated, react-native-safe-area-context, react-native-screens, react-native-svg, react-native-web, react-native-webview, typescript
   ```

 ### Start the app

   ```bash
   npx expo start
   ```


## Get a fresh project if you want to start afresh

Run:

```bash
npm run reset-project
```


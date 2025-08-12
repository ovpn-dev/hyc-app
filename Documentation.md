# Help Youth Cope - App Documentation

Welcome to the hyc-app repository documentation! This document provides an overview of the project structure, components, and key functionalities.

## 1. Project Overview

### Description

This repository contains the source code for the **hyc-app**, a mobile application built using the Expo framework on React Native. The primary language used is JavaScript, with some parts written in TypeScript.

The app aims to support and motivate youth by offering features such as:

- Daily inspirational quotes with push notifications.
- An AI chatbot (using Llama 3.1 via Groq's API) grounded to offer helpful advice.
- Live access to the official Help Youth Cope blog posts.
- Direct SOS hotline access.
- Resource sections.

The app will be continuously updated with new features based on client requests.

### Table of Contents

- [1. Project Overview](#1-project-overview)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
- [2. Setup](#2-setup)
  - [Installation](#installation)
  - [Usage](#usage)
- [3. File Structure](#3-file-structure)
- [4. Directory & File Details](#4-directory--file-details)
  - [Root Files](#root-files)
  - [app/ Directory](#app-directory)
  - [assets/ Directory](#assets-directory)
  - [components/ Directory](#components-directory)
  - [constants/ Directory](#constants-directory)
  - [context/ Directory](#context-directory)
  - [lib/ Directory](#lib-directory)
- [5. Contributing](#5-contributing)
- [6. License](#6-license)

_(Note: This Table of Contents is manually created. For automatic generation in some Markdown viewers or conversion tools, you might use `[TOC]` or specific flags.)_

## 2. Setup

### Installation

To install the project dependencies, Clone the apps github repository to your local machine or
Unzip the source code zip file sent to fiverr
Navigate to the project root directory with your preferred IDE
Open the terminal and run the below command:

``````bash
npm install

Usage

To start the development server and run the application, use the following command:

npx expo start

`````bash

This will typically open Expo Dev Tools in your browser, allowing you to run the app on a simulator/emulator or a physical device using the Expo Go app.

3. File Structure

Here is a high-level overview of the project's directory structure:

.
├── .gitattributes
├── .gitignore
├── GoogleService-Info.plist  # iOS Firebase Config
├── Podfile                   # iOS Dependencies (CocoaPods)
├── README.md                 # Standard GitHub Readme
├── android/                  # Android native project files
├── app.json                  # Expo configuration file
├── app/                      # Main application screens and logic (Expo Router)
│   ├── (auth)/               # Authentication screens (Currently unused)
│   ├── (tabs)/               # Tab navigation layout and screens
│   ├── _layout.jsx           # Root layout for the app directory
│   ├── api/                  # API service integrations
│   ├── blog.jsx              # Blog screen component
│   ├── hooks/                # Custom React Hooks
│   ├── index.jsx             # Welcome/Entry screen component
│   ├── needhelp.jsx          # "Need Help?" screen component
│   ├── quotes.tsx            # Quotes screen component
│   └── search/               # Search functionality screens
├── assets/                   # Static assets (fonts, icons, images)
│   ├── fonts/
│   ├── icons/
│   └── images/
├── components/               # Reusable UI components
├── constants/                # Constant values (icons, images, fallback data)
├── context/                  # Global React Context providers
├── firebase/                 # Firebase configuration
├── lib/                      # Utility functions, Appwrite SDK, storage helpers
├── index.js                  # App entry point (Managed by Expo)
├── babel.config.js           # Babel configuration
├── eas.json                  # EAS Build configuration
├── google-services.json      # Android Firebase Config
├── metro.config.js           # Metro bundler configuration
├── package-lock.json         # Exact dependency versions
├── package.json              # Project metadata and dependencies
├── secret/                   # (Likely for sensitive keys - ensure it's in .gitignore)
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration

Use code with caution.

4. Directory & File Details
Root Files

app.json: Configures the Expo application (name, version, icon, splash screen, plugins, platform settings, etc.). Essential for build and runtime behavior.

package.json: Lists project dependencies, scripts, and metadata.

babel.config.js: Configuration for the Babel JavaScript compiler.

metro.config.js: Configuration for the Metro bundler used by React Native/Expo.

tailwind.config.js: Configuration for Tailwind CSS utility classes.

tsconfig.json: Configuration for the TypeScript compiler.

eas.json: Configuration for Expo Application Services (EAS) builds.

.gitignore: Specifies intentionally untracked files that Git should ignore (e.g., node_modules, .env, secret/).

GoogleService-Info.plist / google-services.json: Firebase configuration files for iOS and Android respectively.

app/ Directory

This directory uses Expo Router for file-based routing.

(auth)/: Contains screens related to user authentication (Sign In, Sign Up).

Note: As per project direction, these authentication functions are currently unused. The app uses a direct approach with user Nickname setup. The code remains for potential future use.

_layout.jsx: Layout component for the auth group. Handles redirection if the user is already logged in.

sign-in.jsx: UI and logic for the user sign-in screen.

sign-up.jsx: UI and logic for the user registration screen.

(tabs)/: Defines the main tab-based navigation structure and the screens within each tab (e.g., Home, Profile, Create). (Specific files not listed in input, assumed structure)

_layout.jsx: The root layout component for the entire app/ directory. Handles font loading, splash screen management, defines the main navigation stacks (tabs, auth, other screens), and wraps the app in GlobalProvider.

api/: Contains code related to interacting with external APIs.

api-service.ts: APIService class for fetching quotes (random, today's) from zenquotes.io. Implements singleton pattern and includes fallback quotes.

fetchGPT.ts: Function fetchChatGPTResponse to interact with the Groq API (Llama 3.1) for the chatbot functionality. Handles request formatting, context management, and error handling.

route.ts: Contains commented-out code potentially related to setting up API routes using ai-sdk, likely experimental or deprecated.

hooks/: Contains custom React Hooks for reusable logic.

useNetwork.ts: useNetwork hook to detect network connectivity status using @react-native-community/netinfo.

useNotifications.ts: useNotifications hook for managing push notifications (registration, scheduling daily quotes, loading/saving preferences, toggling) using expo-notifications.

useQuotes.ts: useQuotes hook for fetching and managing quotes (today's or random). Handles loading, error states, caching (AsyncStorage), and pull-to-refresh logic, using apiService.

blog.jsx: Implements the screen displaying blog posts fetched from the Help Youth Cope WordPress REST API. Uses axios for fetching, react-native-render-html for display, and allows viewing individual posts.

index.jsx: The initial landing/welcome screen of the app. Displays logo, hero image, welcome text, and navigation buttons. Handles redirection for logged-in users and shows the StepProgress component for new users. Initializes Firebase.

needhelp.jsx: Implements the "Need Help?" screen, listing crisis hotlines, support communities, and mental health resources with contact info and links (Linking API).

quotes.tsx: Implements the screen for displaying inspirational quotes. Allows toggling between "Today's Quote" and "More Quotes", shows network status, integrates useQuotes and useGlobalContext (for liking), and includes NotificationSettings.

search/[query].jsx: Dynamic route screen for displaying search results based on the query parameter. Uses useAppwrite to fetch results (currently tied to Appwrite posts, may need update if backend changed) and displays them. Includes SearchInput. (Note: Relies on Appwrite functions which might be deprecated)

Tips.jsx: (Documentation Summary Provided) Displays a responsive grid of helpful tip cards, each linking to an external URL. Adapts layout based on screen size/orientation.

NicknameSetup.jsx: (Documentation Summary Provided) Screen for users to set their nickname. Includes input, validation, and uses GlobalContext to save the nickname and proceed.

assets/ Directory

Contains static assets used within the application.

fonts/: Custom font files (e.g., Poppins variations).

icons/: Icon images used in buttons, tabs, etc.

images/: Other images like logos, backgrounds, illustrations.

Note: No code files reside here. See constants/ for how these are imported and managed.

components/ Directory

Contains reusable UI components used across the application.

CustomButton.jsx: A reusable, styled TouchableOpacity button component with title display and optional loading indicator.

ErrorState.tsx: (Documentation Summary Provided) Displays a user-friendly error message with an icon and a retry button.

FormField.jsx: (Documentation Summary Provided) A reusable input field component with a label, placeholder, value handling, and optional password visibility toggle.

index.js: Central export file for components, simplifying imports. Exports VideoCard, FormField, CustomButton, InfoBox, Loader, Trending, SearchInput, EmptyState.

InfoBox.jsx: (Documentation Summary Provided) Displays a styled box with a title and subtitle, suitable for small informational snippets. Supports custom styling.

LikedQuotesSection.tsx: (Documentation Summary Provided) Displays a list of the user's liked quotes, showing text, author, date liked, and providing unlike/share actions. Uses FlatList.

Loader.jsx: (Documentation Summary Provided) Displays a full-screen, semi-transparent loading overlay with an ActivityIndicator. Conditionally rendered via the isLoading prop.

multiStep.jsx: (Documentation Summary Provided) A component guiding users through a sequence of steps (e.g., onboarding). Renders different step components and provides Back/Next/Finish navigation.

NotificationHandler.tsx: (Documentation Summary Provided) A non-UI component that listens for notification tap events and navigates the user to the appropriate screen using Expo Router. Runs in the background.

NotificationSetting.tsx: (Documentation Summary Provided) UI component for managing daily notification settings (enable/disable toggle, time picker) using the useNotifications hook.

QuoteCard.tsx: (Documentation Summary Provided) Displays a single quote with author, avatar, and interactive like/share buttons. Optimized with React.memo.

sosModal.jsx: (Documentation Summary Provided) A modal providing immediate crisis support options (Call/Text 988 hotline) using the Linking API. Includes animation and close functionality.

(Other components like VideoCard, Trending, SearchInput, EmptyState are exported from index.js but not detailed in the source text)

constants/ Directory

Contains constant values and definitions.

fallback.ts: Defines the FALLBACK_QUOTES array, used when the quote API fails.

icon.js: Exports an object containing imported icon assets from assets/icons/, providing a central access point.

images.js: Exports an object containing imported image assets from assets/images/, providing a central access point.

context/ Directory

Contains global state management using React Context.

GlobalProvider.js: (Documentation Summary Provided) Provides global state (loading, isLogged, isNewUser, user) and functions (saveNickname, liked quote management via useLikedQuotes) to the entire app. Handles loading nickname from AsyncStorage and integrates NotificationHandler.

lib/ Directory

Contains utility functions, service integrations, and helpers.

appwrite.js:

Note: Many functions here (related to user authentication, video posts) are likely deprecated due to the shift away from Appwrite authentication and towards nickname setup. Core client setup might still be relevant if Appwrite is used for other database/storage needs.

Configures the Appwrite client (react-native-appwrite).

Provides functions for Appwrite interactions (user creation, sign-in/out, data fetching - e.g., createUser, signIn, getCurrentUser, searchPosts).

chatStorage.js: Provides functions (saveChatHistory, getAllChats, deleteChat) to manage chat conversation history using AsyncStorage.

useAppwrite.js: Custom hook useAppwrite to simplify data fetching from Appwrite functions. Manages data, loading, and error states, and provides a refetch function. (Note: Usefulness depends on whether Appwrite data fetching is still active).

5. Contributing

We welcome contributions! Please follow these steps:

Fork the repository on GitHub.

Create a new branch for your feature or bug fix:

git checkout -b feature/your-feature-name

`````bash


Make your changes and commit them with clear messages:

git add .
git commit -m "feat: Add feature X"
# or
# git commit -m "fix: Resolve issue Y"

`````bash

Push your changes to your forked repository:

git push origin feature/your-feature-name

`````bash


Open a Pull Request (PR) from your branch to the main repository's main (or develop) branch. Describe your changes clearly in the PR.

Alternatively, if you have direct collaborator access, you can clone the repository and follow steps 2-6 on a local branch before creating a PR.

``````

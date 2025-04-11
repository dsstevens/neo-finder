# Neo Finder 🔭

Completed in 5 days as part of a tech challenge for Red Foundry.
This is a React Native application made in [Expo](https://expo.dev/) with `create-expo-app`.

This app uses NASA's
NeoWs (Near Earth Object Web Service) to display information and details about Near Earth Objects(NEOs) including its name, diameter, velocity, miss distance and whether the object is hazardous.

## 🌌Installation Guide🌌
You will need to `git clone` this application down and have an Expo environment and API key.
1. Generate an API key:

- Visit the [NASA website](https://api.nasa.gov/) to request a key

- Because this API key has limited use, you will need to create your own and replace the key hardcoded into the project by creating an .env file.

- Create a .env file at the root of the cloned project. In the file, create two variables:
```
EXPO_PUBLIC_API_URL=https://api.nasa.gov/neo/rest/v1/feed
EXPO_PUBLIC_API_KEY=<YOUR_API_KEY>
```

- Replace `<YOUR_API_KEY>` with the key you should receive via email from your request.

2. Expo Environment:
- Follow [Expo's guide](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated&mode=expo-go) to set up your environment in Xcode to run the app on a simulator or on your device. (Note: this app is currently designed only for iOS).

- In your terminal, run the command `npm install` to install the necessary dependencies

## ☄️ Running the App:

- In your terminal, run the command `npx expo start`


### 📡 Future Features:

- Build the app with WRD for different devices
- Improve UI for date-time picker
- Light mode and Dark mode with a night time color palette
- Make the app work for Android systems
- Display total object count for user reference
- Loading animation
- Favoriting NEOs

### 🌚 Challenges:

The Expo simulator suddenly stopped working and that took time to troubleshoot, so I worked on the web browser for a good portion of the time while trying to work on the UI. There are some things that could be better about the UI but considering the limited time that I had this week, I am happy with my first mobile app.
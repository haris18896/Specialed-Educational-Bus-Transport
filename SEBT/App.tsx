import React, {useEffect} from 'react';
import {Platform, Alert, Linking, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';
import * as Permissions from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_TIME_INSTALL_KEY = 'first_time_install';

async function requestOverlayPermission() {
  if (Platform.OS === 'android') {
    try {
      const permissionStatus = await Permissions.check('overlay');
      if (permissionStatus !== 'granted') {
        console.log('permission is not granted');
        Alert.alert(
          'Permission Required',
          'Please enable the "Display over other apps" permission in the app settings to use this feature.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
        );
      }
    } catch (err) {
      console.warn('Error checking permission:', err);
    }
  }
}

async function checkFirstTimeInstall() {
  try {
    const isFirstTime = await AsyncStorage.getItem(FIRST_TIME_INSTALL_KEY);
    if (!isFirstTime) {
      // It's the first time, show the alert
      AsyncStorage.setItem(FIRST_TIME_INSTALL_KEY, 'false');
      // Call the permission request function
      requestOverlayPermission();
    }
  } catch (err) {
    console.warn('Error checking first-time install:', err);
  }
}

function App() {
  useEffect(() => {
    checkFirstTimeInstall();
  }, []);

  return (
    <WebView
      source={{uri: 'http://bms.tracking.me/login'}}
      originWhitelist={['*']}
      style={{flex: 1}}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      useWebKit={true}
      mixedContentMode="always"
    />
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
    color: 'black',
  },
  button: {
    backgroundColor: '#4287f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default App;

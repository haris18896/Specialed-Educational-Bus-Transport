import React, {useEffect} from 'react';
import {Platform, Alert, Linking} from 'react-native';
import {WebView} from 'react-native-webview';
import * as Permissions from 'react-native-permissions';

async function requestOverlayPermission() {
  if (Platform.OS === 'android') {
    try {
      const permissionStatus = await Permissions.check('overlay');
      if (permissionStatus !== 'granted') {
        const rationale =
          'We need permission to display over other apps in order to provide a better user experience. Please grant the permission in the next prompt.';
        const permissionRequest = await Permissions.request('overlay', {
          rationale,
        });

        if (permissionRequest === 'granted') {
          console.log('Display over other apps permission granted');
        } else {
          console.log('Display over other apps permission denied');
          // Display an alert or perform additional actions if needed
          Alert.alert(
            'Permission Blocked',
            'Please grant the "Display over other apps" permission in the app settings. If you already have the permissions press "Cancel"',
            [
              {text: 'Cancel', style: 'cancel'},
              {text: 'Open Settings', onPress: () => Linking.openSettings()},
            ],
          );
        }
      } else {
        console.log('Display over other apps permission already granted');
      }
    } catch (err) {
      console.warn('Error checking permission:', err);
    }
  }
}

function App() {
  useEffect(() => {
    requestOverlayPermission();
  }, []);

  return (
    <WebView
      source={{uri: 'https://bms.tracking.me/login'}}
      originWhitelist={['*']}
      style={{flex: 1}}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      useWebKit={true}
      mixedContentMode="always"
    />
  );
}

export default App;

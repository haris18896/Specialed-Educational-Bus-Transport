import React, {useEffect} from 'react';
import {Platform} from 'react-native';
import {WebView} from 'react-native-webview';
import * as Permissions from 'react-native-permissions';

async function requestOverlayPermission() {
  if (Platform.OS === 'android') {
    try {
      const permissionStatus = await Permissions.check('overlay');
      if (permissionStatus === 'granted') {
        console.log('Display over other apps permission granted');
      } else {
        console.log('Display over other apps permission denied');
        // You can open the app settings to allow the permission
        Permissions.openSettings();
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

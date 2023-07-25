import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import {
  Platform,
  Alert,
  Text,
  Linking,
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const FIRST_TIME_INSTALL_KEY = 'first_time_install';

async function requestOverlayPermission() {
  if (Platform.OS === 'android') {
    try {
      const permissionStatus = await request(
        PERMISSIONS.ANDROID.SYSTEM_ALERT_WINDOW,
      );

      if (permissionStatus !== RESULTS.GRANTED) {
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

function Loader() {
  return (
    <View style={styles.loaderContainer}>
      <Image source={require('./assets/logo.png')} style={styles.loaderImage} />
      <ActivityIndicator
        style={{marginTop: 10}}
        size="large"
        color={'#00ABBE'}
      />
    </View>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    async function checkFirstTimeInstall() {
      try {
        const isFirstTimeInstall = await AsyncStorage.getItem(
          FIRST_TIME_INSTALL_KEY,
        );
        if (isFirstTimeInstall === null) {
          await AsyncStorage.setItem(FIRST_TIME_INSTALL_KEY, 'false');
          requestOverlayPermission();
        }
      } catch (error) {
        console.warn('Error checking first time install:', error);
      }
    }

    checkFirstTimeInstall();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const offline = !(state.isConnected && state.isInternetReachable);
      console.log('offline : ', offline);
      setIsConnected(offline);
    });

    const interval = setInterval(() => {
      unsubscribe();
    }, 10000);

    return () => {
      clearInterval(interval);
    };
  }, [isConnected]);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <>
      {!isConnected && isLoading && <Loader />}

      {!isConnected ? (
        <WebView
          source={{uri: 'http://bms.tracking.me/login'}}
          originWhitelist={['*']}
          style={{flex: 1}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          useWebKit={true}
          mixedContentMode="always"
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
        />
      ) : (
        <View style={styles.container}>
          <Text style={styles.offline}>
            Please connect to the Internet to continue
          </Text>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  offline: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  loaderImage: {
    width: 100,
    height: 100,
  },
  // ...
});

export default App;

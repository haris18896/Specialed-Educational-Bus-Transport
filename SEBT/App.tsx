import React, {useEffect, useState} from 'react';
import {
  Platform,
  Alert,
  Linking,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {WebView} from 'react-native-webview';
import * as Permissions from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FIRST_TIME_INSTALL_KEY = 'first_time_install';

async function requestOverlayPermission(firstTimeInstall) {
  if (Platform.OS === 'android') {
    try {
      const permissionStatus = await Permissions.check('overlay');
      if (permissionStatus !== 'granted') {
        console.log('permission is not granted');
        // if (!firstTimeInstall) {
        //   Alert.alert(
        //     'Permission Required',
        //     'Please enable the "Display over other apps" permission in the app settings to use this feature.',
        //     [
        //       {
        //         text: 'Cancel',
        //         style: 'cancel',
        //       },
        //       {
        //         text: 'Open Settings',
        //         onPress: () => Linking.openSettings(),
        //       },
        //     ],
        //   );
        // }
      }
    } catch (err) {
      console.warn('Error checking permission:', err);
    }
  }
}

async function isFirstTimeInstall() {
  try {
    const value = await AsyncStorage.getItem(FIRST_TIME_INSTALL_KEY);
    return value === null; // Check if the value is null (first-time install)
  } catch (err) {
    console.warn('Error checking installation status:', err);
    return true; // Treat any error as the first-time install
  }
}

async function setInstallationStatus(value) {
  try {
    await AsyncStorage.setItem(
      FIRST_TIME_INSTALL_KEY,
      value ? 'true' : 'false',
    );
  } catch (err) {
    console.warn('Error setting installation status:', err);
  }
}

function PermissionModal({onRequestPermission}) {
  return (
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>Permission Required</Text>
      <Text style={styles.modalText}>
        Please enable the "Display over other apps" permission in the app
        settings to use this feature.
      </Text>
      <TouchableOpacity style={styles.button} onPress={onRequestPermission}>
        <Text style={styles.buttonText}>Open Settings</Text>
      </TouchableOpacity>
    </View>
  );
}

function App() {
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  useEffect(() => {
    const checkPermission = async () => {
      const firstTimeInstall = await isFirstTimeInstall();
      if (firstTimeInstall) {
        setShowPermissionModal(true);
        await setInstallationStatus(false);
      } else {
        requestOverlayPermission(firstTimeInstall);
      }
    };

    checkPermission();
  }, []);

  const handlePermissionRequest = async () => {
    setShowPermissionModal(false);
    Linking.openSettings();
  };

  return (
    <>
      {showPermissionModal && (
        <PermissionModal onRequestPermission={handlePermissionRequest} />
      )}
      {!showPermissionModal && (
        <WebView
          source={{uri: 'http://bms.tracking.me/login'}}
          originWhitelist={['*']}
          style={{flex: 1}}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          useWebKit={true}
          mixedContentMode="always"
        />
      )}
    </>
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

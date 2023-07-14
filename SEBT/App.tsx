import React, {useState} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {WebView} from 'react-native-webview';

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const onMessage = event => {
    // Handle WebView messages here
    console.log('Received message from WebView:', event.nativeEvent.data);
  };

  return (
    <View style={styles.container}>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator color="white" />
        </View>
      )}
      <WebView
        source={{uri: 'http://bms.tracking.me/login'}}
        startInLoadingState={true}
        renderLoading={() => null}
        style={styles.webview}
        onLoad={() => {
          setIsLoading(false);
        }}
        onMessage={onMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  },
});

export default App;

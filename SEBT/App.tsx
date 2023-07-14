import React, {useRef} from 'react';

// ** webview
import {WebView} from 'react-native-webview';

function App() {
  const webviewRef = useRef(null);

  return (
    <WebView
      source={{uri: 'http://bms.tracking.me/login'}}
      originWhitelist={['*']}
      ref={webviewRef}
      javaScriptEnabled={true}
      onLoad={() => console.log('WebView loaded')}
      onError={error => console.log('WebView error:', error)}
    />
  );
}

export default App;

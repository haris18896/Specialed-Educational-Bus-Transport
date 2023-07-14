import React, {useRef} from 'react';

// ** webview
import {WebView} from 'react-native-webview';

function App() {
  const webviewRef = useRef(null);

  return (
    <WebView
      // source={{uri: 'http://bms.tracking.me/login'}}

      source={{uri: 'https://www.youtube.com/'}}
      originWhitelist={['*']}
      style={{width: '100%', height: '100%'}}
      ref={webviewRef}
      javaScriptEnabled={true}
      onLoad={() => console.log('WebView loaded')}
      onError={error => console.log('WebView error:', error)}
    />
  );
}

export default App;

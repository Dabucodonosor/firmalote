import { useRef } from 'react';
import { Alert, StatusBar as RNStatusBar, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import { Directory } from 'expo-file-system';
import html from './html';

// FirmaLote · © 2026 Alfredo Núñez. Todos los derechos reservados.
export default function App() {
  const ref = useRef(null);

  const onMessage = async (e) => {
    let m;
    try { m = JSON.parse(e.nativeEvent.data); } catch { return; }
    if (m.type !== 'save' || !Array.isArray(m.files)) return;
    try {
      const dir = await Directory.pickDirectoryAsync();
      let n = 0;
      for (const f of m.files) {
        const file = dir.createFile(f.name, 'application/pdf');
        file.write(f.b64, { encoding: 'base64' });
        n++;
      }
      Alert.alert('Listo', n + ' PDF firmado(s) guardado(s) en la carpeta que elegiste.');
    } catch (err) {
      Alert.alert('No se guardaron los archivos', 'Elige una carpeta e inténtalo de nuevo.');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#14203a', paddingTop: RNStatusBar.currentHeight || 0 }}>
      <StatusBar style="light" backgroundColor="#14203a" />
      <WebView
        ref={ref}
        originWhitelist={['*']}
        source={{ html, baseUrl: 'https://firmalote.app/' }}
        javaScriptEnabled
        domStorageEnabled
        allowFileAccess
        setSupportMultipleWindows={false}
        onMessage={onMessage}
        style={{ flex: 1 }}
      />
    </View>
  );
}

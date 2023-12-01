import { StyleSheet, Text, View } from 'react-native';

import * as AndroidAudioplayer from 'android-audioplayer';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{AndroidAudioplayer.hello()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

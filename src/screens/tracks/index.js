import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import { PreferencesContext } from '../../context/preferences';
import { Button, Text } from 'react-native-paper';
import { MusicContext } from '../../context/music';

const Tracks = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { playerControls } = useContext(MusicContext);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {playerControls && (
          <View>
            <Text>Player Controls</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button
                onPress={playerControls.close}
                uppercase={false}
                mode="outlined"
                style={{ alignSelf: 'flex-start' }}>
                Close
              </Button>
              <Button
                onPress={playerControls.expand}
                uppercase={false}
                mode="outlined"
                style={{ alignSelf: 'flex-start' }}>
                Expand
              </Button>
              <Button
                onPress={playerControls.collapse}
                uppercase={false}
                mode="outlined"
                style={{ alignSelf: 'flex-start' }}>
                Collapse
              </Button>
            </View>
          </View>
        )}

        {Array(50)
          .fill()
          .map((_, index) => (
            <View
              key={index}
              style={{
                backgroundColor: index % 2 ? 'lightblue' : 'lightgreen',
                padding: 10,
                marginBottom: 2,
              }}>
              <Text>Song {index + 1}</Text>
            </View>
          ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Tracks;

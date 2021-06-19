import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';

const Playlists = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text>Playlists screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default Playlists;

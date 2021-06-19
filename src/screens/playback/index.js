import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';

const Playback = ({ navigation }) => {
  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text>Playback screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Playback;

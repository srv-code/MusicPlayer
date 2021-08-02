import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';

// const Playback = ({ navigation }) => {
const Playback = () => {
  return <View style={{ flex: 1, backgroundColor: 'red' }} />;

  return (
    <ScreenContainer
      // onBackPress={navigation.goBack}
      showHeader
      title={screenNames.playback}
      subtitle="<Playback track info>">
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

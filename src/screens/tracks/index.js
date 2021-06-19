import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';

const Tracks = ({ navigation }) => {
  const onSearch = term => {
    console.log(`Searched ${term}`);
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.tracks}
      subtitle="Select from your favorite tracks"
      onSearch={onSearch}
      showMore>
      <View style={styles.container}>
        <Text>Tracks screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Tracks;

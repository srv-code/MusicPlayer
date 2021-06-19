import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';

const Playlists = ({ navigation }) => {
  const onSearch = term => {
    console.log(`Searched ${term}`);
  };

  return (
    <ScreenContainer
      headerInfo={{
        title: screenNames.playlists,
        subtitle: 'Select from your favorite playlists',
        onSearch,
        showMore: true,
      }}>
      <View style={styles.container}>
        <Text>Playlists screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Playlists;

import React, { useState } from 'react';
import { Alert, PermissionsAndroid, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { Button, Text } from 'react-native-paper';

// const Tracks = ({ navigation }) => {
const Tracks = () => {
  console.log('Tracks loaded');
  return <View style={{ flex: 1, backgroundColor: 'yellow' }} />;

  const [searchedTerm, setSearchedTerm] = useState('');

  const onSearchHandler = term => {
    setSearchedTerm(term);
    console.log(`Searched ${term}`);
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.tracks}
      subtitle="Select from your favorite tracks"
      searchPlaceholder="Search among all the tracks"
      searchedTerm={searchedTerm}
      onSearch={onSearchHandler}
      // onPressSettings={navigation.push.bind(this, screenNames.settings)}
    >
      <View style={styles.container}>
        <Text>Tracks screen</Text>
        <Button mode="outlined" uppercase={false}>
          getPermission()
        </Button>
        <Button mode="outlined" onPress={fetch}>
          Fetch tracks
        </Button>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Tracks;

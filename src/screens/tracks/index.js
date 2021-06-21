import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { Text } from 'react-native-paper';

const Tracks = ({ navigation }) => {
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
      onPressSettings={navigation.push.bind(this, screenNames.settings)}>
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

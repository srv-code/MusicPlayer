import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';

const Tracks = ({ navigation }) => {
  const [searchedTerm, setSearchedTerm] = useState('');

  const onSearchHandler = term => {
    setSearchedTerm(term);
    console.log(`Searched ${term}`);
  };

  return (
    <ScreenContainer
      showHeader
      headerColor={colors.darkBlue2}
      title={screenNames.tracks}
      subtitle="Select from your favorite tracks"
      searchedTerm={searchedTerm}
      onSearch={onSearchHandler}
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

import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';

const Playlists = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const onSearch = term => {
    console.log(`Searched ${term}`);
  };

  return (
    <ScreenContainer
      showHeader
      // headerColor={enabledDarkTheme ? null : colors.darkBlue}
      title={screenNames.playlists}
      subtitle="Select from your favorite playlists"
      onSearch={onSearch}
      showMore>
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

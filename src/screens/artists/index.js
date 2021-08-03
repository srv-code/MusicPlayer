import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';

// const Playlists = ({ navigation }) => {
const Artists = () => {
  return <View style={{ flex: 1, backgroundColor: 'cyan' }} />;

  const { enabledDarkTheme } = useContext(PreferencesContext);

  const onSearch = term => {
    console.log(`Searched ${term}`);
  };
  return (
    <ScreenContainer
      showHeader
      title={screenNames.playlists}
      subtitle="Select from your favorite playlists"
      onSearch={onSearch}
      // onPressSettings={navigation.push.bind(this, screenNames.settings)}
    >
      <View style={styles.container}>
        <Text>Artists screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Artists;

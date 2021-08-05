import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

// const Playlists = ({ navigation }) => {
const Favorites = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const [showSearch, setShowSearch] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchedTerm('');
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.playlists}
      subtitle="Select from your favorite playlists"
      actionIcons={[{ name: 'magnify', onPress: toggleSearch }]}>
      <View style={styles.container}>
        <Text>Favorites screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Favorites;

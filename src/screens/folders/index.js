import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';
import labels from "../../constants/labels";

// const Playlists = ({ navigation }) => {
const Folders = () => {
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
      subtitle={labels.playlistSubtitle}
      actionIcons={[
        {
          name: IconUtils.getInfo(keys.SEARCH).name.default,
          onPress: toggleSearch,
        },
      ]}>
      <View style={styles.container}>
        <Text>Folders screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Folders;

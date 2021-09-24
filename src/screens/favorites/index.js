import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import keys from '../../constants/keys';
import IconUtils from '../../utils/icon';
import labels from '../../constants/labels';
import { MusicContext } from '../../context/music';

// const Playlists = ({ navigation }) => {
const Favorites = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { musicInfo, setMusicInfo } = useContext(MusicContext);

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
        <Text>Favorites screen</Text>

        {musicInfo[keys.FAVORITE_IDS].map((id, index) => (
          <Text
            key={index}
            style={{
              backgroundColor: 'lightblue',
              marginVertical: hp(0.5),
            }}>
            {`[${id}] ${musicInfo[keys.TRACKS].find(t => t.id === id).title}`}
          </Text>
        ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Favorites;

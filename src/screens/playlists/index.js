import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';
import labels from '../../constants/labels';
import { MusicContext } from '../../context/music';
import PlaylistCover from '../../components/playlist-cover';

const Playlists = ({ navigation }) => {
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
        <Text>Playlists screen</Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            // alignContents: 'center',
          }}>
          {musicInfo?.[keys.PLAYLISTS].map((info, playlistIndex) => (
            <PlaylistCover
              key={playlistIndex}
              id={info.id}
              // style={{
              //   backgroundColor: 'lightblue',
              //   // marginVertical: hp(1)
              // }}
            />

            // <Text>ID: {info.id}</Text>
            // <Text>Name: {info.name}</Text>
            // <Text>Created On: {new Date(info.created).toString()}</Text>
            // <Text>
            //   Last Updated On: {new Date(info.last_updated).toString()}
            // </Text>
            // <Text>{`Tracks (${musicInfo[keys.TRACKS].length}):`}</Text>
            // {info.track_ids.map((id, trackIndex) => (
            //   <Text key={trackIndex}>
            //     {`  [${id}] ${
            //       musicInfo[keys.TRACKS].find(t => t.id === id).title
            //     }`}
            //   </Text>
            // ))}
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Playlists;

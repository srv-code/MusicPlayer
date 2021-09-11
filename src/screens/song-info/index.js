import React from 'react';
import screenNames from '../../constants/screen-names';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text } from 'react-native-paper';
import globalStyles from '../../styles';

const SongInfo = ({ navigation, extraData }) => {
  if (extraData.snapIndex === 0)
    navigation.navigate(screenNames.nowPlaying);

  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      <Text>{screenNames.songInfo}</Text>
      <Button
        mode="outlined"
        uppercase={false}
        style={globalStyles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentPlaylist)}>
        Go to Current Playlist
      </Button>
      <Button
        mode="outlined"
        uppercase={false}
        style={globalStyles.button}
        onPress={navigation.navigate.bind(this, screenNames.nowPlaying)}>
        Go to Currently Playing
      </Button>
      <Text>{extraData.snapIndex}</Text>
    </BottomSheetView>
  );
};

export default SongInfo;

import React from 'react';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text } from 'react-native-paper';
import screenNames from '../../constants/screen-names';
import globalStyles from '../../styles';
import Player from '../../components/player';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { ScrollView } from 'react-native';

const CurrentlyPlaying = ({ navigation, extraData }) => {
  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      <Text>{screenNames.currentlyPlaying}</Text>
      {extraData.snapIndex !== 0 && (
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={navigation.navigate.bind(this, screenNames.currentPlaylist)}>
          Go to Current Playlist
        </Button>
      )}
      <Text>{`sheetSnapIndex: ${extraData.snapIndex}`}</Text>

      <Player style={{ borderWidth: 1, marginTop: hp(1) }} />
    </BottomSheetView>
  );
};

export default CurrentlyPlaying;

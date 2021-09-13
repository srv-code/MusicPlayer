import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import screenNames from '../../constants/screen-names';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text } from 'react-native-paper';
import globalStyles from '../../styles';
import { Platform, TouchableOpacity, View } from 'react-native';
import Icon from '../../components/icon';
import labels from '../../constants/labels';

const CurrentPlaylist = ({ navigation, extraData }) => {
  const { snapIndex } = extraData;

  if (snapIndex < 2) navigation.navigate(screenNames.nowPlaying);

  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      {/* Header */}
      {/*{snapIndex === 2 && renderScreenHeader()}*/}

      <Text>{screenNames.currentPlaylist}</Text>
      <Button
        mode="outlined"
        uppercase={false}
        style={globalStyles.button}
        onPress={navigation.navigate.bind(this, screenNames.nowPlaying)}>
        Go to Currently Playing
      </Button>
      <Button
        mode="outlined"
        uppercase={false}
        style={globalStyles.button}
        onPress={navigation.navigate.bind(this, screenNames.songInfo)}>
        Go to Song Info
      </Button>
      <Text>{snapIndex}</Text>
    </BottomSheetView>
  );
};

export default CurrentPlaylist;

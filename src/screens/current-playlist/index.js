import React, { useEffect, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import screenNames from '../../constants/screen-names';
import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Button, Text, FAB, TextInput, Portal } from 'react-native-paper';
import globalStyles from '../../styles';
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from '../../components/icon';
import labels from '../../constants/labels';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import TrackPlayer from 'react-native-track-player';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';

const maxPlaylistNameLength = 25;

const CurrentPlaylist = ({ navigation, extraData: { snapIndex } }) => {
  if (snapIndex < 2) navigation.navigate(screenNames.nowPlaying);

  const [isFABOpened, setIsFABOpened] = useState(false);
  const [isFABVisible, setIsFABVisible] = useState(true);
  const [playlistName, setPlaylistName] = useState('');
  const [isPlaylistSaved, setIsPlaylistSaved] = useState(false);
  const [fabActions, setFABActions] = useState([]);
  const [isRenamingInProgress, setIsRenamingInProgress] = useState(true);
  const [tracks, setTracks] = useState([]);

  const isFocused = useIsFocused();

  useEffect(async () => {
    if (isFocused) {
      setTracks(await TrackPlayer.getQueue());
    }
  }, [isFocused]);

  useEffect(() => {
    const actions = [
      {
        icon: 'shuffle-variant',
        label: labels.shuffle,
        onPress: () => console.log('Pressed star'),
      },
      {
        icon: 'play',
        label: labels.play,
        onPress: () => console.log('Pressed email'),
      },
    ];

    if (!isPlaylistSaved)
      actions.push({
        icon: 'content-save',
        label: labels.save,
        onPress: onSavePlaylist,
        // small: false,
        color: colors.red,
      });

    setFABActions(actions);
  }, [isPlaylistSaved]);

  useEffect(() => {
    setIsFABVisible(isFocused);
  }, [isFocused]);

  const onSavePlaylist = () => {
    return undefined;
  };

  return (
    <BottomSheetScrollView
      bounces={true}
      focusHook={useFocusEffect}
      contentContainerStyle={{
        backgroundColor: 'lightgreen',
        // flex: 1,
        paddingHorizontal: wp(4),
        overflow: 'visible',
      }}>
      <TextInput
        // multiline
        mode="outlined"
        placeholder={labels.playlistName}
        label={labels.playlistName}
        value={playlistName}
        onChangeText={name => {
          if (name.length <= maxPlaylistNameLength) setPlaylistName(name);
        }}
        right={
          <TextInput.Affix
            text={`/${maxPlaylistNameLength - playlistName.length}`}
          />
        }
        left={<TextInput.Icon name={IconUtils.getInfo(keys.PLAYLIST_EDIT)} />}
      />
      <Text style={{ fontSize: wp(4) }}>{playlistName}</Text>
      {/*<View*/}
      {/*  style={{*/}
      {/*    // flex: 0.5,*/}
      {/*    borderWidth: 1,*/}
      {/*  }}>*/}
      {/*  <Text>{`all tracks=${tracks.length}`}</Text>*/}
      {/*  {tracks.map((track, index) => (*/}
      {/*    <Text*/}
      {/*      key={index}*/}
      {/*      style={{*/}
      {/*        backgroundColor: 'lightgrey',*/}
      {/*        marginVertical: hp(0.5),*/}
      {/*      }}>*/}
      {/*      {`[${index}] ${JSON.stringify(track)}`}*/}
      {/*    </Text>*/}
      {/*  ))}*/}
      {/*</View>*/}

      {/*<View>*/}
      {/*  {tracks.length === 0 ? (*/}
      {/*    <Text style={styles.noTracksText}>{labels.noTracksFound}</Text>*/}
      {/*  ) : (*/}
      {/*    <FlatList*/}
      {/*      contentContainerStyle={styles.musicList}*/}
      {/*      data={tracks}*/}
      {/*      keyExtractor={(_, index) => index.toString()}*/}
      {/*      renderItem={renderTrackItem}*/}
      {/*    />*/}
      {/*  )}*/}
      {/*</View>*/}

      <Portal>
        <FAB.Group
          visible={isFABVisible}
          open={isFABOpened}
          icon={
            IconUtils.getInfo(keys.ACTION).name[
              isFABOpened ? 'filled' : 'outlined'
            ]
          }
          actions={fabActions}
          onStateChange={state => {
            console.log(`[CurrentPlaylist] FAB state=${JSON.stringify(state)}`);
          }}
          onPress={setIsFABOpened.bind(this, val => !val)}
        />
      </Portal>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({});

export default CurrentPlaylist;

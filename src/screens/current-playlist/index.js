import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import screenNames from '../../constants/screen-names';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Text, FAB, TextInput, Portal, Snackbar } from 'react-native-paper';
import { StyleSheet, ToastAndroid } from 'react-native';
import labels from '../../constants/labels';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import colors from '../../constants/colors';
import TrackPlayer from 'react-native-track-player';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';
import { MusicContext } from '../../context/music';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackHandler } from '@react-native-community/hooks';
import Playlist from '../../components/playlist';

const maxPlaylistNameLength = 25;

// TODO Can reorder the tracks by dragging items
const CurrentPlaylist = ({ navigation, route, extraData: { snapIndex } }) => {
  const { musicInfo, setMusicInfo } = useContext(MusicContext);

  if (snapIndex < 2) navigation.navigate(screenNames.nowPlaying);

  const [isFABOpened, setIsFABOpened] = useState(false);
  const [isFABVisible, setIsFABVisible] = useState(true);
  const [playlistName, setPlaylistName] = useState('');
  // const [draggingTrackIndex, setDraggingTrackIndex] = useState(null);
  const [fabActions, setFABActions] = useState([]);
  const [isEditingPlaylistName, setIsEditingPlaylistName] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [snackbarError, setSnackbarError] = useState(null);
  const [playlistId, setPlaylistId] = useState(null);
  const playlistInput = useRef(null);
  const bottomScrollView = useRef(null);

  const isFocused = useIsFocused();

  useBackHandler(() => {
    if (isEditingPlaylistName) {
      setIsEditingPlaylistName(false);
      setPlaylistName('');
      return true;
    }
    return false;
  });

  useEffect(async () => {
    setIsFABVisible(isFocused);
    if (isFocused) setTracks(await TrackPlayer.getQueue());
  }, [isFocused]);

  useEffect(() => {
    if (route.params.playlistId) {
      setPlaylistId(route.params.playlistId);
      setPlaylistName(
        musicInfo[keys.PLAYLISTS].find(pl => pl.id === route.params.playlistId)
          .name,
      );
    }
  }, [route.params.playlistId]);

  useEffect(() => {
    const actions = [
      {
        icon: IconUtils.getInfo(keys.SHUFFLE).name.default,
        label: labels.shuffle,
        onPress: () => console.log('Pressed star'),
      },
      {
        icon: IconUtils.getInfo(keys.PLAY).name.default,
        label: labels.play,
        onPress: () => console.log('Pressed email'),
      },
    ];

    if (!playlistId)
      actions.push({
        icon: IconUtils.getInfo(keys.SAVE).name.default,
        label: labels.save,
        onPress: () => {
          setIsEditingPlaylistName(true);
          // playlistInput.current?.focus();
          console.log(
            `[Current-Playlist] playlistTextInput.current=${playlistInput.current}`,
          );
          // playlistTextInput.current.clear();
          setIsFABOpened(false);
        },
        // small: false,
        color: colors.red,
      });

    setFABActions(actions);
  }, [playlistId]);

  useEffect(() => {
    // console.log(
    //   `[Current-Playlist] focusing on playlist input... cond=${Boolean(
    //     isEditingPlaylistName && playlistInput.current,
    //   )}`,
    // );
    if (isEditingPlaylistName) {
      playlistInput.current?.focus();
    }
  }, [isEditingPlaylistName]);

  // console.log(`[Current-Playlist] playlistInput=${playlistInput.current}`);

  const onSavePlaylist = () => {
    console.log(
      `[Current-Playlist] playlists=${JSON.stringify(
        musicInfo[keys.PLAYLISTS],
      )}`,
    );

    const name = playlistName.trim();
    if (name === '') setSnackbarError(labels.emptyPlaylistName);
    else if (musicInfo[keys.PLAYLISTS].some(info => info.name === name))
      setSnackbarError(labels.sameNamePlaylist);
    else {
      const createdOn = new Date().getTime();
      const newPlaylists = [
        ...musicInfo[keys.PLAYLISTS],
        {
          id: createdOn,
          name,
          track_ids: tracks.map(t => t.id),
          created: createdOn,
          last_updated: new Date().getTime(),
        },
      ];
      AsyncStorage.setItem(keys.PLAYLISTS, JSON.stringify(newPlaylists))
        .then(() => {
          setMusicInfo(info => ({
            ...info,
            [keys.PLAYLISTS]: newPlaylists,
          }));
          setPlaylistId(createdOn);
          setIsEditingPlaylistName(false);
          setMusicInfo(data => ({
            ...data,
            currentlyPlaying: {
              ...data.currentlyPlaying,
              playlistId: createdOn,
            },
          }));
          ToastAndroid.show(labels.playlistSaved, ToastAndroid.SHORT);
        })
        .catch(err => {
          ToastAndroid.show(
            `${labels.couldntSavePlaylist}: ${err.message}`,
            ToastAndroid.LONG,
          );
          throw err;
        });
    }
  };

  console.log(`[Current-Playlist] musicInfo=${JSON.stringify(musicInfo)}`);

  // TODO Add a transparent background when dragging
  // const renderTrackItem = ({ item: track, index, drag, isActive }) => {
  //   return (
  //     <View
  //       style={{
  //         borderWidth: 1,
  //         borderColor: 'yellow',
  //         flexDirection: 'row',
  //         alignItems: 'center',
  //         backgroundColor: isActive ? 'red' : track.backgroundColor,
  //         // alignItems: 'center',
  //         justifyContent: 'space-between',
  //         height: hp(10),
  //         opacity: isActive ? 0.85 : 1,
  //       }}>
  //       <Text
  //         style={{
  //           marginVertical: hp(0.5),
  //           width: wp(80),
  //         }}>
  //         {`(${index + 1}/${tracks.length}) ID=${track.id}, title=${
  //           track.title
  //         }, isActive=${isActive}`}
  //       </Text>
  //       <TouchableOpacity
  //         style={{
  //           backgroundColor: 'blue',
  //           height: hp(10),
  //           width: wp(10),
  //         }}
  //         // onLongPress={() => {
  //         //   // setDraggingTrackIndex(index);
  //         //   drag();
  //         // }}
  //         onPress={() => {
  //           drag();
  //           setDraggingTrackIndex(index);
  //         }}>
  //         {/*<Icon name={'play'} />*/}
  //       </TouchableOpacity>
  //     </View>
  //   );
  // };

  return (
    <BottomSheetScrollView
      ref={bottomScrollView}
      // simultaneousHandlers={[bottomScrollView, draggableFlatList]}
      bounces={true}
      focusHook={useFocusEffect}
      contentContainerStyle={{
        backgroundColor: 'lightgreen',
        // flex: 1,
        paddingHorizontal: wp(4),
        overflow: 'visible',
      }}>
      {isEditingPlaylistName ? (
        <TextInput
          // // multiline
          // ref={_ref => {
          //   console.log(`djfjdsjfslsdlj `, _ref);
          // }}
          ref={playlistInput}
          dense
          autoFocus
          mode="outlined"
          placeholder={labels.playlistName}
          label={labels.playlistName}
          value={playlistName}
          onBlur={onSavePlaylist}
          onChangeText={name => {
            // console.log(`[Current-Playlist/onChangeText] text=${name}, ASCII=`);
            if (name.length <= maxPlaylistNameLength) setPlaylistName(name);
          }}
          right={
            <TextInput.Affix
              text={`/${maxPlaylistNameLength - playlistName.length}`}
            />
          }
          left={
            <TextInput.Icon
              name={IconUtils.getInfo(keys.PLAYLIST_EDIT).name.default}
            />
          }
        />
      ) : (
        <Text
          style={{
            fontSize: wp(5),
            textAlign: 'center',
            marginVertical: hp(1.5),
          }}>
          {playlistName || labels.untitledPlaylist}
        </Text>
      )}

      {/*<View*/}
      {/*  style={{*/}
      {/*    // flex: 0.5,*/}
      {/*    borderWidth: 1,*/}
      {/*  }}>*/}
      {/*  /!*<Text>{`Track Count: ${tracks.length}`}</Text>*!/*/}
      {/*  /!*{tracks.map((track, index) => (*!/*/}
      {/*  /!*  <Text*!/*/}
      {/*  /!*    key={index}*!/*/}
      {/*  /!*    style={{*!/*/}
      {/*  /!*      color:*!/*/}
      {/*  /!*        musicInfo.currentlyPlaying.track.id === track.id*!/*/}
      {/*  /!*          ? 'white'*!/*/}
      {/*  /!*          : 'black',*!/*/}
      {/*  /!*      backgroundColor:*!/*/}
      {/*  /!*        musicInfo.currentlyPlaying.track.id === track.id*!/*/}
      {/*  /!*          ? 'blue'*!/*/}
      {/*  /!*          : 'lightgrey',*!/*/}
      {/*  /!*      marginVertical: hp(0.5),*!/*/}

      {/*  /!*    }}>*!/*/}
      {/*  /!*    {`[${index}] ${*!/*/}
      {/*  /!*      musicInfo.currentlyPlaying.track.id === track.id ? '->' : ''*!/*/}
      {/*  /!*    } ${JSON.stringify(track.title)}`}*!/*/}
      {/*  /!*  </Text>*!/*/}
      {/*  /!*))}*!/*/}

      {/*  <DraggableFlatList*/}
      {/*    // onRef={ref => (draggableFlatList.current = ref)}*/}
      {/*    // simultaneousHandlers={[bottomScrollView, draggableFlatList]}*/}
      {/*    simultaneousHandlers={bottomScrollView}*/}
      {/*    data={tracks}*/}
      {/*    // dragItemOverflow={false}*/}
      {/*    keyExtractor={(_, index) => index.toString()}*/}
      {/*    renderItem={renderTrackItem}*/}
      {/*    renderPlaceholder={({ item, index }) => (*/}
      {/*      <View style={{ backgroundColor: 'yellow' }}>*/}
      {/*        <Text>{`${index} ${JSON.stringify(item)}`}</Text>*/}
      {/*      </View>*/}
      {/*    )}*/}
      {/*    // onDragBegin={setDraggingTrackIndex}*/}
      {/*    onDragEnd={({ data, from, to }) => {*/}
      {/*      console.log(`[Current-Playlist] drag end, from=${from}, to=${to}`);*/}
      {/*      setTracks(data);*/}
      {/*      setDraggingTrackIndex(null);*/}
      {/*    }}*/}
      {/*    // dragHitSlop={-200}*/}
      {/*    dragHitSlop={*/}
      {/*      // 1 ? { right: -(width * 0.95 - 20) } : { right: -width }*/}
      {/*      draggingTrackIndex === null ? -200 : 0*/}
      {/*    }*/}
      {/*  />*/}
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

      <Playlist
        tracks={tracks}
        setTracks={setTracks}
        simultaneousHandlers={bottomScrollView}
      />

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

        <Snackbar
          visible={Boolean(snackbarError)}
          onDismiss={setSnackbarError.bind(this, null)}
          duration={4000}
          action={{
            label: labels.dismiss,
            onPress: setSnackbarError.bind(this, null),
          }}>
          {snackbarError}
        </Snackbar>
      </Portal>
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({});

export default CurrentPlaylist;

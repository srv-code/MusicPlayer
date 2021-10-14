import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Avatar,
  Divider,
  FAB,
  IconButton,
  List,
  Menu,
  Portal,
  Snackbar,
  Text,
  TextInput,
} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { width } from '../../constants/dimensions';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from '../icon';
import labels from '../../constants/labels';
import colors from '../../constants/colors';
import PlayerUtils from '../../utils/player';
import { PreferencesContext } from '../../context/preferences';
import { MusicContext } from '../../context/music';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBackHandler } from '@react-native-community/hooks';
import { useIsFocused } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import screenNames from '../../constants/screen-names';
import { displayModes as ItemInfoDisplayModes } from '../../screens/item-info';

const rearrangeActions = {
  MOVE_UP: 'MOVE_UP',
  MOVE_TO_FIRST: 'MOVE_TO_FIRST',
  MOVE_DOWN: 'MOVE_DOWN',
  MOVE_TO_LAST: 'MOVE_TO_LAST',
};

const snackbarMessageType = {
  TRACK_REMOVED: 'TRACK_REMOVED',
  ERROR_MESSAGE: 'ERROR_MESSAGE',
};

const MAX_PLAYLIST_NAME_LENGTH = 25;

// FIXME [Algorithm #1] for saving the playlist:
//  - hasUnsavedChanges hook initially set to false
//  - Actions: renaming, tracks re-ordering/removing
//  - Also can re-order/remove from an unsaved playlist for which hasUnsavedChanges will be false
//  - Re-ordering/removing tracks should also affect the tracks being played immediately (without crashing)
//    - If there's no track after the current one will stop playing (or follow the repeat-mode if specified)
//  - In initial load (useEffect with dep: id): if (id) setHasUnsavedChanges(true)
//  - When tracks are reordered/removed: ??
//  - When renaming but cancelled in between: using back-button / minimizing (resulting in navigating to now-playing screen): ??
//  - When name is changed but not saved: ??

// FIXME [Algorithm #1/Solution]
//  - Add a hook: id (initially update with _id)
//  - Inside useBackHandler() saved only if id is non-null
//  - When track is re-ordered/removed or playlist name is updated,
//      hasUnsavedChanges will be updated to true if not already set
//  - When track is re-ordered/removed,
//      if the playlist being modified is the current one then the current TrackPlayer queue
//      will be updated (take care so that the current playing track should not start
//      from beginning, silently make the update),
//       if the current track is removed then play the next one,
//          if there's no next track then stop playing
//  - While renaming playlist,
//      if the process is cancelled then the previous state is restored
//        (if saved then keep the previous name else keep it unsaved)

// TODO [Complete]
//  - [LATER] Long press to select many tracks to re-order or delete them
//  - Replace the test hardcoded colors with the ones from colors object
//  - Restructure all the playlist related functionalities here (from current-playlist screen & playlists)
//  - Implement all pending props, update code as per the new set of props
//  - Implement the show info button press logic
//  - Implement the prop disabled

// FIXME [Bugs]
//  - When selecting a song from this component and pressing on the nav back button
//      then bottom sheet is showing unexpected behaviour

// TODO [Test]
//  - Play sequence in current & other playlists
//  - If all the unsaved changes are saved when required and also if its handled properly
//      when the current playlist is from tracks (unsaved & untitled)

const Playlist = ({ style, id: _id, disabled, showItemInfo }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { musicInfo, setMusicInfo } = useContext(MusicContext);
  const { playerControls } = useContext(MusicContext);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [id, setID] = useState(null);
  const [name, setName] = useState('');
  const [tracks, setTracks] = useState([]);
  const [isFABOpened, setIsFABOpened] = useState(false);
  const [isFABVisible, setIsFABVisible] = useState(true);
  const [isEditingPlaylistName, setIsEditingPlaylistName] = useState(false);
  const [lastTrackRemoved, setLastTrackRemoved] = useState(null);
  const [rowTranslateAnimatedValues, setRowTranslateAnimatedValues] = useState(
    [],
  );
  const [currentActions, setCurrentActions] = useState(null);
  const [currentlyPlayingTrackId, setCurrentlyPlayingTrackId] = useState(null);
  const [showMoreOptionForTrackId, setShowMoreOptionForTrackId] =
    useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  // const [info, setInfo] = useState(null);
  const list = useRef(null);
  const playlistInput = useRef(null);
  const originalName = useRef(null);

  const isFocused = useIsFocused();
  let animationIsRunning = false;

  // useBackHandler(() => {
  //   if (isEditingPlaylistName)
  //     if (id && hasUnsavedChanges)
  //       // return true;
  //       // if (isEditingPlaylistName)
  //       //   getValidName()
  //       //     .then(result => {
  //       //       setName(result);
  //       //       setIsEditingPlaylistName(false);
  //       //       setHasUnsavedChanges(true);
  //       //       savePlaylist();
  //       //       return false;
  //       //     })
  //       //     .catch(error => {
  //       //       setSnackbarMessage({
  //       //         type: snackbarMessageType.ERROR_MESSAGE,
  //       //         info: error,
  //       //       });
  //       //       playlistInput.current?.focus();
  //       //       return true;
  //       //     });
  //
  //       savePlaylist();
  //   return false;
  // });

  const _setCurrentlyPlayingTrackId = playlistId => {
    if (playlistId === musicInfo.currentlyPlaying?.playlistId)
      setCurrentlyPlayingTrackId(musicInfo.currentlyPlaying.track.id);
  };

  useEffect(async () => {
    console.log(
      `[Playlist/useEffect] isFocused=${isFocused}, _id=${JSON.stringify(_id)}`,
    );

    if (isFocused) {
      setID(_id);
      const _info = _id && musicInfo[keys.PLAYLISTS].find(pl => pl.id === _id);

      console.log(
        `[Playlist/useEffect] setting playlist info... _id=${_id}, _info=${JSON.stringify(
          _info,
        )}`,
      );

      /* Set currently playing track ID from this playlist */
      // FIXME Check if this is required as another useEffect is added with musicInfo.currentlyPlaying as a dep
      _setCurrentlyPlayingTrackId(_id);

      /* Update tracks */
      let _tracks;
      if (_id)
        _tracks = _info.track_ids.map(id =>
          musicInfo?.[keys.TRACKS].find(t => t.id === id),
        );
      else _tracks = await TrackPlayer.getQueue();

      setTracks(_tracks);

      /* Update playlist name */
      if (_info) {
        setName(_info.name);
        originalName.current = _info.name;
      }

      /* Update rowTranslateAnimatedValues */
      if (_tracks.length && !Object.keys(rowTranslateAnimatedValues).length) {
        console.log(
          `[Playlist/useEffect] tracks.length=$_{tracks.length}, keys=${
            Object.keys(rowTranslateAnimatedValues).length
          }`,
        );

        const animValues = {};
        _tracks.forEach(track => {
          animValues[track.id] = {
            removal: new Animated.Value(1),
            expansion: new Animated.Value(0),
          };
          track.key = track.id;
        });

        // for (const e in animValues) {
        //   console.log(
        //     `[Playlist/useEffect] ${e}=${JSON.stringify(
        //       animValues[e].expansion,
        //     )}`,
        //   );
        // }

        setRowTranslateAnimatedValues(animValues);
      }
    } else {
      // console.log(
      //   `originalName.current=${JSON.stringify(originalName)}/${
      //     originalName.current
      //   }`,
      // );

      /* restore original name */
      if (isEditingPlaylistName) {
        setName(originalName.current);
        setIsEditingPlaylistName(false);
      }

      if (name !== '' && hasUnsavedChanges)
        save()
          .then(data => {
            ToastAndroid.show(
              data.created ? labels.playlistCreated : labels.playlistUpdated,
              ToastAndroid.SHORT,
            );
          })
          .catch(err => {
            ToastAndroid.show(
              `${labels.couldntSavePlaylist}: ${err.message}`,
              ToastAndroid.LONG,
            );
            throw err;
          });
    }

    setIsFABVisible(isFocused);
  }, [isFocused]);

  useEffect(() => {
    // FIXME Check if this function is called when this component is first initialised
    //    and the track is still not changed
    _setCurrentlyPlayingTrackId(id);
  }, [musicInfo.currentlyPlaying]);

  // useEffect(() => {
  //   /* Update action menu */
  //   const actions = [
  //     {
  //       icon: IconUtils.getInfo(keys.SHUFFLE).name.default,
  //       label: labels.shuffle,
  //       onPress: () => console.log('Pressed star'),
  //     },
  //     {
  //       icon: IconUtils.getInfo(keys.PLAY).name.default,
  //       label: labels.play,
  //       onPress: () => console.log('Pressed email'),
  //     },
  //     {
  //       icon: IconUtils.getInfo(keys[id ? 'PLAYLIST_EDIT' : 'SAVE']).name
  //         .default,
  //       label: labels[id ? 'rename' : 'save'],
  //       onPress: () => {
  //         setIsEditingPlaylistName(true);
  //         playlistInput.current?.focus();
  //         // console.log(
  //         //   `[Current-Playlist] playlistTextInput.current=${playlistInput.current}`,
  //         // );
  //         // playlistInput.current.clear();
  //         setIsFABOpened(false);
  //       },
  //       // small: false,
  //       color: id ? null : colors.red,
  //     },
  //   ];
  //
  //   // if (!_id)
  //   //   actions.push();
  //
  //   setFABActions(actions);
  // }, [id]);

  // useEffect(() => {
  //   // console.log(
  //   //   `[Current-Playlist] focusing on playlist input... cond=${Boolean(
  //   //     isEditingPlaylistName && playlistInput.current,
  //   //   )}`,
  //   // );
  //   if (isEditingPlaylistName) playlistInput.current?.focus();
  // }, [isEditingPlaylistName]);

  // console.log(
  //   `rowTranslateAnimatedValues=${JSON.stringify(rowTranslateAnimatedValues)}`,
  // );

  const getValidName = () =>
    new Promise((resolve, reject) => {
      const newName = name.trim();
      if (newName === '') reject(labels.emptyPlaylistName);
      if (musicInfo[keys.PLAYLISTS].some(info => info.name === newName))
        reject(labels.sameNamePlaylist);
      resolve(newName);
    });

  // TODO Update with the newer scheme
  const save = async () => {
    console.log(
      `[Playlist/savePlaylist] isFocused=${isFocused}, hasUnsavedChanges=${hasUnsavedChanges}, id=${id}, name=${name}, tracks=${tracks.map(
        t => t.title,
      )}`,
    );

    // console.log(
    //   `[Current-Playlist] playlists=${JSON.stringify(
    //     musicInfo[keys.PLAYLISTS],
    //   )}`,
    // );

    const _name = await getValidName();
    let isCreating;
    let createdOn, newPlaylists, currentPlaylist;

    if (id) {
      /* Updating playlist */
      isCreating = false;
      newPlaylists = [...musicInfo[keys.PLAYLISTS]];
      currentPlaylist = newPlaylists.find(x => x.id === id);
      currentPlaylist.name = _name;
      currentPlaylist.track_ids = tracks.map(t => t.id);
      currentPlaylist.last_updated = new Date().getTime();
    } else {
      /* Creating playlist */
      isCreating = true;
      createdOn = new Date().getTime();
      currentPlaylist = {
        id: createdOn,
        name: _name,
        track_ids: tracks.map(t => t.id),
        created: createdOn,
        last_updated: new Date().getTime(),
      };
      newPlaylists = [...musicInfo[keys.PLAYLISTS], currentPlaylist];
    }

    console.log(
      `[Playlist/useEffect] should write playlist data: ${JSON.stringify(
        newPlaylists,
      )}, _name=${_name}`,
    );

    await AsyncStorage.setItem(keys.PLAYLISTS, JSON.stringify(newPlaylists));
    setMusicInfo(info => ({
      ...info,
      [keys.PLAYLISTS]: newPlaylists,
    }));

    if (isCreating) {
      setID(createdOn);
      setMusicInfo(data => ({
        ...data,
        currentlyPlaying: {
          ...data.currentlyPlaying,
          playlistId: createdOn,
        },
      }));
    }
    setHasUnsavedChanges(false);

    console.log(
      `[Playlist/savePlaylist()] isCreating=${isCreating}, currentPlaylist=${JSON.stringify(
        currentPlaylist,
      )}`,
    );
    return { created: isCreating, info: currentPlaylist };
  };

  const rearrange = (item, fromIndex, action) => {
    const getScrollValue = index => hp(8) * (index - 3); /* 3 items spacing */

    let toIndex, scrollX, scrollY;
    switch (action) {
      case rearrangeActions.MOVE_UP:
      case rearrangeActions.MOVE_TO_FIRST:
        if (fromIndex <= 0)
          throw new Error(
            `Invalid move operation: action: ${action}, fromIndex=${fromIndex}`,
          );
        toIndex = action === rearrangeActions.MOVE_TO_FIRST ? 0 : fromIndex - 1;
        scrollX = getScrollValue(toIndex);
        scrollY = 0;
        break;

      case rearrangeActions.MOVE_DOWN:
      case rearrangeActions.MOVE_TO_LAST:
        if (fromIndex >= tracks.length - 1)
          throw new Error(
            `Invalid move operation: action: ${action}, fromIndex=${fromIndex}`,
          );
        toIndex =
          action === rearrangeActions.MOVE_TO_LAST
            ? tracks.length - 1
            : fromIndex + 1;
        scrollX = 0;
        scrollY = getScrollValue(toIndex);
        break;

      default:
        throw new Error(`Invalid action: ${action}`);
    }

    const _tracks = [...tracks];
    const tmp = _tracks[fromIndex];
    _tracks[fromIndex] = _tracks[toIndex];
    _tracks[toIndex] = tmp;
    setTracks(_tracks);

    list.current._listRef._scrollRef.scrollTo({
      x: scrollX,
      y: scrollY,
      animated: true,
    });

    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;

    if (
      value < 0 &&
      (!currentActions?.hasOwnProperty(key) ||
        currentActions[key] !== 'removing')
    )
      setCurrentActions(prev => ({ ...prev, [key]: 'removing' }));
    else if (value === 0 && currentActions) setCurrentActions(null);
    else if (
      value > 0 &&
      (!currentActions?.hasOwnProperty(key) || currentActions[key] !== 'moving')
    )
      setCurrentActions(prev => ({ ...prev, [key]: 'moving' }));

    if (value < -width && !animationIsRunning) {
      animationIsRunning = true;
      Animated.timing(rowTranslateAnimatedValues[key].removal, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const removeIndex = tracks.findIndex(track => track.key === key);
        setLastTrackRemoved({ index: removeIndex, item: tracks[removeIndex] });
        setSnackbarMessage({ type: snackbarMessageType.TRACK_REMOVED });
        const newList = [...tracks];
        newList.splice(removeIndex, 1);
        setTracks(newList);
        setCurrentActions(null);
        if (!hasUnsavedChanges) setHasUnsavedChanges(true);
        animationIsRunning = false;
      });
    }
  };

  const animateOptionsMenu = ({
    shouldCollapse,
    currentKey,
    otherKeyToCollapse,
  }) => {
    if (!animationIsRunning) {
      animationIsRunning = true;
      Animated.parallel([
        Animated.timing(rowTranslateAnimatedValues[currentKey].expansion, {
          toValue: shouldCollapse ? 0 : 1,
          duration: 400,
          useNativeDriver: false,
        }),
        otherKeyToCollapse &&
          Animated.timing(
            rowTranslateAnimatedValues[otherKeyToCollapse].expansion,
            {
              toValue: 0,
              duration: 400,
              useNativeDriver: false,
            },
          ),
      ]).start(() => {
        setShowMoreOptionForTrackId(shouldCollapse ? null : currentKey);
        animationIsRunning = false;
      });
    }
  };

  const renderItem = data => {
    const onPress = () => {
      PlayerUtils.playTracks(tracks, data.index)
        .then(() => {
          playerControls.collapse();
          ToastAndroid.show(
            `${labels.playingFromPlaylist} ${name}`,
            ToastAndroid.SHORT,
          );
        })
        .catch(err => {
          ToastAndroid.show(
            `${labels.couldntPlayTracks} (${err.message}}`,
            ToastAndroid.LONG,
          );
          throw err;
        });
    };

    const renderDescription = () => (
      <View style={styles.trackDescText}>
        <Icon
          name={IconUtils.getInfo(keys.ARTISTS).name.outlined}
          type={IconUtils.getInfo(keys.ARTISTS).type}
          size={wp(3.5)}
          color={colors.lightGrey}
        />
        <Text numberOfLines={1} style={styles.trackSubtitleText}>
          {data.item.artist}
          {/*{Object.keys(data.item)}*/}
        </Text>
      </View>
    );

    const renderLeftComponent = props => {
      if (data.item.artwork)
        return (
          <Avatar.Image
            size={hp(6)}
            source={{ uri: `file://${data.item.artwork}` }}
          />
        );
      return <Avatar.Icon size={hp(6)} icon="music" style={styles.musicIcon} />;
    };

    const renderRightComponent = props => {
      return (
        <IconButton
          {...props}
          color={
            showMoreOptionForTrackId === data.item.key ? 'blue' : props.color
          }
          icon={IconUtils.getInfo(keys.VERTICAL_ELLIPSIS).name.default}
          onPress={() => {
            if (!showMoreOptionForTrackId) {
              animateOptionsMenu({ currentKey: data.item.key });
            } else {
              if (showMoreOptionForTrackId !== data.item.key) {
                animateOptionsMenu({
                  currentKey: data.item.key,
                  otherKeyToCollapse: showMoreOptionForTrackId,
                });
              } else {
                animateOptionsMenu({
                  shouldCollapse: true,
                  currentKey: data.item.key,
                });
              }
            }
          }}
        />
      );
    };

    // FIXME Not working
    const renderDivider = () => {
      if (data.index === tracks.length - 1) {
        return <View style={styles.listItemEndSmallBar} />;
      } else {
        if (currentlyPlayingTrackId) {
          const playingIndex = tracks.findIndex(
            t => t.id === currentlyPlayingTrackId,
          );
          if (playingIndex === -1)
            throw new Error(`Could not find playing track index`);
          if (data.index === playingIndex - 1 || data.index === playingIndex)
            return null;
          else return <Divider inset />;
        } else return <Divider inset />;
      }
    };

    return (
      <View
        style={{
          backgroundColor: 'white',
        }}>
        <Animated.View
          style={{
            ...styles.rowFrontContainer,
            height: rowTranslateAnimatedValues[
              data.item.key
            ]?.removal.interpolate({
              inputRange: [0, 1],
              outputRange: [0, hp(8)],
            }),

            // opacity: 0.3,
            borderRadius: currentlyPlayingTrackId === data.item.id ? wp(2) : 0,
            // backgroundColor: // FIXME Integrate this coloring scheme too when removal animation is not in progress
            //   currentlyPlayingTrackId === data.item.id
            //     ? enabledDarkTheme
            //       ? colors.darker
            //       : colors.lighter
            //     : enabledDarkTheme
            //     ? colors.dark
            //     : colors.light,

            backgroundColor:
              rowTranslateAnimatedValues[data.item.key]?.removal?.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: ['blue', '#0080ff', 'white'],
              }) ?? hp(8),

            elevation: currentlyPlayingTrackId === data.item.id ? 2 : 0,
          }}>
          <List.Item
            style={styles.trackItemContainer}
            onPress={onPress}
            titleEllipsizeMode={'tail'}
            titleNumberOfLines={1}
            titleStyle={styles.listItemText}
            // title={`[${data.item.id}] ${data.item.title}`}
            title={data.item.title}
            descriptionEllipsizeMode={'tail'}
            descriptionNumberOfLines={1}
            description={renderDescription}
            left={renderLeftComponent}
            right={renderRightComponent}
          />

          {renderDivider()}
        </Animated.View>

        <Animated.View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: wp(88),
            paddingHorizontal: wp(4),
            borderBottomStartRadius: 10,
            borderBottomEndRadius: 10,
            height: rowTranslateAnimatedValues[
              data.item.key
            ]?.expansion.interpolate({
              inputRange: [0, 1],
              outputRange: [0, hp(11)],
            }),
            backgroundColor: rowTranslateAnimatedValues[
              data.item.key
            ]?.expansion.interpolate({
              inputRange: [0, 1],
              outputRange: ['blue', 'lightgreen'],
            }),
            opacity: rowTranslateAnimatedValues[
              data.item.key
            ]?.expansion.interpolate({
              inputRange: [0, 0.7, 1],
              outputRange: [0, 0.1, 1],
            }),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'center',
              flexWrap: 'wrap',
              justifyContent: 'space-around',
            }}>
            {[
              {
                title: labels.playNext,
                iconName: IconUtils.getInfo(keys.SKIP_NEXT).name.default,
                onPress: () => {
                  // alert(JSON.stringify(props));
                  setShowMoreOptionForTrackId(null);
                },
              },

              {
                title: labels.addToPlaylist,
                iconName: IconUtils.getInfo(keys.ADD_TO_PLAYLIST).name.default,
                onPress: () => {
                  // alert(JSON.stringify(props));
                  setShowMoreOptionForTrackId(null);
                },
              },

              {
                title: labels.addToQueue,
                iconName: IconUtils.getInfo(keys.ADD_TO_QUEUE).name.default,
                onPress: () => {
                  // alert(JSON.stringify(props));
                  setShowMoreOptionForTrackId(null);
                },
              },

              {
                title: labels.showInfo,
                iconName: IconUtils.getInfo(keys.INFO).name.filled,
                onPress: () => {
                  setShowMoreOptionForTrackId(null);
                  showItemInfo({
                    type: keys.TRACKS,
                    data: data.item,
                  });
                  // console.log(`navigator=${navigator}`);
                  // if (navigator)
                  //   navigator.navigate(screenNames.itemInfo, {
                  //     type: keys.TRACKS,
                  //     displayMode: ItemInfoDisplayModes.SCREEN,
                  //     data: {},
                  //   });
                },
              },
            ].map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={option.onPress}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: hp(0.5),
                  paddingRight: wp(2),
                  borderWidth: 1,
                  borderColor: colors.lightGrey,
                  borderRadius: 50,
                }}>
                <Icon
                  name={option.iconName}
                  size={wp(5)}
                  color={colors.white}
                  style={{
                    marginRight: wp(2),
                    padding: wp(1),
                    backgroundColor: colors.lightGrey,
                    borderRadius: 50,
                  }}
                />
                <Text
                  style={{
                    fontSize: wp(3.5),
                    color: colors.lightGrey,
                    alignItems: 'center',
                  }}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </View>
    );
  };

  const renderHiddenItem = rowData => {
    let showMove = true,
      showRemove = true;
    if (currentActions?.hasOwnProperty(rowData.item.key)) {
      showMove = currentActions[rowData.item.key] === 'moving';
      showRemove = currentActions[rowData.item.key] === 'removing';
    }

    return (
      <View
        style={{
          ...styles.rowBack,
          backgroundColor: showMove ? 'blue' : showRemove ? 'red' : 'grey',
          borderRadius:
            currentlyPlayingTrackId === rowData.item.key ? wp(2) : 0,
        }}>
        {showMove && (
          <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                backgroundColor: 'blue',
                height: hp(8),
                width: '100%',
              }}>
              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginRight: wp(2),
                }}>
                <TouchableOpacity
                  disabled={!rowData.index}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rowData.index,
                    rearrangeActions.MOVE_UP,
                  )}>
                  <Icon name="angle-up" type="FontAwesome5" size={wp(5)} />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={rowData.index === tracks.length - 1}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rowData.index,
                    rearrangeActions.MOVE_DOWN,
                  )}>
                  <Icon name="angle-down" type="FontAwesome5" size={wp(5)} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginRight: wp(2),
                }}>
                <TouchableOpacity
                  disabled={!rowData.index}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rowData.index,
                    rearrangeActions.MOVE_TO_FIRST,
                  )}>
                  <Icon
                    name="first-page"
                    type="MaterialIcons"
                    size={wp(6)}
                    style={{
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={rowData.index === tracks.length - 1}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rowData.index,
                    rearrangeActions.MOVE_TO_LAST,
                  )}>
                  <Icon
                    name="last-page"
                    type="MaterialIcons"
                    size={wp(6)}
                    style={{
                      // fontWeight: 'bold',
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  marginLeft: wp(2),
                  alignSelf: 'center',
                }}>
                {labels.move}
              </Text>
            </View>
          </View>
        )}

        {showRemove && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'red',
              justifyContent: 'flex-end',
              // height: '100%',
              height: hp(8),
              width: '100%',
              paddingRight: wp(2),
            }}>
            <Text>{labels.remove}</Text>
            <Icon
              name="ios-remove-circle"
              type="Ionicons"
              size={wp(5)}
              style={{ marginLeft: wp(1) }}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <>
      <View style={[styles.container, style]}>
        {/* [Component] Name Input/Label */}
        {isEditingPlaylistName ? (
          <View
            style={{
              marginBottom: hp(1),
            }}>
            <TextInput
              // // multiline
              // ref={_ref => {
              //   console.log(`djfjdsjfslsdlj `, _ref);
              // }}
              style={{
                width: wp(85),
              }}
              ref={playlistInput}
              dense
              autoFocus
              mode="outlined"
              placeholder={labels.playlistName}
              label={labels.playlistName}
              value={name}
              // onBlur={savePlaylist}
              onBlur={() => {
                getValidName()
                  .then(result => {
                    setName(result);
                    setIsEditingPlaylistName(false);
                    setHasUnsavedChanges(true);
                  })
                  .catch(error => {
                    setSnackbarMessage({
                      type: snackbarMessageType.ERROR_MESSAGE,
                      info: error,
                    });
                    playlistInput.current?.focus();
                  });
              }}
              onChangeText={text => {
                // console.log(`[Current-Playlist/onChangeText] text=${text}, ASCII=`);
                if (text.length <= MAX_PLAYLIST_NAME_LENGTH) setName(text);
              }}
              right={
                <TextInput.Affix
                  text={`/${MAX_PLAYLIST_NAME_LENGTH - name.length}`}
                />
              }
              left={
                <TextInput.Icon
                  name={IconUtils.getInfo(keys.PLAYLIST_EDIT).name.default}
                />
              }
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              // alignContent: 'center',
              justifyContent: 'center',
              width: wp(90),
              // backgroundColor: 'lightblue',
            }}>
            <TouchableOpacity
              style={{
                marginVertical: hp(1.5),
                // alignSelf: 'center',
              }}
              onPress={() => {
                setIsEditingPlaylistName(true);
                playlistInput.current?.focus();
              }}>
              <Text
                style={{
                  fontSize: wp(5),
                  textAlign: 'center',
                }}>
                {name || labels.untitledPlaylist}
              </Text>
            </TouchableOpacity>

            {/* TODO Complete */}
            {Boolean(name) && (
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 0,
                }}
                onPress={() => {
                  if (hasUnsavedChanges)
                    save()
                      .then(data => {
                        ToastAndroid.show(
                          data.created
                            ? labels.playlistCreated
                            : labels.playlistUpdated,
                          ToastAndroid.SHORT,
                        );

                        showItemInfo({ type: keys.PLAYLISTS, data: data.info });
                      })
                      .catch(err => {
                        ToastAndroid.show(
                          `${labels.couldntSavePlaylist}: ${err.message}`,
                          ToastAndroid.LONG,
                        );
                        throw err;
                      });
                  else
                    showItemInfo({
                      type: keys.PLAYLISTS,
                      data: musicInfo[keys.PLAYLISTS].find(x => x.id === id),
                    });
                }}>
                <Icon
                  type={IconUtils.getInfo(keys.INFO).type}
                  name={IconUtils.getInfo(keys.INFO).name.outlined}
                  size={wp(5.5)}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* [Component] Track List */}
        <View
          style={{
            // borderWidth: 1,
            borderRadius: 10,
            overflow: 'hidden',
            // backgroundColor: 'green',
            // marginBottom: hp(1),
          }}>
          <SwipeListView
            listViewRef={list}
            data={tracks}
            renderItem={renderItem}
            renderHiddenItem={renderHiddenItem}
            leftOpenValue={wp(30)}
            stopLeftSwipe={wp(30)}
            rightOpenValue={-width}
            previewRowKey={tracks[0]?.key}
            previewOpenValue={-wp(10)}
            previewOpenDelay={500}
            onSwipeValueChange={onSwipeValueChange}
            closeOnRowBeginSwipe={true}
            closeOnScroll={false}
            useNativeDriver={false}
            useAnimatedList={true}
          />
        </View>
      </View>

      {/* [Component] Message Box */}
      <Snackbar
        visible={Boolean(snackbarMessage)}
        // visible={Boolean(lastTrackRemoved)}
        duration={2000}
        style={{
          opacity: 0.7,
          // snackbarMessage?.type === snackbarMessageType.TRACK_REMOVED
          //   ? 0.7
          //   : 1,

          // position: 'absolute',
          // top: 0,
          // left: 0,
        }}
        onDismiss={() => {
          if (snackbarMessage?.type === snackbarMessageType.TRACK_REMOVED)
            setLastTrackRemoved(null);
          setSnackbarMessage(null);
        }}
        action={{
          label:
            snackbarMessage?.type === snackbarMessageType.TRACK_REMOVED
              ? labels.undo
              : snackbarMessage?.type === snackbarMessageType.ERROR_MESSAGE &&
                labels.OK,
          onPress: () => {
            if (snackbarMessage?.type === snackbarMessageType.TRACK_REMOVED) {
              if (!lastTrackRemoved) return;

              const _tracks = [...tracks];
              _tracks.splice(lastTrackRemoved.index, 0, lastTrackRemoved.item);
              setTracks(_tracks);
              setLastTrackRemoved(null);

              if (!animationIsRunning) {
                animationIsRunning = true;
                Animated.timing(
                  rowTranslateAnimatedValues[lastTrackRemoved.item.key].removal,
                  {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: false,
                  },
                ).start(() => {
                  animationIsRunning = false;
                  setSnackbarMessage(null);
                });
              }
            } else {
              setSnackbarMessage(null);
            }
          },
        }}>
        {snackbarMessage?.type === snackbarMessageType.TRACK_REMOVED
          ? labels.trackRemoved
          : snackbarMessage?.info}
      </Snackbar>

      {/* [Component] Floating Action Button */}
      {/*<Portal>*/}
      <FAB.Group
        style={{
          // zIndex: 9999,
          // flex: 2,
          paddingBottom: hp(6),
          // opacity: isFABOpened ? 1 : 0.7,
        }}
        visible={isFABVisible}
        // visible={true}
        open={isFABOpened}
        icon={
          IconUtils.getInfo(keys.ACTION).name[
            isFABOpened ? 'filled' : 'outlined'
          ]
        }
        // actions={fabActions}
        actions={[
          {
            icon: IconUtils.getInfo(keys.SHUFFLE).name.default,
            label: labels.shuffle,
            onPress: () => console.log('Pressed star'),
            color: colors.lightGrey,
          },
          {
            icon: IconUtils.getInfo(keys.PLAY).name.default,
            label: labels.play,
            onPress: () => console.log('Pressed email'),
            color: colors.lightGrey,
          },
          {
            icon: IconUtils.getInfo(keys[name ? 'PLAYLIST_EDIT' : 'SAVE']).name
              .default,
            label: labels[name ? 'rename' : 'save'],
            onPress: () => {
              setIsEditingPlaylistName(true);
              playlistInput.current?.focus();
              // console.log(
              //   `[Current-Playlist] playlistTextInput.current=${playlistInput.current}`,
              // );
              // playlistInput.current.clear();
              setIsFABOpened(false);
            },
            // small: false,
            color: colors[name ? 'lightGrey' : 'red'],
          },
        ]}
        onStateChange={state => {
          console.log(`[Current Playlist] FAB state=${JSON.stringify(state)}`);
        }}
        onPress={setIsFABOpened.bind(this, val => !val)}
      />
      {/*</Portal>*/}
    </>
  );
};

const styles = StyleSheet.create({
  leftAction: {
    backgroundColor: 'red',
    width: wp(80),
  },
  actionText: {
    backgroundColor: 'lightgreen',
    width: wp(80),
  },
  rowFrontContainer: {
    width: wp(88),
    alignItems: 'center',
    textAlignVertical: 'center',
  },
  container: {
    // flex: 1,
    flex: 0.9,
    // borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: wp(4),
    overflow: 'hidden',
  },
  backRightBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backRightBtnRight: {
    right: wp(2),
  },
  trackItemContainer: {
    alignItems: 'center',
  },
  trackSubtitleText: {
    fontSize: wp(3.2),
    color: colors.lightGrey,
    marginLeft: wp(0.5),
  },
  trackDescText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: wp(4),
  },
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
  listItemEndSmallBar: {
    paddingVertical: hp(0.3),
    width: wp(12),
    backgroundColor: colors.black,
    opacity: 0.1,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp(1),
  },
});

export default Playlist;

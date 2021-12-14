import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { PreferencesContext } from '../../context/preferences';
import {
  Avatar,
  Divider,
  IconButton,
  List,
  Menu,
  Text,
} from 'react-native-paper';
import keys from '../../constants/keys';
import IconUtils from '../../utils/icon';
import labels from '../../constants/labels';
import { MusicContext } from '../../context/music';
import colors from '../../constants/colors';
import PlayerUtils from '../../utils/player';
import { sortingOptions, sortingOrders } from '../../constants/tracks';
import DateTimeUtils from '../../utils/datetime';
import Icon from '../../components/icon';
import PlaylistControls from '../../components/playlist-controls';
import { SwipeListView } from 'react-native-swipe-list-view';
import { width } from '../../constants/dimensions';
import { useIsFocused } from '@react-navigation/native';
import TrackPlayer from 'react-native-track-player';
import Modal from 'react-native-modal';

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

// TODO: Store the sorting order
// TODO: Set a specific playlist ID when playing from this list

const Favorites = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { playerControls, musicInfo, setMusicInfo } = useContext(MusicContext);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [sortBy, setSortBy] = useState(sortingOptions.TITLE);
  const [sortOrder, setSortOrder] = useState(sortingOrders.ASCENDING);
  const [showMoreOptionForTrackId, setShowMoreOptionForTrackId] =
    useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentlyPlayingTrackId, setCurrentlyPlayingTrackId] = useState(null);
  const [rowTranslateAnimatedValues, setRowTranslateAnimatedValues] = useState(
    [],
  );
  const [lastTrackRemoved, setLastTrackRemoved] = useState(null);
  const [currentActions, setCurrentActions] = useState(null);
  const [snackbarMessage, setSnackbarMessage] = useState(null);

  const list = useRef(null);

  // console.log(
  //   `[Favorites] favs=${JSON.stringify(musicInfo?.[keys.FAVORITE_IDS])}`,
  // );

  // const isFocused = useIsFocused();
  let animationIsRunning = false;

  // useEffect(() => {
  //
  // }, [musicInfo?.[keys.FAVORITE_IDS], musicInfo?.[keys.TRACKS]]);

  useEffect(async () => {
    const _tracks = musicInfo?.[keys.TRACKS].filter(tr =>
      musicInfo?.[keys.FAVORITE_IDS].includes(tr.id),
    );
    console.log(`[Favorites] tracks=${_tracks}`);

    if (_tracks.length)
      sortTracks(_tracks, sortingOptions.TITLE, sortingOrders.ASCENDING);

    /* Update rowTranslateAnimatedValues */
    if (_tracks.length && !Object.keys(rowTranslateAnimatedValues).length) {
      console.log(
        `[Favorites/useEffect] tracks.length=${_tracks.length}, keys=${
          Object.keys(rowTranslateAnimatedValues).length
        }`,
      );

      const animValues = {};
      _tracks.forEach(track => {
        animValues[track.id] = new Animated.Value(1);
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
  }, [musicInfo?.[keys.FAVORITE_IDS], musicInfo?.[keys.TRACKS]]);

  const sortTracks = (list, by, order) => {
    const _sort = (keys, type = 'string') => {
      let compare;
      const getKeyValue = x => {
        let val = { ...x };
        for (const key of keys) val = val[key];
        return val;
      };

      if (type === 'string' && order === sortingOrders.ASCENDING)
        compare = (a, b) =>
          getKeyValue(a) < getKeyValue(b)
            ? -1
            : getKeyValue(a) > getKeyValue(b)
            ? 1
            : 0;
      else if (type === 'string' && order === sortingOrders.DECREASING)
        compare = (a, b) =>
          getKeyValue(b) < getKeyValue(a)
            ? -1
            : getKeyValue(b) > getKeyValue(a)
            ? 1
            : 0;
      else if (type === 'number' && order === sortingOrders.ASCENDING)
        compare = (a, b) => getKeyValue(a) - getKeyValue(b);
      else if (type === 'number' && order === sortingOrders.DECREASING)
        compare = (a, b) => getKeyValue(b) - getKeyValue(a);
      else throw new Error(`Invalid type: ${type} or order: ${order}`);

      setTracks(list.sort(compare));
    };

    switch (by) {
      case sortingOptions.ARTIST:
        _sort(['artist']);
        break;
      case sortingOptions.TITLE:
        _sort(['title']);
        break;
      case sortingOptions.DURATION:
        _sort(['duration'], 'number');
        break;
      case sortingOptions.ALBUM:
        _sort(['album']);
        break;
      case sortingOptions.FOLDER:
        _sort(['folder', 'path']);
        break;
      default:
        throw new Error(`Invalid by: ${by}`);
    }

    setSortBy(by);
    setSortOrder(order);
  };

  const onShuffleTracks = () => {
    PlayerUtils.shuffleAndPlayTracks(tracks)
      .then(currentTrack => {
        setCurrentlyPlayingTrackId(currentTrack.id);
        playerControls.collapse();
        ToastAndroid.show(
          `${labels.shuffled} ${tracks.length} ${labels.tracks}`,
          ToastAndroid.SHORT,
        );
      })
      .catch(err => {
        ToastAndroid.show(
          `${labels.couldntShuffleTracks} (${err.message}}`,
          ToastAndroid.LONG,
        );
        throw err;
      });
  };

  const onPlayWholePlayList = () => {
    PlayerUtils.playTracks(tracks)
      .then(currentTrack => {
        setCurrentlyPlayingTrackId(currentTrack.id);
        playerControls.collapse();
        ToastAndroid.show(
          `${labels.playing} ${tracks.length} ${labels.tracks}`,
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

  const renderItem = data => {
    const onPress = () => {
      PlayerUtils.playTracks(tracks, data.index)
        .then(currentTrack => {
          setCurrentlyPlayingTrackId(currentTrack.id);
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
      return (
        <Avatar.Icon
          size={hp(6)}
          icon={IconUtils.getInfo(keys.MUSIC).name.default}
          style={styles.musicIcon}
        />
      );
    };

    const renderRightComponent = props => (
      <IconButton
        {...props}
        icon={IconUtils.getInfo(keys.VERTICAL_ELLIPSIS).name.default}
        onPress={setShowMoreOptionForTrackId.bind(this, data.item.id)}
      />
    );

    // FIXME: Not working
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
      <Animated.View
        style={{
          ...styles.rowFrontContainer,
          height: rowTranslateAnimatedValues[data.item.key]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, hp(8)],
          }),

          // opacity: 0.3,
          borderRadius: currentlyPlayingTrackId === data.item.id ? wp(2) : 0,
          // backgroundColor: // FIXME: Integrate this coloring scheme too when removal animation is not in progress
          //   currentlyPlayingTrackId === data.item.id
          //     ? enabledDarkTheme
          //       ? colors.darker
          //       : colors.lighter
          //     : enabledDarkTheme
          //     ? colors.dark
          //     : colors.light,

          backgroundColor:
            rowTranslateAnimatedValues[data.item.key]?.interpolate({
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
    );
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
          // alignItems: 'center',
          // alignContent: 'center',
          // alignSelf: 'center',

          // borderWidth: 1,
          // backgroundColor: 'white',
          // textAlignVertical: 'center',
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
      Animated.timing(rowTranslateAnimatedValues[key], {
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

  return (
    <ScreenContainer
      ref={_ref => {
        console.log(`[Favorites] ScreenContainer: _ref=${JSON.stringify(ref)}`);
      }}
      noScroll
      hasRoundedContainer
      varHeights={{ collapsed: hp(14), closed: hp(6) }}>
      <PlaylistControls
        enabledDarkTheme={enabledDarkTheme}
        disabled={!tracks.length}
        sortKeys={[
          sortingOptions.TITLE,
          sortingOptions.ARTIST,
          sortingOptions.ALBUM,
          sortingOptions.DURATION,
          sortingOptions.FOLDER,
        ]}
        sortOrder={sortOrder}
        onChangeSortOrder={order => sortTracks([...tracks], sortBy, order)}
        sortBy={sortBy}
        onChangeSortBy={by => sortTracks([...tracks], by, sortOrder)}
        onShuffle={onShuffleTracks}
        onPlay={onPlayWholePlayList}
      />

      <Text>list={JSON.stringify(musicInfo?.[keys.FAVORITE_IDS])}</Text>

      {/*<Modal*/}
      {/*  testID={'modal'}*/}
      {/*  // isVisible={Boolean(editingPlaylistInfo)}*/}
      {/*  isVisible={!true}*/}
      {/*  // isVisible={false}*/}
      {/*  onSwipeComplete={() => {}}*/}
      {/*  swipeDirection={['down']}*/}
      {/*  // scrollTo={this.handleScrollTo}*/}
      {/*  // scrollOffset={this.state.scrollOffset}*/}
      {/*  onBackdropPress={() => {}}*/}
      {/*  onBackButtonPress={() => {}}*/}
      {/*  backdropOpacity={0.5}*/}
      {/*  scrollOffsetMax={hp(80)} // content height - ScrollView height*/}
      {/*  propagateSwipe={true}*/}
      {/*  style={{*/}
      {/*    // flex: 1,*/}
      {/*    justifyContent: 'flex-end',*/}
      {/*    margin: 0,*/}
      {/*  }}>*/}
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
      {/*</Modal>*/}
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  // TODO:  imported from playlist/index.js; remove the unnecessary objects
  leftAction: {
    backgroundColor: 'red',
    width: wp(80),
  },
  actionText: {
    backgroundColor: 'lightgreen',
    width: wp(80),
  },
  rowFrontContainer: {
    // width: wp(88),
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

export default Favorites;

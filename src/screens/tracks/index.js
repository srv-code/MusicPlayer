import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import ScreenContainer from '../../components/screen-container';
import { MusicContext } from '../../context/music';
import { PreferencesContext } from '../../context/preferences';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  Menu,
  Surface,
  Text,
  ToggleButton,
} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TrackPlayer from 'react-native-track-player';
import colors from '../../constants/colors';
import Icon from '../../components/icon';
import labels from '../../constants/labels';
import globalStyles from '../../styles';
import DateTimeUtils from '../../utils/datetime';
// import List from '../../components/track-list';
import { SortingOptions, SortingOrders } from '../../constants/tracks';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';
import PlayerUtils from '../../utils/player';
import PlaylistControls from '../../components/playlist-controls';

// TODO Scroll to the currently playing track automatically
// TODO Add a go up button (same as in Samsung Music)
// TODO Add a scroll handle (same as in Samsung Music)
// FIXME When shuffling the playlist skip to previous & next tracks player buttons are not correctly disabled
// FIXME Selecting another item should not show the same toast message ("selected from all tracks")
// FIXME Selecting a track (which is not the first one) should not highlight the first one

const Tracks = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { playerControls, musicInfo, bottomSheetMiniPositionIndex } =
    useContext(MusicContext);

  // const [showSortingMenu, setShowSortingMenu] = useState(false);
  const [sortBy, setSortBy] = useState(SortingOptions.TITLE);
  const [sortOrder, setSortOrder] = useState(SortingOrders.ASCENDING);
  const [showMoreOptionForTrackId, setShowMoreOptionForTrackId] =
    useState(null);
  const [tracks, setTracks] = useState([]);
  const [currentlyPlayingTrackId, setCurrentlyPlayingTrackId] = useState(null);

  useEffect(() => {
    if (musicInfo?.[keys.TRACKS]?.length) {
      console.log(
        `[Tracks] Populating tracks for first time, tracks=${
          musicInfo[keys.TRACKS]
        }`,
      );
      sortTracks(
        [...musicInfo[keys.TRACKS]],
        SortingOptions.TITLE,
        SortingOrders.ASCENDING,
      );
    }
  }, [musicInfo?.[keys.TRACKS]]);

  useEffect(() => {
    // console.log(
    //   `>> currentlyPlayingTrack=${JSON.stringify(
    //     musicInfo.currentlyPlayingTrack,
    //   )}`,
    // );
    setCurrentlyPlayingTrackId(musicInfo.currentlyPlaying?.track.id);
  }, [musicInfo.currentlyPlaying]);

  // TODO apply useMemo later
  const dynamicStyles = {
    screen: {
      ...styles.screen,
      backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
    },
    container: {
      ...styles.container,
      backgroundColor: enabledDarkTheme ? colors.darkest : colors.light,
    },
    // playerButton: {
    //   ...styles.playerButton,
    //   backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
    //   opacity: tracks.length ? 1 : 0.8,
    // },
    // sortButton: {
    //   ...styles.sortButton,
    //   opacity: tracks.length ? 1 : 0.8,
    // },
  };

  // console.log(`colors:${JSON.stringify({ colors })}`);

  // const { colors } = useTheme();
  // console.log(`theme=${JSON.stringify(useTheme())}`);

  // console.log(`[Tracks] sortBy=${sortBy}, sortOrder=${sortOrder}`);

  // const playTracks = async (list, index = 0) => {
  //   console.log(`[Tracks] track pressed=${JSON.stringify(list[index])}`);
  //
  //   await TrackPlayer.reset();
  //   await TrackPlayer.add(list);
  //   await TrackPlayer.skip(index);
  //   playerControls.collapse();
  //   await TrackPlayer.play();
  //
  //   // console.log(
  //   //   `[Tracks] Playing: {queue=${JSON.stringify(
  //   //     (await TrackPlayer.getQueue()).map(e => e.id),
  //   //   )}, current track index: ${await TrackPlayer.getCurrentTrack()}`,
  //   // );
  // };

  const onShuffleTracks = () => {
    // const randomizedList = [...tracks];
    // // console.log(`list=${randomizedList.map(e => e.id)}`);
    // randomizedList.sort(() => 0.5 - Math.random());
    // // console.log(`list(randomized)=${randomizedList.map(e => e.id)}`);

    PlayerUtils.shuffleAndPlayTracks(tracks)
      .then(() => {
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
      .then(() => {
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

  // console.log(`[Tracks] tracks=${JSON.stringify(tracks)}`);

  const renderTrackDescription = track => {
    const getText = () => {
      switch (sortBy) {
        case SortingOptions.TITLE:
        case SortingOptions.ARTIST:
          return track.artist;
        case SortingOptions.DURATION:
          return DateTimeUtils.msToTime(track.duration);
        case SortingOptions.ALBUM:
          return track.album;
        case SortingOptions.FOLDER:
          // return `${track.folder.name} (${track.folder.path)})`;
          return track.folder.name;
        default:
          throw new Error(`Invalid sortBy value: ${sortBy}`);
      }
    };

    return (
      <View style={styles.trackDescText}>
        <Icon
          name={
            IconUtils.getInfo(
              sortBy === SortingOptions.TITLE ? SortingOptions.ARTIST : sortBy,
            ).name.outlined
          }
          type={
            IconUtils.getInfo(
              sortBy === SortingOptions.TITLE ? SortingOptions.ARTIST : sortBy,
            ).type
          }
          size={wp(3.5)}
          color={colors.lightGrey}
        />
        <Text numberOfLines={1} style={styles.trackSubtitleText}>
          {getText()}
        </Text>
      </View>
    );
  };

  const renderTrackItemLeftComponent = (track, props) => {
    if (track.artwork)
      return (
        <Avatar.Image
          size={hp(6)}
          source={{ uri: `file://${track.artwork}` }}
        />
      );
    return <Avatar.Icon size={hp(6)} icon="music" style={styles.musicIcon} />;
  };

  const renderTrackItemRightComponent = (track, props) => (
    <Menu
      {...props}
      visible={showMoreOptionForTrackId === track.id}
      onDismiss={setShowMoreOptionForTrackId.bind(this, null)}
      anchor={
        <IconButton
          {...props}
          icon={IconUtils.getInfo(keys.VERTICAL_ELLIPSIS).name.default}
          onPress={setShowMoreOptionForTrackId.bind(this, track.id)}
        />
      }>
      <Menu.Item
        icon={IconUtils.getInfo(keys.SKIP_NEXT).name.default}
        title={labels.playNext}
        onPress={() => {
          alert(JSON.stringify(props));
          setShowMoreOptionForTrackId(null);
        }}
      />
      <Menu.Item
        icon={IconUtils.getInfo(keys.ADD_TO_PLAYLIST).name.default}
        title={labels.addToPlaylist}
        onPress={() => {
          setShowMoreOptionForTrackId(null);
          alert(JSON.stringify(props));
        }}
      />
      <Menu.Item
        icon={IconUtils.getInfo(keys.ADD_TO_QUEUE).name.default}
        title={labels.addToQueue}
        onPress={() => {
          // alert(JSON.stringify(props));
          setShowMoreOptionForTrackId(null);
          ToastAndroid.show(labels.addedToQueue, ToastAndroid.SHORT);
        }}
      />
      <Menu.Item
        icon={IconUtils.getInfo(keys.INFO).name.filled}
        title={labels.showInfo}
        onPress={() => {
          // alert(JSON.stringify(props));
          // navigation.navigate(screenNames.itemInfo, { type, data });
          // setInfoModalData({ type, data });
          setShowMoreOptionForTrackId(null);
        }}
      />
    </Menu>
  );

  const renderTrackItem = ({ item: track, index }) => {
    const renderDivider = () => {
      if (index === tracks.length - 1) {
        return <View style={styles.listItemEndSmallBar} />;
      } else {
        if (currentlyPlayingTrackId) {
          const playingIndex = tracks.findIndex(
            t => t.id === currentlyPlayingTrackId,
          );
          if (playingIndex === -1)
            throw new Error(`Could not find playing track index`);
          if (index === playingIndex - 1 || index === playingIndex) return null;
          else return <Divider inset />;
        } else return <Divider inset />;
      }
    };

    return (
      <>
        <List.Item
          style={{
            ...styles.trackItemContainer,
            backgroundColor:
              currentlyPlayingTrackId === track.id
                ? enabledDarkTheme
                  ? colors.darker
                  : colors.lighter
                : null,
            elevation: currentlyPlayingTrackId === track.id ? 2 : 0,
          }}
          onPress={() => {
            PlayerUtils.playTracks(tracks, index)
              .then(() => {
                playerControls.collapse();
                ToastAndroid.show(
                  `${labels.playing} ${labels.fromAll} ${tracks.length} ${labels.tracks}`,
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
          }}
          titleEllipsizeMode={'tail'}
          titleNumberOfLines={1}
          titleStyle={styles.listItemText}
          // title={`[${index}] ${track.title}`}
          title={track.title}
          descriptionEllipsizeMode={'tail'}
          descriptionNumberOfLines={1}
          description={renderTrackDescription.bind(this, track)}
          left={props => renderTrackItemLeftComponent(track, props)}
          right={props => renderTrackItemRightComponent(track, props)}
        />

        {renderDivider()}
      </>
    );
  };

  const sortTracks = (list, by, order) => {
    const _sort = (keys, type = 'string') => {
      let compare;
      const getKeyValue = x => {
        let val = { ...x };
        for (const key of keys) val = val[key];
        return val;
      };

      if (type === 'string' && order === SortingOrders.ASCENDING)
        compare = (a, b) =>
          getKeyValue(a) < getKeyValue(b)
            ? -1
            : getKeyValue(a) > getKeyValue(b)
            ? 1
            : 0;
      else if (type === 'string' && order === SortingOrders.DECREASING)
        compare = (a, b) =>
          getKeyValue(b) < getKeyValue(a)
            ? -1
            : getKeyValue(b) > getKeyValue(a)
            ? 1
            : 0;
      else if (type === 'number' && order === SortingOrders.ASCENDING)
        compare = (a, b) => getKeyValue(a) - getKeyValue(b);
      else if (type === 'number' && order === SortingOrders.DECREASING)
        compare = (a, b) => getKeyValue(b) - getKeyValue(a);
      else throw new Error(`Invalid type: ${type} or order: ${order}`);

      setTracks(list.sort(compare));
    };

    switch (by) {
      case SortingOptions.ARTIST:
        _sort(['artist']);
        break;
      case SortingOptions.TITLE:
        _sort(['title']);
        break;
      case SortingOptions.DURATION:
        _sort(['duration'], 'number');
        break;
      case SortingOptions.ALBUM:
        _sort(['album']);
        break;
      case SortingOptions.FOLDER:
        _sort(['folder', 'path']);
        break;
      default:
        throw new Error(`Invalid by: ${by}`);
    }

    setSortBy(by);
    setSortOrder(order);
  };

  return (
    <ScreenContainer noScroll style={dynamicStyles.screen}>
      <View style={dynamicStyles.container}>
        {/*<Text>{`bottomSheetMiniPositionIndex=${bottomSheetMiniPositionIndex}`}</Text>*/}
        {/*<View style={styles.container}>*/}
        {/*{playerControls && (*/}
        {/*  <View>*/}
        {/*    <Text>Player Controls</Text>*/}
        {/*    <View style={{ flexDirection: 'row' }}>*/}
        {/*      <Button*/}
        {/*        onPress={playerControls.close}*/}
        {/*        uppercase={false}*/}
        {/*        mode="outlined"*/}
        {/*        style={globalStyles.button}>*/}
        {/*        Close*/}
        {/*      </Button>*/}
        {/*      <Button*/}
        {/*        onPress={playerControls.expand}*/}
        {/*        uppercase={false}*/}
        {/*        mode="outlined"*/}
        {/*        style={globalStyles.button}>*/}
        {/*        Expand*/}
        {/*      </Button>*/}
        {/*      <Button*/}
        {/*        onPress={playerControls.collapse}*/}
        {/*        uppercase={false}*/}
        {/*        mode="outlined"*/}
        {/*        style={globalStyles.button}>*/}
        {/*        Collapse*/}
        {/*      </Button>*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*)}*/}

        {/*{Array(50)*/}
        {/*  .fill()*/}
        {/*  .map((_, index) => (*/}
        {/*    <View*/}
        {/*      key={index}*/}
        {/*      style={{*/}
        {/*        backgroundColor: index % 2 ? 'lightblue' : 'lightgreen',*/}
        {/*        padding: 10,*/}
        {/*        marginBottom: 2,*/}
        {/*      }}>*/}
        {/*      <Text>Song {index + 1}</Text>*/}
        {/*    </View>*/}
        {/*  ))}*/}
        {/*</View>*/}

        {/* Player Controls */}
        <PlaylistControls
          enabledDarkTheme={enabledDarkTheme}
          disabled={!tracks.length}
          sortKeys={[
            SortingOptions.TITLE,
            SortingOptions.ARTIST,
            SortingOptions.ALBUM,
            SortingOptions.DURATION,
            SortingOptions.FOLDER,
          ]}
          sortOrder={sortOrder}
          onChangeSortOrder={order => sortTracks([...tracks], sortBy, order)}
          sortBy={sortBy}
          onChangeSortBy={by => sortTracks([...tracks], by, sortOrder)}
          onShuffle={onShuffleTracks}
          onPlay={onPlayWholePlayList}
        />

        {/*<View style={styles.playerControlsContainer}>*/}
        {/*  <Menu*/}
        {/*    visible={showSortingMenu}*/}
        {/*    onDismiss={setShowSortingMenu.bind(this, false)}*/}
        {/*    anchor={*/}
        {/*      <TouchableOpacity*/}
        {/*        disabled={tracks.length === 0}*/}
        {/*        onPress={setShowSortingMenu.bind(this, true)}*/}
        {/*        style={dynamicStyles.sortButton}>*/}
        {/*        <Icon*/}
        {/*          name={*/}
        {/*            IconUtils.getInfo(*/}
        {/*              sortOrder === SortingOrders.ASCENDING*/}
        {/*                ? keys.SORT_ASCENDING_ALT*/}
        {/*                : keys.SORT_DESCENDING_ALT,*/}
        {/*            ).name.filled*/}
        {/*          }*/}
        {/*          type={IconUtils.getInfo(keys.SORT_ASCENDING_ALT).type}*/}
        {/*          size={wp(4)}*/}
        {/*        />*/}
        {/*        <Icon*/}
        {/*          name={IconUtils.getInfo(sortBy).name.outlined}*/}
        {/*          type={IconUtils.getInfo(sortBy).type}*/}
        {/*          size={wp(4.5)}*/}
        {/*          color={colors.lightGrey}*/}
        {/*        />*/}
        {/*      </TouchableOpacity>*/}
        {/*    }>*/}
        {/*    /!*<Text>{sortOrder}</Text>*!/*/}
        {/*    <View style={styles.sortOrderContainer}>*/}
        {/*      <ToggleButton*/}
        {/*        icon={IconUtils.getInfo(keys.SORT_ASCENDING).name.default}*/}
        {/*        onPress={sortTracks.bind(*/}
        {/*          this,*/}
        {/*          [...tracks],*/}
        {/*          sortBy,*/}
        {/*          SortingOrders.ASCENDING,*/}
        {/*        )}*/}
        {/*        style={styles.sortOrderButton}*/}
        {/*        size={wp(4.5)}*/}
        {/*        status={*/}
        {/*          sortOrder === SortingOrders.ASCENDING ? 'checked' : 'unchecked'*/}
        {/*        }*/}
        {/*        value={SortingOrders.ASCENDING}*/}
        {/*      />*/}
        {/*      <ToggleButton*/}
        {/*        icon={IconUtils.getInfo(keys.SORT_DESCENDING).name.default}*/}
        {/*        onPress={sortTracks.bind(*/}
        {/*          this,*/}
        {/*          [...tracks],*/}
        {/*          sortBy,*/}
        {/*          SortingOrders.DECREASING,*/}
        {/*        )}*/}
        {/*        style={styles.sortOrderButton}*/}
        {/*        size={wp(4.5)}*/}
        {/*        status={*/}
        {/*          sortOrder === SortingOrders.DECREASING ? 'checked' : 'unchecked'*/}
        {/*        }*/}
        {/*        value={SortingOrders.DECREASING}*/}
        {/*      />*/}
        {/*    </View>*/}

        {/*    {Object.values(SortingOptions).map((option, index) => (*/}
        {/*      <TouchableOpacity*/}
        {/*        key={index}*/}
        {/*        style={styles.sortOptionButton}*/}
        {/*        onPress={sortTracks.bind(this, [...tracks], option, sortOrder)}>*/}
        {/*        <View style={{ flexDirection: 'row', alignItems: 'center' }}>*/}
        {/*          <Icon*/}
        {/*            name={IconUtils.getInfo(option).name.outlined}*/}
        {/*            type={IconUtils.getInfo(option).type}*/}
        {/*            size={wp(4.5)}*/}
        {/*            color={colors.lightGrey}*/}
        {/*          />*/}
        {/*          <Text style={styles.sortOptionText}>{option}</Text>*/}
        {/*        </View>*/}
        {/*        {sortBy === option && (*/}
        {/*          <Icon*/}
        {/*            name={IconUtils.getInfo(keys.CHECK).name.filled}*/}
        {/*            type={IconUtils.getInfo(keys.CHECK).type}*/}
        {/*            size={wp(4)}*/}
        {/*            color={colors.lightGrey}*/}
        {/*          />*/}
        {/*        )}*/}
        {/*      </TouchableOpacity>*/}
        {/*    ))}*/}
        {/*  </Menu>*/}

        {/*  <View style={styles.playerRightButtonContainer}>*/}
        {/*    <TouchableOpacity*/}
        {/*      disabled={tracks.length === 0}*/}
        {/*      style={dynamicStyles.playerButton}*/}
        {/*      onPress={onShuffleTracks}>*/}
        {/*      <Icon*/}
        {/*        name={IconUtils.getInfo(keys.SHUFFLE).name.filled}*/}
        {/*        type={IconUtils.getInfo(keys.SHUFFLE).type}*/}
        {/*        size={wp(4)}*/}
        {/*      />*/}
        {/*    </TouchableOpacity>*/}
        {/*    <TouchableOpacity*/}
        {/*      disabled={tracks.length === 0}*/}
        {/*      style={dynamicStyles.playerButton}*/}
        {/*      onPress={onPlayWholePlayList}>*/}
        {/*      <Icon*/}
        {/*        name={IconUtils.getInfo(keys.PLAY).name.filled}*/}
        {/*        type={IconUtils.getInfo(keys.PLAY).type}*/}
        {/*        size={wp(3)}*/}
        {/*      />*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/*<Text>{`currentlyPlayingTrackId=${currentlyPlayingTrackId}`}</Text>*/}
        <View>
          {tracks.length === 0 ? (
            <Text style={styles.noTracksText}>{labels.noTracksFound}</Text>
          ) : (
            <FlatList
              contentContainerStyle={{
                ...styles.musicList,
                paddingBottom: hp(bottomSheetMiniPositionIndex === 0 ? 15 : 5),
              }}
              data={tracks}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderTrackItem}
            />
          )}
        </View>

        {/*<List*/}
        {/*  tracks={tracks}*/}
        {/*  sortBy={sortBy}*/}
        {/*  currentlyPlayingTrackId={currentlyPlayingTrackId}*/}
        {/*  playerOnCollapse={playerControls.collapse}*/}
        {/*  listStyle={{*/}
        {/*    paddingBottom: hp(bottomSheetMiniPositionIndex === 0 ? 15 : 5),*/}
        {/*  }}*/}
        {/*/>*/}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    elevation: 4,
    marginTop: hp(0.4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
  },
  iconButton: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // playerControlsContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignItems: 'center',
  //   marginBottom: hp(1),
  //   paddingHorizontal: wp(2),
  // },
  // playerRightButtonContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  // playerButton: {
  //   elevation: 2,
  //   borderRadius: hp(10),
  //   // padding: hp(1),
  //   height: hp(4),
  //   width: hp(4),
  //   overflow: 'hidden',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   marginLeft: wp(2),
  // },
  // sortOptionButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingVertical: hp(0.7),
  //   paddingHorizontal: wp(4),
  //   width: wp(37),
  // },
  // sortOptionText: {
  //   fontSize: wp(4),
  //   marginLeft: wp(1.8),
  // },
  listItemText: {
    fontSize: wp(4),
  },
  noTracksText: {
    fontSize: wp(5),
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: hp(8),
    color: colors.lightGrey,
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
  sortOrderRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // sortOrderContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // sortOrderButton: {
  //   height: hp(4),
  //   width: wp(15),
  // },
  // sortButton: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  listItemEndSmallBar: {
    paddingVertical: hp(0.3),
    width: wp(12),
    backgroundColor: colors.black,
    opacity: 0.1,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
  trackItemContainer: {
    alignItems: 'center',
    borderRadius: wp(2),
    // paddingVertical: 0,
    // backgroundColor: 'lightgreen',
  },
  musicList: {
    paddingHorizontal: wp(2),
  },
});

export default Tracks;

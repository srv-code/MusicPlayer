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
import { PreferencesContext } from '../../context/preferences';
import {
  Avatar,
  Button,
  Divider,
  IconButton,
  List,
  Menu,
  Text,
  ToggleButton,
} from 'react-native-paper';
import { MusicContext } from '../../context/music';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
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

const SortingOptions = {
  TITLE: labels.title,
  ARTIST: labels.artist,
  ALBUM: labels.album,
  DURATION: labels.duration,
  FOLDER: labels.folder,
};

const SortingOrders = {
  ASCENDING: 'ASCENDING',
  DECREASING: 'DECREASING',
};

const Tracks = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const {
    playerControls,
    musicInfo: { tracks: _tracks },
    bottomSheetMiniPositionIndex,
  } = useContext(MusicContext);

  const [showSortingMenu, setShowSortingMenu] = useState(false);
  const [sortBy, setSortBy] = useState(SortingOptions.TITLE);
  const [sortOrder, setSortOrder] = useState(SortingOrders.ASCENDING);
  const [showMoreOptionForTrackId, setShowMoreOptionForTrackId] =
    useState(null);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    if (_tracks?.length)
      // console.log(`[Tracks] Populating tracks for first time`);
      sortTracks([..._tracks], SortingOptions.TITLE, SortingOrders.ASCENDING);
  }, [_tracks]);

  // TODO apply useMemo later
  const dynamicStyles = {
    container: [
      styles.container,
      {
        backgroundColor: enabledDarkTheme ? Colors.dark : Colors.light,
      },
    ],
    playerButton: [
      styles.playerButton,
      {
        backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
        opacity: tracks.length ? 1 : 0.8,
      },
    ],
    sortButton: [
      styles.sortButton,
      {
        opacity: tracks.length ? 1 : 0.8,
      },
    ],
  };

  // console.log(`[Tracks] sortBy=${sortBy}, sortOrder=${sortOrder}`);

  const playTracks = async list => {
    await TrackPlayer.reset();
    await TrackPlayer.add(list);
    playerControls.collapse();
    await TrackPlayer.play();
  };

  const onShuffleTracks = () => {
    const randomizedList = [...tracks];
    // console.log(`list=${randomizedList.map(e => e.id)}`);
    randomizedList.sort(() => 0.5 - Math.random());
    // console.log(`list(randomized)=${randomizedList.map(e => e.id)}`);

    playTracks(randomizedList)
      .then(() =>
        ToastAndroid.show(
          `${labels.shuffled} ${randomizedList.length} ${labels.tracks}`,
          ToastAndroid.SHORT,
        ),
      )
      .catch(err => {
        ToastAndroid.show(
          `${labels.couldntShuffleTracks} (${err.message}}`,
          ToastAndroid.LONG,
        );
        throw err;
      });
  };

  const onPlayWholePlayList = () => {
    playTracks(tracks)
      .then(() =>
        ToastAndroid.show(
          `${labels.playing} ${tracks.length} ${labels.tracks}`,
          ToastAndroid.SHORT,
        ),
      )
      .catch(err => {
        ToastAndroid.show(
          `${labels.couldntPlayTracks} (${err.message}}`,
          ToastAndroid.LONG,
        );
        throw err;
      });
  };

  // console.log(`[Tracks] tracks=${JSON.stringify(tracks)}`);

  const getIconInfo = type => {
    switch (type) {
      case SortingOptions.TITLE:
        return { name: 'format-text', type: 'MaterialCommunityIcons' };
      case SortingOptions.DURATION:
        return { name: 'clock-time-five-outline' };
      case SortingOptions.ALBUM:
        return { name: 'disc-outline', type: 'Ionicons' };
      case SortingOptions.ARTIST:
        return {
          name: 'account-music-outline',
          type: 'MaterialCommunityIcons',
        };
      case SortingOptions.FOLDER:
        return { name: 'folder-music-outline', type: 'MaterialCommunityIcons' };
      default:
        throw new Error(`Invalid type: ${type}`);
    }
  };

  const renderTrackDescription = track => {
    const getText = () => {
      switch (sortBy) {
        case SortingOptions.TITLE:
        case SortingOptions.ARTIST:
          return track.artist.trim();
        case SortingOptions.DURATION:
          return DateTimeUtils.msToTime(track.duration).trim();
        case SortingOptions.ALBUM:
          return track.album.trim();
        case SortingOptions.FOLDER:
          // return `${track.folder.name} (${track.folder.path.trim()})`;
          return track.folder.name.trim();
        default:
          throw new Error(`Invalid sortBy value: ${sortBy}`);
      }
    };

    return (
      <View style={styles.trackDescText}>
        <Icon
          {...getIconInfo(
            sortBy === SortingOptions.TITLE ? SortingOptions.ARTIST : sortBy,
          )}
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
          icon="dots-vertical"
          onPress={setShowMoreOptionForTrackId.bind(this, track.id)}
        />
      }>
      <Menu.Item
        icon="skip-next-outline"
        title={labels.playNext}
        onPress={() => {
          alert(JSON.stringify(props));
          setShowMoreOptionForTrackId(null);
        }}
      />
      <Menu.Item
        icon="playlist-plus"
        title={labels.addToPlaylist}
        onPress={() => {
          setShowMoreOptionForTrackId(null);
          alert(JSON.stringify(props));
        }}
      />
      <Menu.Item
        icon="table-column-plus-after"
        title={labels.addToQueue}
        onPress={() => {
          // alert(JSON.stringify(props));
          setShowMoreOptionForTrackId(null);
          ToastAndroid.show(labels.addedToQueue, ToastAndroid.SHORT);
        }}
      />
      <Menu.Item
        icon="information-variant"
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

  const renderTrackItem = ({ item: track, index }) => (
    <>
      <List.Item
        onPress={() => {
          // TODO
          //  - tracks: insert current track in the stack (at the top) & play it
          //  - albums|artists|folders: show album tracks
          Alert.alert(`Track Info`, JSON.stringify(track));
        }}
        titleEllipsizeMode={'tail'}
        titleNumberOfLines={1}
        titleStyle={styles.listItemText}
        // title={`[${index + 1}] ${track.title}`}
        title={track.title}
        descriptionEllipsizeMode={'tail'}
        descriptionNumberOfLines={1}
        description={renderTrackDescription.bind(this, track)}
        left={props => renderTrackItemLeftComponent(track, props)}
        right={props => renderTrackItemRightComponent(track, props)}
      />
      {index === tracks.length - 1 ? (
        <View style={styles.listItemEndSmallBar} />
      ) : (
        <Divider inset />
      )}
    </>
  );

  const sortTracks = (list, by, order) => {
    const _sort = ({ keys, type = 'string' } = {}) => {
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
      else throw new Error(`Invalid type: ${type} or order=${order}`);

      setTracks(list.sort(compare));
    };

    // TODO implement logic
    switch (by) {
      case SortingOptions.ARTIST:
        _sort({ keys: ['artist'] });
        break;
      case SortingOptions.TITLE:
        _sort({ keys: ['title'] });
        break;
      case SortingOptions.DURATION:
        _sort({ keys: ['duration'], type: 'number' });
        break;
      case SortingOptions.ALBUM:
        _sort({ keys: ['album'] });
        break;
      case SortingOptions.FOLDER:
        _sort({ keys: ['folder', 'path'] });
        break;
    }

    setSortBy(by);
    setSortOrder(order);
  };

  return (
    <ScreenContainer noScroll style={dynamicStyles.container}>
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
      <View style={styles.playerControlsContainer}>
        <Menu
          visible={showSortingMenu}
          onDismiss={setShowSortingMenu.bind(this, false)}
          anchor={
            <TouchableOpacity
              disabled={tracks.length === 0}
              onPress={setShowSortingMenu.bind(this, true)}
              style={dynamicStyles.sortButton}>
              <Icon
                name={
                  sortOrder === SortingOrders.ASCENDING
                    ? 'sort-amount-down-alt'
                    : 'sort-amount-up-alt'
                }
                type="FontAwesome5"
                size={wp(4)}
              />
              <Icon
                {...getIconInfo(sortBy)}
                size={wp(4.5)}
                color={colors.lightGrey}
              />
            </TouchableOpacity>
          }>
          {/*<Text>{sortOrder}</Text>*/}
          <View style={styles.sortOrderContainer}>
            <ToggleButton
              icon="sort-ascending"
              onPress={sortTracks.bind(
                this,
                [...tracks],
                sortBy,
                SortingOrders.ASCENDING,
              )}
              style={styles.sortOrderButton}
              size={wp(4.5)}
              status={
                sortOrder === SortingOrders.ASCENDING ? 'checked' : 'unchecked'
              }
              value={SortingOrders.ASCENDING}
            />
            <ToggleButton
              icon="sort-descending"
              onPress={sortTracks.bind(
                this,
                [...tracks],
                sortBy,
                SortingOrders.DECREASING,
              )}
              style={styles.sortOrderButton}
              size={wp(4.5)}
              status={
                sortOrder === SortingOrders.DECREASING ? 'checked' : 'unchecked'
              }
              value={SortingOrders.DECREASING}
            />
          </View>

          {Object.values(SortingOptions).map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.sortOptionButton}
              onPress={sortTracks.bind(this, [...tracks], option, sortOrder)}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon
                  {...getIconInfo(option)}
                  size={wp(4.5)}
                  color={colors.lightGrey}
                />
                <Text style={styles.sortOptionText}>{option}</Text>
              </View>
              {sortBy === option && (
                <Icon
                  name="check"
                  type="Entypo"
                  size={wp(4)}
                  color={colors.lightGrey}
                />
              )}
            </TouchableOpacity>
          ))}
        </Menu>

        <View style={styles.playerRightButtonContainer}>
          <TouchableOpacity
            disabled={tracks.length === 0}
            style={dynamicStyles.playerButton}
            onPress={onShuffleTracks}>
            <Icon name="shuffle" type="Entypo" size={wp(4)} />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={tracks.length === 0}
            style={dynamicStyles.playerButton}
            onPress={onPlayWholePlayList}>
            <Icon name="controller-play" type="Entypo" size={wp(4)} />
          </TouchableOpacity>
        </View>
      </View>

      <View>
        {tracks.length === 0 ? (
          <Text style={styles.noTracksText}>{labels.noTracksFound}</Text>
        ) : (
          <FlatList
            contentContainerStyle={{
              paddingBottom: hp(bottomSheetMiniPositionIndex === -1 ? 5 : 15),
            }}
            data={tracks}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderTrackItem}
          />
        )}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    elevation: 4,
    marginTop: hp(0.4),
  },
  iconButton: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  playerRightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerButton: {
    elevation: 2,
    borderRadius: hp(10),
    padding: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  sortOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(4),
    width: wp(37),
  },
  sortOptionText: {
    fontSize: wp(4),
    marginLeft: wp(1.8),
  },
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
  sortOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortOrderButton: {
    height: hp(4),
    width: wp(15),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemEndSmallBar: {
    paddingVertical: hp(0.3),
    width: wp(12),
    backgroundColor: colors.black,
    opacity: 0.1,
    borderRadius: 10,
    alignSelf: 'center',
  },
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
});

export default Tracks;

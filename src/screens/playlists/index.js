import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { IconButton, Menu, Snackbar, Text } from 'react-native-paper';
import ScreenContainer from '../../components/screen-container';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import keys from '../../constants/keys';
import { MusicContext } from '../../context/music';
import TrackListCover from '../../components/playlist-cover';
import Modal from 'react-native-modal';
import Playlist from '../../components/playlist';
import PlaylistControls from '../../components/playlist-controls';
import { sortingOptions, sortingOrders } from '../../constants/tracks';
import { displayModes as ItemInfoDisplayModes } from '../item-info';
import Icon from '../../components/icon';
import IconUtils from '../../utils/icon';
import labels from '../../constants/labels';
import Info from '../../components/info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PlayerUtils from '../../utils/player';
import TrackPlayer from 'react-native-track-player';

// FIXME: The corner of the playlist covers are getting cut off
// FIXME: Render the panel below playlist covers here and also provide some vertical & horizontal
//  margins to avoid colliding with the adjacent ones
// FIXME: Not updating the thumbnail when track list is edited

const Playlists = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { playerControls, musicInfo, setMusicInfo } = useContext(MusicContext);

  const [playlists, setPlaylists] = useState([]);
  const [editingPlaylistId, setEditingPlaylistId] = useState(null);
  const [sortBy, setSortBy] = useState(sortingOptions.TITLE);
  const [sortOrder, setSortOrder] = useState(sortingOrders.ASCENDING);
  const [itemInfo, setItemInfo] = useState(null);
  const [infoPanelAnimatedValue] = useState(new Animated.Value(0));
  const [snackbarMessage, setSnackbarMessage] = useState(null);
  const [showMenuForId, setShowMenuForId] = useState(null);

  const playlist = useRef(null);

  // console.log(
  //   `[Playlists] playlists=${JSON.stringify(
  //     playlists,
  //   )}, musicInfo.playlists=${JSON.stringify(musicInfo?.[keys.PLAYLISTS])}`,
  // );

  useEffect(() => {
    if (musicInfo?.[keys.PLAYLISTS]?.length)
      sortAllPlaylists(
        [...musicInfo?.[keys.PLAYLISTS]],
        sortingOptions.TITLE,
        sortingOrders.ASCENDING,
      );
    else setPlaylists([]);

    /* close if not properly closed while dismissing the modal */
    hideItemInfoPanel();
  }, [musicInfo?.[keys.PLAYLISTS]]);

  const onPlayPlaylist = id => {};

  const onShufflePlaylist = id => {};

  const onAddPlaylistToQueue = id => {};

  const onDeletePlaylist = id => {
    const isCurrentPlaylist = musicInfo.currentlyPlaying?.playlistId === id;

    console.log(
      `[Playlist/onDeletePlaylist] id=${id}, musicInfo=${JSON.stringify(
        musicInfo.currentlyPlaying,
      )}, is current playlist=${isCurrentPlaylist}`,
    );

    const newList = playlists.filter(pl => pl.id !== id);
    AsyncStorage.setItem(keys.PLAYLISTS, JSON.stringify(newList))
      .then(() => {
        setMusicInfo(info => {
          const _info = { ...info };
          _info[keys.PLAYLISTS] = newList;
          if (isCurrentPlaylist) _info.currentlyPlaying = null;
          return _info;
        });
        if (musicInfo.currentlyPlaying?.playlistId === id)
          playerControls.close();
        setSnackbarMessage({ info: labels.playlistDeletedSuccessfully });
      })
      .catch(err => {
        console.log(
          `[Playlists] ${labels.errorDeletingPlaylist}: ${JSON.stringify(err)}`,
        );
        setSnackbarMessage({
          isError: true,
          info: `${labels.errorDeletingPlaylist}: ${err.message}`,
        });
      });
  };

  const sortAllPlaylists = (list, by, order) => {
    const _sort = (getValue, type = 'string') => {
      let compare;
      if (type === 'string') {
        if (order === sortingOrders.ASCENDING)
          compare = (a, b) =>
            getValue(a) < getValue(b) ? -1 : getValue(a) > getValue(b) ? 1 : 0;
        else
          compare = (a, b) =>
            getValue(b) < getValue(a) ? -1 : getValue(b) > getValue(a) ? 1 : 0;
      } else if (type === 'number') {
        if (order === sortingOrders.ASCENDING)
          compare = (a, b) => getValue(a) - getValue(b);
        else compare = (a, b) => getValue(b) - getValue(a);
      } else throw new Error(`Invalid type: ${type} or order: ${order}`);

      setPlaylists(list.sort(compare));
    };

    switch (by) {
      case sortingOptions.TITLE:
        _sort(x => x.name);
        break;
      case sortingOptions.TRACKS:
        _sort(x => x.track_ids.length, 'number');
        break;
      case sortingOptions.DURATION:
        _sort(x => {
          let totalDuration = 0;
          x.track_ids.forEach(
            id =>
              (totalDuration +=
                musicInfo[keys.TRACKS].find(tr => tr.id === id)?.duration ?? 0),
          );
          return totalDuration;
        }, 'number');
        break;
      case sortingOptions.CREATED_ON:
        _sort(x => x.created, 'number');
        break;
      case sortingOptions.UPDATED_ON:
        _sort(x => x.last_updated, 'number');
        break;
      default:
        throw new Error(`Invalid by: ${by}`);
    }

    setSortBy(by);
    setSortOrder(order);
  };

  const onPlayAllPlaylists = () => {};

  const closeEditModal = () => {
    console.log(`[Playlists/closeEditModal] force saving playlist`);
    playlist.current.save();
    // .then(res => {
    //   console.log(
    //     `[Playlists/closeEditModal] save: res: ${JSON.stringify(res)}`,
    //   );
    // })
    // .catch(err => {
    //   console.log(
    //     `[Playlists/closeEditModal] save: err: ${JSON.stringify(err)}`,
    //   );
    // });
    hideItemInfoPanel();
    setEditingPlaylistId(null);
  };

  // console.log(
  //   `[Playlists] editingPlaylistInfo=${JSON.stringify(editingPlaylistInfo)}`,
  // );

  // const fillEditingPlaylistInfo = info => {
  //   const tracks = [];
  //   musicInfo?.[keys.TRACKS]?.forEach(tr => {
  //     if (info.track_ids.includes(tr.id)) tracks.push(tr);
  //   });
  //   info.tracks = tracks;
  //   setEditingPlaylistInfo(info);
  // };

  const showItemInfoPanel = ({ type, data }) => {
    console.log(
      `[showItemInfo] type=${type}, data=${JSON.stringify(
        data,
      )}, infoPanelAnimatedValue=${JSON.stringify(infoPanelAnimatedValue)}`,
    );
    // displayMode: ItemInfoDisplayModes.SCREEN,

    // if (!itemInfo) setItemInfo({ type, data });
    setItemInfo({ type, data });
    Animated.timing(infoPanelAnimatedValue, {
      // Animated.spring(infoPanelAnimatedValue, { // TODO: Implement this
      // toValue: itemInfo ? 0 : 1,
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // }).start(() => {
    //   // if (itemInfo) setItemInfo(null);
    // });
  };

  const hideItemInfoPanel = () => {
    console.log(
      `[hideItemInfoPanel] itemInfo=${itemInfo}, infoPanelAnimatedValue=${JSON.stringify(
        infoPanelAnimatedValue,
      )}`,
    );

    // console.log(`[hideItemInfoPanel] itemInfo=${itemInfo}`);
    Animated.timing(infoPanelAnimatedValue, {
      // Animated.spring(infoPanelAnimatedValue, { // TODO: Implement this
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setItemInfo(null);
    });
  };

  // FIXME: Screen is not scrollable
  const getInfoPanelHeaderText = type =>
    `${
      type === keys.TRACKS
        ? labels.track
        : type === keys.PLAYLISTS && labels.playlist
    } Info`;

  return (
    <>
      <ScreenContainer
        styles={{ wrapper: { flex: 1 } }}
        noScroll
        hasRoundedContainer
        varHeights={{ collapsed: hp(14), closed: hp(5) }}>
        <PlaylistControls
          enabledDarkTheme={enabledDarkTheme}
          disabled={!musicInfo?.[keys.PLAYLISTS]?.length}
          sortKeys={[
            sortingOptions.TITLE,
            sortingOptions.TRACKS,
            sortingOptions.DURATION,
            sortingOptions.CREATED_ON,
            sortingOptions.UPDATED_ON,
          ]}
          sortOrder={sortOrder}
          onChangeSortOrder={order =>
            sortAllPlaylists([...playlists], sortBy, order)
          }
          sortBy={sortBy}
          onChangeSortBy={by => sortAllPlaylists([...playlists], by, sortOrder)}
          onShuffle={onShufflePlaylist}
          onPlay={onPlayAllPlaylists}
        />

        <View
          style={{
            // flex:1,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            // alignContents: 'center',
          }}>
          {!playlists.length ? (
            <Text
              style={{
                flex: 1,
                fontSize: wp(5),
                color: colors.lightGrey,
                textAlign: 'center',
                marginTop: hp(15),
              }}>
              {labels.nothingHere}
            </Text>
          ) : (
            <FlatList
              // horizontal
              style={{
                flex: 1,
                flexDirection: 'row',
                alignContent: 'center',
                // paddingHorizontal: wp(3),
                // backgroundColor: 'blue',
                marginHorizontal: wp(-2.5),
              }}
              contentContainerStyle={{
                flex: 1,
                flexDirection: 'row',
                alignContent: 'center',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              data={playlists}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={setEditingPlaylistId.bind(this, item.id)}
                  style={{
                    alignSelf: 'flex-start',
                    borderRadius: 10,
                    overflow: 'hidden',
                    elevation: 2,
                    alignItems: 'center',
                    marginVertical: hp(1),
                    marginHorizontal: wp(1.5),
                    backgroundColor: enabledDarkTheme
                      ? colors.darker
                      : colors.lighter,
                  }}>
                  <TrackListCover
                    // playlistId={item.id}
                    playlist={item}
                    tracks={musicInfo[keys.TRACKS]}

                    // onEdit={info => setEditingPlaylistId(info.id)}
                    // onEdit={fillEditingPlaylistInfo}
                    // onPlay={onPlayPlaylist}
                    // onShuffle={onShufflePlaylist}
                    // onAddToQueue={onAddPlaylistToQueue}
                    // onShowInfo={onShowPlaylistInfo}
                    // onDelete={onDeletePlaylist}
                    // style={{
                    //   backgroundColor: 'lightblue',
                    //   // marginVertical: hp(1)
                    // }}
                  >
                    <View
                      style={{
                        position: 'absolute',
                        // flex: 1,
                        height: '100%',
                        width: '100%',
                        zIndex: 1,
                        backgroundColor: colors.black,
                        opacity: 0.3,
                      }}
                    />

                    <TouchableOpacity
                      onPress={onPlayPlaylist.bind(this, item.id)}
                      style={{
                        // flex: 1,
                        // backgroundColor: colors.black,
                        // backgroundColor: 'transparent',
                        alignSelf: 'center',
                        position: 'absolute',
                        zIndex: 2,
                        // left: '50%',
                        // top: '50%',
                        opacity: 1,
                      }}>
                      {/* TODO: Add a playing animation like in Google Music along with the pause icon */}
                      <Icon
                        name={
                          IconUtils.getInfo(
                            keys[
                              item.id === musicInfo.currentlyPlaying?.playlistId
                                ? 'PAUSE'
                                : 'PLAY'
                            ],
                          ).name.outlined
                        }
                        // name="ios-play-circle"
                        // name="pause-circle"
                        // name="play-circle"
                        // name="md-play-circle-outline"
                        // name="md-pause-circle-outline"
                        // type="Ionicons"
                        // type="FontAwesome5"
                        type={IconUtils.getInfo(keys.PLAY).type}
                        color={colors.white1}
                        size={hp(5)}
                        // size={hp(15)}
                      />
                    </TouchableOpacity>
                  </TrackListCover>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      zIndex: 2,
                      marginVertical: hp(0.5),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Icon
                        size={wp(4)}
                        name={IconUtils.getInfo(keys.PLAYLISTS).name.filled}
                        color={colors.lightGrey}
                      />
                      <Text
                        style={{ fontSize: wp(3), color: colors.lightGrey }}>
                        {/*{info?.track_ids?.length}*/}
                        {item.track_ids?.length}
                      </Text>
                    </View>

                    <Text
                      titleEllipsizeMode="tail"
                      style={{
                        fontSize: wp(4),
                        textAlign: 'center',
                        width: wp(28),
                        // TODO: Take care of the below width calc
                        // width: wp(
                        //   coverContents.length === COVER_ROW_CELL_COUNT * 2
                        //     ? 90
                        //     : 28,
                        // ),
                      }}>
                      {item.name}
                    </Text>

                    <Menu
                      visible={item.id === showMenuForId}
                      onDismiss={setShowMenuForId.bind(this, null)}
                      anchor={
                        <IconButton
                          style={{
                            padding: 0,
                            margin: 0,
                          }}
                          icon={
                            IconUtils.getInfo(keys.VERTICAL_ELLIPSIS).name
                              .default
                          }
                          size={wp(4)}
                          color={colors.lightGrey}
                          onPress={setShowMenuForId.bind(this, item.id)}
                        />
                      }>
                      <Menu.Item
                        icon={IconUtils.getInfo(keys.PLAY).name.default}
                        title={labels.play}
                        onPress={() => {
                          onPlayPlaylist(item.id);
                          setShowMenuForId(null);
                        }}
                      />
                      <Menu.Item
                        icon={IconUtils.getInfo(keys.SHUFFLE).name.default}
                        title={labels.shuffleAndPlay}
                        onPress={() => {
                          onShufflePlaylist(item.id);
                          onPlayPlaylist(item.id);
                          setShowMenuForId(null);
                        }}
                      />
                      <Menu.Item
                        icon={IconUtils.getInfo(keys.ADD_TO_QUEUE).name.default}
                        title={labels.addToQueue}
                        onPress={() => {
                          onAddPlaylistToQueue(item.id);
                          setShowMenuForId(null);
                        }}
                      />
                      <Menu.Item
                        icon={
                          IconUtils.getInfo(keys.PLAYLIST_EDIT).name.default
                        }
                        title={labels.edit}
                        onPress={() => {
                          setEditingPlaylistId(item.id);
                          setShowMenuForId(null);
                        }}
                      />
                      <Menu.Item
                        icon={IconUtils.getInfo(keys.DELETE).name.default}
                        title={labels.delete}
                        onPress={() => {
                          onDeletePlaylist(item.id);
                          setShowMenuForId(null);
                        }}
                      />
                      {/*<Menu.Item*/}
                      {/*  icon={IconUtils.getInfo(keys.INFO).name.default}*/}
                      {/*  title={labels.showInfo}*/}
                      {/*  onPress={() => {*/}
                      {/*    onShowInfo();*/}
                      {/*    setShowMenu(false);*/}
                      {/*  }}*/}
                      {/*/>*/}
                    </Menu>
                  </View>
                </TouchableOpacity>
              )}
            />

            // <>
            //   {playlists.map((info, index) => (
            //     <PlaylistCover
            //       key={index}
            //       playlistId={info.id}
            //       onEdit={info => setEditingPlaylistId(info.id)}
            //       // onEdit={fillEditingPlaylistInfo}
            //       onPlay={onPlayPlaylist}
            //       onShuffle={onShufflePlaylist}
            //       onAddToQueue={onAddPlaylistToQueue}
            //       // onShowInfo={onShowPlaylistInfo}
            //       onDelete={onDeletePlaylist}
            //       // style={{
            //       //   backgroundColor: 'lightblue',
            //       //   // marginVertical: hp(1)
            //       // }}
            //     />
            //
            //     // <Text>ID: {info.id}</Text>
            //     // <Text>Name: {info.name}</Text>
            //     // <Text>Created On: {new Date(info.created).toString()}</Text>
            //     // <Text>
            //     //   Last Updated On: {new Date(info.last_updated).toString()}
            //     // </Text>
            //     // <Text>{`Tracks (${musicInfo[keys.TRACKS].length}):`}</Text>
            //     // {info.track_ids.map((id, trackIndex) => (
            //     //   <Text key={trackIndex}>
            //     //     {`  [${id}] ${
            //     //       musicInfo[keys.TRACKS].find(t => t.id === id).title
            //     //     }`}
            //     //   </Text>
            //     // ))}
            //   ))}
            // </>
          )}
        </View>
      </ScreenContainer>

      <Modal
        testID={'modal'}
        // isVisible={Boolean(editingPlaylistInfo)}
        isVisible={Boolean(editingPlaylistId)}
        // isVisible={false}
        onSwipeComplete={closeEditModal}
        swipeDirection={['down']}
        // scrollTo={this.handleScrollTo}
        // scrollOffset={this.state.scrollOffset}
        onBackdropPress={closeEditModal}
        onBackButtonPress={closeEditModal}
        backdropOpacity={0.5}
        scrollOffsetMax={hp(80)} // content height - ScrollView height
        propagateSwipe={true}
        style={{
          // flex: 1,
          justifyContent: 'flex-end',
          margin: 0,
        }}>
        <View
          style={{
            // height: hp(70),
            flex: 0.8,
            backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
            overflow: 'hidden',
            alignItems: 'center',
          }}>
          <View
            style={{
              marginTop: hp(1),
              marginBottom: hp(2),
              paddingVertical: hp(0.3),
              width: wp(10),
              backgroundColor: colors.black,
              opacity: 0.3,
              borderRadius: 10,
              alignSelf: 'center',
            }}
          />

          {/*<Playlist*/}
          {/*  name={editingPlaylistInfo?.name}*/}
          {/*  tracks={editingPlaylistInfo?.tracks || []}*/}
          {/*  setTracks={tracks => {*/}
          {/*    setEditingPlaylistInfo(prev => ({ ...prev, tracks }));*/}
          {/*  }}*/}
          {/*/>*/}

          {/*<Text>{JSON.stringify(navigator)}</Text>*/}

          {/* FIXME: Spoiling the styles of Playlist component */}
          <View
            style={{
              flexDirection: 'row',
              // alignItems: 'center',
              // alignContents: 'center',
              flex: 1,
            }}>
            <Animated.View
              style={{
                transform: [
                  {
                    // translateX: wp(45), // normal
                    // translateX: -wp(50), // slided to the left

                    translateX: infoPanelAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [wp(45), -wp(50)],
                    }),
                  },
                ],
                borderTopStartRadius: 15,
                borderTopEndRadius: 15,
                overflow: 'hidden',
              }}>
              <Playlist
                ref={playlist}
                id={editingPlaylistId}
                showItemInfo={showItemInfoPanel}
              />
            </Animated.View>

            <Animated.View
              style={{
                // position: 'absolute',
                // flex: 1,
                // alignSelf: 'flex-end',
                // height: hp(70),
                // width: wp(90),
                width: wp(90),
                backgroundColor: colors[enabledDarkTheme ? 'darker' : 'white'],
                borderRadius: 10,
                overflow: 'hidden',
                paddingTop: hp(2),
                paddingBottom: hp(1),
                paddingHorizontal: wp(4),
                marginBottom: hp(0.7),
                transform: [
                  {
                    // translateX: wp(60), // normal
                    // translateX: -wp(45), // slided to the right

                    translateX: infoPanelAnimatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [wp(50), -wp(45)],
                    }),
                  },
                ],
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: hp(1),
                }}>
                <TouchableOpacity onPress={hideItemInfoPanel}>
                  <Icon
                    type={IconUtils.getInfo(keys.BACK_ANDROID).type}
                    name={
                      IconUtils.getInfo(
                        keys[
                          Platform.OS === 'ios' ? 'BACK_IOS' : 'BACK_ANDROID'
                        ],
                      ).name.filled
                    }
                    color={colors[enabledDarkTheme ? 'light' : 'dark']}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    fontSize: wp(6),
                    color: colors[enabledDarkTheme ? 'light' : 'dark'],
                    marginLeft: wp(20),
                  }}>
                  {getInfoPanelHeaderText(itemInfo?.type)}
                </Text>
              </View>

              {/*<Text>{JSON.stringify(itemInfo)}</Text>*/}

              <ScrollView
                style={{
                  flex: 1,
                }}>
                {itemInfo && (
                  <Info
                    type={itemInfo.type}
                    data={itemInfo.data}
                    artworkSize={hp(20)}
                  />
                )}
              </ScrollView>
            </Animated.View>
          </View>

          {/*<Animated.View*/}
          {/*  style={{*/}
          {/*    backgroundColor: 'grey',*/}
          {/*    width: infoPanelAnimatedValue.interpolate({*/}
          {/*      inputRange: [0, 1],*/}
          {/*      outputRange: [0, wp(60)],*/}
          {/*    }),*/}
          {/*  }}>*/}
          {/*  <Text>Info Panel</Text>*/}
          {/*</Animated.View>*/}

          {/*<Animated.View*/}
          {/*  // elevation={50}*/}
          {/*  style={{*/}
          {/*    transform: [*/}
          {/*      {*/}
          {/*        translateX: infoPanelAnimatedValue.interpolate({*/}
          {/*          inputRange: [0, 1],*/}
          {/*          outputRange: [-wp(90), wp(90)],*/}
          {/*        }),*/}
          {/*      },*/}
          {/*    ],*/}

          {/*    display: 'none',*/}

          {/*    width: wp(90),*/}
          {/*    // width: infoPanelAnimatedValue.interpolate({*/}
          {/*    //   inputRange: [0, 1],*/}
          {/*    //   outputRange: [0, wp(90)],*/}
          {/*    // }),*/}
          {/*    height: hp(72),*/}
          {/*    borderRadius: 15,*/}
          {/*    overflow: 'hidden',*/}
          {/*    paddingVertical: hp(2),*/}
          {/*    // paddingVertical: infoPanelAnimatedValue.interpolate({*/}
          {/*    //   inputRange: [0, 1],*/}
          {/*    //   outputRange: [0, hp(2)],*/}
          {/*    // }),*/}
          {/*    paddingHorizontal: wp(4),*/}
          {/*    // paddingHorizontal: infoPanelAnimatedValue.interpolate({*/}
          {/*    //   inputRange: [0, 1],*/}
          {/*    //   outputRange: [0, wp(4)],*/}
          {/*    // }),*/}
          {/*    // flex: 1,*/}
          {/*    // borderWidth: 2,*/}
          {/*    // borderColor: 'blue',*/}
          {/*    backgroundColor: 'grey',*/}
          {/*    // position: 'absolute',*/}
          {/*    // zIndex: 999,*/}
          {/*    // elevation: 10,*/}
          {/*    // bottom: 10,*/}
          {/*    right: wp(5),*/}
          {/*    bottom: hp(1.5),*/}
          {/*  }}>*/}
          {/*  <Text onPress={hideItemInfoPanel}>Close</Text>*/}
          {/*  <Text>Info Panel</Text>*/}

          {/*  <Text>{JSON.stringify(itemInfo)}</Text>*/}
          {/*</Animated.View>*/}

          {/*<Animated.View*/}
          {/*  // elevation={50}*/}
          {/*  style={{*/}
          {/*    // width: wp(90),*/}
          {/*    width: infoPanelAnimatedValue.interpolate({*/}
          {/*      inputRange: [0, 1],*/}
          {/*      outputRange: [0, wp(90)],*/}
          {/*    }),*/}
          {/*    // height: hp(72),*/}
          {/*    borderRadius: 15,*/}
          {/*    overflow: 'hidden',*/}
          {/*    // paddingVertical: hp(2),*/}
          {/*    paddingVertical: infoPanelAnimatedValue.interpolate({*/}
          {/*      inputRange: [0, 1],*/}
          {/*      outputRange: [0, hp(2)],*/}
          {/*    }),*/}
          {/*    // paddingHorizontal: wp(4),*/}
          {/*    paddingHorizontal: infoPanelAnimatedValue.interpolate({*/}
          {/*      inputRange: [0, 1],*/}
          {/*      outputRange: [0, wp(4)],*/}
          {/*    }),*/}
          {/*    // flex: 1,*/}
          {/*    // borderWidth: 2,*/}
          {/*    // borderColor: 'blue',*/}
          {/*    backgroundColor: 'grey',*/}
          {/*    position: 'absolute',*/}
          {/*    zIndex: 999,*/}
          {/*    elevation: 10,*/}
          {/*    // bottom: 10,*/}
          {/*    right: wp(5),*/}
          {/*    bottom: hp(1.5),*/}
          {/*  }}>*/}
          {/*  <Text onPress={hideItemInfoPanel}>Close</Text>*/}
          {/*  <Text>Info Panel</Text>*/}

          {/*  <Text>{JSON.stringify(itemInfo)}</Text>*/}
          {/*</Animated.View>*/}
        </View>
        {/*</View>*/}
      </Modal>

      <Snackbar
        visible={Boolean(snackbarMessage)}
        duration={snackbarMessage?.isError ? 4000 : 2000}
        style={{
          opacity: 0.7,
          backgroundColor: colors[snackbarMessage?.isError ? 'red' : 'black'],
        }}
        onDismiss={setSnackbarMessage.bind(this, null)}
        // wrapperStyle={{
        //   backgroundColor: 'red',
        // }}
        action={{
          label: labels.OK,
          onPress: setSnackbarMessage.bind(this, null),
        }}>
        {snackbarMessage?.info}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({});

export default Playlists;

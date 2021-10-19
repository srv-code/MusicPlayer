import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
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
import { Snackbar, Text } from 'react-native-paper';
import ScreenContainer from '../../components/screen-container';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import keys from '../../constants/keys';
import { MusicContext } from '../../context/music';
import PlaylistCover from '../../components/playlist-cover';
import Modal from 'react-native-modal';
import Playlist from '../../components/playlist';
import PlaylistControls from '../../components/playlist-controls';
import { sortingOptions, sortingOrders } from '../../constants/tracks';
import { displayModes as ItemInfoDisplayModes } from '../item-info';
import Icon from '../../components/icon';
import IconUtils from '../../utils/icon';
import labels from '../../constants/labels';
import Info from '../../components/info';
import PlaylistUtils from '../../utils/playlist';

const Playlists = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { musicInfo, setMusicInfo } = useContext(MusicContext);

  const [playlists, setPlaylists] = useState([]);
  const [editingPlaylistID, setEditingPlaylistID] = useState(null);
  const [sortBy, setSortBy] = useState(sortingOptions.TITLE);
  const [sortOrder, setSortOrder] = useState(sortingOrders.ASCENDING);
  const [itemInfo, setItemInfo] = useState(null);
  const [infoPanelAnimatedValue] = useState(new Animated.Value(0));
  const [snackbarMessage, setSnackbarMessage] = useState(null);

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
    console.log(`[Playlists] delete playlist id ${id}`);
    PlaylistUtils.delete(id, playlists, musicInfo, setMusicInfo)
      .then(() => {
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

  const dynamicStyles = {
    screen: {
      ...styles.screen,
      backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
    },
    container: {
      ...styles.container,
      backgroundColor: enabledDarkTheme ? colors.darkest : colors.light,
    },
  };

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
    setEditingPlaylistID(null);
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
      // Animated.spring(infoPanelAnimatedValue, { // TODO Implement this
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
      // Animated.spring(infoPanelAnimatedValue, { // TODO Implement this
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      setItemInfo(null);
    });
  };

  // FIXME Screen is not scrollable
  const getInfoPanelHeaderText = type =>
    `${
      type === keys.TRACKS
        ? labels.track
        : type === keys.PLAYLISTS && labels.playlist
    } Info`;

  return (
    <>
      <ScreenContainer style={dynamicStyles.screen}>
        <View style={dynamicStyles.container}>
          {/*<Text>Playlists screen</Text>*/}

          {/*<Text*/}
          {/*  onPress={navigation.navigate.bind(this, screenNames.editPlaylist)}>*/}
          {/*  Go to info screen*/}
          {/*</Text>*/}

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
            onChangeSortBy={by =>
              sortAllPlaylists([...playlists], by, sortOrder)
            }
            onShuffle={onShufflePlaylist}
            onPlay={onPlayAllPlaylists}
          />

          <View
            style={{
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
                {labels.nothingYet}
              </Text>
            ) : (
              <>
                {playlists.map((info, index) => (
                  <PlaylistCover
                    key={index}
                    playlistID={info.id}
                    onEdit={info => setEditingPlaylistID(info.id)}
                    // onEdit={fillEditingPlaylistInfo}
                    onPlay={onPlayPlaylist}
                    onShuffle={onShufflePlaylist}
                    onAddToQueue={onAddPlaylistToQueue}
                    // onShowInfo={onShowPlaylistInfo}
                    onDelete={onDeletePlaylist}
                    // style={{
                    //   backgroundColor: 'lightblue',
                    //   // marginVertical: hp(1)
                    // }}
                  />

                  // <Text>ID: {info.id}</Text>
                  // <Text>Name: {info.name}</Text>
                  // <Text>Created On: {new Date(info.created).toString()}</Text>
                  // <Text>
                  //   Last Updated On: {new Date(info.last_updated).toString()}
                  // </Text>
                  // <Text>{`Tracks (${musicInfo[keys.TRACKS].length}):`}</Text>
                  // {info.track_ids.map((id, trackIndex) => (
                  //   <Text key={trackIndex}>
                  //     {`  [${id}] ${
                  //       musicInfo[keys.TRACKS].find(t => t.id === id).title
                  //     }`}
                  //   </Text>
                  // ))}
                ))}
              </>
            )}
          </View>
        </View>
      </ScreenContainer>

      <Modal
        testID={'modal'}
        // isVisible={Boolean(editingPlaylistInfo)}
        isVisible={Boolean(editingPlaylistID)}
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

          {/* FIXME Spoiling the styles of Playlist component */}
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
                id={editingPlaylistID}
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
});

export default Playlists;

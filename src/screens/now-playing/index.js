import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { BottomSheetScrollView, BottomSheetView } from '@gorhom/bottom-sheet';
import { Avatar, Button, List, Text } from 'react-native-paper';
import screenNames from '../../constants/screen-names';
import globalStyles from '../../styles';
import Player from '../../components/player';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TrackPlayer, {
  useTrackPlayerEvents as usePlayerEvents,
  Event as PlayerEvent,
  State as PlayerState,
  RepeatMode as PlayerRepeatMode,
  useProgress as usePlayerProgress,
  RepeatMode,
} from 'react-native-track-player';
import { MusicContext } from '../../context/music';
import PlayerUtils from '../../utils/player';
import labels from '../../constants/labels';
import DateTimeUtils from '../../utils/datetime';
import Icon from '../../components/icon';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import Slider from 'react-native-slider';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import MarqueeText from 'react-native-marquee';
import AsyncStorage from '@react-native-async-storage/async-storage';
import keys from '../../constants/keys';
import { DisplayModes as ItemInfoDisplayModes } from '../item-info';
import { useBackHandler } from '@react-native-community/hooks';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import IconUtils from '../../utils/icon';

const playSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// FIXME Player buttons are not corresponding to the actual play state (sometimes)
const NowPlaying = ({ navigation, extraData: { snapIndex, setSnapIndex } }) => {
  const { musicInfo, setMusicInfo } = useContext(MusicContext);
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const [trackInfo, setTrackInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPreviousTrack, setHasPreviousTrack] = useState(false);
  const [hasNextTrack, setHasNextTrack] = useState(false);
  const [showRemainingTime, setShowRemainingTime] = useState(false);
  const [playSpeedIndex, setPlaySpeedIndex] = useState(3);
  const [repeatMode, setRepeatMode] = useState(PlayerRepeatMode.Off);

  const trackProgress = usePlayerProgress();

  const isFocused = useIsFocused();
  useBackHandler(() => {
    if (isFocused && (snapIndex === 1 || snapIndex === 2)) {
      setSnapIndex(0);
      return true; /* custom handling */
    }
    return false; /* default handling */
  });

  // console.log(`>> Progress: ${JSON.stringify(trackProgress)}`);

  useEffect(async () => {
    if (snapIndex === -1) {
      await TrackPlayer.reset();
      setTrackInfo(null);
    }
  }, [snapIndex]);

  // useEffect(() => {
  //   setTrackInfo(musicInfo.currentTrack);
  // }, [musicInfo]);

  usePlayerEvents(
    [
      PlayerEvent.PlaybackTrackChanged,
      PlayerEvent.PlaybackState,
      PlayerEvent.PlaybackError,
      PlayerEvent.PlaybackQueueEnded,
      PlayerEvent.PlaybackTrackChanged,
      PlayerEvent.PlaybackMetadataReceived,
      PlayerEvent.RemotePlay,
      PlayerEvent.RemotePlayId,
      PlayerEvent.RemotePlaySearch,
      PlayerEvent.RemotePause,
      PlayerEvent.RemoteStop,
      PlayerEvent.RemoteSkip,
      PlayerEvent.RemoteNext,
      PlayerEvent.RemotePrevious,
      PlayerEvent.RemoteJumpForward,
      PlayerEvent.RemoteJumpBackward,
      PlayerEvent.RemoteSeek,
      PlayerEvent.RemoteSetRating,
      PlayerEvent.RemoteDuck,
      PlayerEvent.RemoteLike,
      PlayerEvent.RemoteDislike,
      PlayerEvent.RemoteBookmark,
    ],
    async event => {
      console.log(
        `[NowPlaying] Player: Event: type=${event.type}, state=${JSON.stringify(
          PlayerUtils.getStateInfo(event.state),
        )}, event=${JSON.stringify(event)}`,
      );

      // TODO Add Queue ended event and show via AndroidToast

      if (
        event.type === PlayerEvent.PlaybackTrackChanged &&
        event.nextTrack != null
      ) {
        TrackPlayer.getTrack(event.nextTrack)
          .then(track => {
            console.log(
              `[Now Playing] changed to track=${JSON.stringify(track)}`,
            );
            setTrackInfo({
              ...track,
              playlistName: null,
              markedFavorite: musicInfo.favoriteIds.find(id => id === track.id),
            });
            setMusicInfo(data => ({
              ...data,
              currentlyPlaying: {
                track: track,
                indexInPlaylist: event.nextTrack,
                playlistId: null,
                markedFavorite: false,
              },
            }));
          })
          .catch(err => {
            throw err;
          });
        TrackPlayer.getQueue()
          .then(queue => {
            // console.log(
            //   `>> queue.length=${queue.length}, nextTrack=${
            //     event.nextTrack
            //   }, hasPrev=${event.nextTrack !== 0}, hasNext=${
            //     event.nextTrack + 1 !== queue.length
            //   }`,
            // );

            setHasPreviousTrack(event.nextTrack !== 0);
            setHasNextTrack(event.nextTrack + 1 !== queue.length);
          })
          .catch(err => {
            throw err;
          });
      } else if (event.type === PlayerEvent.PlaybackState) {
        setIsPlaying(
          event.state === PlayerState.Playing ||
            event.state === PlayerState.Buffering,
        );

        if (
          event.state === PlayerState.Stopped ||
          event.state === PlayerState.None
        ) {
          setTrackInfo(null);
          setMusicInfo(data => ({
            ...data,
            currentlyPlaying: null,
          }));
        }
      }
    },
  );

  // console.log(
  //   `[CurrentlyPlaying] trackInfo=${JSON.stringify(
  //     trackInfo,
  //   )}, musicInfo=${JSON.stringify(Object.keys(musicInfo))}`,
  // );

  // return (
  //   <View>
  //     <Text>trackInfo: {JSON.stringify(trackInfo)}</Text>
  //
  //     <Text>{trackInfo?.title}</Text>
  //     <Text>{trackInfo?.artwork}</Text>
  //     <Text>{trackInfo?.artist}</Text>
  //   </View>
  // );

  const renderMarqueeTrackDescription = track => {
    const info = [
      {
        text: track.artist,
        icon: IconUtils.getInfo(keys.ARTISTS),
      },
    ];
    if (snapIndex === 2) {
      info.push({
        text: track.album,
        icon: IconUtils.getInfo(keys.ALBUMS),
      });
      info.push({
        text: track.folder.name,
        icon: IconUtils.getInfo(keys.FOLDERS),
      });

      if (track.playlistName)
        info.push({
          text: track.playlistName,
          icon: IconUtils.getInfo(keys.PLAYLISTS),
        });
    }

    return (
      <>
        {info.map((data, index) => (
          <View key={index} style={styles.trackDescText}>
            <Icon
              type={data.icon.type}
              name={data.icon.name.outlined}
              size={wp(snapIndex === 2 ? 4 : 3.5)}
              color={colors.lightGrey}
              style={{ marginRight: wp(1) }}
            />
            <MarqueeText
              style={{
                fontSize: wp(snapIndex === 2 ? 4 : 3.2),
                color: colors.lightGrey,
                marginBottom: snapIndex === 2 ? hp(0.5) : 0,
                // marginLeft: wp(5.5),
                // paddingRight: wp(2),
                // backgroundColor: 'lightgreen',
                width: snapIndex === 0 ? wp(53) : null,
                // textAlign: 'center',
                // flex:1
              }}
              duration={5000}
              marqueeOnStart
              loop
              marqueeDelay={1000}
              marqueeResetDelay={1000}>
              {data.text}
            </MarqueeText>
          </View>
        ))}
      </>
    );
  };

  const renderMarqueeTrackTitle = title => {
    const fontSizes = [4, 5, 6];

    return (
      <MarqueeText
        style={{
          fontSize: wp(fontSizes[snapIndex]),
          marginBottom: snapIndex === 2 ? hp(1) : 0,
          color: enabledDarkTheme ? Colors.light : Colors.darker,
          // color: enabledDarkTheme ? 'white' : 'black',
          // backgroundColor: 'lightgreen',
          // width:
          //     snapIndex === 0 ? wp(58) :
          //       // snapIndex === 1 ? wp(90) :
          //         null,
          // width: snapIndex === 1 ? wp(90) : null,
        }}
        duration={5000}
        marqueeOnStart
        loop
        marqueeDelay={1000}
        marqueeResetDelay={1000}>
        {/*<Text>{title}</Text>*/}
        {title}
      </MarqueeText>
    );
  };

  // TODO Also check how it looks when no artwork is present (when using icon)
  const renderTrackArtwork = path => {
    const iconSizes = [6, 18, 30];

    if (path)
      return (
        <Avatar.Image
          size={hp(iconSizes[snapIndex])}
          source={{ uri: `file://${path}` }}
        />
      );
    return (
      <Avatar.Icon
        size={hp(iconSizes[snapIndex])}
        icon={IconUtils.getInfo(keys.TRACKS).name.default}
        style={styles.musicIcon}
      />
    );
  };

  const play = async () => {
    await TrackPlayer.play();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const skipBack = async () => {
    if (hasPreviousTrack) await TrackPlayer.skipToPrevious();
  };

  const skipForward = async () => {
    if (hasNextTrack) await TrackPlayer.skipToNext();
  };

  const renderPlayerControls = () => (
    <>
      {snapIndex === 2 && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            // backgroundColor: 'lightgreen',
            width: wp(90),
            marginBottom: hp(2.5),
          }}>
          {/*<Text>Playlist</Text>*/}
          <TouchableOpacity
            style={styles.secondaryPlayerButtons}
            // activeOpacity={hasPreviousTrack ? 0.2 : 1}
            onPress={navigation.navigate.bind(
              this,
              screenNames.currentPlaylist,
              { playlistId: null },
            )}>
            <Icon
              name={IconUtils.getInfo(keys.PLAYLISTS).name.outlined}
              // TODO update the button colors
              size={wp(6)}
              // style={{ opacity: hasPreviousTrack ? 1 : 0.2 }}
            />
          </TouchableOpacity>

          {/*<Text>Rate</Text>*/}
          <TouchableOpacity
            style={styles.secondaryPlayerButtons}
            // activeOpacity={hasPreviousTrack ? 0.2 : 1}
            onLongPress={() => {
              if (playSpeeds[playSpeedIndex] === 1) return;
              const normalSpeedIndex = playSpeeds.findIndex(s => s === 1);
              TrackPlayer.setRate(playSpeeds[normalSpeedIndex]).then(() => {
                setPlaySpeedIndex(normalSpeedIndex);
                ToastAndroid.show(labels.playingSpeedReset, ToastAndroid.SHORT);
              });
            }}
            onPress={() => {
              const newSpeedIndex = (playSpeedIndex + 1) % playSpeeds.length;
              TrackPlayer.setRate(playSpeeds[newSpeedIndex]).then(() => {
                setPlaySpeedIndex(newSpeedIndex);
              });
            }}>
            {/*<Text>{playSpeedIndex}</Text>*/}
            <Text
              style={{
                fontSize: wp(4),
                fontWeight: 'bold',
                color: colors.lightGrey,
              }}>
              {`${playSpeeds[playSpeedIndex]}x`}
            </Text>
          </TouchableOpacity>

          {/*<Text>Heart</Text>*/}
          <TouchableOpacity
            style={styles.secondaryPlayerButtons}
            // activeOpacity={hasPreviousTrack ? 0.2 : 1}
            onPress={() => {
              const newFavoriteValue = !trackInfo.markedFavorite;
              const newFavoriteIds = newFavoriteValue
                ? [...musicInfo.favoriteIds, trackInfo.id]
                : musicInfo.favoriteIds.filter(id => id !== trackInfo.id);

              AsyncStorage.setItem(
                keys.FAVORITE_IDS,
                JSON.stringify(newFavoriteIds),
              )
                .then(() => {
                  setMusicInfo(data => ({
                    ...data,
                    favoriteIds: newFavoriteIds,
                  }));
                  setTrackInfo(data => ({
                    ...data,
                    markedFavorite: newFavoriteValue,
                  }));
                })
                .catch(err => {
                  ToastAndroid.show(
                    `${labels.couldntFavSong}: ${err.message}`,
                    ToastAndroid.LONG,
                  );
                  throw err;
                });
            }}>
            <Icon
              name={
                trackInfo.markedFavorite
                  ? IconUtils.getInfo(keys.FAVORITE).name.filled
                  : IconUtils.getInfo(keys.FAVORITE).name.outlined
              }
              // TODO update the button colors
              size={wp(6)}
              // style={{ opacity: hasPreviousTrack ? 1 : 0.2 }}
            />
          </TouchableOpacity>

          {/*<Text>Repeat Mode</Text>*/}
          <TouchableOpacity
            style={styles.secondaryPlayerButtons}
            // activeOpacity={hasPreviousTrack ? 0.2 : 1}
            onPress={() => {
              const nextMode = (repeatMode + 1) % 3;
              TrackPlayer.setRepeatMode(nextMode).then(
                setRepeatMode.bind(this, nextMode),
              );
            }}>
            {/*<Text>{repeatMode}</Text>*/}
            <Icon
              name={
                repeatMode === RepeatMode.Off
                  ? IconUtils.getInfo(keys.REPEAT_OFF).name.default
                  : repeatMode === RepeatMode.Track
                  ? IconUtils.getInfo(keys.REPEAT_ONCE).name.default
                  : IconUtils.getInfo(keys.REPEAT).name.default
              }
              // TODO update the button colors
              size={wp(6)}
              // style={{ opacity: hasPreviousTrack ? 1 : 0.2 }}
            />
          </TouchableOpacity>

          {/*<Text>Info</Text>*/}
          <TouchableOpacity
            style={styles.secondaryPlayerButtons}
            // activeOpacity={hasPreviousTrack ? 0.2 : 1}
            onPress={navigation.navigate.bind(this, screenNames.itemInfo, {
              type: keys.TRACKS,
              displayMode: ItemInfoDisplayModes.MODAL,
              data: trackInfo,
            })}>
            <Icon
              name={IconUtils.getInfo(keys.INFO).name.default}
              // TODO update the button colors
              size={wp(6)}
              // style={{ opacity: hasPreviousTrack ? 1 : 0.2 }}
            />
          </TouchableOpacity>
        </View>
      )}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // borderWidth: 1,
          width: wp(snapIndex === 0 ? 25 : 55),
          // padding: 0,
          // backgroundColor: 'lightgreen',
          // marginLeft: wp(1.5),
        }}>
        <TouchableOpacity
          style={styles.playerButton}
          activeOpacity={hasPreviousTrack ? 0.2 : 1}
          onPress={skipBack}>
          <Icon
            // TODO update the button colors
            name={IconUtils.getInfo(keys.SKIP_BACK).name.filled}
            type={IconUtils.getInfo(keys.SKIP_BACK).type}
            size={wp(snapIndex === 2 ? 11 : 7)}
            style={{ opacity: hasPreviousTrack ? 1 : 0.2 }}
          />
        </TouchableOpacity>

        {isPlaying ? (
          <TouchableOpacity style={styles.playerButton} onPress={pause}>
            <Icon
              // TODO update the button colors, add spring animation
              name={IconUtils.getInfo(keys.PAUSE).name.filled}
              type={IconUtils.getInfo(keys.PAUSE).type}
              size={wp(snapIndex === 2 ? 12.4 : 8.4)}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.playerButton} onPress={play}>
            <Icon
              // TODO update the button colors, add spring animation
              name={IconUtils.getInfo(keys.PLAY).name.filled}
              type={IconUtils.getInfo(keys.PLAY).type}
              size={wp(snapIndex === 2 ? 12 : 8)}
            />
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.playerButton}
          activeOpacity={hasNextTrack ? 0.2 : 1}
          onPress={skipForward}>
          <Icon
            // TODO update the button colors
            name={IconUtils.getInfo(keys.SKIP_NEXT).name.filled}
            type={IconUtils.getInfo(keys.SKIP_NEXT).type}
            style={{ opacity: hasNextTrack ? 1 : 0.2 }}
            size={wp(snapIndex === 2 ? 11 : 7)}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderExpandedPlayerView = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* Renders artwork */}
      <LinearGradient
        colors={
          enabledDarkTheme
            ? ['#767676', '#595959', '#323232'] // excluded: '#282828'
            : ['#d4d4d4', '#999999', '#7b7b7b', '#373737']
        }
        style={{
          elevation: 10,
          // borderRadius: hp(10),
          // borderColor: 'transparent',
          // borderWidth: wp(2),
          borderRadius: hp(20),
          padding: wp(2),
          marginVertical: hp(1),
          alignItems: 'center',
        }}>
        <View
          style={{
            // elevation: 10,
            // alignItems: 'center',
            // borderWidth: wp(2),
            // justifyContent: 'center',
            // alignContent: 'center',
            // alignSelf: 'flex-start',
            borderRadius: hp(20),
            // borderColor: enabledDarkTheme ? '#3b3b3b' : '#c0c0c0',
            // elevation: 10,
            // backgroundColor: 'transparent'
          }}>
          {renderTrackArtwork(trackInfo.artwork)}
          {/*{trackInfo.artwork ? (*/}
          {/*  <Avatar.Image*/}
          {/*    size={hp(snapIndex === 1 ? 18 : 30)}*/}
          {/*    source={{ uri: `file://${trackInfo.artwork}` }}*/}
          {/*  />*/}
          {/*) : (*/}
          {/*  // <Avatar.Icon*/}
          {/*  //   size={hp(18)}*/}
          {/*  //   icon="music"*/}
          {/*  //   style={styles.musicIcon}*/}
          {/*  // />*/}
          {/*  <Icon*/}
          {/*    name={'music'}*/}
          {/*    size={hp(snapIndex === 1 ? 12 : 18)}*/}
          {/*    style={{*/}
          {/*      padding: wp(snapIndex === 1 ? 5.5 : 11),*/}
          {/*      color: colors.lightPurple,*/}
          {/*    }}*/}
          {/*  />*/}
          {/*)}*/}
        </View>
      </LinearGradient>

      {/* Renders track title and artist name */}
      <View
        style={{
          // flexDirection: 'row',
          alignItems: 'center',
          // justifyContent: 'center',
          marginTop: hp(snapIndex === 1 ? 1 : 3),
          width: wp(90),
          // backgroundColor: 'lightgreen',
        }}>
        {renderMarqueeTrackTitle(trackInfo.title)}
        {/*<Text*/}
        {/*  numberOfLines={snapIndex === 1 ? 1 : 2}*/}
        {/*  style={{*/}
        {/*    fontSize: wp(snapIndex === 1 ? 5 : 6),*/}
        {/*    marginBottom: snapIndex === 1 ? 0 : hp(1),*/}
        {/*    textAlign: 'center',*/}
        {/*  }}>*/}
        {/*  {trackInfo.title}*/}
        {/*</Text>*/}
        {renderMarqueeTrackDescription(trackInfo)}
        {/*<Text*/}
        {/*  numberOfLines={snapIndex === 1 ? 1 : 3}*/}
        {/*  style={{*/}
        {/*    fontSize: wp(snapIndex === 1 ? 3 : 4),*/}
        {/*    color: colors.lightGrey,*/}
        {/*    textAlign: 'center',*/}
        {/*  }}>*/}
        {/*  {trackInfo.artist}*/}
        {/*</Text>*/}
      </View>

      {/* Renders progress duration, slider, total duration & remaining duration */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          // backgroundColor: 'lightgreen',
          width: wp(95),
          marginTop: hp(snapIndex === 2 ? 2 : 0.5),
          marginBottom: hp(snapIndex === 2 ? 2.5 : 0),
        }}>
        <Text
          style={{
            fontSize: wp(snapIndex === 1 ? 3 : 4),
            color: colors.lightGrey,
          }}>
          {DateTimeUtils.msToTime(trackProgress.position * 1000)}
        </Text>
        <Slider
          minimumValue={0}
          maximumValue={trackProgress.duration}
          value={trackProgress.position}
          onValueChange={TrackPlayer.seekTo}
          // animateTransitions={true}
          // animationType="spring"
          // style={{ borderWidth: 1 }}
          minimumTrackTintColor="#1073ff"
          maximumTrackTintColor="#b7b7b7"
          trackStyle={{
            height: hp(0.3),
            borderRadius: hp(0.3),
            width: wp(snapIndex === 1 ? 70 : 65),
          }}
          thumbStyle={{
            width: hp(snapIndex === 1 ? 2.5 : 4),
            height: hp(snapIndex === 1 ? 2.5 : 4),
            borderRadius: hp(3),
            backgroundColor: enabledDarkTheme ? Colors.dark : Colors.lighter,
            elevation: 2,
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 2,
            shadowOpacity: 0.35,
          }}
        />
        <TouchableOpacity
          onPress={setShowRemainingTime.bind(this, value => !value)}>
          <Text
            style={{
              fontSize: wp(snapIndex === 1 ? 3 : 4),
              color: colors.lightGrey,
            }}>
            {`${showRemainingTime ? '-' : ''} ${DateTimeUtils.msToTime(
              (showRemainingTime
                ? trackProgress.duration - trackProgress.position
                : trackProgress.duration) * 1000,
            )}`}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Renders player controls */}
      {renderPlayerControls()}
    </View>
  );

  const renderContent = () => {
    if (!trackInfo) return null;

    switch (snapIndex) {
      case -1:
        return null;
      case 0:
        return (
          <TouchableOpacity
            onPress={setSnapIndex.bind(this, 2)}
            style={styles.songInfoContainer}>
            {renderTrackArtwork(trackInfo.artwork)}
            <View
              style={{
                width: wp(58),
                // backgroundColor: 'lightgray',
                overflow: 'hidden',
              }}>
              {renderMarqueeTrackTitle(trackInfo.title)}
              {renderMarqueeTrackDescription(trackInfo)}
            </View>
            {renderPlayerControls()}
          </TouchableOpacity>
        );

      // return (
      //   <List.Item
      //     onPress={setSnapIndex.bind(this, 2)}
      //     style={styles.songInfoContainer}
      //     // titleEllipsizeMode="tail"
      //     // titleNumberOfLines={1}
      //     // titleStyle={styles.listItemText}
      //     title={renderCollapsedTrackTitle.bind(this, trackInfo.title.trim())}
      //     // title={() => (
      //     //   <Text>
      //     //     hi
      //     //   </Text>
      //     // )}
      //     // title={trackInfo.title}
      //     // descriptionEllipsizeMode="tail"
      //     // descriptionNumberOfLines={1}
      //     // descriptionStyle={{ borderWidth: 1, backgroundColor: 'lightgreen' }}
      //     description={renderCollapsedTrackDescription.bind(
      //       this,
      //       trackInfo.artist.trim(),
      //     )}
      //     left={props => renderTrackArtwork(trackInfo)}
      //     right={props => renderPlayerControls()}
      //   />
      // );

      case 1:
      case 2:
        return renderExpandedPlayerView();

      default:
        throw new Error(`Invalid snapIndex=${snapIndex}`);
    }
  };

  return (
    <BottomSheetScrollView
      bounces={true}
      focusHook={useFocusEffect}
      contentContainerStyle={{
        // flex: 1,
        paddingHorizontal: wp(2),
        overflow: 'visible',
      }}>
      {/*<Text>{screenNames.currentlyPlaying}</Text>*/}
      {/*{extraData.snapIndex !== 0 && (*/}
      {/*  <Button*/}
      {/*    mode="outlined"*/}
      {/*    uppercase={false}*/}
      {/*    style={globalStyles.button}*/}
      {/*    onPress={navigation.navigate.bind(this, screenNames.currentPlaylist)}>*/}
      {/*    Go to Current Playlist*/}
      {/*  </Button>*/}
      {/*)}*/}
      {/*<Text>{`sheetSnapIndex: ${extraData.snapIndex}`}</Text>*/}

      {/*<Player style={{ borderWidth: 1, marginTop: hp(1) }} />*/}

      {renderContent()}
    </BottomSheetScrollView>
  );
};

const styles = StyleSheet.create({
  trackDescText: {
    flexDirection: 'row',
    alignItems: 'center',
    // alignContent: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'lightblue',
    // marginRight: wp(0),
    // borderWidth: 1,
  },
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
  songInfoContainer: {
    // backgroundColor: 'lightgreen',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    // paddingVertical: 0,
    // flex: 1,
  },
  playerButton: {
    // elevation: 2,
    // borderRadius: hp(10),
    // padding: hp(1),
    // backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: WP(2),
  },
  secondaryPlayerButtons: {
    // elevation: 2,
    // borderRadius: hp(10),
    // padding: hp(1),
    // backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: wp(2),
    // backgroundColor: 'lightgreen',
    width: wp(14),
  },
  listItemText: {
    fontSize: wp(4),
    // backgroundColor: 'lightgreen',
    // marginLeft: wp(1),
    // marginRight: wp(0),
    // borderWidth: 1,
  },
});

export default NowPlaying;

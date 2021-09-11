import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, ToastAndroid, TouchableOpacity, View } from 'react-native';
import { BottomSheetView } from '@gorhom/bottom-sheet';
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
} from 'react-native-track-player';
import { MusicContext } from '../../context/music';
// import { useTrackPlayerEvents as usePlayerEvents } from "react-native-track-player/lib/hooks";
// import { Event as PlayerEvent } from "react-native-track-player/lib/interfaces";
import PlayerUtils from '../../utils/player';
import labels from '../../constants/labels';
import DateTimeUtils from '../../utils/datetime';
import Icon from '../../components/icon';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import Slider from 'react-native-slider';
import LinearGradient from 'react-native-linear-gradient';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

const NowPlaying = ({ navigation, extraData: { snapIndex, setSnapIndex } }) => {
  const { setMusicInfo } = useContext(MusicContext);
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const [trackInfo, setTrackInfo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPreviousTrack, setHasPreviousTrack] = useState(false);
  const [hasNextTrack, setHasNextTrack] = useState(false);
  const [showRemainingTime, setShowRemainingTime] = useState(false);

  const trackProgress = usePlayerProgress();

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
          PlayerUtils.getPlayerStateInfo(event.state),
        )}, event=${JSON.stringify(event)}`,
      );

      // TODO Add Queue ended event and show via AndroidToast

      if (
        event.type === PlayerEvent.PlaybackTrackChanged &&
        event.nextTrack != null
      ) {
        TrackPlayer.getTrack(event.nextTrack)
          .then(track => {
            setTrackInfo(track);
            setMusicInfo(data => ({
              ...data,
              currentlyPlayingTrack: {
                info: track,
                index: event.nextTrack,
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
            currentlyPlayingTrack: null,
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

  const renderTrackDescription = track => {
    return (
      <View style={styles.trackDescText}>
        <Icon
          name="account-music-outline"
          type="MaterialCommunityIcons"
          size={wp(3.5)}
          color={colors.lightGrey}
        />
        <Text numberOfLines={1} style={styles.trackSubtitleText}>
          {track.artist.trim()}
        </Text>
      </View>
    );
  };

  const renderTrackArtwork = track => {
    if (track.artwork)
      return (
        <Avatar.Image
          size={hp(6)}
          source={{ uri: `file://${track.artwork}` }}
        />
      );
    return <Avatar.Icon size={hp(6)} icon="music" style={styles.musicIcon} />;
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
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // borderWidth: 1,
        width: wp(25),
        // padding: 0,
      }}>
      <TouchableOpacity
        style={styles.playerButton}
        activeOpacity={hasPreviousTrack ? 0.2 : 1}
        onPress={skipBack}>
        <Icon
          name="ios-play-skip-back"
          // TODO update the button colors
          type="Ionicons"
          size={wp(7)}
          style={{ opacity: hasPreviousTrack ? 1 : 0.2 }}
        />
      </TouchableOpacity>

      {isPlaying ? (
        <TouchableOpacity style={styles.playerButton} onPress={pause}>
          <Icon
            name="pause"
            type="FontAwesome5"
            // TODO update the button colors, add spring animation
            size={wp(8.4)}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.playerButton} onPress={play}>
          <Icon
            name="play"
            type="FontAwesome5"
            // TODO update the button colors, add spring animation
            size={wp(8)}
          />
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.playerButton}
        activeOpacity={hasNextTrack ? 0.2 : 1}
        onPress={skipForward}>
        <Icon
          style={{ opacity: hasNextTrack ? 1 : 0.2 }}
          name="ios-play-skip-forward"
          type="Ionicons"
          // TODO update the button colors
          size={wp(7)}
        />
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (!trackInfo) return null;

    switch (snapIndex) {
      case -1:
        return null;
      case 0:
        return (
          <List.Item
            onPress={setSnapIndex.bind(this, 2)}
            style={styles.songInfoContainer}
            titleEllipsizeMode={'tail'}
            titleNumberOfLines={1}
            titleStyle={styles.listItemText}
            // TODO Apply marquee effect to title and artist
            title={trackInfo.title}
            descriptionEllipsizeMode={'tail'}
            descriptionNumberOfLines={1}
            description={renderTrackDescription.bind(this, trackInfo)}
            left={props => renderTrackArtwork(trackInfo)}
            right={props => renderPlayerControls()}
          />
        );

      case 1:
        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <LinearGradient
              colors={['#d4d4d4', '#999999', '#7b7b7b', '#373737']} // TODO colors are yet to optimize
              style={{
                elevation: 10,
                // borderRadius: hp(10),
                // borderColor: 'transparent',
                // borderWidth: wp(2),
                borderRadius: hp(20),
                padding: wp(2),
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
                {trackInfo.artwork ? (
                  <Avatar.Image
                    size={hp(15)}
                    source={{ uri: `file://${trackInfo.artwork}` }}
                  />
                ) : (
                  // <Avatar.Icon
                  //   size={hp(18)}
                  //   icon="music"
                  //   style={styles.musicIcon}
                  // />
                  <Icon
                    name={'music'}
                    size={hp(12)}
                    style={{
                      padding: wp(5.5),
                      color: colors.lightPurple,
                    }}
                  />
                )}
              </View>
            </LinearGradient>
            <View
              style={{
                // flexDirection: 'row',
                alignItems: 'center',
                // justifyContent: 'center',
                marginTop: hp(1),
              }}>
              {/*TODO Apply marquee effect*/}
              <Text style={{ fontSize: wp(4.5) }}>{trackInfo.title}</Text>
              {/*<Text style={{ fontSize: wp(3), color: colors.lightGrey }}>*/}
              {/*  {trackInfo.artist}*/}
              {/*</Text>*/}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                // backgroundColor: 'lightgreen',
                width: wp(95),
                marginTop: hp(1),
              }}>
              <Text style={{ fontSize: wp(3), color: colors.lightGrey }}>
                {DateTimeUtils.msToTime(trackProgress.position * 1000)}
              </Text>
              <Slider
                minimumValue={0}
                maximumValue={trackProgress.duration}
                value={trackProgress.position}
                // onValueChange={value => this.setState({ value })}
                // animateTransitions={true}
                // animationType="spring"
                // style={{ borderWidth: 1 }}
                minimumTrackTintColor="#1073ff"
                maximumTrackTintColor="#b7b7b7"
                trackStyle={{
                  height: hp(0.3),
                  borderRadius: hp(0.3),
                  width: wp(70),
                }}
                thumbStyle={{
                  width: hp(2.5),
                  height: hp(2.5),
                  borderRadius: hp(3),
                  backgroundColor: enabledDarkTheme
                    ? Colors.dark
                    : Colors.lighter,
                  elevation: 2,
                  shadowColor: 'black',
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 2,
                  shadowOpacity: 0.35,
                }}
              />
              <TouchableOpacity
                onPress={setShowRemainingTime.bind(this, value => !value)}>
                <Text style={{ fontSize: wp(3), color: colors.lightGrey }}>
                  {`${showRemainingTime ? '-' : ''} ${DateTimeUtils.msToTime(
                    (showRemainingTime
                      ? trackProgress.duration - trackProgress.position
                      : trackProgress.duration) * 1000,
                  )}`}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                // borderWidth: 1,
                width: wp(55),
                // padding: 0,
                // flex:1,
              }}>
              <TouchableOpacity
                style={styles.playerButton}
                activeOpacity={hasPreviousTrack ? 0.2 : 1}
                onPress={skipBack}>
                <Icon
                  name="ios-play-skip-back"
                  // TODO update the button colors
                  type="Ionicons"
                  size={wp(7)}
                  style={{ opacity: hasPreviousTrack ? 1 : 0.2 }}
                />
              </TouchableOpacity>

              {isPlaying ? (
                <TouchableOpacity style={styles.playerButton} onPress={pause}>
                  <Icon
                    name="pause"
                    type="FontAwesome5"
                    // TODO update the button colors, add spring animation
                    size={wp(8.4)}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.playerButton} onPress={play}>
                  <Icon
                    name="play"
                    type="FontAwesome5"
                    // TODO update the button colors, add spring animation
                    size={wp(8)}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.playerButton}
                activeOpacity={hasNextTrack ? 0.2 : 1}
                onPress={skipForward}>
                <Icon
                  style={{ opacity: hasNextTrack ? 1 : 0.2 }}
                  name="ios-play-skip-forward"
                  type="Ionicons"
                  // TODO update the button colors
                  size={wp(7)}
                />
              </TouchableOpacity>
            </View>
          </View>
        );

      case 2:
        return <Text>State 2</Text>;

      default:
        throw new Error(`Invalid snapIndex=${snapIndex}`);
    }
  };

  return (
    <BottomSheetView
      style={{
        flex: 1,
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
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  trackDescText: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: wp(0),
    // borderWidth: 1,
  },
  trackSubtitleText: {
    fontSize: wp(3.2),
    color: colors.lightGrey,
    marginLeft: wp(0.5),
  },
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
  songInfoContainer: {
    // backgroundColor: 'lightgreen',
    alignItems: 'center',
    paddingVertical: 0,
  },
  playerButton: {
    // elevation: 2,
    // borderRadius: hp(10),
    // padding: hp(1),
    // backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    // marginLeft: wp(2),
  },
  listItemText: {
    fontSize: wp(4),
    // marginRight: wp(0),
    // borderWidth: 1,
  },
});

export default NowPlaying;

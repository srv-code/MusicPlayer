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
import MarqueeText from 'react-native-marquee';

// FIXME Player buttons are not corresponding to the actual play state (sometimes)
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

  const renderMarqueeTrackDescription = track => {
    const info = [
      {
        text: track.artist.trim(),
        icon: { name: 'account-music-outline', type: 'MaterialCommunityIcons' },
      },
    ];
    if (snapIndex === 2) {
      info.push({
        text: track.album.trim(),
        icon: { name: 'disc-outline', type: 'Ionicons' },
      });
      info.push({
        text: track.folder.name.trim(),
        icon: { name: 'folder-music-outline', type: 'MaterialCommunityIcons' },
      });
    }

    return (
      <>
        {info.map((data, index) => (
          <View key={index} style={styles.trackDescText}>
            <Icon
              name={data.icon.name}
              type={data.icon.type}
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
        {title}
      </MarqueeText>
    );
  };

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
        icon="music"
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
          name="ios-play-skip-back"
          // TODO update the button colors
          type="Ionicons"
          size={wp(snapIndex === 2 ? 11 : 7)}
          style={{ opacity: hasPreviousTrack ? 1 : 0.2 }}
        />
      </TouchableOpacity>

      {isPlaying ? (
        <TouchableOpacity style={styles.playerButton} onPress={pause}>
          <Icon
            name="pause"
            type="FontAwesome5"
            // TODO update the button colors, add spring animation
            size={wp(snapIndex === 2 ? 12.4 : 8.4)}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.playerButton} onPress={play}>
          <Icon
            name="play"
            type="FontAwesome5"
            // TODO update the button colors, add spring animation
            size={wp(snapIndex === 2 ? 12 : 8)}
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
          size={wp(snapIndex === 2 ? 11 : 7)}
        />
      </TouchableOpacity>
    </View>
  );

  const renderExpandedPlayerView = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* Renders artwork */}
      <LinearGradient
        colors={['#d4d4d4', '#999999', '#7b7b7b', '#373737']} // TODO colors are yet to optimize
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
        {/*TODO Apply marquee effect*/}
        {renderMarqueeTrackTitle(trackInfo.title.trim())}
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
          marginBottom: hp(snapIndex === 2 ? 3 : 0),
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
          // onValueChange={value => this.setState({ value })}
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
              {renderMarqueeTrackTitle(trackInfo.title.trim())}
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
    // marginLeft: wp(2),
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

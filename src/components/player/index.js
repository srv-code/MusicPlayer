import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import TrackPlayer, {
  State as PlayerState,
  RepeatMode as PlayerRepeatMode,
  useProgress as usePlayerProgress,
} from 'react-native-track-player';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import globalStyles from '../../styles';
import { MusicContext } from '../../context/music';

export const getPlayerStateInfo = stateValue => {
  switch (stateValue) {
    case null:
    case undefined:
      return null;

    case PlayerState.None:
      return {
        constant: 'None',
        description: 'State indicating that no media is currently loaded',
      };

    case PlayerState.Ready:
      return {
        constant: 'Ready',
        description:
          'State indicating that the player is ready to start playing',
      };

    case PlayerState.Playing:
      return {
        constant: 'Playing',
        description: 'State indicating that the player is currently playing',
      };

    case PlayerState.Paused:
      return {
        constant: 'Paused',
        description: 'State indicating that the player is currently paused',
      };

    case PlayerState.Stopped:
      return {
        constant: 'Stopped',
        description: 'State indicating that the player is currently stopped',
      };

    case PlayerState.Buffering:
      return {
        constant: 'Buffering',
        description:
          'State indicating that the player is currently buffering (in “play” state)',
      };

    case PlayerState.Connecting:
      return {
        constant: 'Connecting',
        description:
          'State indicating that the player is currently buffering (in “pause” state)',
      };

    default:
      throw new Error(`Invalid value: ${stateValue}`);
  }
};

const Player = ({ style }) => {
  const { musicInfo } = useContext(MusicContext);

  const trackProgress = usePlayerProgress();

  const [volume, setVolume] = useState(0.5); /* default value */
  const [rate, setRate] = useState(1); /* default value */
  const [repeatMode, setRepeatMode] = useState(
    PlayerRepeatMode.Off,
  ); /* default value */

  const getRepeatModeInfo = value => {
    switch (value) {
      case PlayerRepeatMode.Off:
        return 'Off';
      case PlayerRepeatMode.Track:
        return 'Track';
      case PlayerRepeatMode.Queue:
        return 'Queue';
      default:
        throw new Error(`Invalid value: ${value}`);
    }
  };

  const getNextMode = () => {
    return (repeatMode + 1) % 3;
  };

  return (
    <View style={[styles.container, style]}>
      <Text
        style={{
          marginBottom: hp(1),
          fontSize: wp(5),
          backgroundColor: 'lightblue',
          textAlign: 'center',
        }}>
        Player
      </Text>
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          // justifyContent: 'space-between',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            const tracks = musicInfo.tracks.slice(0, 3);
            console.log(
              `[Player] Adding ${tracks.length} tracks, tracks=${JSON.stringify(
                tracks.map(info => `[${info.id}] ${info.title}`),
              )}`,
            );
            await TrackPlayer.add(tracks);
          }}>
          Add Tracks
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            const state = {};
            state.value = await TrackPlayer.getState();
            const stateInfo = getPlayerStateInfo(state.value);
            state.constant = stateInfo.constant;
            state.description = stateInfo.description;

            state.trackIndex = await TrackPlayer.getCurrentTrack();
            state.trackObject = state.trackIndex
              ? await TrackPlayer.getTrack(state.trackIndex)
              : null;

            state.position = await TrackPlayer.getPosition();
            state.duration = await TrackPlayer.getDuration();
            state.volume = await TrackPlayer.getVolume();
            state.repeatMode = await TrackPlayer.getRepeatMode();
            state.rate = await TrackPlayer.getRate();

            console.log(`[Player] Player State: ${JSON.stringify(state)}`);
          }}>
          Show Player State
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Playing...`);
            await TrackPlayer.play();
          }}>
          Play
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Pausing...`);
            await TrackPlayer.pause();
          }}>
          Pause
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Stopping...`);
            await TrackPlayer.stop();
          }}>
          Stop
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Resetting...`);
            await TrackPlayer.reset();
          }}>
          Reset
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Skipping to 1st track...`);
            await TrackPlayer.skip(1);
          }}>
          Skip to 1st Track
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Removing 1st track...`);
            await TrackPlayer.remove([1]);
          }}>
          Remove 1st Track
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Removing upcoming tracks...`);
            await TrackPlayer.removeUpcomingTracks();
          }}>
          Remove Upcoming Tracks{' '}
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Seeking 10s...`);
            await TrackPlayer.seekTo(10);
          }}>
          Seek 10s
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            const nextRepeatMode = getNextMode();
            console.log(
              `[Player] Setting repeat mode to ${getRepeatModeInfo(
                nextRepeatMode,
              )} (${nextRepeatMode})...`,
            );
            await TrackPlayer.setRepeatMode(nextRepeatMode);
            setRepeatMode(nextRepeatMode);
          }}>
          Repeat Mode: {getRepeatModeInfo(repeatMode)}
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          disabled={rate === 2}
          onPress={async () => {
            if (rate === 2) return;
            const newRate = +(rate + 0.5).toFixed(1);
            console.log(`[Player] Setting rate from ${rate} to ${newRate}...`);
            await TrackPlayer.setRate(newRate);
            setRate(newRate);
          }}>
          Rate+
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          disabled={rate === 1}
          onPress={async () => {
            if (rate === 1) return;
            const newRate = +(rate - 0.5).toFixed(1);
            console.log(`[Player] Setting rate from ${rate} to ${newRate}...`);
            await TrackPlayer.setRate(newRate);
            setRate(newRate);
          }}>
          Rate-
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          disabled={volume === 1}
          onPress={async () => {
            if (volume === 1) return;
            const newVol = +(volume + 0.1).toFixed(1);
            console.log(`[Player] Vol+ : ${volume} to ${newVol}...`);
            await TrackPlayer.setVolume(newVol);
            setVolume(newVol);
          }}>
          Vol+
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          disabled={volume === 0}
          onPress={async () => {
            if (volume === 0) return;
            const newVol = +(volume - 0.1).toFixed(1);
            console.log(`[Player] Vol- : ${volume} to ${newVol}...`);
            await TrackPlayer.setVolume(newVol);
            setVolume(newVol);
          }}>
          Vol-
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Skipping to next track...`);
            await TrackPlayer.skipToNext();
          }}>
          Skip To Next Track
        </Button>

        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            console.log(`[Player] Skipping to previous track...`);
            await TrackPlayer.skipToPrevious();
          }}>
          Skip To Previous Track
        </Button>
      </View>

      <Text
        style={{
          backgroundColor: 'lightgreen',
          textAlign: 'center',
          marginVertical: hp(1),
        }}>
        Progress: {JSON.stringify(trackProgress)}
      </Text>

      {/*<View*/}
      {/*  style={{*/}
      {/*    marginVertical: hp(1),*/}
      {/*    paddingVertical: hp(1),*/}
      {/*  }}>*/}
      {/*  {logs.map((log, index) => (*/}
      {/*    <Text*/}
      {/*      style={{*/}
      {/*        backgroundColor: 'lightgreen',*/}
      {/*        marginBottom: 2,*/}
      {/*      }}*/}
      {/*      key={index}>*/}
      {/*      {log}*/}
      {/*    </Text>*/}
      {/*  ))}*/}
      {/*</View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Player;

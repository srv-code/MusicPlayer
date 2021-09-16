import TrackPlayer, { State, RepeatMode } from 'react-native-track-player';

export default class PlayerUtils {
  /* For debugging purpose */
  static getRepeatModeInfo = value => {
    switch (value) {
      case RepeatMode.Off:
        return 'Off';
      case RepeatMode.Track:
        return 'Track';
      case RepeatMode.Queue:
        return 'Queue';
      default:
        throw new Error(`Invalid value: ${value}`);
    }
  };

  /* For debugging purpose */
  static getStateInfo = stateValue => {
    switch (stateValue) {
      case null:
      case undefined:
        return null;

      case State.None:
        return {
          constant: 'None',
          description: 'State indicating that no media is currently loaded',
        };

      case State.Ready:
        return {
          constant: 'Ready',
          description:
            'State indicating that the player is ready to start playing',
        };

      case State.Playing:
        return {
          constant: 'Playing',
          description: 'State indicating that the player is currently playing',
        };

      case State.Paused:
        return {
          constant: 'Paused',
          description: 'State indicating that the player is currently paused',
        };

      case State.Stopped:
        return {
          constant: 'Stopped',
          description: 'State indicating that the player is currently stopped',
        };

      case State.Buffering:
        return {
          constant: 'Buffering',
          description:
            'State indicating that the player is currently buffering (in “play” state)',
        };

      case State.Connecting:
        return {
          constant: 'Connecting',
          description:
            'State indicating that the player is currently buffering (in “pause” state)',
        };

      default:
        throw new Error(`Invalid value: ${stateValue}`);
    }
  };

  static playTracks = async (onCollapse, tracks, index = 0) => {
    console.log(
      `[PlayerUtils/playTracks] track to play=${JSON.stringify(tracks[index])}`,
    );

    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
    await TrackPlayer.skip(index);
    onCollapse();
    // playerControls.collapse();
    await TrackPlayer.play();

    // console.log(
    //   `[Tracks] Playing: {queue=${JSON.stringify(
    //     (await TrackPlayer.getQueue()).map(e => e.id),
    //   )}, current track index: ${await TrackPlayer.getCurrentTrack()}`,
    // );
  };

  static shuffleAndPlayTracks = async tracks => {
    const randomizedTracks = [...tracks];
    // console.log(`list=${randomizedList.map(e => e.id)}`);
    randomizedTracks.sort(() => 0.5 - Math.random());
    // console.log(`list(randomized)=${randomizedList.map(e => e.id)}`);
    await PlayerUtils.playTracks(randomizedTracks);
  };
}

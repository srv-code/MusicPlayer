import TrackPlayer, { Event as PlayerEvent } from 'react-native-track-player';

module.exports = async function () {
  const events = [
    { name: PlayerEvent.RemotePlay, method: TrackPlayer.play },
    { name: PlayerEvent.RemotePause, method: TrackPlayer.pause },
    { name: PlayerEvent.RemoteStop, method: TrackPlayer.destroy },
    { name: PlayerEvent.RemoteSkip, method: TrackPlayer.skip },
    { name: PlayerEvent.RemoteNext, method: TrackPlayer.skipToNext },
    { name: PlayerEvent.RemotePrevious, method: TrackPlayer.skipToPrevious },
    { name: PlayerEvent.RemoteSeek, method: TrackPlayer.seekTo },
    { name: PlayerEvent.RemoteSetRating, method: TrackPlayer.getRate },
  ];

  events.forEach(event =>
    TrackPlayer.addEventListener(event.name, event.method),
  );

  // All events:
  //   PlaybackState = "playback-state",
  //   PlaybackError = "playback-error",
  //   PlaybackQueueEnded = "playback-queue-ended",
  //   PlaybackTrackChanged = "playback-track-changed",
  //   PlaybackMetadataReceived = "playback-metadata-received",
  //   ✅ RemotePlay = "remote-play",
  //   RemotePlayId = "remote-play-id",
  //   RemotePlaySearch = "remote-play-search",
  //   ✅ RemotePause = "remote-pause",
  //   ✅ RemoteStop = "remote-stop",
  //   ✅ RemoteSkip = "remote-skip",
  //   ✅ RemoteNext = "remote-next",
  //   ✅ RemotePrevious = "remote-previous",
  //   RemoteJumpForward = "remote-jump-forward",
  //   RemoteJumpBackward = "remote-jump-backward",
  //   ✅ RemoteSeek = "remote-seek",
  //   ✅ RemoteSetRating = "remote-set-rating",
  //   RemoteDuck = "remote-duck",
  //   RemoteLike = "remote-like",
  //   RemoteDislike = "remote-dislike",
  //   RemoteBookmark = "remote-bookmark"
};

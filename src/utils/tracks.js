import MusicFiles from '@yajanarao/react-native-get-music-files';
import FileSystem from 'react-native-fs';

// FIXME: Song album art is not getting generated in Android emulator.
export const fetchAllMusicTracks = async () => {
  console.log('[fetchAllMusicTracks] invoked');

  const tracks = await MusicFiles.getAll({
    id: true, // get id
    duration: true, // get duration
    title: true, // get title
    artist: true, // get artist
    genre: true, // get genre
    album: true,
    fileName: true, // get file name
    // cover: true,
    // coverFolder: 'file:///storage/emulated/0/Download/iclear',
    // coverResizeRatio: true,
    // icon: true,
    // iconSize: true,
    // coverSize: true,
    // batchNumber: true,
    // delay: true,
    minimumSongDuration: 1000, // get songs bigger than 1s,

    // imported from site: https://www.npmjs.com/package/react-native-get-music-files
    blured: true, // works only when 'cover' is set to true
    fields: [
      'title',
      'albumTitle',
      'artist',
      'genre',
      'lyrics',
      'artwork',
      'duration',
    ], // for iOs Version
  });

  for (const track of tracks) {
    track.coverFilePath = `file://${FileSystem.ExternalStorageDirectoryPath}/${track.id}.jpg`;
    track.coverExists = await FileSystem.exists(track.coverFilePath);

    track.artist = track.author;
    delete track.author;

    const pathComponents = track.path.split('/');
    track.folder = {
      name: pathComponents[pathComponents.length - 2],
      path: track.path.substr(0, track.path.length - track.fileName.length - 1),
    };
  }

  return tracks;
};

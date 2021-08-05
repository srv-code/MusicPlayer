import MusicFiles from '@yajanarao/react-native-get-music-files';

export const fetchAllMusicTracks = async () => {
  console.log('[fetchAllMusicTracks] invoked');

  return await MusicFiles.getAll({
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
};

import MusicFiles from '@yajanarao/react-native-get-music-files';

export const fetchAllMusicTracks = async () => {
  console.log('[fetchAllMusicTracks] invoked');

  const tracks = await MusicFiles.getAll({
    id: true, // get id
    artist: true, // get artist
    duration: true, // get duration
    genre: true, // get genre
    title: true, // get title
    fileName: true, // get file name
    minimumSongDuration: 1000, // get songs bigger than 1s,

    // imported from site: https://www.npmjs.com/package/react-native-get-music-files
    blured: true, // works only when 'cover' is set to true
    cover: true,
    fields: ['title', 'albumTitle', 'genre', 'lyrics', 'artwork', 'duration'], // for iOs Version
  });

  console.log('[fetchAllMusicTracks] tracks:', tracks);
  return tracks;
};

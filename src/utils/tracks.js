import MusicFiles, {
  Constants as MusicSortingOptions,
} from 'react-native-get-music-files-v3dev-test';
import FileSystem from 'react-native-fs';

export const fetchAllMusicTracks = async (
  albumCoverFolderName = 'album-covers',
) => {
  console.log('fetchAllMusicTracks: invoked');

  // const tracks = [];
  const tracks = await MusicFiles.getAll({
    // cover: false,
    cover: true,
    coverFolder: `${FileSystem.ExternalDirectoryPath}/${albumCoverFolderName}`,
    batchSize: 0,
    batchNumber: 0,
    sortBy: MusicSortingOptions.SortBy.Title,
    sortOrder: MusicSortingOptions.SortOrder.Ascending,

    // cover?: boolean,
    // coverFolder?: string,
    // minimumSongDuration?: number,
    // batchSize?: number,
    // batchNumber?: number,
    // sortBy?: string,
    // sortOrder?: string,
  });

  // const tracks = await MusicFiles.getAll({
  //   id: true, // get id
  //   duration: true, // get duration
  //   title: true, // get title
  //   artist: true, // get artist
  //   genre: true, // get genre
  //   album: true,
  //   fileName: true, // get file name
  //   // cover: true,
  //   // coverFolder: 'file:///storage/emulated/0/Download/iclear',
  //   // coverResizeRatio: true,
  //   // icon: true,
  //   // iconSize: true,
  //   // coverSize: true,
  //   // batchNumber: true,
  //   // delay: true,
  //   minimumSongDuration: 1000, // get songs bigger than 1s,
  //
  //   // imported from site: https://www.npmjs.com/package/react-native-get-music-files
  //   blured: true, // works only when 'cover' is set to true
  //   fields: [
  //     'title',
  //     'albumTitle',
  //     'artist',
  //     'genre',
  //     'lyrics',
  //     'artwork',
  //     'duration',
  //   ], // for iOs Version
  // });

  for (const track of tracks.results) {
    // track.coverFilePath = `file://${track.cover}`;
    // track.coverExists = true;
    // track.coverExists = await FileSystem.exists(track.coverFilePath); // TODO check if required, if not remove the track.coverExists prop

    // track.artist = track.author;
    // delete track.author;

    const pathComponents = track.path.split('/');
    pathComponents.pop(); // removes the file name
    track.folder = {
      name: pathComponents[pathComponents.length - 1],
      path: pathComponents.join('/'),
    };
  }

  // console.log(`fetchAllMusicTracks: tracks=${JSON.stringify(tracks)}`);

  return tracks;
};

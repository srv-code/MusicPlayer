import MusicFiles, {
  Constants as MusicSortingOptions,
} from 'react-native-get-music-files-v3dev-test';
import FileSystem from 'react-native-fs';

// FIXME: Song album art is not getting generated in Android emulator.
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

  // TODO uncomment the below code snippet
  // for (const track of tracks) {
  //   track.coverFilePath = `file://${FileSystem.ExternalStorageDirectoryPath}/${track.id}.jpg`;
  //   track.coverExists = await FileSystem.exists(track.coverFilePath);
  //
  //   track.artist = track.author;
  //   delete track.author;
  //
  //   const pathComponents = track.path.split('/');
  //   track.folder = {
  //     name: pathComponents[pathComponents.length - 2],
  //     path: track.path.substr(0, track.path.length - track.fileName.length - 1),
  //   };
  // }

  console.log(`fetchAllMusicTracks: tracks=${JSON.stringify(tracks)}`);

  return tracks;
};

import MusicFiles, {
  Constants as MusicSortingOptions,
} from 'react-native-get-music-files-v3dev-test';
import FileSystem from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import keys from '../constants/keys';

export default class TrackUtils {
  static fetchAll = async ({ artworkFolderName = 'artworks' } = {}) => {
    console.log(`[fetchAllTracks] invoked`);

    // MusicFiles.getAll()
    //   .then(res => {
    //     console.log(
    //       `[fetchAllTracks/MusicFiles.getAll] res=${JSON.stringify(res)}`,
    //     );
    //   })
    //   .catch(e => {
    //     console.log(
    //       `[fetchAllTracks/MusicFiles.getAll] error=${JSON.stringify(e)}`,
    //     );
    //   })
    //   .finally(() => {
    //     console.log(`[fetchAllTracks/MusicFiles.getAll] finally`);
    //   });

    let tracks = [];
    try {
      tracks = await MusicFiles.getAll({
        cover: true,
        coverFolder: `${FileSystem.ExternalDirectoryPath}/${artworkFolderName}`,
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
    } catch (err) {
      /* Only exempt if no song tracks are found, 
        otherwise show appropriate native error details to user */
      if (err.message?.startsWith('404')) return [];
      else throw err;
    }

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
      // track.coverExists = await FileSystem.exists(track.coverFilePath); // TODO: check if required, if not remove the track.coverExists prop

      // track.artist = track.author;
      // delete track.author;

      /* Prop mapping for TrackPlayer */
      // path -> url
      track.url = track.path;
      delete track.path;
      // cover -> artwork
      track.artwork = track.cover;
      delete track.cover;

      /* trim fields */
      track.title = track.title.trim();
      track.album = track.album.trim();
      track.artist = track.artist.trim();

      /* split path components */
      const pathComponents = track.url.split('/');
      pathComponents.pop(); // removes the file name
      track.folder = {
        name: pathComponents[pathComponents.length - 1],
        path: pathComponents.join('/'),
      };
    }

    // console.log(`[fetchAllTracks] tracks=${JSON.stringify(tracks)}`);

    return tracks;
  };

  static stripMusicInfo = data => {
    // sample input (value of data)
    // {
    //   "results": [
    //     {
    //       "id": "31",
    //       "duration": "371487",
    //       "album": "Kabir Singh (Pagalworld.Live)",
    //       "artist": "Sachet Tandon (Pagalworld.Live)",
    //       "title": "Bekhayali (Pagalworld.Live)",
    //       "url": "/storage/emulated/0/Download/Bekhayali - Kabir Singh.mp3",
    //       "artwork": "/storage/emulated/0/Android/data/com.musicplayer/files/artworks/17e76fc89e0cd9365be832825a81b055",
    //       "folder": { "name": "Download", "path": "/storage/emulated/0/Download" }
    //     }
    //   ],
    //   "length": 13
    // }

    // console.log(`[Splash/stripTracks] (INPUT) data=${JSON.stringify(data)}`);

    const tracks = data.results,
      albums = [],
      artists = [],
      folders = [];

    data.results?.forEach(track => {
      if (track.album && !albums.some(x => x.name === track.album))
        albums.push({ name: track.album, trackIds: [] });

      if (track.artist && !artists.some(x => x.name === track.artist))
        artists.push({ name: track.artist, trackIds: [] });

      if (
        folders.every(
          f => f.name !== track.folder.name && f.path !== track.folder.path,
        )
      )
        folders.push({ ...track.folder, trackIds: [] });
    });

    /* adding additional summaries */
    data.results?.forEach(track => {
      for (const album of albums)
        if (album.name === track.album) {
          album.trackIds.push(track.id);
          break;
        }
      for (const artist of artists)
        if (artist.name === track.artist) {
          artist.trackIds.push(track.id);
          break;
        }
      for (const folder of folders)
        if (
          folder.name === track.folder.name &&
          folder.path === track.folder.path
        ) {
          folder.trackIds.push(track.id);
          break;
        }
    });

    console.log(
      `[Splash/stripTracks] (OUTPUT) result=${JSON.stringify({
        tracks,
        albums,
        artists,
        folders,
      })}`,
    );

    return {
      [keys.TRACKS]: tracks || [],
      [keys.ALBUMS]: albums || [],
      [keys.ARTISTS]: artists || [],
      [keys.FOLDERS]: folders || [],
      [keys.FAVORITE_IDS]: [],
      [keys.PLAYLISTS]: [],
    };
  };

  static loadMusicInfo = async ignoreCache => {
    const error = {};
    try {
      error.title = 'Storage Read Error';
      error.message = 'Failed reading music information from storage';

      console.log(`[loadMusicInfo] Loading track info from cache...`);
      let musicInfo = ignoreCache
        ? null
        : JSON.parse(await AsyncStorage.getItem(keys.MUSIC_INFO));
      console.log(
        `[loadMusicInfo] musicInfo (from cache)=${JSON.stringify(
          Object.keys(musicInfo || {}),
          // musicInfo,
        )}`,
      );

      if (musicInfo) {
        console.log(`[loadMusicInfo] Loading favorite Ids from cache...`);
        const favs = await AsyncStorage.getItem(keys.FAVORITE_IDS);

        console.log(`[loadMusicInfo] Loading playlists from cache...`);
        const pl = await AsyncStorage.getItem(keys.PLAYLISTS);

        musicInfo = {
          ...musicInfo,
          [keys.FAVORITE_IDS]: favs ? JSON.parse(favs) : [],
          [keys.PLAYLISTS]: pl ? JSON.parse(pl) : [],
        };

        console.log(
          `[loadMusicInfo] favoriteIds=${JSON.stringify(
            favs,
          )}, playlists=${JSON.stringify(pl)}, musicInfo=${JSON.stringify(
            Object.keys(musicInfo),
          )}`,
        );
      } else {
        // Load all music tracks
        error.title = 'I/O Error';
        error.message = 'Failed loading music tracks';

        console.log(
          `[loadMusicInfo] Discovering all music tracks from phone...`,
        );
        const tracks = TrackUtils.stripMusicInfo(await TrackUtils.fetchAll());

        // Write music tracks to async-storage
        error.title = 'Storage Write Error';
        error.message = 'Failed writing music information in storage';

        console.log(
          `[loadMusicInfo] Recalculating & writing track info in cache...`,
        );
        await AsyncStorage.setItem(keys.MUSIC_INFO, JSON.stringify(tracks));
        console.log(
          `[loadMusicInfo] musicInfo(recalculated)=${Object.keys(
            tracks,
          )}, ${JSON.stringify(tracks)}`,
        );

        musicInfo = tracks;
      }

      return musicInfo;
    } catch (err) {
      console.log(
        `[loadMusicInfo] Error: ${error.title}. ${
          error.message
        }\n${JSON.stringify(err)}`,
      );
      error.cause = err;

      throw error;
    }
  };
}

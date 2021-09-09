import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  PermissionsAndroid,
  Platform,
  BackHandler,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import appColors from '../../constants/colors';
import Icons from '../../constants/icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { ActivityIndicator, Text } from 'react-native-paper';
import { fetchAllMusicTracks } from '../../utils/tracks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import keys from '../../constants/keys';

const { height } = Dimensions.get('screen');
const LOGO_HEIGHT = height * 0.28;
const LOGO_ANIMATION_DURATION = 1500;
const SPLASH_TIMEOUT = 1600;
const requiredPermissions = [
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
];

// const Splash = ({ navigation }) => {
const Splash = ({ setShow, setMusicInfo }) => {
  const [loadingInfo, setLoadingInfo] = useState({
    loading: false,
    info: null,
  });

  const stripMusicInfo = data => {
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

    data.results.forEach(track => {
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
    data.results.forEach(track => {
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

    // console.log(
    //   `[Splash/stripTracks] (OUTPUT) result=${JSON.stringify({
    //     tracks,
    //     albums,
    //     artists,
    //     folders,
    //   })}`,
    // );

    return { tracks, albums, artists, folders };
  };

  useEffect(() => {
    setTimeout(async () => {
      const error = {};
      try {
        // Check Android permissions
        if (Platform.OS === 'android') {
          console.log(`[Splash] Checking Android permissions...`);
          setLoadingInfo({
            loading: true,
            info: 'Checking for app permissions...',
          });

          error.title = 'Permission Error';
          error.message = `Application permission error`;

          const response = await PermissionsAndroid.requestMultiple(
            requiredPermissions,
          );
          console.log('Splash: permission response:', response);
          for (const perm of Object.keys(response))
            if (response[perm] !== PermissionsAndroid.RESULTS.GRANTED)
              throw new Error(`Permission ${perm} denied.`);
        }

        // Check for music info from async-storage
        setLoadingInfo({
          loading: true,
          info: 'Loading music tracks...',
        });

        error.title = 'Storage Read Error';
        error.message = `Failed reading music information from storage`;

        console.log(`[Splash] Loading track info from cache...`);
        let musicInfo = JSON.parse(await AsyncStorage.getItem(keys.MUSIC_INFO));
        // console.log('Splash:', { musicInfo });

        if (!musicInfo) {
          // Load all music tracks
          error.title = 'I/O Error';
          error.message = `Failed loading music tracks`;

          console.log(`[Splash] Discovering all music tracks from phone...`);
          const tracks = stripMusicInfo(await fetchAllMusicTracks());
          // console.log('fetchAllMusicTracks:', { tracks });

          // Write music tracks to async-storage
          error.title = 'Storage Write Error';
          error.message = `Failed writing music information in storage`;

          console.log(
            `[Splash] Recalculating & writing track info in cache...`,
          );
          await AsyncStorage.setItem(keys.MUSIC_INFO, JSON.stringify(tracks));

          musicInfo = tracks;
        }

        console.log(`[Splash] musicInfo=${JSON.stringify(musicInfo)}`);

        console.log(`[Splash] Storing track info in context...`);
        setMusicInfo(musicInfo);
      } catch (err) {
        console.log(
          `Error: ${error.title}. ${error.message}\n${JSON.stringify(err)}`,
        );
        Alert.alert(error.title, `${error.message}\nReason: ${err.message}`, [
          {
            text: 'Exit',
            onPress: BackHandler.exitApp,
            style: 'cancel',
          },
        ]);
        error.caught = true;
      } finally {
        setLoadingInfo({ loading: false, info: null });
        if (!error.caught) setShow(false);
      }
    }, SPLASH_TIMEOUT);

    // checkForInitialDataStatus()
    //   .then(requires => {
    //     if (!requires.length) navigation.navigate(screenNames.tracks);
    //
    //     setTimeout(() => {
    //       initializeData(requires)
    //         .then(() => {
    //           navigation.navigate(screenNames.tracks);
    //         })
    //         .catch(e => Alert.alert('Error', 'Error occurred:' + e));
    //     }, SPLASH_TIMEOUT);
    //   })
    //   .catch(e => Alert.alert('Application Error', 'Error encountered: ' + e));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={appColors.lightGrey}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duration={LOGO_ANIMATION_DURATION}
          source={Icons.LargeLogo}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>

      <View
        style={{
          // borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator
          animating={loadingInfo.loading}
          size={wp(4)}
          color={appColors.nastyPink}
          style={{ marginRight: wp(2) }}
        />
        <Text style={{ fontSize: wp(4), color: appColors.nastyPink }}>
          {loadingInfo.info}
        </Text>
      </View>

      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text style={styles.title}>Welcome to the World of Music 🎵</Text>
        <Text style={styles.text}>Your own very personalized music app ❤</Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.lightGrey,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    paddingVertical: hp(10),
    paddingHorizontal: hp(10),
  },
  logo: {
    height: LOGO_HEIGHT,
    width: LOGO_HEIGHT,
  },
  title: {
    color: appColors.darkBlue,
    fontSize: wp(10),
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: hp(6),
  },
  text: {
    color: appColors.lightGrey1,
    textAlign: 'center',
    fontSize: wp(5),
    marginTop: hp(3),
    lineHeight: hp(3),
  },
});

export default Splash;

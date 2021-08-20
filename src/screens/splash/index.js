import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  PermissionsAndroid,
  Alert,
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
const Splash = ({ setShow, musicContext, preferencesContext }) => {
  // console.log('Splash loaded', { setShow, musicContext, preferencesContext });

  // const musicInfo = useContext(MusicContext);
  // console.log('Splash', { musicInfo });

  const [loadingInfo, setLoadingInfo] = useState({
    loading: false,
    info: null,
  });

  const stripTracks = data => {
    /* sample track info */
    // duration: "229175"
    // title: " baby I Like It -enrique ft pitbull"
    // genre: null
    // fileName: "tumblr_l6qv0j8bce1qbjng1o1.mp3"
    // album: "World Wide Urban Music"
    // author: "Enrique Iglesias ft. Pitbull"
    // path: "/storage/emulated/0/Music/Others/tumblr_l6qv0j8bce1qbjng1o1.mp3"
    // id: "5347"

    const tracks = data,
      albums = [],
      artists = [],
      folders = [];

    data.forEach(track => {
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
    data.forEach(track => {
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

    return { tracks, albums, artists, folders };
  };

  useEffect(() => {
    setTimeout(async () => {
      const errorMessage = {};
      try {
        // Check Android permissions
        if (Platform.OS === 'android') {
          setLoadingInfo({
            loading: true,
            info: 'Checking for app permissions...',
          });

          errorMessage.title = 'Permission Error';
          errorMessage.message = `Application permission error`;

          const response = await PermissionsAndroid.requestMultiple(
            requiredPermissions,
          );
          console.log('Splash: permission response:', response);
          // TODO should throw error from here in case any of the permission is not PermissionsAndroid.RESULTS.GRANTED
        }

        // Check for music info from async-storage
        setLoadingInfo({
          loading: true,
          info: 'Loading music tracks...',
        });

        errorMessage.title = 'Storage Read Error';
        errorMessage.message = `Failed reading music information from storage`;

        let musicInfo = JSON.parse(await AsyncStorage.getItem(keys.MUSIC_INFO));
        // console.log('Splash:', { musicInfo });

        if (!musicInfo) {
          // Load all music tracks
          errorMessage.title = 'I/O Error';
          errorMessage.message = `Failed loading music tracks`;

          const tracks = await fetchAllMusicTracks();
          // console.log('fetchAllMusicTracks:', { tracks });

          // Write music tracks to async-storage
          errorMessage.title = 'Storage Read Error';
          errorMessage.message = `Failed writing music information in storage`;

          await AsyncStorage.setItem(keys.MUSIC_INFO, JSON.stringify(tracks));

          musicInfo = tracks;
        }

        // Update stripped data in context
        musicContext.setMusicInfo(stripTracks(musicInfo));
      } catch (error) {
        Alert.alert(
          errorMessage.title,
          `${errorMessage.message}\nReason: ${error.message}`,
          [
            {
              text: 'Exit',
              onPress: BackHandler.exitApp,
              style: 'cancel',
            },
          ],
        );
      }

      // finally
      setLoadingInfo({ loading: false, info: null });
      setShow(false);
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

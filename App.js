import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StatusBar } from 'react-native';
import { PreferencesContext } from './src/context/preferences';
import { MusicContext } from './src/context/music';
import Navigator from './src/navigator';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
  Text,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext';
import colors from './src/constants/colors';
import Splash from './src/screens/splash';
import TrackPlayer from 'react-native-track-player';
import {
  Capability as PlayerCapability,
  RatingType as PlayerRatingType,
} from 'react-native-track-player/lib/interfaces';
import { useTrackPlayerEvents as usePlayerEvents } from 'react-native-track-player/lib/hooks';
import PlayerUtils from './src/utils/player';
import useColorScheme from 'react-native/Libraries/Utilities/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import keys from './src/constants/keys';

const App = () => {
  console.log('App loaded');

  const [enabledDarkTheme, setEnabledDarkTheme] = useState(
    // useColorScheme() === 'dark',
    false, // TODO revert later, for testing purpose only
    // true,
  );
  const [musicInfo, setMusicInfo] = useState(null);
  const [playerControls, setPlayerControls] = useState({});
  const [showSplash, setShowSplash] = useState(true);
  const [bottomSheetMiniPositionIndex, setBottomSheetMiniPositionIndex] =
    useState(-1);

  const _playerBottomSheet = useRef(null);

  const musicContextValue = useMemo(
    () => ({
      _playerBottomSheet,
      playerControls,
      setPlayerControls,
      bottomSheetMiniPositionIndex,
      setBottomSheetMiniPositionIndex,
      musicInfo,
      setMusicInfo,
    }),
    [musicInfo, playerControls, bottomSheetMiniPositionIndex],
  );

  const preferencesContextValue = useMemo(
    () => ({
      enabledDarkTheme,
      setEnabledDarkTheme,
    }),
    [enabledDarkTheme],
  );

  const MergedDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
  };

  const MergedDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
  };

  const theme = enabledDarkTheme ? MergedDarkTheme : MergedDefaultTheme;

  const initPlayer = async () => {
    console.log(`[App] Player::setupPlayer....`);
    await TrackPlayer.setupPlayer({});

    const capabilities = [
      PlayerCapability.Play,
      // PlayerCapability.PlayFromId,
      // PlayerCapability.PlayFromSearch,
      PlayerCapability.Pause,
      PlayerCapability.Stop,
      PlayerCapability.SeekTo,
      PlayerCapability.Skip,
      PlayerCapability.SkipToNext,
      PlayerCapability.SkipToPrevious,
      PlayerCapability.JumpForward,
      PlayerCapability.JumpBackward,
      // PlayerCapability.SetRating,
      // PlayerCapability.Like,
      // PlayerCapability.Dislike,
      // PlayerCapability.Bookmark,
    ];
    console.log(`[App] Player::updateOptions....`);
    await TrackPlayer.updateOptions({
      ratingType: PlayerRatingType.Heart,

      // // Whether the player will be destroyed when the app closes
      // stopWithApp: true,
      //
      // // Whether the remote-duck event will be triggered on every interruption
      // alwaysPauseOnInterruption: true,

      // The notification icon
      icon: require('./assets/images/logo.png'),

      // color: enabledDarkTheme ? 0 : parseInt('00004e', 16),
      // color: parseInt('000000', 16),

      // Media controls capabilities
      capabilities,

      // Capabilities that will show up when the notification is in the compact form on Android
      compactCapabilities: capabilities,

      // // The buttons that it will show in the notification. Defaults to data.capabilities
      // notificationCapabilities: [
      //   ...capabilities,
      //   PlayerCapability.SetRating,
      //   PlayerCapability.Like,
      //   PlayerCapability.Dislike,
      //   PlayerCapability.Bookmark,
      // ],

      // // Icons for the notification on Android (if you don't like the default ones)
      // playIcon: require('./play-icon.png'),
      // pauseIcon: require('./pause-icon.png'),
      // stopIcon: require('./stop-icon.png'),
      // previousIcon: require('./previous-icon.png'),
      // nextIcon: require('./next-icon.png'),
      // icon: require('./notification-icon.png'),
    });

    await TrackPlayer.setVolume(1); // Set to full volume
  };

  useEffect(() => {
    initPlayer().catch(err => {
      console.log(`[App] Player: Error initializing: ${JSON.stringify(err)}`);
      throw err;
    });

    /* wont be called when the app is dismissed from background */
    return () => {
      console.log(`[App] Player: Destroying...`);
      TrackPlayer.destroy();
    };
  }, []);

  // useEffect(() => {
  //   if (showSplash)
  //     setTimeout(() => {
  //       setShowSplash(false);
  //     }, SPLASH_TIMEOUT);
  // }, []);

  // TODO remove later, test code
  // return (
  //   <TouchableOpacity
  //     onPress={async () => {
  //       try {
  //         console.log('App: starting...');
  //         console.log(
  //           `App: check write: ${await PermissionsAndroid.check(
  //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //           )}`,
  //         );
  //         console.log(
  //           `App: request write: ${await PermissionsAndroid.request(
  //             PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //           )}`,
  //         );
  //
  //         // const filePath = 'file:///storage/emulated/0';
  //         const folderPath = FileSystem.ExternalStorageDirectoryPath;
  //         const fileNames = ['test1.txt', 'test3.txt'];
  //
  //         let filePath;
  //         // filePath = `${folderPath}/${fileNames[0]}`;
  //         // console.log(
  //         //   `App: writing to file (${filePath}) (using rn-fetch-blob): ${await RNFetchBlob.fs.writeFile(
  //         //     filePath,
  //         //     'foo',
  //         //     'utf8',
  //         //   )}`,
  //         // );
  //
  //         filePath = `${folderPath}/${fileNames[1]}`;
  //         console.log(
  //           `App: writing to file (${filePath}) (using rn-fs): ${await FileSystem.writeFile(
  //             filePath,
  //             'jello',
  //           )}`,
  //         );
  //       } catch (err) {
  //         console.log(`App: Err: ${JSON.stringify(err.message)}`);
  //       }
  //     }}
  //     style={{
  //       backgroundColor: 'lightblue',
  //       borderRadius: 5,
  //       alignSelf: 'flex-start',
  //       padding: 5,
  //       elevation: 1,
  //     }}>
  //     <Text>Test Write</Text>
  //   </TouchableOpacity>
  // );

  // return (
  //   <View>
  //     <Text
  //       onPress={async () => {
  //         console.log(
  //           `read value: ${JSON.stringify(
  //             await AsyncStorage.getItem(keys.MUSIC_INFO),
  //           )}`,
  //         );
  //       }}>
  //       Read using async
  //     </Text>
  //
  //     <Text
  //       onPress={async () => {
  //         console.log(
  //           `written value: ${JSON.stringify(
  //             await AsyncStorage.setItem(
  //               keys.MUSIC_INFO,
  //               JSON.stringify({ name: 'yellow' }),
  //             ),
  //           )}`,
  //         );
  //       }}>
  //       Write using async
  //     </Text>
  //   </View>
  // );

  if (showSplash)
    return <Splash setShow={setShowSplash} setMusicInfo={setMusicInfo} />;

  // return (
  //   <View>
  //     <Text>Screen</Text>
  //   </View>
  // );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <PreferencesContext.Provider value={preferencesContextValue}>
          <MusicContext.Provider value={musicContextValue}>
            <StatusBar
              style="auto"
              animated
              backgroundColor={
                enabledDarkTheme ? colors.darker : colors.darkBlue2
              }
              barStyle="light-content"
            />
            <SafeAreaProvider>
              {/*<Text*/}
              {/*  onPress={() => {*/}
              {/*    const data = {*/}
              {/*      name: ['ds', 'gdf'],*/}
              {/*      ROLL: { a: 'dfs', b: 'dsf' },*/}
              {/*    };*/}
              {/*    const toWrite = JSON.stringify(data);*/}
              {/*    AsyncStorage.setItem('TEST_DATA', toWrite)*/}
              {/*      .then(() => {*/}
              {/*        console.log(*/}
              {/*          `[Test] written, data=${data}, toWrite=${toWrite}`,*/}
              {/*        );*/}
              {/*      })*/}
              {/*      .catch(err => {*/}
              {/*        console.log(`[Test] write err=${err.message}`);*/}
              {/*      });*/}
              {/*  }}>*/}
              {/*  WRITE*/}
              {/*</Text>*/}

              {/*<Text*/}
              {/*  onPress={() => {*/}
              {/*    AsyncStorage.getItem(keys.MUSIC_INFO)*/}
              {/*      .then(res => {*/}
              {/*        console.log(*/}
              {/*          `[Test] read, res=${JSON.stringify(*/}
              {/*            res,*/}
              {/*          )}, parsed=${Object.keys(JSON.parse(res))}`,*/}
              {/*        );*/}
              {/*      })*/}
              {/*      .catch(err => {*/}
              {/*        console.log(`[Test] read err=${err.message}}`);*/}
              {/*      });*/}
              {/*  }}>*/}
              {/*  READ*/}
              {/*</Text>*/}

              <Navigator theme={theme} />
            </SafeAreaProvider>
          </MusicContext.Provider>
        </PreferencesContext.Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

export default App;

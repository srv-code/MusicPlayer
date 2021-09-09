import React, { useMemo, useRef, useState } from 'react';
import {
  PermissionsAndroid,
  StatusBar,
  TouchableOpacity,
  View,
  AppState,
} from 'react-native';
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
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import colors from './src/constants/colors';
import Splash from './src/screens/splash';
import FileSystem from 'react-native-fs';
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
  const _playerBottomSheet = useRef(null);
  const [playerControls, setPlayerControls] = useState({});
  const [showSplash, setShowSplash] = useState(true);

  const musicContextValue = useMemo(() => {
    return {
      _playerBottomSheet,
      playerControls,
      setPlayerControls,
      musicInfo,
      setMusicInfo,
    };
  }, [musicInfo, playerControls]);

  const preferencesContextValue = useMemo(() => {
    return {
      toggleDarkTheme: setEnabledDarkTheme.bind(this, !enabledDarkTheme),
      enabledDarkTheme,
    };
  }, [enabledDarkTheme]);

  const MergedDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
  };

  const MergedDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
  };

  const theme = enabledDarkTheme ? MergedDarkTheme : MergedDefaultTheme;

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
    <>
      <PaperProvider theme={theme}>
        <PreferencesContext.Provider value={preferencesContextValue}>
          <MusicContext.Provider value={musicContextValue}>
            <StatusBar
              style="auto"
              animated
              backgroundColor={
                enabledDarkTheme ? Colors.darker : colors.darkBlue2
              }
              barStyle="light-content"
            />
            <SafeAreaProvider>
              <Navigator theme={theme} />
            </SafeAreaProvider>
          </MusicContext.Provider>
        </PreferencesContext.Provider>
      </PaperProvider>
    </>
  );
};

export default App;

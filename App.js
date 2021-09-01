import React, { useMemo, useRef, useState } from 'react';
import { StatusBar } from 'react-native';
import { PreferencesContext } from './src/context/preferences';
import { MusicContext } from './src/context/music';
import Navigator from './src/navigator';
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme,
} from 'react-native-paper';
import {
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import colors from './src/constants/colors';
import Splash from './src/screens/splash';

const App = () => {
  console.log('App loaded');

  const [enabledDarkTheme, setEnabledDarkTheme] = useState(
    // useColorScheme() === 'dark',
    false, // TODO revert later, for testing purpose only
    // true,
  );
  const [musicInfo, setMusicInfo] = useState(null);
  const [showSplash, setShowSplash] = useState(true);
  const bottomSheet = useRef(null);

  const musicContextValue = useMemo(() => {
    return { bottomSheet, musicInfo, setMusicInfo };
  }, [musicInfo]);

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

  if (showSplash)
    return (
      <Splash
        setShow={setShowSplash}
        musicContext={musicContextValue}
        preferencesContext={preferencesContextValue}
      />
    );

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

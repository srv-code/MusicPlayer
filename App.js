import React, { useEffect, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { PreferencesContext } from './src/context/preferences';
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
import Splash from './src/screens/splash';

const SPLASH_TIMEOUT = 1600;

const App = () => {
  const [enabledDarkTheme, setEnabledDarkTheme] = useState(
    // useColorScheme() === 'dark',
    false, // for testing purpose
  );
  const [showSplash, setShowSplash] = useState(true);

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

  useEffect(() => {
    if (showSplash)
      setTimeout(() => {
        setShowSplash(false);
      }, SPLASH_TIMEOUT);
  }, []);

  if (showSplash) return <Splash />;

  return (
    <PaperProvider theme={theme}>
      <PreferencesContext.Provider value={preferencesContextValue}>
        <Navigator enabledDarkTheme={enabledDarkTheme} theme={theme} />
      </PreferencesContext.Provider>
    </PaperProvider>
  );
};

export default App;

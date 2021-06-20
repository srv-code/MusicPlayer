import React, { useMemo, useState } from 'react';
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
import Splash from "./src/screens/splash";

const App = () => {
  const [enabledDarkTheme, setEnabledDarkTheme] = useState(
    // useColorScheme() === 'dark',
    false, // for testing purpose
  );

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

  return <Splash />

  return (
    <PaperProvider theme={theme}>
      <PreferencesContext.Provider value={preferencesContextValue}>
        <Navigator enabledDarkTheme={enabledDarkTheme} theme={theme} />
      </PreferencesContext.Provider>
    </PaperProvider>
  );
};

export default App;

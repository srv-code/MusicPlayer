import React, { useEffect, useMemo, useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
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
import { SafeAreaProvider } from 'react-native-safe-area-context/src/SafeAreaContext';
// import Splash from './src/screens/splash';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import colors from './src/constants/colors';
import Splash from './src/screens/splash';

const App = () => {
  console.log('App loaded');

  const [enabledDarkTheme, setEnabledDarkTheme] = useState(
    // useColorScheme() === 'dark',
    false, // TODO revert later, for testing purpose only
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

  // useEffect(() => {
  //   if (showSplash)
  //     setTimeout(() => {
  //       setShowSplash(false);
  //     }, SPLASH_TIMEOUT);
  // }, []);

  if (showSplash) return <Splash setShow={setShowSplash} />;
  return (
    <PaperProvider theme={theme}>
      <PreferencesContext.Provider value={preferencesContextValue}>
        <SafeAreaProvider>
          <StatusBar
            backgroundColor={
              enabledDarkTheme ? Colors.darker : colors.darkBlue2
            }
            barStyle="light-content"
          />
          <Navigator enabledDarkTheme={enabledDarkTheme} theme={theme} />
        </SafeAreaProvider>
      </PreferencesContext.Provider>
    </PaperProvider>
  );
};

export default App;

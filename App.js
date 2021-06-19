import React, { useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { AppContext } from './src/context/app';
import Navigator from './src/navigator';
import { Provider as PaperProvider } from 'react-native-paper';

const App = () => {
  const [enabledDarkTheme, setEnabledDarkTheme] = useState(
    useColorScheme() === 'dark',
  );

  const appContext = useMemo(() => {
    return {
      toggleDarkTheme: setEnabledDarkTheme.bind(this, !enabledDarkTheme),
      darkTheme: enabledDarkTheme,
    };
  }, [enabledDarkTheme]);

  return (
    <PaperProvider>
      <AppContext.Provider value={appContext}>
        <Navigator />
      </AppContext.Provider>
    </PaperProvider>
  );
};

export default App;

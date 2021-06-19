import React, { useContext } from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { AppContext } from '../../context/app';
import { SafeAreaView, ScrollView, StatusBar } from 'react-native';

const ScreenContainer = ({ children }) => {
  const { enabledDarkTheme } = useContext(AppContext);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={enabledDarkTheme ? 'light-content' : 'dark-content'}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenContainer;

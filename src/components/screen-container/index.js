import React, { useContext } from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { AppContext } from '../../context/app';
import { Platform, SafeAreaView, ScrollView, StatusBar } from 'react-native';
import { Appbar } from 'react-native-paper';

const ScreenContainer = ({ headerInfo, children }) => {
  const { enabledDarkTheme } = useContext(AppContext);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
  };

  const showMoreOptionsHandler = () => {};

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={enabledDarkTheme ? 'dark-content' : 'light-content'}
      />
      {headerInfo && (
        <Appbar.Header>
          <Appbar.Content
            title={headerInfo.title}
            subtitle={headerInfo.subtitle}
          />
          {Boolean(headerInfo.onSearch) && (
            <Appbar.Action icon="magnify" onPress={headerInfo.onSearch} />
          )}
          {headerInfo.showMore && (
            <Appbar.Action
              icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
              onPress={showMoreOptionsHandler}
            />
          )}
        </Appbar.Header>
      )}
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ScreenContainer;

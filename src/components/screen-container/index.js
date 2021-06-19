import React, { useContext } from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { AppContext } from '../../context/app';
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Appbar } from 'react-native-paper';

const ScreenContainer = ({
  showHeader,
  headerColor,
  onBackPress,
  title,
  subtitle,
  onSearch,
  showMore,
  children,
}) => {
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
      {showHeader && (
        <Appbar.Header style={{ backgroundColor: headerColor }}>
          {onBackPress && <Appbar.BackAction onPress={onBackPress} />}
          <Appbar.Content title={title} subtitle={subtitle} />
          {onSearch && <Appbar.Action icon="magnify" onPress={onSearch} />}
          {showMore && (
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

const styles = StyleSheet.create({});

export default ScreenContainer;

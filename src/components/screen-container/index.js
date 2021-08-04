import React, { useContext } from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { PreferencesContext } from '../../context/preferences';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Appbar } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../constants/colors';
import Icon from '../icon';

const ScreenContainer = ({
  showHeader,
  title,
  subtitle,
  onBackPress,
  onSearch,
  iconName,
  style,
  children,
}) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: enabledDarkTheme ? Colors.darker : colors.white1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {showHeader && (
        <Appbar.Header
          style={{
            backgroundColor: enabledDarkTheme ? null : colors.darkBlue2,
          }}>
          {onBackPress && <Appbar.BackAction onPress={onBackPress} />}
          {iconName && <Icon name={iconName} />}
          {title && (
            <Appbar.Content
              titleStyle={styles.titleText}
              title={title}
              subtitle={subtitle}
            />
          )}
          {onSearch && <Appbar.Action icon="magnify" onPress={onSearch} />}
        </Appbar.Header>
      )}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.scrollViewContent, style]}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {},
  titleText: {
    textTransform: 'capitalize',
    fontSize: wp(6),
  },
  scrollViewContent: {
    flex: 1,
    // backgroundColor: 'red',
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),
  },
});

export default ScreenContainer;

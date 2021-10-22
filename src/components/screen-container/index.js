import React, { useContext } from 'react';
import { PreferencesContext } from '../../context/preferences';
import { StyleSheet, SafeAreaView, ScrollView, View } from 'react-native';
import { Appbar, Text } from 'react-native-paper';
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
  actionIcons,
  iconName,
  style,
  noScroll,
  children,
}) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  return (
    <SafeAreaView style={styles.background}>
      {showHeader && (
        <Appbar.Header
          style={{
            backgroundColor: enabledDarkTheme
              ? colors.darker
              : colors.darkBlue2,
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
          {actionIcons?.map((icon, index) => (
            <Appbar.Action
              key={index}
              disabled={icon.disabled}
              icon={icon.name}
              onPress={icon.onPress}
            />
          ))}
        </Appbar.Header>
      )}

      {noScroll ? (
        <View style={[styles.scrollView, styles.scrollViewContent, style]}>
          {children}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView
            keyboardDismissMode={'on-drag'} /* experimental */
            keyboardShouldPersistTaps={'handled'} /* experimental */
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}
            contentContainerStyle={[styles.scrollViewContent, style]}>
            {children}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    // backgroundColor: colors.darker,
  },
  titleText: {
    textTransform: 'capitalize',
    fontSize: wp(6),
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    // flex: 1,
    paddingHorizontal: wp(5),
    paddingVertical: hp(2),

    // backgroundColor: 'red',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
});

export default ScreenContainer;

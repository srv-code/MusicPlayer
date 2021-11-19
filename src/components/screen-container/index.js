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
import { MusicContext } from '../../context/music';

const ScreenContainer = ({
  styles: customStyles = { wrapper: {}, container: {}, content: {} },
  showHeader,
  title,
  subtitle,
  fixedHeight,
  varHeights = { closed: 0 },
  onBackPress,
  actionIcons,
  iconName,
  noScroll,
  hasRoundedContainer,
  children,
}) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { bottomSheetMiniPositionIndex } = useContext(MusicContext);

  const dynamicStyles = {
    wrapper: {
      flex: 1,
      backgroundColor: colors[enabledDarkTheme ? 'darker' : 'lighter'],
    },
    container: {
      ...styles[
        hasRoundedContainer ? 'roundedContainer' : 'nonRoundedContainer'
      ],
      backgroundColor: colors[enabledDarkTheme ? 'darkest' : 'light'],
      paddingBottom:
        !fixedHeight && bottomSheetMiniPositionIndex === 0
          ? varHeights.collapsed
          : varHeights.closed,
    },
  };

  return (
    <SafeAreaView style={styles.background}>
      {showHeader && (
        <Appbar.Header
          style={{
            backgroundColor: colors[enabledDarkTheme ? 'darker' : 'darkBlue2'],
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

      {/*{noScroll ? (*/}
      {/*  <View style={[styles.scrollView, styles.scrollViewContent, style]}>*/}
      {/*    {children}*/}
      {/*  </View>*/}
      {/*) : (*/}
      {/*  <View style={dynamicStyles.wrapper}>*/}
      {/*    <View style={[dynamicStyles.container]}>*/}
      {/*      <ScrollView*/}
      {/*        keyboardDismissMode={'on-drag'} /* experimental */}
      {/*        keyboardShouldPersistTaps={'handled'} /* experimental */}
      {/*        contentInsetAdjustmentBehavior="automatic"*/}
      {/*        style={styles.scrollView}*/}
      {/*        contentContainerStyle={[styles.scrollContent, style]}>*/}
      {/*        {children}*/}
      {/*      </ScrollView>*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*)}*/}

      <View style={[dynamicStyles.wrapper, customStyles.wrapper]}>
        <View style={[dynamicStyles.container, customStyles.container]}>
          {noScroll ? (
            <View
              style={[
                styles.scrollContent,
                styles.scrollView,
                customStyles.content,
              ]}>
              {children}
            </View>
          ) : (
            <ScrollView
              keyboardDismissMode={'on-drag'} /* experimental */
              keyboardShouldPersistTaps={'handled'} /* experimental */
              contentInsetAdjustmentBehavior="automatic"
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                customStyles.content,
              ]}>
              {children}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  nonRoundedContainer: {
    flex: 1,
    // marginTop: hp(0.4),
    paddingHorizontal: wp(3),
    // paddingTop: hp(2.5),
  },
  roundedContainer: {
    flex: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    elevation: 4,
    marginTop: hp(0.4),
    paddingHorizontal: wp(3),
    paddingTop: hp(2.5),
  },
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
  // scrollViewContent: {
  //   // flex: 1,
  //   paddingHorizontal: wp(5),
  //   paddingVertical: hp(2),
  //
  //   // backgroundColor: 'red',
  //   // borderWidth: 2,
  //   // borderColor: 'blue',
  // },
});

export default ScreenContainer;

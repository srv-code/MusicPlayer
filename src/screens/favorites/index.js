import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import keys from '../../constants/keys';
import IconUtils from '../../utils/icon';
import labels from '../../constants/labels';
import { MusicContext } from '../../context/music';
import colors from '../../constants/colors';

// const Playlists = ({ navigation }) => {
const Favorites = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const dynamicStyles = {
    screen: {
      ...styles.screen,
      backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
    },
    container: {
      ...styles.container,
      backgroundColor: enabledDarkTheme ? colors.darkest : colors.light,
    },
  };

  return (
    <ScreenContainer style={dynamicStyles.screen}>
      <View style={dynamicStyles.container}>
        <Text>Favorites screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    elevation: 4,
    marginTop: hp(0.4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
  },
});

export default Favorites;

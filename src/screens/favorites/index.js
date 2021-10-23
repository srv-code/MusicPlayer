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

  return (
    <ScreenContainer
      noScroll
      hasRoundedContainer
      varHeights={{ collapsed: hp(15), closed: hp(6) }}>
      <Text>Favorites screen</Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Favorites;

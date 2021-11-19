import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';
import labels from '../../constants/labels';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Artists = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  return (
    <ScreenContainer
      noScroll
      hasRoundedContainer
      varHeights={{ collapsed: hp(14), closed: hp(6) }}>
      <Text>Artists screen</Text>

      <FlatList
        data={Array(22).fill()}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ _, index }) => (
          <View
            key={index}
            style={{
              height: hp(5),
              backgroundColor: 'pink',
              marginBottom: hp(0.5),
            }}>
            <Text>{`element ${index + 1}`}</Text>
          </View>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Artists;

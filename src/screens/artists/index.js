import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
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

  const dynamicStyles = {
    screen: {
      ...styles.screen,
      backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
      // backgroundColor: 'blue',
    },
    container: {
      ...styles.container,
      backgroundColor: enabledDarkTheme ? colors.darkest : colors.light,
      // backgroundColor: 'red',
    },
  };

  return (
    <ScreenContainer style={dynamicStyles.screen}>
      <View style={dynamicStyles.container}>
        <Text>Artists screen</Text>

        {/*<View style={{ flex: 1 }}>*/}
        {Array(22)
          .fill()
          .map((e, index) => (
            <View
              key={index}
              style={{
                height: hp(5),
                backgroundColor: 'pink',
                marginBottom: hp(0.5),
              }}>
              <Text>{`element ${index + 1}`}</Text>
            </View>
          ))}
        {/*</View>*/}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
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

export default Artists;

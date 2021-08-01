import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Switch, Text, TouchableRipple } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Settings = ({ navigation }) => {
  const { enabledDarkTheme, toggleDarkTheme } = useContext(PreferencesContext);

  return (
    <ScreenContainer
      showHeader
      onBackPress={navigation.goBack}
      title={screenNames.settings}
      subtitle="Set your own preferences"
      showSettings>
      <View style={styles.container}>
        <Text>Settings screen</Text>

        <TouchableRipple
          onPress={toggleDarkTheme}
          rippleColor={colors.lightBlack}>
          <View style={styles.row}>
            <Text style={styles.attributeText}>Dark mode</Text>
            <Switch value={enabledDarkTheme} onValueChange={toggleDarkTheme} />
          </View>
        </TouchableRipple>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(1),
  },
  attributeText: {
    fontSize: wp(5),
  },
});

export default Settings;

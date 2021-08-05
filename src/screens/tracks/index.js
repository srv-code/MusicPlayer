import React, { useContext, useState } from 'react';
import { Alert, PermissionsAndroid, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { Button, Text } from 'react-native-paper';
import { PreferencesContext } from '../../context/preferences';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

// const Tracks = ({ navigation }) => {
const Tracks = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
        backgroundColor: 'red',

      }}>
      <Text>Content</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Tracks;

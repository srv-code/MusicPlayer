import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';

const Tracks = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
        <Text>Tracks screen</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Tracks;

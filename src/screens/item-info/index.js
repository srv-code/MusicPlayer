import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import labels from '../../constants/labels';
import keys from '../../constants/keys';

const ItemInfo = ({ navigation, route }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const { type, data } = route.params;

  const getScreenTitle = () => {
    switch (type) {
      case keys.TRACKS:
        return `${labels.track} ${labels.info}`;
      case keys.ALBUMS:
        return `${labels.album} ${labels.info}`;
      case keys.ARTISTS:
        return `${labels.artist} ${labels.info}`;
      case keys.FOLDERS:
        return `${labels.folder} ${labels.info}`;
      default:
        throw new Error(`Invalid type: ${type}`);
    }
  };

  return (
    <ScreenContainer
      showHeader
      title={getScreenTitle()}
      onBackPress={navigation.goBack}>
      <View style={styles.container}>
        <Text>Item Info screen</Text>
        <Text>Type: {JSON.stringify(type)}</Text>
        <Text>Type: {JSON.stringify(data)}</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default ItemInfo;

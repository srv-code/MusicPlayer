import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

// TODO Complete
const Playlist = ({ id, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text>{`Playlist List for ${id}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Playlist;

import React, { useContext, useEffect, useState } from 'react';
import { PermissionsAndroid, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import TrackPlayer from 'react-native-track-player';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import globalStyles from '../../styles';
import { MusicContext } from '../../context/music';
import FileSystem from 'react-native-fs';

const Player = ({ style }) => {
  const { musicInfo } = useContext(MusicContext);

  useEffect(async () => {
    console.log('Player: init');
    await TrackPlayer.setupPlayer({});
  }, []);

  return (
    <View style={[styles.container, style]}>
      <Text
        style={{
          marginBottom: hp(1),
          fontSize: wp(5),
          backgroundColor: 'lightblue',
          textAlign: 'center',
        }}>
        Player
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={() => {
            // console.log('Player:', { musicInfo });
          }}>
          Fetch songs
        </Button>
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={async () => {
            // TODO remove later, for testing purpose only
            try {
              console.log(
                `Player: check write: ${await PermissionsAndroid.check(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                )}`,
              );
              console.log(
                `Player: request write: ${await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                )}`,
              );

              // const filePath = 'file:///storage/emulated/0/test.txt';
              const filePath = `${FileSystem.ExternalStorageDirectoryPath}/test.txt`;
              console.log(
                `Player: request write: ${await FileSystem.writeFile(
                  filePath,
                  'hi',
                )}`,
              );
            } catch (err) {
              console.log(`Player: err: ${JSON.stringify(err.message)}`);
            }
          }}>
          Test
        </Button>
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={() => {}}>
          Seek backward
        </Button>
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={() => {}}>
          Seek forward
        </Button>
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={() => {}}>
          Previous track
        </Button>
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={() => {}}>
          Next track
        </Button>
        <Button
          mode="outlined"
          uppercase={false}
          style={globalStyles.button}
          onPress={() => {}}>
          Destroy
        </Button>
      </View>
      <Text
        style={{
          backgroundColor: 'lightgreen',
          flexWrap: 'wrap',
          marginVertical: hp(1),
          paddingVertical: hp(1),
        }}>
        {/*{`musicInfo: ${JSON.stringify(musicInfo)}`}*/}
        {`DocumentDirectoryPath: ${FileSystem.DocumentDirectoryPath}
LibraryDirectoryPath: ${FileSystem.LibraryDirectoryPath}
ExternalDirectoryPath: ${FileSystem.ExternalDirectoryPath}
ExternalStorageDirectoryPath: ${FileSystem.ExternalStorageDirectoryPath}`}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Player;

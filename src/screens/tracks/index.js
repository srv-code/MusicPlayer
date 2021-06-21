import React, { useState } from 'react';
import { Alert, PermissionsAndroid, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { Button, Text } from 'react-native-paper';
import MusicFiles from 'react-native-get-music-files';

const Tracks = ({ navigation }) => {
  const [searchedTerm, setSearchedTerm] = useState('');
  const onSearchHandler = term => {
    setSearchedTerm(term);
    console.log(`Searched ${term}`);
  };

  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Need permission',
          message: 'Need storage read permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      Alert.alert(
        'Permission Error',
        'Error getting user permission: ' + err.message,
      );
    }
  };

  const fetchAllMusicTracks = () => {
    requestCameraPermission().then(res => {
      MusicFiles.getAll({
        blured: true, // works only when 'cover' is set to true
        artist: true,
        duration: true, //default : true
        cover: true, //default : true,
        genre: true,
        title: true,
        minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
        fields: [
          'title',
          'albumTitle',
          'genre',
          'lyrics',
          'artwork',
          'duration',
        ], // for iOs Version
      })
        .then(tracks => {
          console.log('[fetchAllMusicTracks] response:', tracks);
        })
        .catch(error => {
          console.log('[fetchAllMusicTracks] error:', error);
          Alert.alert('Error', 'While fetching all tracks: ' + error.message);
        });
    });
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.tracks}
      subtitle="Select from your favorite tracks"
      searchPlaceholder="Search among all the tracks"
      searchedTerm={searchedTerm}
      onSearch={onSearchHandler}
      onPressSettings={navigation.push.bind(this, screenNames.settings)}>
      <View style={styles.container}>
        <Text>Tracks screen</Text>
        <Button mode="outlined" onPress={fetchAllMusicTracks}>
          Fetch tracks
        </Button>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Tracks;

import React, { useState } from 'react';
import { Alert, PermissionsAndroid, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { Button, Text, IconButton } from 'react-native-paper';
import MusicFiles from 'react-native-get-music-files';
import { getTracks, MusicFile } from 'react-native-music-files';
import ToastAndroid from 'react-native/Libraries/Components/ToastAndroid/ToastAndroid';

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

  const fetchAllTracks_OLD = () => {
    MusicFiles.getAll({
      blured: true, // works only when 'cover' is set to true
      artist: true,
      duration: true, //default : true
      cover: true, //default : true,
      genre: true,
      title: true,
      minimumSongDuration: 10000, // get songs bigger than 10000 miliseconds duration,
      fields: ['title', 'albumTitle', 'genre', 'lyrics', 'artwork', 'duration'], // for iOs Version
    })
      .then(tracks => {
        console.log('[fetchAllMusicTracks] response:', tracks);
      })
      .catch(error => {
        console.log('[fetchAllMusicTracks] error:', error);
        Alert.alert('Error', 'While fetching all tracks: ' + error.message);
      });
  };
  const fetchAllTracks = () => {
    getTracks()
      .then(tracks => {
        console.log('[fetchAllTracks] tracks:', tracks);
      })
      .catch(e => {
        Alert.alert('Fetch error', 'Could not access tracks: ' + e.message);
      });
  };

  const getPermissionAndFetchAllTracks = () => {
    requestCameraPermission()
      .then(res => {
        fetchAllTracks();
      })
      .catch(e => {
        Alert.alert('Error', '[getPermissionAndFetchAllTracks] ' + e.message);
      });
  };

  const fetch = () => {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Need permission',
        message: 'Need storage read permission',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    )
      .then(response => {
        console.log('>> [PermissionsAndroid] response:', response);

        if (response === PermissionsAndroid.RESULTS.GRANTED) {
          MusicFiles.getAll({
            id: true, // get id
            artist: true, // get artist
            duration: true, // get duration
            genre: true, // get genre
            title: true, // get title
            fileName: true, // get file name
            minimumSongDuration: 1000, // get track has min duration is 1000 ms (or 1s)

            // imported from site: https://www.npmjs.com/package/react-native-get-music-files
            blured: true, // works only when 'cover' is set to true
            cover: true,
            // minimumSongDuration : 10000, // get songs bigger than 10000 miliseconds duration,
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
              Alert.alert(
                'Error',
                'While fetching all tracks: ' + error.message,
              );
            })
            .finally(() => {
              // this.setState({loading: false})
            });
        } else console.log('Camera permission denied');
      })
      .catch(e => {
        Alert.alert('Error', 'Permission error: ' + e.message);
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
        <Button mode="outlined" uppercase={false}>
          getPermission()
        </Button>
        <Button mode="outlined" onPress={fetch}>
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

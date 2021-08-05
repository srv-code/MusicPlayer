import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import {
  Button,
  Caption,
  Divider,
  Headline,
  Paragraph,
  Searchbar,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import Icon from '../../components/icon';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { MusicContext } from '../../context/music';
import { PreferencesContext } from '../../context/preferences';
import { useBackHandler } from '@react-native-community/hooks';
import { List } from 'react-native-paper';
import colors from '../../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storageKeys from '../../constants/storage-keys';

const accordionIds = {
  TRACKS: 'tracks',
  ALBUMS: 'albums',
  ARTISTS: 'artists',
  FOLDERS: 'folders',
};

const inProgressKeys = {
  DELETE_MUSIC_CACHE: 'delete-music-cache',
  DELETE_PREFERENCES_CACHE: 'delete-pref-cache',
};

const Info = ({ navigation }) => {
  const musicContext = useContext(MusicContext);
  const preferencesContext = useContext(PreferencesContext);

  const [showSearch, setShowSearch] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [expandedAccordionIds, setExpandedAccordionIds] = useState([]);
  const [inProgress, setInProgress] = useState(null);
  const [musicData, setMusicData] = useState(null);
  const [prefData, setPrefData] = useState(null);

  console.log('[Info]', { musicData, prefData, searchedTerm });

  useEffect(() => {
    setMusicData(musicContext.musicInfo);
  }, [musicContext.musicInfo]);

  useEffect(() => {
    setPrefData({ enabledDarkTheme: preferencesContext.enabledDarkTheme });
  }, [preferencesContext.enabledDarkTheme]);

  useBackHandler(() => {
    if (showSearch) {
      toggleSearch();
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (musicContext.musicInfo) {
      setMusicData({
        // matches with: tracks { id, title }
        tracks: musicContext.musicInfo?.tracks?.filter(
          x =>
            x.id?.toLowerCase().includes(searchedTerm.toLowerCase()) ||
            x.title?.toLowerCase().includes(searchedTerm.toLowerCase()),
        ),

        // matches with: albums: <string>
        albums: musicContext.musicInfo?.albums?.filter(x =>
          x.toLowerCase().includes(searchedTerm.toLowerCase()),
        ),

        // matches with: artists: <string>
        artists: musicContext.musicInfo?.artists?.filter(x =>
          x.toLowerCase().includes(searchedTerm.toLowerCase()),
        ),

        // matches with: folders { name, path }
        folders: musicContext.musicInfo?.folders?.filter(
          x =>
            x.name?.toLowerCase().includes(searchedTerm.toLowerCase()) ||
            x.path?.toLowerCase().includes(searchedTerm.toLowerCase()),
        ),
      });
    }
    // if (prefData) {
    // }
  }, [searchedTerm]);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchedTerm('');
  };

  const isAccordionExpanded = id => expandedAccordionIds.includes(id);
  const toggleAccordionExpansion = id =>
    setExpandedAccordionIds(
      expandedAccordionIds.includes(id)
        ? expandedAccordionIds.filter(_id => _id !== id)
        : [...expandedAccordionIds, id],
    );

  const renderData = () => {
    const deleteMusicCache = async () => {
      setInProgress(inProgressKeys.DELETE_MUSIC_CACHE);
      musicContext.setMusicInfo(null);
      AsyncStorage.removeItem(storageKeys.MUSIC_INFO)
        .catch(error =>
          Alert.alert(
            'I/O Error',
            `Failed removing music cache: ${error.message}`,
          ),
        )
        .finally(setInProgress);
    };

    const deletePrefCache = async () => {
      setInProgress(inProgressKeys.DELETE_PREFERENCES_CACHE);
      setInProgress(null);
    };

    return (
      <View>
        <View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Music Info</Text>
            <Button
              icon="delete"
              mode="outlined"
              uppercase={false}
              disabled={!musicData}
              loading={inProgress === inProgressKeys.DELETE_MUSIC_CACHE}
              style={styles.button}
              onPress={deleteMusicCache}>
              Delete Cache
            </Button>
          </View>

          <List.Accordion
            id={accordionIds.TRACKS}
            expanded={isAccordionExpanded(accordionIds.TRACKS)}
            onPress={toggleAccordionExpansion.bind(this, accordionIds.TRACKS)}
            title={`${accordionIds.TRACKS} (${musicData?.tracks?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="music" />}>
            {musicData?.tracks?.length ? (
              <FlatList
                data={musicData.tracks}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: track }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      paddingVertical: hp(1),
                      borderRadius: 10,
                      flexWrap: 'wrap',
                      paddingHorizontal: wp(2),
                    }}>
                    <Text>
                      {`title: ${track.title}
id: ${track.id}
duration: ${track.duration}
genre: ${track.genre}
fileName: ${track.fileName}
album: ${track.album}
author: ${track.author}
path: ${track.path}`}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={accordionIds.ALBUMS}
            expanded={isAccordionExpanded(accordionIds.ALBUMS)}
            onPress={toggleAccordionExpansion.bind(this, accordionIds.ALBUMS)}
            title={`${accordionIds.ALBUMS} (${musicData?.albums?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="disc" />}>
            {musicData?.albums?.length ? (
              <FlatList
                data={musicData.albums}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: album }) => (
                  <List.Item
                    style={{
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      borderRadius: 10,
                      flexWrap: 'wrap',
                    }}
                    titleStyle={styles.text}
                    title={album}
                  />
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={accordionIds.ARTISTS}
            expanded={isAccordionExpanded(accordionIds.ARTISTS)}
            onPress={toggleAccordionExpansion.bind(this, accordionIds.ARTISTS)}
            title={`Artists (${musicData?.artists?.length || 0})`}
            left={props => <List.Icon {...props} icon="account-music" />}>
            {musicData?.artists?.length ? (
              <FlatList
                data={musicData.artists}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: artist }) => (
                  <List.Item
                    style={{
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      borderRadius: 10,
                      flexWrap: 'wrap',
                    }}
                    titleStyle={styles.text}
                    title={artist}
                  />
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={accordionIds.FOLDERS}
            expanded={isAccordionExpanded(accordionIds.FOLDERS)}
            onPress={toggleAccordionExpansion.bind(this, accordionIds.FOLDERS)}
            title={`${accordionIds.FOLDERS} (${
              musicData?.folders?.length || 0
            })`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="folder-music" />}>
            {musicData?.folders?.length ? (
              <FlatList
                data={musicData.folders}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: folder }) => (
                  <List.Item
                    style={{
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      borderRadius: 10,
                      flexWrap: 'wrap',
                    }}
                    titleStyle={styles.text}
                    title={folder.name}
                    description={folder.path}
                  />
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>
        </View>

        <Divider style={styles.divider} />

        <View>
          <View style={styles.row}>
            <Text style={styles.titleText}>Preferences</Text>
            <Button
              icon="delete"
              mode="outlined"
              uppercase={false}
              disabled={!prefData}
              loading={inProgress === inProgressKeys.DELETE_PREFERENCES_CACHE}
              style={styles.button}
              onPress={deletePrefCache}>
              Delete Cache
            </Button>
          </View>
          <List.Item
            titleStyle={
              prefData?.enabledDarkTheme === null ||
              prefData?.enabledDarkTheme === undefined
                ? styles.errorText
                : styles.text
            }
            title={`enabledDarkTheme: ${prefData?.enabledDarkTheme ?? 'N/A'}`}
          />
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.info}
      iconName="bug-outline"
      onBackPress={navigation.goBack}
      actionIcons={[
        {
          name: 'arrow-collapse',
          onPress: setExpandedAccordionIds.bind(this, []),
        },
        { name: 'magnify', onPress: toggleSearch },
      ]}>
      <View style={styles.iconContainer}>
        <Icon name="bug-outline" size={hp(20)} />
        <Text style={{ fontSize: wp(7) }}>Information</Text>
      </View>

      {showSearch && (
        <Searchbar
          placeholder="Search within app info"
          onChangeText={setSearchedTerm}
          value={searchedTerm}
          style={{
            marginTop: hp(2),
          }}
        />
      )}

      <View
        style={{
          marginVertical: hp(2),
        }}>
        {renderData()}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: wp(5),
    fontWeight: 'bold',
  },
  text: {
    fontSize: wp(3.5),
  },
  errorText: {
    fontSize: wp(3.5),
    color: 'red',
  },
  accordionTitleText: {
    textTransform: 'capitalize',
  },
  button: {
    alignSelf: 'flex-start',
  },
  divider: {
    marginVertical: hp(2),
  },
});

export default Info;

import React, { useContext, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { Button, Divider, Searchbar, Text } from 'react-native-paper';
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
import keys from '../../constants/keys';

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
          x.name.toLowerCase().includes(searchedTerm.toLowerCase()),
        ),

        // matches with: artists: <string>
        artists: musicContext.musicInfo?.artists?.filter(x =>
          x.name.toLowerCase().includes(searchedTerm.toLowerCase()),
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
      musicContext.setMusicInfo(values.RESET_MUSIC_DATA);
      AsyncStorage.removeItem(keys.MUSIC_INFO)
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
            id={keys.TRACKS}
            expanded={isAccordionExpanded(keys.TRACKS)}
            onPress={toggleAccordionExpansion.bind(this, keys.TRACKS)}
            title={`${keys.TRACKS} (${musicData?.tracks?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="music" />}>
            {musicData?.tracks?.length ? (
              <FlatList
                data={musicData.tracks}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: track }) => (
                  <View
                    style={{
                      // flexDirection: 'row',
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      paddingVertical: hp(1),
                      borderRadius: 10,
                      // flexWrap: 'wrap',
                      paddingHorizontal: wp(2),
                    }}>
                    {Object.keys(track).map((key, index) => (
                      <Text>
                        <Text style={{ color: 'blue' }}>{key}: </Text>
                        <Text>{JSON.stringify(track[key])}</Text>
                      </Text>
                    ))}
                  </View>
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={keys.ALBUMS}
            expanded={isAccordionExpanded(keys.ALBUMS)}
            onPress={toggleAccordionExpansion.bind(this, keys.ALBUMS)}
            title={`${keys.ALBUMS} (${musicData?.albums?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="disc" />}>
            {musicData?.albums?.length ? (
              <FlatList
                data={musicData.albums}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: album }) => (
                  <View
                    style={{
                      // flexDirection: 'row',
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      paddingVertical: hp(1),
                      borderRadius: 10,
                      // flexWrap: 'wrap',
                      paddingHorizontal: wp(2),
                    }}>
                    {Object.keys(album).map((key, index) => (
                      <Text>
                        <Text style={{ color: 'blue' }}>{key}: </Text>
                        <Text>{JSON.stringify(album[key])}</Text>
                      </Text>
                    ))}
                  </View>

                  /////////////////
                  // <List.Item
                  //   style={{
                  //     marginBottom: hp(1),
                  //     backgroundColor: colors.lightGrey,
                  //     borderRadius: 10,
                  //     flexWrap: 'wrap',
                  //   }}
                  //   titleStyle={styles.text}
                  //   title={album}
                  // />
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={keys.ARTISTS}
            expanded={isAccordionExpanded(keys.ARTISTS)}
            onPress={toggleAccordionExpansion.bind(this, keys.ARTISTS)}
            title={`Artists (${musicData?.artists?.length || 0})`}
            left={props => <List.Icon {...props} icon="account-music" />}>
            {musicData?.artists?.length ? (
              <FlatList
                data={musicData.artists}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: artist }) => (
                  <View
                    style={{
                      // flexDirection: 'row',
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      paddingVertical: hp(1),
                      borderRadius: 10,
                      // flexWrap: 'wrap',
                      paddingHorizontal: wp(2),
                    }}>
                    {Object.keys(artist).map((key, index) => (
                      <Text>
                        <Text style={{ color: 'blue' }}>{key}: </Text>
                        <Text>{JSON.stringify(artist[key])}</Text>
                      </Text>
                    ))}
                  </View>

                  ///////
                  // <List.Item
                  //   style={{
                  //     marginBottom: hp(1),
                  //     backgroundColor: colors.lightGrey,
                  //     borderRadius: 10,
                  //     flexWrap: 'wrap',
                  //   }}
                  //   titleStyle={styles.text}
                  //   title={artist}
                  // />
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={keys.FOLDERS}
            expanded={isAccordionExpanded(keys.FOLDERS)}
            onPress={toggleAccordionExpansion.bind(this, keys.FOLDERS)}
            title={`${keys.FOLDERS} (${musicData?.folders?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="folder-music" />}>
            {musicData?.folders?.length ? (
              <FlatList
                data={musicData.folders}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: folder }) => (
                  <View
                    style={{
                      // flexDirection: 'row',
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      paddingVertical: hp(1),
                      borderRadius: 10,
                      // flexWrap: 'wrap',
                      paddingHorizontal: wp(2),
                    }}>
                    {Object.keys(folder).map((key, index) => (
                      <Text>
                        <Text style={{ color: 'blue' }}>{key}: </Text>
                        <Text>{JSON.stringify(folder[key])}</Text>
                      </Text>
                    ))}
                  </View>

                  ///////////
                  // <List.Item
                  //   style={{
                  //     marginBottom: hp(1),
                  //     backgroundColor: colors.lightGrey,
                  //     borderRadius: 10,
                  //     flexWrap: 'wrap',
                  //   }}
                  //   titleStyle={styles.text}
                  //   title={folder.name}
                  //   description={folder.path}
                  // />
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
          name: 'arrow-expand',
          disabled: !musicData || expandedAccordionIds.length === 4,
          onPress: setExpandedAccordionIds.bind(this, [
            keys.TRACKS,
            keys.ALBUMS,
            keys.ARTISTS,
            keys.FOLDERS,
          ]),
        },
        {
          name: 'arrow-collapse',
          disabled: !musicData || !expandedAccordionIds.length,
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

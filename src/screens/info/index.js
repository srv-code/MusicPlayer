import React, { useContext, useState } from 'react';
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
  const { musicInfo, setMusicInfo } = useContext(MusicContext);
  const { enabledDarkTheme } = useContext(PreferencesContext);

  console.log('[Info]', { musicInfo, enabledDarkTheme });

  const [showSearch, setShowSearch] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [expandedAccordionIds, setExpandedAccordionIds] = useState([]);
  const [inProgress, setInProgress] = useState(null);

  useBackHandler(() => {
    if (showSearch) {
      toggleSearch();
      return true;
    }
    return false;
  });

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
      setMusicInfo(null);
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
            title={`${accordionIds.TRACKS} (${musicInfo?.tracks?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="music" />}>
            {musicInfo?.tracks ? (
              <FlatList
                data={musicInfo.tracks}
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
            title={`${accordionIds.ALBUMS} (${musicInfo?.albums?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="disc" />}>
            {musicInfo?.albums ? (
              <FlatList
                data={musicInfo.albums}
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
            title={`Artists (${musicInfo?.artists?.length || 0})`}
            left={props => <List.Icon {...props} icon="account-music" />}>
            {musicInfo?.artists ? (
              <FlatList
                data={musicInfo.artists}
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
              musicInfo?.folders?.length || 0
            })`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="folder-music" />}>
            {musicInfo?.folders ? (
              <FlatList
                data={musicInfo.folders}
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
              loading={inProgress === inProgressKeys.DELETE_PREFERENCES_CACHE}
              style={styles.button}
              onPress={deletePrefCache}>
              Delete Cache
            </Button>
          </View>
          <List.Item
            titleStyle={
              enabledDarkTheme === null || enabledDarkTheme === undefined
                ? styles.errorText
                : styles.text
            }
            title={`enabledDarkTheme: ${enabledDarkTheme ?? 'N/A'}`}
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

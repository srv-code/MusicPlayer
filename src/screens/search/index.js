import React, { useContext, useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import {
  List,
  Searchbar,
  Card,
  Avatar,
  Text,
  IconButton,
  Divider,
} from 'react-native-paper';
import Icon from '../../components/icon';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { MusicContext } from '../../context/music';
import colors from '../../constants/colors';
import DateTimeUtils from '../../utils/datetime';
import { PreferencesContext } from '../../context/preferences';

// TODO
//  - Save the searched term in async-storage (avoid dups)

const accordionIds = {
  TRACKS: 'tracks',
  ALBUMS: 'albums',
  ARTISTS: 'artists',
  FOLDERS: 'folders',
};

const Search = ({ navigation }) => {
  const musicContext = useContext(MusicContext);
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const [searchedTerm, setSearchedTerm] = useState('');
  const [previousSearchedTerms, setPreviousSearchedTerms] = useState([]);
  const [musicData, setMusicData] = useState(null);
  const [expandedAccordionIds, setExpandedAccordionIds] = useState([]);

  console.log('[Info]', { musicData, searchedTerm, previousSearchedTerms });

  useEffect(() => {
    setMusicData(musicContext.musicInfo);
  }, [musicContext.musicInfo]);

  useEffect(() => {
    if (musicContext.musicInfo && searchedTerm) {
      setMusicData({
        // matches with: tracks { title }
        tracks: musicContext.musicInfo?.tracks?.filter(x =>
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
    } else setMusicData(null);
  }, [searchedTerm]);

  const isAccordionExpanded = id => expandedAccordionIds.includes(id);
  const toggleAccordionExpansion = id =>
    setExpandedAccordionIds(
      expandedAccordionIds.includes(id)
        ? expandedAccordionIds.filter(_id => _id !== id)
        : [...expandedAccordionIds, id],
    );

  const renderData = () => {
    const resultCount =
      (musicData?.tracks?.length || 0) +
      (musicData?.albums?.length || 0) +
      (musicData?.artists?.length || 0) +
      (musicData?.folders?.length || 0);

    return (
      <View>
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: hp(1),
            }}>
            {resultCount ? (
              <>
                <Icon
                  name={'text-search'}
                  size={wp(3.5)}
                  color={colors.lightGrey}
                  style={{ marginRight: wp(0.5) }}
                />
                <Text
                  style={{
                    fontSize: wp(3.5),
                    color: colors.lightGrey,
                  }}>{`${resultCount} results found`}</Text>
              </>
            ) : (
              <>
                <Icon
                  name={'circle-with-cross'}
                  type={'Entypo'}
                  size={wp(3.5)}
                  color={colors.red}
                  style={{ marginRight: wp(0.5) }}
                />
                <Text style={styles.errorText}>No results found!</Text>
              </>
            )}
          </View>
          {!!musicData?.tracks?.length && (
            <List.Accordion
              id={accordionIds.TRACKS}
              expanded={isAccordionExpanded(accordionIds.TRACKS)}
              onPress={toggleAccordionExpansion.bind(this, accordionIds.TRACKS)}
              title={`${accordionIds.TRACKS} (${musicData.tracks.length})`}
              titleStyle={styles.accordionTitleText}
              // style={{
              //   borderWidth: 1,
              //   borderColor: colors.lightGrey1,
              //   elevation: 1,
              //   borderRadius: 5,
              //   marginVertical: hp(0.5),
              // }}
              left={props => <List.Icon {...props} icon="music" />}>
              <FlatList
                contentContainerStyle={{ marginLeft: wp(-9) }}
                data={musicData.tracks}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: track }) => (
                  <>
                    <List.Item
                      // style={{
                      //   marginBottom: hp(1),
                      //   backgroundColor: colors.lightGrey,
                      //   borderRadius: 10,
                      //   flexWrap: 'wrap',
                      // }}
                      titleStyle={styles.text}
                      title={track.title}
                      description={
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <Icon
                            name={'clock-time-five-outline'}
                            size={wp(3.2)}
                            color={colors.lightGrey}
                          />
                          <Text
                            style={{
                              fontSize: wp(3.2),
                              color: colors.lightGrey,
                              marginLeft: wp(0.2),
                            }}>
                            {DateTimeUtils.msToTime(track.duration)}
                          </Text>
                          <Icon
                            name={'dot-single'}
                            type={'Entypo'}
                            size={wp(3.2)}
                            color={colors.lightGrey}
                          />
                          <Icon
                            name={'account-music'}
                            size={wp(3.2)}
                            color={colors.lightGrey}
                          />
                          <Text
                            style={{
                              fontSize: wp(3.2),
                              color: colors.lightGrey,
                              marginLeft: wp(0.2),
                            }}>
                            {track.artist}
                          </Text>
                          <Icon
                            name={'dot-single'}
                            type={'Entypo'}
                            size={wp(3.2)}
                            color={colors.lightGrey}
                          />
                          <Icon
                            name={'folder-music'}
                            size={wp(3.2)}
                            color={colors.lightGrey}
                          />
                          <Text
                            style={{
                              fontSize: wp(3.2),
                              color: colors.lightGrey,
                              marginLeft: wp(0.2),
                            }}>
                            {track.folder.name}
                          </Text>
                        </View>
                      }
                      left={props =>
                        track.coverExists ? (
                          <Avatar.Image
                            {...props}
                            size={hp(6)}
                            source={{ uri: track.coverFilePath }}
                          />
                        ) : (
                          <Avatar.Icon
                            size={hp(6)}
                            icon="music"
                            style={{
                              backgroundColor: colors.lightPurple,
                            }}
                          />
                        )
                      }
                      right={props => (
                        <IconButton
                          {...props}
                          icon="dots-vertical"
                          onPress={() => {}}
                        />
                      )}
                    />
                    <Divider inset />
                  </>
                )}
              />
            </List.Accordion>
          )}

          {!!musicData?.albums?.length && (
            <List.Accordion
              id={accordionIds.ALBUMS}
              expanded={isAccordionExpanded(accordionIds.ALBUMS)}
              onPress={toggleAccordionExpansion.bind(this, accordionIds.ALBUMS)}
              title={`${accordionIds.ALBUMS} (${musicData.albums.length})`}
              titleStyle={styles.accordionTitleText}
              left={props => <List.Icon {...props} icon="disc" />}>
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
            </List.Accordion>
          )}

          {!!musicData?.artists?.length && (
            <List.Accordion
              id={accordionIds.ARTISTS}
              expanded={isAccordionExpanded(accordionIds.ARTISTS)}
              onPress={toggleAccordionExpansion.bind(
                this,
                accordionIds.ARTISTS,
              )}
              title={`Artists (${musicData.artists.length})`}
              left={props => <List.Icon {...props} icon="account-music" />}>
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
            </List.Accordion>
          )}

          {!!musicData?.folders?.length && (
            <List.Accordion
              id={accordionIds.FOLDERS}
              expanded={isAccordionExpanded(accordionIds.FOLDERS)}
              onPress={toggleAccordionExpansion.bind(
                this,
                accordionIds.FOLDERS,
              )}
              title={`${accordionIds.FOLDERS} (${musicData.folders.length})`}
              titleStyle={styles.accordionTitleText}
              left={props => <List.Icon {...props} icon="folder-music" />}>
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
            </List.Accordion>
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.search}
      iconName="text-search"
      onBackPress={navigation.goBack}
      actionIcons={[
        {
          name: 'arrow-expand',
          disabled: !musicData || expandedAccordionIds.length === 4,
          onPress: setExpandedAccordionIds.bind(this, [
            accordionIds.TRACKS,
            accordionIds.ALBUMS,
            accordionIds.ARTISTS,
            accordionIds.FOLDERS,
          ]),
        },
        {
          name: 'arrow-collapse',
          disabled: !musicData || !expandedAccordionIds.length,
          onPress: setExpandedAccordionIds.bind(this, []),
        },
      ]}>
      <Searchbar
        placeholder="Search within music"
        onChangeText={setSearchedTerm}
        value={searchedTerm}
        style={{
          marginTop: hp(2),
        }}
      />

      {!previousSearchedTerms.length && !searchedTerm && (
        <View style={styles.iconContainer}>
          <Icon name="text-search" size={hp(20)} />
          <Text style={{ fontSize: wp(7) }}>Search Music</Text>
        </View>
      )}

      {/*<Text>*/}
      {/*  {JSON.stringify({*/}
      {/*    DocumentDirectoryPath: FileSystem.DocumentDirectoryPath,*/}
      {/*    TemporaryDirectoryPath: FileSystem.TemporaryDirectoryPath,*/}
      {/*    LibraryDirectoryPath: FileSystem.LibraryDirectoryPath,*/}
      {/*    ExternalDirectoryPath: FileSystem.ExternalDirectoryPath,*/}
      {/*    ExternalStorageDirectoryPath: FileSystem.ExternalStorageDirectoryPath,*/}
      {/*  })}*/}
      {/*</Text>*/}

      <View
        style={{
          marginVertical: hp(2),
        }}>
        {musicData && renderData()}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
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
    color: colors.red,
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

export default Search;

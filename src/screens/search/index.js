import React, { useContext, useEffect, useState } from 'react';
import { FlatList, Platform, StyleSheet, View } from 'react-native';
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
  Appbar,
  Menu,
  Snackbar,
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
import labels from '../../constants/labels';

// TODO
//  - Save the searched term in async-storage (avoid dups)
//  - Focus on the search-bar when the screen gets focus
//  - Fix the snack-bar
//  - Make a common renderer for the accordions

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
  const [showMoreOptionFor, setShowMoreOptionFor] = useState(null);
  const [showInfoInSnackBar, setShowInfoInSnackBar] = useState(null);

  console.log('[Info]', {
    musicData,
    searchedTerm,
    previousSearchedTerms,
    showInfoInSnackBar,
  });

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
          <View style={styles.resultCountContainer}>
            {resultCount ? (
              <>
                <Icon
                  name={'text-search'}
                  size={wp(3.5)}
                  color={colors.lightGrey}
                  style={styles.resultIcon}
                />
                <Text style={styles.resultCountText}>
                  {`${resultCount} results found`}
                </Text>
              </>
            ) : (
              <>
                <Icon
                  name={'circle-with-cross'}
                  type={'Entypo'}
                  size={wp(3.5)}
                  color={colors.red}
                  style={styles.resultIcon}
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
              left={props => <List.Icon {...props} icon="music" />}>
              <FlatList
                contentContainerStyle={styles.flatList}
                data={musicData.tracks}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: track, index }) => (
                  <>
                    <List.Item
                      onPress={() => {
                        // TODO insert current track in the stack (at the top) & play it
                        alert(`Selected: ${JSON.stringify(track)}`);
                      }}
                      titleEllipsizeMode={'tail'}
                      titleNumberOfLines={1}
                      titleStyle={styles.listItemText}
                      title={track.title}
                      descriptionEllipsizeMode={'tail'}
                      descriptionNumberOfLines={2}
                      description={
                        <Text style={styles.trackDescText}>
                          <Icon
                            name={'clock-time-five-outline'}
                            size={wp(3.2)}
                            color={colors.lightGrey}
                          />
                          <Text style={styles.trackSubtitleText}>
                            {DateTimeUtils.msToTime(track.duration)}
                          </Text>
                          {track.artist && (
                            <>
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
                              <Text style={styles.trackSubtitleText}>
                                {track.artist}
                              </Text>
                            </>
                          )}
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
                          <Text style={styles.trackSubtitleText}>
                            {track.folder.name}
                          </Text>
                        </Text>
                      }
                      left={props =>
                        track.coverExists ? (
                          <Avatar.Image
                            size={hp(6)}
                            source={{ uri: track.coverFilePath }}
                          />
                        ) : (
                          <Avatar.Icon
                            size={hp(6)}
                            icon="music"
                            style={styles.musicIcon}
                          />
                        )
                      }
                      right={props => (
                        <Menu
                          {...props}
                          visible={
                            showMoreOptionFor &&
                            showMoreOptionFor.type === accordionIds.TRACKS &&
                            showMoreOptionFor.index === index
                          }
                          onDismiss={setShowMoreOptionFor}
                          anchor={
                            <IconButton
                              {...props}
                              icon="dots-vertical"
                              onPress={setShowMoreOptionFor.bind(this, {
                                type: accordionIds.TRACKS,
                                index,
                              })}
                            />
                          }>
                          <Menu.Item
                            icon="skip-next-outline"
                            title={labels.playNext}
                            onPress={() => {
                              alert(JSON.stringify(props));
                              setShowMoreOptionFor(null);
                            }}
                          />
                          <Menu.Item
                            icon="playlist-plus"
                            title={labels.addToPlaylist}
                            onPress={() => {
                              setShowMoreOptionFor(null);
                              alert(JSON.stringify(props));
                            }}
                          />
                          <Menu.Item
                            icon="table-column-plus-after"
                            title={labels.addToQueue}
                            onPress={() => {
                              // alert(JSON.stringify(props));
                              setShowMoreOptionFor(null);
                              setShowInfoInSnackBar({
                                message: labels.addedToQueue,
                                actions: {
                                  label: labels.dismiss,
                                  onPress: setShowInfoInSnackBar.bind(
                                    this,
                                    null,
                                  ),
                                },
                              });
                            }}
                          />
                          <Menu.Item
                            icon="information-variant"
                            title={labels.songInfo}
                            onPress={() => {
                              alert(JSON.stringify(props));
                              setShowMoreOptionFor(null);
                            }}
                          />
                        </Menu>
                      )}
                    />
                    {index === musicData.tracks.length - 1 ? (
                      <View style={styles.listItemEndSmallBar} />
                    ) : (
                      <Divider inset />
                    )}
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
                renderItem={({ item: album, index }) => (
                  <>
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
                    {index === musicData.albums.length - 1 ? (
                      <View style={styles.listItemEndSmallBar} />
                    ) : (
                      <Divider inset />
                    )}
                  </>
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
    <>
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
          style={styles.searchBar}
        />

        {!previousSearchedTerms.length && !searchedTerm && (
          <View style={styles.iconContainer}>
            <Icon name="text-search" size={hp(20)} />
            <Text style={styles.screenTitleText}>{labels.searchMusic}</Text>
          </View>
        )}

        <View style={styles.dataContainer}>{musicData && renderData()}</View>
      </ScreenContainer>

      <Snackbar
        visible={Boolean(showInfoInSnackBar)}
        duration={showInfoInSnackBar?.duration ?? 1500}
        onDismiss={() => {
          if (showInfoInSnackBar.onDismiss) showInfoInSnackBar.onDismiss();
          setShowInfoInSnackBar(null);
        }}
        action={showInfoInSnackBar?.actions}>
        {showInfoInSnackBar?.message}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    marginTop: hp(2),
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
  resultCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },
  resultIcon: {
    marginRight: wp(0.5),
  },
  resultCountText: {
    fontSize: wp(3.5),
    color: colors.lightGrey,
  },
  flatList: {
    marginLeft: wp(-9),
    paddingBottom: hp(2),
  },
  listItemText: {
    fontSize: wp(3.5),
    marginBottom: hp(0.3),
  },
  trackDescText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackSubtitleText: {
    fontSize: wp(3.2),
    color: colors.lightGrey,
    marginLeft: wp(0.2),
  },
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
  listItemEndSmallBar: {
    paddingVertical: hp(0.3),
    width: wp(12),
    backgroundColor: colors.black,
    opacity: 0.1,
    borderRadius: 10,
    alignSelf: 'center',
  },
  screenTitleText: {
    fontSize: wp(7),
  },
  dataContainer: {
    marginVertical: hp(2),
  },
});

export default Search;

import React, { useContext, useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  StyleSheet,
  View,
} from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import {
  List,
  Searchbar,
  Avatar,
  Text,
  IconButton,
  Divider,
  Menu,
  Snackbar,
  DataTable,
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
import keys from '../../constants/keys';

// TODO
//  - Save the searched term in async-storage (avoid duplicates)
//  - Fix bug: 'Synthetic reuse' on context menu press
//  - Pressing space also returns search results (trim search term)

const Search = ({ navigation }) => {
  const musicContext = useContext(MusicContext);
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const [searchedTerm, setSearchedTerm] = useState('');
  const [previousSearchedTerms, setPreviousSearchedTerms] = useState([]);
  const [musicData, setMusicData] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [showMoreOptionFor, setShowMoreOptionFor] = useState(null);
  const [showInfoInSnackBar, setShowInfoInSnackBar] = useState(null);
  const searchBar = useRef(null);

  console.log('[Search]', {
    musicData,
    searchedTerm,
    previousSearchedTerms,
    showInfoInSnackBar,
    searchBar,
  });

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) searchBar.current?.focus();
    else Keyboard.dismiss();
  }, [isFocused]);

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
    } else setMusicData(null);
  }, [searchedTerm]);

  const isAccordionExpanded = id => expandedKeys.includes(id);
  const toggleAccordionExpansion = id =>
    setExpandedKeys(
      expandedKeys.includes(id)
        ? expandedKeys.filter(_id => _id !== id)
        : [...expandedKeys, id],
    );

  const renderData = () => {
    const resultCount =
      (musicData?.tracks?.length || 0) +
      (musicData?.albums?.length || 0) +
      (musicData?.artists?.length || 0) +
      (musicData?.folders?.length || 0);

    const renderList = (type, index) => {
      if (!musicData || !musicData[type]?.length) return null;

      // let description, left, right;

      const renderDescription = data => {
        switch (type) {
          case keys.TRACKS:
            console.log('data of tracks:', { data });

            return (
              <Text style={styles.trackDescText}>
                <Icon
                  name={'clock-time-five-outline'}
                  size={wp(3.2)}
                  color={colors.lightGrey}
                />
                <Text style={styles.trackSubtitleText}>
                  {DateTimeUtils.msToTime(data.duration)}
                </Text>
                {data.artist && (
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
                    <Text style={styles.trackSubtitleText}>{data.artist}</Text>
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
                <Text style={styles.trackSubtitleText}>{data.folder.name}</Text>
              </Text>
            );

          case keys.ALBUMS:
          case keys.ARTISTS:
          case keys.FOLDERS:
            return (
              <Text style={styles.trackDescText}>
                <Icon name={'music'} size={wp(3.2)} color={colors.lightGrey} />
                <Text style={styles.trackSubtitleText}>
                  {data.trackIds.length}
                </Text>
              </Text>
            );

          default:
            throw new Error(`Invalid type: ${type}`);
        }
      };

      const renderLeftComponent = (data, props) => {
        let iconName;
        switch (type) {
          case keys.TRACKS:
            if (data.coverExists)
              return (
                <Avatar.Image
                  size={hp(6)}
                  source={{ uri: data.coverFilePath }}
                />
              );
            else iconName = 'music';
            break;
          case keys.ALBUMS:
            iconName = 'disc';
            break;
          case keys.ARTISTS:
            iconName = 'account-music-outline';
            break;
          case keys.FOLDERS:
            iconName = 'folder-music-outline';
            break;
          default:
            new Error(`Invalid type: ${type}`);
        }

        return (
          <Avatar.Icon size={hp(6)} icon={iconName} style={styles.musicIcon} />
        );
      };

      const renderRightComponent = (data, props, itemIndex) => {
        switch (type) {
          case keys.TRACKS:
            return (
              <Menu
                {...props}
                visible={
                  showMoreOptionFor &&
                  showMoreOptionFor.type === type &&
                  showMoreOptionFor.index === itemIndex
                }
                onDismiss={setShowMoreOptionFor}
                anchor={
                  <IconButton
                    {...props}
                    icon="dots-vertical"
                    onPress={setShowMoreOptionFor.bind(this, {
                      type,
                      index: itemIndex,
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
                        onPress: setShowInfoInSnackBar.bind(this, null),
                      },
                    });
                  }}
                />
                <Menu.Item
                  icon="information-variant"
                  title={labels.showInfo}
                  onPress={() => {
                    // alert(JSON.stringify(props));
                    navigation.navigate(screenNames.itemInfo, { type, data });
                    // setInfoModalData({ type, data });
                    setShowMoreOptionFor(null);
                  }}
                />
              </Menu>
            );

          case keys.ALBUMS:
            return (
              <Menu
                {...props}
                visible={
                  showMoreOptionFor &&
                  showMoreOptionFor.type === type &&
                  showMoreOptionFor.index === itemIndex
                }
                onDismiss={setShowMoreOptionFor}
                anchor={
                  <IconButton
                    {...props}
                    icon="dots-vertical"
                    onPress={setShowMoreOptionFor.bind(this, {
                      type,
                      index: itemIndex,
                    })}
                  />
                }>
                <Menu.Item
                  icon="skip-next-outline"
                  title={labels.playAllNext}
                  onPress={() => {
                    alert(JSON.stringify(props));
                    setShowMoreOptionFor(null);
                  }}
                />
                <Menu.Item
                  icon="playlist-plus"
                  title={labels.addAllToPlaylist}
                  onPress={() => {
                    setShowMoreOptionFor(null);
                    alert(JSON.stringify(props));
                  }}
                />
                <Menu.Item
                  icon="table-column-plus-after"
                  title={labels.addAllToQueue}
                  onPress={() => {
                    // alert(JSON.stringify(props));
                    setShowMoreOptionFor(null);
                    setShowInfoInSnackBar({
                      message: labels.addedToQueue,
                      actions: {
                        label: labels.dismiss,
                        onPress: setShowInfoInSnackBar.bind(this, null),
                      },
                    });
                  }}
                />
                <Menu.Item
                  icon="information-variant"
                  title={labels.showInfo}
                  onPress={() => {
                    // alert(JSON.stringify(props));
                    navigation.navigate(screenNames.itemInfo, { type, data });
                    // setInfoModalData({ type, data });
                    setShowMoreOptionFor(null);
                  }}
                />
              </Menu>
            );

          case keys.ARTISTS:
            return (
              <Menu
                {...props}
                visible={
                  showMoreOptionFor &&
                  showMoreOptionFor.type === type &&
                  showMoreOptionFor.index === itemIndex
                }
                onDismiss={setShowMoreOptionFor}
                anchor={
                  <IconButton
                    {...props}
                    icon="dots-vertical"
                    onPress={setShowMoreOptionFor.bind(this, {
                      type,
                      index: itemIndex,
                    })}
                  />
                }>
                <Menu.Item
                  icon="skip-next-outline"
                  title={labels.playAllNext}
                  onPress={() => {
                    alert(JSON.stringify(props));
                    setShowMoreOptionFor(null);
                  }}
                />
                <Menu.Item
                  icon="playlist-plus"
                  title={labels.addAllToPlaylist}
                  onPress={() => {
                    setShowMoreOptionFor(null);
                    alert(JSON.stringify(props));
                  }}
                />
                <Menu.Item
                  icon="table-column-plus-after"
                  title={labels.addAllToQueue}
                  onPress={() => {
                    // alert(JSON.stringify(props));
                    setShowMoreOptionFor(null);
                    setShowInfoInSnackBar({
                      message: labels.addedToQueue,
                      actions: {
                        label: labels.dismiss,
                        onPress: setShowInfoInSnackBar.bind(this, null),
                      },
                    });
                  }}
                />
                <Menu.Item
                  icon="information-variant"
                  title={labels.showInfo}
                  onPress={() => {
                    // alert(JSON.stringify(props));
                    navigation.navigate(screenNames.itemInfo, { type, data });
                    // setInfoModalData({ type, data });
                    setShowMoreOptionFor(null);
                  }}
                />
              </Menu>
            );

          case keys.FOLDERS:
            return (
              <Menu
                {...props}
                visible={
                  showMoreOptionFor &&
                  showMoreOptionFor.type === type &&
                  showMoreOptionFor.index === itemIndex
                }
                onDismiss={setShowMoreOptionFor}
                anchor={
                  <IconButton
                    {...props}
                    icon="dots-vertical"
                    onPress={setShowMoreOptionFor.bind(this, {
                      type,
                      index: itemIndex,
                    })}
                  />
                }>
                <Menu.Item
                  icon="skip-next-outline"
                  title={labels.playAllNext}
                  onPress={() => {
                    alert(JSON.stringify(props));
                    setShowMoreOptionFor(null);
                  }}
                />
                <Menu.Item
                  icon="playlist-plus"
                  title={labels.addAllToPlaylist}
                  onPress={() => {
                    setShowMoreOptionFor(null);
                    alert(JSON.stringify(props));
                  }}
                />
                <Menu.Item
                  icon="table-column-plus-after"
                  title={labels.addAllToQueue}
                  onPress={() => {
                    // alert(JSON.stringify(props));
                    setShowMoreOptionFor(null);
                    setShowInfoInSnackBar({
                      message: labels.addedToQueue,
                      actions: {
                        label: labels.dismiss,
                        onPress: setShowInfoInSnackBar.bind(this, null),
                      },
                    });
                  }}
                />
                <Menu.Item
                  icon="information-variant"
                  title={labels.showInfo}
                  onPress={() => {
                    // alert(JSON.stringify(props));
                    navigation.navigate(screenNames.itemInfo, { type, data });
                    // setInfoModalData({ type, data });
                    setShowMoreOptionFor(null);
                  }}
                />
              </Menu>
            );

          default:
            new Error(`Invalid type: ${type}`);
        }
      };

      const renderAccordionIcon = () => {
        switch (type) {
          case keys.TRACKS:
            return 'music';
          case keys.ALBUMS:
            return 'disc';
          case keys.ARTISTS:
            return 'account-music';
          case keys.FOLDERS:
            return 'folder-music';
          default:
            new Error(`Invalid type: ${type}`);
        }
      };

      const getTitleText = data => {
        switch (type) {
          case keys.TRACKS:
            return data.title;
          case keys.ALBUMS:
          case keys.ARTISTS:
          case keys.FOLDERS:
            return data.name;
          default:
            new Error(`Invalid type: ${type}`);
        }
      };

      return (
        <List.Accordion
          key={index}
          id={type}
          expanded={isAccordionExpanded(type)}
          onPress={toggleAccordionExpansion.bind(this, type)}
          title={`${type} (${musicData[type].length})`}
          titleStyle={styles.accordionTitleText}
          left={props => <List.Icon {...props} icon={renderAccordionIcon()} />}>
          <FlatList
            contentContainerStyle={styles.flatList}
            data={musicData[type]}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index: itemIndex }) => (
              <>
                <List.Item
                  onPress={() => {
                    // TODO
                    //  - tracks: insert current track in the stack (at the top) & play it
                    //  - albums|artists|folders: show album tracks
                    Alert.alert(`${type} Info`, JSON.stringify(item));
                  }}
                  titleEllipsizeMode={'tail'}
                  titleNumberOfLines={1}
                  titleStyle={styles.listItemText}
                  title={getTitleText(item)}
                  descriptionEllipsizeMode={'tail'}
                  descriptionNumberOfLines={2}
                  description={renderDescription.bind(this, item)}
                  left={props => renderLeftComponent(item, props)}
                  right={props => renderRightComponent(item, props, itemIndex)}
                />
                {index === musicData[type].length - 1 ? (
                  <View style={styles.listItemEndSmallBar} />
                ) : (
                  <Divider inset />
                )}
              </>
            )}
          />
        </List.Accordion>
      );
    };

    const renderCount = () => (
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
    );

    return (
      <View>
        <View>
          {renderCount()}
          {[keys.TRACKS, keys.ALBUMS, keys.ARTISTS, keys.FOLDERS].map(
            renderList,
          )}
        </View>
      </View>
    );
  };

  // TODO move to item-info screen
  const renderInfoModalContent = () => {
    console.log('[Search]', { infoModalData });

    // if (!infoModalData) return null;

    switch (infoModalData?.type) {
      case undefined:
        return null;

      case keys.TRACKS:
        return (
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp(1),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Icon
                name={'music'}
                size={wp(6)}
                color={colors.lightPurple}
                style={{ marginRight: wp(1) }}
              />
              <Text
                style={{
                  fontSize: wp(6),
                }}>
                {labels.trackInformation}
              </Text>
            </View>

            <Image
              // size={hp(12)}
              style={{
                height: hp(20),
                width: hp(20),
                borderRadius: 10,
                marginTop: hp(1),
                // marginBottom: hp(0.7),
              }}
              resizeMode={'contain'}
              source={{ uri: infoModalData.data.coverFilePath }}
            />

            <DataTable>
              <DataTable.Row>
                <DataTable.Cell>
                  <Text style={{ fontSize: wp(3), fontWeight: 'bold' }}>
                    {labels.duration}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={{ fontSize: wp(3) }}>
                    {
                      DateTimeUtils.msToTimeComponents(
                        infoModalData.data.duration,
                      ).string
                    }
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            </DataTable>
          </View>
        );

      case keys.ARTISTS:
        return null;

      case keys.ALBUMS:
        return null;

      case keys.FOLDERS:
        return null;

      default:
        throw new Error(`Invalid type: ${infoModalData.type}`);
    }
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
            disabled: !musicData || expandedKeys.length === 4,
            onPress: setExpandedKeys.bind(this, [
              keys.TRACKS,
              keys.ALBUMS,
              keys.ARTISTS,
              keys.FOLDERS,
            ]),
          },
          {
            name: 'arrow-collapse',
            disabled: !musicData || !expandedKeys.length,
            onPress: setExpandedKeys.bind(this, []),
          },
        ]}>
        <Searchbar
          ref={searchBar}
          placeholder="Search within music"
          onChangeText={setSearchedTerm}
          value={searchedTerm}
          style={styles.searchBar}
        />

        <Text
          onPress={() => {
            sheetRef.current.snapTo(0);
          }}>
          Show bottom sheet
        </Text>

        {!previousSearchedTerms.length && !searchedTerm && (
          <View style={styles.iconContainer}>
            <Icon name="text-search" size={hp(20)} />
            <Text style={styles.screenTitleText}>{labels.searchMusic}</Text>
          </View>
        )}

        {musicData && <View style={styles.dataContainer}>{renderData()}</View>}

        {/*<BottomSheet*/}
        {/*  ref={sheetRef}*/}
        {/*  snapPoints={[450, 300, 0]}*/}
        {/*  borderRadius={10}*/}
        {/*  renderContent={*/}
        {/*    <View*/}
        {/*      style={{*/}
        {/*        backgroundColor: 'white',*/}
        {/*        padding: 16,*/}
        {/*        height: 450,*/}
        {/*      }}>*/}
        {/*      <Text>Swipe down to close</Text>*/}
        {/*    </View>*/}
        {/*  }*/}
        {/*/>*/}
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

      {/*<Modal*/}
      {/*  testID={'modal1'}*/}
      {/*  backdropOpacity={0.5}*/}
      {/*  isVisible={Boolean(infoModalData)}*/}
      {/*  onBackdropPress={setInfoModalData.bind(this, null)}*/}
      {/*  onBackButtonPress={setInfoModalData.bind(this, null)}*/}
      {/*  style={styles.modalStyle}>*/}
      {/*  <View style={styles.modalViewStyle}>*/}
      {/*    <View style={styles.listItemEndSmallBar} />*/}
      {/*    {renderInfoModalContent()}*/}
      {/*    <Button*/}
      {/*      icon="check"*/}
      {/*      mode="contained"*/}
      {/*      // color={'green'}*/}
      {/*      style={{*/}
      {/*        marginTop: hp(2),*/}
      {/*        paddingVertical: hp(0.4),*/}
      {/*      }}*/}
      {/*      uppercase={false}*/}
      {/*      onPress={setInfoModalData.bind(this, null)}>*/}
      {/*      {labels.OK}*/}
      {/*    </Button>*/}
      {/*  </View>*/}
      {/*</Modal>*/}
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
  modalStyle: {
    // position: 'absolute',
    // bottom: 0,
    // left: 0,
    // justifyContent: 'center',
    // flex:1,
    margin: 0,
    justifyContent: 'center',
    alignItems: 'flex-end',
    // marginBottom: hp(-1.8),
    // borderWidth: 1,
    flex: 1,
    // borderColor: 'yellow',
    flexDirection: 'row',
  },
  modalViewStyle: {
    // display: 'none',

    flex: 0.98,
    backgroundColor: colors.white1,
    // width: wp(98),
    elevation: 1,
    // borderRadius: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: wp(3),
    paddingTop: hp(2),
    paddingBottom: hp(1),
  },
});

export default Search;

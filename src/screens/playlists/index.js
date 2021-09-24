import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';
import labels from '../../constants/labels';
import { MusicContext } from '../../context/music';
import PlaylistCover from '../../components/playlist-cover';
import Modal from 'react-native-modal';
import Playlist from '../../components/playlist';
import PlaylistControls from '../../components/playlist-controls';
import { SortingOptions, SortingOrders } from '../../constants/tracks';

const Playlists = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { musicInfo, setMusicInfo } = useContext(MusicContext);

  const [showEditingModalForId, setShowEditingModalForId] = useState(null);
  const [sortBy, setSortBy] = useState(SortingOptions.TITLE);
  const [sortOrder, setSortOrder] = useState(SortingOrders.ASCENDING);

  const onEditPlaylist = id => setShowEditingModalForId(id);

  const onPlayPlaylist = (id, playNext) => {};

  const onShufflePlaylist = id => {};

  const onAddPlaylistToQueue = id => {};

  const onShowPlaylistInfo = id => {};

  const onDeletePlaylist = id => {};

  const sortAllPlaylists = (by, order) => {
    setSortBy(by);
    setSortOrder(order);
  };

  const onPlayAllPlaylists = () => {};

  const dynamicStyles = {
    screen: {
      ...styles.screen,
      backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
    },
    container: {
      ...styles.container,
      backgroundColor: enabledDarkTheme ? colors.darkest : colors.light,
    },
  };

  return (
    <>
      <ScreenContainer style={dynamicStyles.screen}>
        <View style={dynamicStyles.container}>
          {/*<Text>Playlists screen</Text>*/}

          {/*<Text*/}
          {/*  onPress={navigation.navigate.bind(this, screenNames.editPlaylist)}>*/}
          {/*  Go to info screen*/}
          {/*</Text>*/}

          <PlaylistControls
            enabledDarkTheme={enabledDarkTheme}
            disabled={!musicInfo?.[keys.PLAYLISTS]?.length}
            sortKeys={[
              SortingOptions.TITLE,
              SortingOptions.TRACKS,
              SortingOptions.DURATION,
              SortingOptions.CREATED_ON,
              SortingOptions.UPDATED_ON,
            ]}
            sortOrder={sortOrder}
            onChangeSortOrder={order => sortAllPlaylists(sortBy, order)}
            sortBy={sortBy}
            onChangeSortBy={by => sortAllPlaylists(by, sortOrder)}
            onShuffle={onShufflePlaylist}
            onPlay={onPlayAllPlaylists}
          />

          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              // alignContents: 'center',
            }}>
            {musicInfo?.[keys.PLAYLISTS].map((info, playlistIndex) => (
              <PlaylistCover
                key={playlistIndex}
                id={info.id}
                onEdit={onEditPlaylist}
                onPlay={onPlayPlaylist}
                onShuffle={onShufflePlaylist}
                onAddToQueue={onAddPlaylistToQueue}
                onShowInfo={onShowPlaylistInfo}
                onDelete={onDeletePlaylist}
                // style={{
                //   backgroundColor: 'lightblue',
                //   // marginVertical: hp(1)
                // }}
              />

              // <Text>ID: {info.id}</Text>
              // <Text>Name: {info.name}</Text>
              // <Text>Created On: {new Date(info.created).toString()}</Text>
              // <Text>
              //   Last Updated On: {new Date(info.last_updated).toString()}
              // </Text>
              // <Text>{`Tracks (${musicInfo[keys.TRACKS].length}):`}</Text>
              // {info.track_ids.map((id, trackIndex) => (
              //   <Text key={trackIndex}>
              //     {`  [${id}] ${
              //       musicInfo[keys.TRACKS].find(t => t.id === id).title
              //     }`}
              //   </Text>
              // ))}
            ))}
          </View>
        </View>
      </ScreenContainer>

      <Modal
        testID={'modal'}
        isVisible={Boolean(showEditingModalForId)}
        onSwipeComplete={setShowEditingModalForId.bind(this, null)}
        swipeDirection={['down']}
        // scrollTo={this.handleScrollTo}
        // scrollOffset={this.state.scrollOffset}
        onBackdropPress={setShowEditingModalForId.bind(this, null)}
        onBackButtonPress={setShowEditingModalForId.bind(this, null)}
        backdropOpacity={0.5}
        scrollOffsetMax={hp(80)} // content height - ScrollView height
        propagateSwipe={true}
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          // backgroundColor: 'transparent',
        }}>
        <View
          style={{
            height: hp(70),
            backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
            borderTopStartRadius: 15,
            borderTopEndRadius: 15,
            alignItems: 'center',
          }}>
          <View
            style={{
              marginTop: hp(1),
              marginBottom: hp(2),
              paddingVertical: hp(0.3),
              width: wp(10),
              backgroundColor: colors.black,
              opacity: 0.3,
              borderRadius: 10,
              alignSelf: 'center',
            }}
          />

          <Playlist id={showEditingModalForId} style={{}} />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    elevation: 4,
    marginTop: hp(0.4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
  },
});

export default Playlists;

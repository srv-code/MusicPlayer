import React, { useContext, useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, ToastAndroid, View } from 'react-native';
import {
  Avatar,
  Divider,
  IconButton,
  List,
  Menu,
  Text,
} from 'react-native-paper';
import labels from '../../constants/labels';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../constants/colors';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { PreferencesContext } from '../../context/preferences';
import PlayerUtils from '../../utils/player';
import DateTimeUtils from '../../utils/datetime';
import Icon from '../icon';
import { SortingOptions, SortingOrders } from '../../constants/tracks';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';

const TrackList = ({
  tracks,
  sortBy,
  listStyle,
  currentlyPlayingTrackId,
  playerOnCollapse,
}) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const [showMoreOptionForTrackId, setShowMoreOptionForTrackId] =
    useState(null);

  const renderTrackDescription = track => {
    const getText = () => {
      switch (sortBy) {
        case SortingOptions.TITLE:
        case SortingOptions.ARTIST:
          return track.artist;
        case SortingOptions.DURATION:
          return DateTimeUtils.msToTime(track.duration);
        case SortingOptions.ALBUM:
          return track.album;
        case SortingOptions.FOLDER:
          // return `${track.folder.name} (${track.folder.path)})`;
          return track.folder.name;
        default:
          throw new Error(`Invalid sortBy: ${sortBy}`);
      }
    };

    return (
      <View style={styles.trackDescText}>
        <Icon
          name={
            IconUtils.getInfo(
              sortBy === SortingOptions.TITLE ? SortingOptions.ARTIST : sortBy,
            ).name.outlined
          }
          type={
            IconUtils.getInfo(
              sortBy === SortingOptions.TITLE ? SortingOptions.ARTIST : sortBy,
            ).type
          }
          size={wp(3.5)}
          color={colors.lightGrey}
        />
        <Text numberOfLines={1} style={styles.trackSubtitleText}>
          {getText()}
        </Text>
      </View>
    );
  };

  const renderTrackItemLeftComponent = (track, props) => {
    if (track.artwork)
      return (
        <Avatar.Image
          size={hp(6)}
          source={{ uri: `file://${track.artwork}` }}
        />
      );
    return (
      <Avatar.Icon
        size={hp(6)}
        icon={IconUtils.getInfo(keys.TRACKS).name.default}
        style={styles.musicIcon}
      />
    );
  };

  const renderTrackItemRightComponent = (track, props) => (
    <Menu
      {...props}
      visible={showMoreOptionForTrackId === track.id}
      onDismiss={setShowMoreOptionForTrackId.bind(this, null)}
      anchor={
        <IconButton
          {...props}
          icon={IconUtils.getInfo(keys.VERTICAL_ELLIPSIS).name.default}
          onPress={setShowMoreOptionForTrackId.bind(this, track.id)}
        />
      }>
      <Menu.Item
        icon={IconUtils.getInfo(keys.SKIP_NEXT).name.default}
        title={labels.playNext}
        onPress={() => {
          alert(JSON.stringify(props));
          setShowMoreOptionForTrackId(null);
        }}
      />
      <Menu.Item
        icon={IconUtils.getInfo(keys.ADD_TO_PLAYLIST).name.default}
        title={labels.addToPlaylist}
        onPress={() => {
          setShowMoreOptionForTrackId(null);
          alert(JSON.stringify(props));
        }}
      />
      <Menu.Item
        icon={IconUtils.getInfo(keys.ADD_TO_QUEUE).name.default}
        title={labels.addToQueue}
        onPress={() => {
          // alert(JSON.stringify(props));
          setShowMoreOptionForTrackId(null);
          ToastAndroid.show(labels.addedToQueue, ToastAndroid.SHORT);
        }}
      />
      <Menu.Item
        icon={IconUtils.getInfo(keys.INFO).name.filled}
        title={labels.showInfo}
        onPress={() => {
          // alert(JSON.stringify(props));
          // navigation.navigate(screenNames.itemInfo, { type, data });
          // setInfoModalData({ type, data });
          setShowMoreOptionForTrackId(null);
        }}
      />
    </Menu>
  );

  const renderTrackItem = ({ item: track, index }) => {
    const renderDivider = () => {
      if (index === tracks.length - 1) {
        return <View style={styles.listItemEndSmallBar} />;
      } else {
        if (currentlyPlayingTrackId) {
          const playingIndex = tracks.findIndex(
            t => t.id === currentlyPlayingTrackId,
          );
          if (playingIndex === -1)
            throw new Error(`Could not find playing track index`);
          if (index === playingIndex - 1 || index === playingIndex) return null;
          else return <Divider inset />;
        } else return <Divider inset />;
      }
    };

    return (
      <>
        <List.Item
          style={{
            ...styles.trackItemContainer,
            backgroundColor:
              currentlyPlayingTrackId === track.id
                ? enabledDarkTheme
                  ? Colors.darker
                  : Colors.lighter
                : null,
            elevation: currentlyPlayingTrackId === track.id ? 2 : 0,
          }}
          onPress={() => {
            PlayerUtils.playTracks(playerOnCollapse, tracks, index)
              .then(() =>
                ToastAndroid.show(
                  `${labels.playing} ${labels.fromAll} ${tracks.length} ${labels.tracks}`,
                  ToastAndroid.SHORT,
                ),
              )
              .catch(err => {
                ToastAndroid.show(
                  `${labels.couldntPlayTracks} (${err.message}}`,
                  ToastAndroid.LONG,
                );
                throw err;
              });
          }}
          titleEllipsizeMode={'tail'}
          titleNumberOfLines={1}
          titleStyle={styles.listItemText}
          // title={`[${index}] ${track.title}`}
          title={track.title}
          descriptionEllipsizeMode={'tail'}
          descriptionNumberOfLines={1}
          description={renderTrackDescription.bind(this, track)}
          left={props => renderTrackItemLeftComponent(track, props)}
          right={props => renderTrackItemRightComponent(track, props)}
        />

        {renderDivider()}
      </>
    );
  };

  return (
    <View>
      {tracks.length === 0 ? (
        <Text style={styles.noTracksText}>{labels.noTracksFound}</Text>
      ) : (
        <FlatList
          contentContainerStyle={[styles.musicList, listStyle]}
          data={tracks}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderTrackItem}
        />
      )}
    </View>
  );
};

// TODO Remove these style objects from Tracks, Item-Info, Search screens
const styles = StyleSheet.create({
  noTracksText: {
    fontSize: wp(5),
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: hp(8),
    color: colors.lightGrey,
  },
  musicList: {
    paddingHorizontal: wp(2),
    paddingBottom: hp(5),
  },
  listItemEndSmallBar: {
    paddingVertical: hp(0.3),
    width: wp(12),
    backgroundColor: colors.black,
    opacity: 0.1,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: hp(1),
  },
  trackItemContainer: {
    alignItems: 'center',
    borderRadius: wp(2),
    // paddingVertical: 0,
    // backgroundColor: 'lightgreen',
  },
  listItemText: {
    fontSize: wp(4),
  },
  trackDescText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackSubtitleText: {
    fontSize: wp(3.2),
    color: colors.lightGrey,
    marginLeft: wp(0.5),
  },
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
});
export default TrackList;

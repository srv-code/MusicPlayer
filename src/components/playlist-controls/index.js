import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Menu, Text, ToggleButton } from 'react-native-paper';
import Icon from '../icon';
import colors from '../../constants/colors';
import IconUtils from '../../utils/icon';
import { SortingOrders } from '../../constants/tracks';
import keys from '../../constants/keys';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// Sorting menus as per screens:
//  - Tracks: TITLE, ARTIST, ALBUM, DURATION, FOLDER
//  - Playlists: TITLE, TRACKS, DURATION, CREATED_ON, UPDATED_ON
//  - Favorites: TITLE, CREATED_ON, ARTIST, ALBUM, DURATION, FOLDER
//  - Albums: TITLE, TRACKS, DURATION
//  - Artists: TITLE, TRACKS, DURATION
//  - Folders: TITLE, TRACKS, DURATION
const PlaylistControls = ({
  style,
  enabledDarkTheme,
  disabled,
  sortKeys = [],
  sortOrder,
  onChangeSortOrder,
  sortBy,
  onChangeSortBy,
  onShuffle,
  onPlay,
}) => {
  const [showSortingMenu, setShowSortingMenu] = useState(false);

  // console.log(
  //   `props: ${JSON.stringify({
  //     style,
  //     enabledDarkTheme,
  //     disabled,
  //     sortKeys,
  //     sortOrder,
  //     onChangeSortOrder,
  //     sortBy,
  //     onChangeSortBy,
  //     onShuffle,
  //     onPlay,
  //   })}`,
  // );

  const dynamicStyles = {
    sortButton: {
      ...styles.sortButton,
      opacity: disabled ? 1 : 0.8,
    },
    playerButton: {
      ...styles.playerButton,
      backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
      opacity: disabled ? 0.8 : 1,
    },
  };

  return (
    <View style={[styles.container, style]}>
      <Menu
        visible={showSortingMenu}
        onDismiss={setShowSortingMenu.bind(this, false)}
        anchor={
          <TouchableOpacity
            disabled={disabled}
            onPress={setShowSortingMenu.bind(this, true)}
            style={dynamicStyles.sortButton}>
            <Icon
              name={
                IconUtils.getInfo(
                  sortOrder === SortingOrders.ASCENDING
                    ? keys.SORT_ASCENDING_ALT
                    : keys.SORT_DESCENDING_ALT,
                ).name.filled
              }
              type={IconUtils.getInfo(keys.SORT_ASCENDING_ALT).type}
              size={wp(4)}
              color={disabled ? colors.lightGrey1 : colors.lightGrey}
            />
            <Icon
              name={IconUtils.getInfo(sortBy).name.outlined}
              type={IconUtils.getInfo(sortBy).type}
              size={wp(4.5)}
              color={disabled ? colors.lightGrey1 : colors.lightGrey}
            />
          </TouchableOpacity>
        }>
        {/*<Text>{sortOrder}</Text>*/}
        <View style={styles.sortOrderContainer}>
          {[SortingOrders.ASCENDING, SortingOrders.DECREASING].map(
            (key, index) => (
              <ToggleButton
                key={index}
                icon={IconUtils.getInfo(key).name.default}
                onPress={onChangeSortOrder.bind(this, key)}
                style={styles.sortOrderButton}
                size={wp(4.5)}
                status={sortOrder === key ? 'checked' : 'unchecked'}
                value={key}
              />
            ),
          )}

          {/*<ToggleButton*/}
          {/*  icon={IconUtils.getInfo(keys.SORT_ASCENDING).name.default}*/}
          {/*  onPress={sortTracks.bind(*/}
          {/*    this,*/}
          {/*    [...tracks],*/}
          {/*    sortBy,*/}
          {/*    SortingOrders.ASCENDING,*/}
          {/*  )}*/}
          {/*  style={styles.sortOrderButton}*/}
          {/*  size={wp(4.5)}*/}
          {/*  status={*/}
          {/*    sortOrder === SortingOrders.ASCENDING ? 'checked' : 'unchecked'*/}
          {/*  }*/}
          {/*  value={SortingOrders.ASCENDING}*/}
          {/*/>*/}
          {/*<ToggleButton*/}
          {/*  icon={IconUtils.getInfo(keys.SORT_DESCENDING).name.default}*/}
          {/*  onPress={sortTracks.bind(*/}
          {/*    this,*/}
          {/*    [...tracks],*/}
          {/*    sortBy,*/}
          {/*    SortingOrders.DECREASING,*/}
          {/*  )}*/}
          {/*  style={styles.sortOrderButton}*/}
          {/*  size={wp(4.5)}*/}
          {/*  status={*/}
          {/*    sortOrder === SortingOrders.DECREASING ? 'checked' : 'unchecked'*/}
          {/*  }*/}
          {/*  value={SortingOrders.DECREASING}*/}
          {/*/>*/}
        </View>

        {/*{Object.values(SortingOptions).map((option, index) => (*/}
        {sortKeys.map((key, index) => (
          <TouchableOpacity
            key={index}
            style={styles.sortOptionButton}
            onPress={onChangeSortBy.bind(this, key)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={IconUtils.getInfo(key).name.outlined}
                type={IconUtils.getInfo(key).type}
                size={wp(4.5)}
                color={colors.lightGrey}
              />
              <Text style={styles.sortOptionText}>{key}</Text>
            </View>
            {sortBy === key && (
              <Icon
                name={IconUtils.getInfo(keys.CHECK).name.filled}
                type={IconUtils.getInfo(keys.CHECK).type}
                size={wp(4)}
                color={colors.lightGrey}
              />
            )}
          </TouchableOpacity>
        ))}
      </Menu>

      <View style={styles.playerRightButtonContainer}>
        <TouchableOpacity
          disabled={disabled}
          style={dynamicStyles.playerButton}
          onPress={onShuffle}>
          <Icon
            name={IconUtils.getInfo(keys.SHUFFLE).name.filled}
            type={IconUtils.getInfo(keys.SHUFFLE).type}
            size={wp(4)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          disabled={disabled}
          style={dynamicStyles.playerButton}
          onPress={onPlay}>
          <Icon
            name={IconUtils.getInfo(keys.PLAY).name.filled}
            type={IconUtils.getInfo(keys.PLAY).type}
            size={wp(3)}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
    paddingHorizontal: wp(2),
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortOrderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortOrderButton: {
    height: hp(4),
    width: wp(15),
  },
  sortOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: hp(0.7),
    paddingHorizontal: wp(4),
    width: wp(37),
  },
  sortOptionText: {
    fontSize: wp(4),
    marginLeft: wp(1.8),
    textTransform: 'capitalize',
  },
  playerButton: {
    elevation: 2,
    borderRadius: hp(10),
    // padding: hp(1),
    height: hp(4),
    width: hp(4),
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
  playerRightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PlaylistControls;

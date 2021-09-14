import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Avatar, DataTable, Divider, Text } from 'react-native-paper';
import labels from '../../constants/labels';
import keys from '../../constants/keys';
import DateTimeUtils from '../../utils/datetime';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Icon from '../../components/icon';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';

export const DisplayModes = {
  SCREEN: 'SCREEN',
  MODAL: 'MODAL',
};

export const getScreenTitle = type => {
  switch (type) {
    case keys.TRACKS:
      return `${labels.track} ${labels.info}`;
    case keys.ALBUMS:
      return `${labels.album} ${labels.info}`;
    case keys.ARTISTS:
      return `${labels.artist} ${labels.info}`;
    case keys.FOLDERS:
      return `${labels.folder} ${labels.info}`;
    case keys.PLAYLISTS:
      return `${labels.playlist} ${labels.info}`;
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};

const ItemInfo = ({ navigation, route, extraData }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const { displayMode, type, data } = route.params;

  if (displayMode === DisplayModes.MODAL && extraData.snapIndex < 2)
    navigation.navigate(screenNames.nowPlaying);

  console.log(
    `[ItemInfo] displayMode=${JSON.stringify(
      displayMode,
    )}, type=${JSON.stringify(type)}, data=${JSON.stringify(data)}`,
  );

  const Container = ({ children }) => {
    switch (displayMode) {
      case DisplayModes.SCREEN:
        return (
          <ScreenContainer
            showHeader
            title={getScreenTitle(type)}
            onBackPress={navigation.goBack}>
            <View style={styles.container}>{children}</View>
          </ScreenContainer>
        );

      case DisplayModes.MODAL:
        return (
          <BottomSheetScrollView
            style={{
              flex: 1,
              paddingHorizontal: 16,
              overflow: 'visible',
            }}>
            {children}
          </BottomSheetScrollView>
        );

      default:
        throw new Error(`Invalid displayMode: ${displayMode}`);
    }
  };

  const getSongTableData = () => {
    switch (type) {
      case keys.TRACKS:
        return [
          {
            icon: { name: 'format-text', type: 'MaterialCommunityIcons' },
            attr: { name: labels.title, value: data.title },
          },
          {
            icon: { name: 'disc-outline', type: 'Ionicons' },
            attr: { name: labels.album, value: data.album },
          },
          {
            icon: {
              name: 'account-music-outline',
              type: 'MaterialCommunityIcons',
            },
            attr: { name: labels.artist, value: data.artist },
          },
          {
            icon: {
              name: 'clock-time-five-outline',
              type: 'MaterialCommunityIcons',
            },
            attr: {
              name: labels.playDuration,
              value: DateTimeUtils.msToTime(data.duration),
            },
          },
          {
            icon: { name: 'heart-outline', type: 'MaterialCommunityIcons' },
            attr: {
              name: labels.markedFavorite,
              value: data.markedFavorite != null ? labels.yes : labels.no,
            },
          },
          {
            icon: {
              name: 'playlist-music-outline',
              type: 'MaterialCommunityIcons',
            },
            attr: {
              name: labels.includedInPlaylists,
              value: 'None', // TODO calc
            },
          },
          {
            icon: {
              name: 'folder-music-outline',
              type: 'MaterialCommunityIcons',
            },
            attr: {
              name: labels.location,
              value: data.folder.name,
              subValue: data.folder.path,
            },
          },
        ];

      case keys.ALBUMS:
        return [
          {
            icon: { name: 'disc-outline', type: 'Ionicons' },
            attr: { name: labels.name, value: data.name },
          },
          {
            icon: { name: 'musical-notes-outline', type: 'Ionicons' },
            attr: { name: labels.trackCount, value: data.trackIds.length },
          },
        ];

      case keys.ARTISTS:
        return [
          {
            icon: {
              name: 'account-music-outline',
              type: 'MaterialCommunityIcons',
            },
            attr: { name: labels.name, value: data.name },
          },
          {
            icon: { name: 'musical-notes-outline', type: 'Ionicons' },
            attr: { name: labels.trackCount, value: data.trackIds.length },
          },
        ];

      case keys.FOLDERS:
        return [];

      case keys.PLAYLISTS:
        return [];

      default:
        throw new Error(`Invalid type: ${type}`);
    }
  };

  const renderArtwork = () => {
    const getIconName = () => {
      switch (type) {
        case keys.TRACKS:
          return 'music';
        case keys.ALBUMS:
          return 'album';
        case keys.ARTISTS:
          return 'account-music';
        case keys.FOLDERS:
          return 'folder-music';
        case keys.PLAYLISTS:
          return 'playlist-music';
        default:
          throw new Error(`Invalid type: ${type}`);
      }
    };

    return (
      <LinearGradient
        colors={
          enabledDarkTheme
            ? ['#767676', '#595959', '#323232'] // excluded: '#282828'
            : ['#d4d4d4', '#999999', '#7b7b7b', '#373737']
        }
        style={{
          elevation: 10,
          borderRadius: hp(20),
          padding: wp(2),
          marginVertical: hp(1),
          alignItems: 'center',
        }}>
        <View
          style={{
            borderRadius: hp(20),
          }}>
          {type === keys.TRACKS && data.artwork ? (
            <Avatar.Image
              size={hp(30)}
              source={{ uri: `file://${data.artwork}` }}
            />
          ) : (
            <Avatar.Icon
              size={hp(30)}
              icon={getIconName()}
              style={styles.musicIcon}
            />
          )}
        </View>
      </LinearGradient>
    );
  };

  const renderContent = () => {
    if (data)
      return (
        <>
          {/*<Text>*/}
          {/*  {`keys=${JSON.stringify(Object.keys(route.params.app-info))}`}*/}
          {/*</Text>*/}
          {/*<Text>{`data=${JSON.stringify(route.params.app-info)}`}</Text>*/}

          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: hp(2),
            }}>
            {renderArtwork()}
          </View>
          <View>
            <View
              style={{
                borderWidth: 2,
                borderColor: colors.lightGrey,
                borderRadius: 5,
                paddingVertical: hp(1),
                paddingHorizontal: wp(2),
                overflow: 'hidden',
              }}>
              {/*<DataTable.Header>*/}
              {/*  <DataTable.Title>Dessert</DataTable.Title>*/}
              {/*  <DataTable.Title numeric>Calories</DataTable.Title>*/}
              {/*  <DataTable.Title numeric>Fat</DataTable.Title>*/}
              {/*</DataTable.Header>*/}

              {getSongTableData().map((data, index, array) => (
                <>
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // justifyContent: 'flex-start',
                        // backgroundColor: 'lightgreen',
                      }}>
                      <Icon
                        name={data.icon.name}
                        type={data.icon.type}
                        size={wp(4.5)}
                        color={colors.lightGrey}
                        style={{ marginRight: wp(1) }}
                      />
                      <Text
                        style={{
                          fontSize: wp(4),
                          color: enabledDarkTheme
                            ? colors.lightGrey
                            : '#474747',
                          // fontWeight: 'bold',
                          // marginRight: wp(4)
                        }}>
                        {`${data.attr.name}  `}
                      </Text>
                    </View>

                    <View
                      style={{
                        // flexDirection: 'column',
                        alignItems: 'flex-end',
                        // justifyContent: 'flex-end',
                        // backgroundColor: 'lightblue',
                        flexWrap: 'wrap',
                      }}>
                      <Text
                        style={{
                          fontSize: wp(4),
                          color: enabledDarkTheme ? '#e4e4e4' : '#474747',
                        }}>
                        {data.attr.value}
                      </Text>
                      {data.attr.subValue && (
                        <Text style={{ fontSize: wp(3), color: '#a9a9a9' }}>
                          {data.attr.subValue}
                        </Text>
                      )}
                    </View>
                  </View>

                  {index !== array.length - 1 && (
                    <Divider
                      style={{
                        marginVertical: hp(1),
                      }}
                    />
                  )}
                </>

                // <DataTable.Row key={index}>
                //   <DataTable.Cell
                //     style={{
                //       flexDirection: 'row',
                //       // alignItems: 'center',
                //       justifyContent: 'flex-start',
                //       backgroundColor: 'lightgreen',
                //     }}>
                //     <Icon
                //       name={data.icon.name}
                //       type={data.icon.type}
                //       size={wp(4)}
                //       color={colors.lightGrey}
                //       style={{ marginRight: wp(2) }}
                //     />
                //     <Text>{data.attr.name}</Text>
                //   </DataTable.Cell>
                //
                //   <DataTable.Cell
                //     style={{
                //       // flexDirection: 'column',
                //       // alignItems: 'flex-end',
                //       justifyContent: 'flex-end',
                //       backgroundColor: 'lightblue',
                //       flexWrap: 'wrap',
                //     }}>
                //     <Text>{data.attr.value}</Text>
                //     {data.attr.subValue && (
                //       <Text style={{ color: colors.lightGrey }}>
                //         {data.attr.subValue}
                //       </Text>
                //     )}
                //   </DataTable.Cell>
                // </DataTable.Row>
              ))}
            </View>

            {/*<Text>*/}
            {/*  {`keys=${JSON.stringify(Object.keys(route.params.app-info))}`}*/}
            {/*</Text>*/}
            {/*<Text>{`data=${JSON.stringify(route.params.app-info)}`}</Text>*/}
          </View>
        </>
      );
    else
      return (
        <Text
          style={{
            color: colors.lightGrey,
            fontSize: wp(5),
            textAlign: 'center',
            marginTop: hp(5),
          }}>
          {labels.noInfoFound}
        </Text>
      );
  };

  return <Container>{renderContent()}</Container>;
};

const styles = StyleSheet.create({
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
});

export default ItemInfo;

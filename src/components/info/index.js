import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Avatar, Divider, Text } from 'react-native-paper';
import labels from '../../constants/labels';
import keys from '../../constants/keys';
import DateTimeUtils from '../../utils/datetime';
import LinearGradient from 'react-native-linear-gradient';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import Icon from '../../components/icon';
import IconUtils from '../../utils/icon';
import { sortingOptions } from '../../constants/tracks';
import { MusicContext } from '../../context/music';
import PlaylistCover from '../playlist-cover';

// TODO Move all the hardcoded color values to colors.js file

const Info = ({ type, data, artworkSize = hp(30) }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { musicInfo } = useContext(MusicContext);

  const getSongTableData = () => {
    switch (type) {
      case keys.TRACKS:
        return [
          {
            icon: IconUtils.getInfo(keys.TITLE),
            attr: { name: labels.title, value: data.title },
          },
          {
            icon: IconUtils.getInfo(keys.ALBUMS),
            attr: { name: labels.album, value: data.album },
          },
          {
            icon: IconUtils.getInfo(keys.ARTISTS),
            attr: { name: labels.artist, value: data.artist },
          },
          {
            icon: IconUtils.getInfo(keys.DURATION),
            attr: {
              name: labels.playDuration,
              value: DateTimeUtils.msToTime(data.duration),
            },
          },
          {
            icon: IconUtils.getInfo(keys.FAVORITE),
            attr: {
              name: labels.markedFavorite,
              value: data.markedFavorite != null ? labels.yes : labels.no,
            },
          },
          {
            icon: IconUtils.getInfo(keys.PLAYLISTS),
            attr: {
              name: labels.includedInPlaylists,
              value:
                musicInfo?.[keys.PLAYLISTS]
                  .filter(pl => pl.track_ids.includes(data.id))
                  ?.map(pl => pl.name)
                  ?.join(', ') ?? 'None',
            },
          },
          {
            icon: IconUtils.getInfo(keys.FOLDERS),
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
            icon: IconUtils.getInfo(keys.ALBUMS),
            attr: { name: labels.name, value: data.name },
          },
          {
            icon: IconUtils.getInfo(keys.TRACKS),
            attr: { name: labels.trackCount, value: data.trackIds.length },
          },
        ];

      case keys.ARTISTS:
        return [
          {
            icon: IconUtils.getInfo(keys.ARTISTS),
            attr: { name: labels.name, value: data.name },
          },
          {
            icon: IconUtils.getInfo(keys.TRACKS),
            attr: { name: labels.trackCount, value: data.trackIds.length },
          },
        ];

      // TODO Complete
      case keys.FOLDERS:
        return [];

      case keys.PLAYLISTS:
        return [
          {
            icon: IconUtils.getInfo(keys.TITLE),
            attr: { name: labels.name, value: data.name },
          },
          {
            icon: IconUtils.getInfo(keys.TRACKS),
            attr: { name: labels.trackCount, value: data.track_ids.length },
          },
          {
            icon: IconUtils.getInfo(sortingOptions.CREATED_ON),
            attr: {
              name: labels.createdOn,
              value: DateTimeUtils.msToDateTimeString(data.created),
            },
          },
          {
            icon: IconUtils.getInfo(sortingOptions.UPDATED_ON),
            attr: {
              name: labels.updatedOn,
              value: DateTimeUtils.msToDateTimeString(data.last_updated),
            },
          },
        ];

      default:
        throw new Error(`Invalid type: ${type}`);
    }
  };

  // TODO For Playlists, Albums, Artists & Folders render Playlist-Cover else this
  const renderArtwork = () => {
    // const renderBody = () => {
    //   switch (type) {
    //     // render multiple image in cover
    //     case keys.PLAYLISTS:
    //     case keys.ALBUMS:
    //     case keys.ARTISTS:
    //     case keys.FOLDERS:
    //       return <Text>Show thumbs</Text>;
    //       return <PlaylistCover playlistID={info.id} />;
    //
    //     case keys.TRACKS:
    //       return (
    //         <>
    //           {type === keys.TRACKS && data.artwork ? (
    //             <Avatar.Image
    //               size={artworkSize}
    //               source={{ uri: `file://${data.artwork}` }}
    //             />
    //           ) : (
    //             <Avatar.Icon
    //               size={artworkSize}
    //               icon={
    //                 IconUtils.getInfo(type).name[
    //                   type === keys.TRACKS || type === keys.ALBUMS
    //                     ? 'default'
    //                     : 'filled'
    //                 ]
    //               }
    //               style={styles.musicIcon}
    //             />
    //           )}
    //         </>
    //       );
    //
    //     default:
    //       throw new Error(`Invalid type: ${type}`);
    //   }
    // };

    return (
      <LinearGradient
        colors={
          colors[
            enabledDarkTheme
              ? 'circularLinearGradientDark'
              : 'circularLinearGradientLight'
          ]
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
          {/*{renderBody()}*/}
          {type === keys.TRACKS && data.artwork ? (
            <Avatar.Image
              size={artworkSize}
              source={{ uri: `file://${data.artwork}` }}
            />
          ) : (
            <Avatar.Icon
              size={artworkSize}
              icon={
                IconUtils.getInfo(type).name[
                  type === keys.TRACKS || type === keys.ALBUMS
                    ? 'default'
                    : 'filled'
                ]
              }
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
                <React.Fragment key={index}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      flex: 1,
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        // flex:0.5,
                        // justifyContent: 'flex-start',
                        // backgroundColor: 'lightgreen',
                      }}>
                      <Icon
                        name={data.icon.name.outlined}
                        type={data.icon.type}
                        size={wp(4.5)}
                        color={colors.lightGrey}
                        style={{ marginRight: wp(1) }}
                      />
                      <Text
                        style={{
                          fontSize: wp(4),
                          // color: '#5b5b5b',
                          color: colors.lightGrey,
                          // color: enabledDarkTheme
                          //   ? colors.lightGrey
                          //   : '#474747',
                          // fontWeight: 'bold',
                          marginRight: wp(4),
                          // paddingRight: wp(4),
                        }}>
                        {/*{`${data.attr.name}  `}*/}
                        {data.attr.name}
                      </Text>
                    </View>

                    <View
                      style={{
                        // flexDirection: 'column',
                        // flex: 1,
                        // alignItems: 'flex-end',
                        // alignSelf: 'flex-end',
                        // justifyContent: 'flex-end',
                        // backgroundColor: 'lightblue',
                        // flexWrap: 'wrap',
                        // flex: 0.9,
                        flex: 1,
                      }}>
                      <Text
                        style={{
                          // backgroundColor: 'lightblue',
                          // alignItems: 'flex-end',
                          textAlign: 'right',
                          // alignSelf: 'flex-start',
                          // alignSelf: 'flex-end',
                          // flexWrap: 'wrap',
                          // marginRight: wp(10),
                          fontSize: wp(4),
                          color: enabledDarkTheme ? '#e4e4e4' : '#474747',
                        }}>
                        {data.attr.value}
                      </Text>
                      {data.attr.subValue && (
                        <Text
                          style={{
                            // backgroundColor: 'lightblue',
                            textAlign: 'right',
                            fontSize: wp(3),
                            color: '#a9a9a9',
                          }}>
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
                </React.Fragment>

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

  return <>{renderContent()}</>;
};

const styles = StyleSheet.create({
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
});

export default Info;

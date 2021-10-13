import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Menu, IconButton } from 'react-native-paper';
import { MusicContext } from '../../context/music';
import keys from '../../constants/keys';
import Icon from '../icon';
import colors from '../../constants/colors';
import IconUtils from '../../utils/icon';
import { PreferencesContext } from '../../context/preferences';
import labels from '../../constants/labels';

const COVER_ROW_CELL_COUNT = 4;
const MAX_ACRONYM_COUNT = 2;
const TEXT_BG_COLORS = [
  '#9dff9d',
  '#c4c4ff',
  '#6262ff',
  '#ff4d4d',
  '#ffd8d8',
  '#b3b300',
  '#c9c9c9',
  '#949494',
  '#bbadd9',
  '#898276',
  '#b300b3',
  '#a36ba3',
  '#00b300',
  '#707070',
  '#ff2d2d',
  '#cd00cd',
];

const PlaylistCover = ({
  id,
  onEdit,
  onPlay,
  onShuffle,
  onAddToQueue,
  onShowInfo,
  onDelete,
  style,
}) => {
  const { musicInfo } = useContext(MusicContext);
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [info, setInfo] = useState({});
  const [coverContents, setCoverContents] = useState([]);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (id && musicInfo?.[keys.TRACKS]?.length) {
      const _info = musicInfo[keys.PLAYLISTS].find(pl => pl.id === id);
      setInfo(_info);
      setIsPlaying(musicInfo.currentlyPlaying?.playlistId === id);

      TEXT_BG_COLORS.sort(() => 0.5 - Math.random());
      const artworks = [];
      for (
        let i = 0, colorIdx = 0;
        // i < 16;
        i < _info.track_ids.length;
        i++
      ) {
        const track = musicInfo[keys.TRACKS].find(
          tr => tr.id === _info.track_ids[i],
        );
        // if (false) {
        if (track.artwork) {
          if (
            !artworks.some(
              data => data.hasImage && data.content === track.artwork,
            )
          )
            artworks.push({ hasImage: true, content: track.artwork });
        } else {
          // console.log(
          //   `[Playlist-Cover] splits=${JSON.stringify(track.title.split(' '))}`,
          // );
          let text = '';
          for (
            let i = 0,
              splits = track.title.split(' '),
              len =
                splits.length < MAX_ACRONYM_COUNT
                  ? splits.length
                  : MAX_ACRONYM_COUNT;
            i < len;
            i++
          ) {
            let ch;
            for (const _ch of splits[i]) {
              if (/^[A-Z]$/i.test(_ch)) {
                ch = _ch;
                break;
              }
            }
            // console.log(`splits[${i}]=${splits[i]}, ch=${ch}`);
            if (ch) text += ch.toUpperCase();
            else if (i + 1 < splits.length) len++;
          }

          artworks.push({
            hasImage: false,
            content: text,
            color: TEXT_BG_COLORS[colorIdx++],
          });
        }
      }

      // console.log(`[Playlist-Cover] artworks=${JSON.stringify(artworks)}`);

      /* prioritize the covers having image */
      artworks.sort((a, b) => b.hasImage - a.hasImage);

      let count = Math.floor(artworks.length / COVER_ROW_CELL_COUNT);
      if (count === 0) count = 1;
      else if (count > COVER_ROW_CELL_COUNT) count = COVER_ROW_CELL_COUNT ** 2;
      else count *= COVER_ROW_CELL_COUNT;

      artworks.splice(count);
      setCoverContents(artworks);
    }
  }, [id]);

  // console.log(
  //   `[Playlist-Cover] coverContents=${JSON.stringify(coverContents)}`,
  // );

  const renderCoverArt = () => {
    // TODO For testing, have to remove later to avoid variable shadowing
    // TEXT_BG_COLORS.sort(() => 0.5 - Math.random());
    // const coverContents = [
    //   { content: 'AB', color: TEXT_BG_COLORS[0] },
    //   { content: 'CD', color: TEXT_BG_COLORS[1] },
    //   { content: 'EF', color: TEXT_BG_COLORS[2] },
    //   { content: 'GH', color: TEXT_BG_COLORS[3] },
    //
    //   { content: 'AB', color: TEXT_BG_COLORS[4] },
    //   { content: 'CD', color: TEXT_BG_COLORS[5] },
    //   { content: 'EF', color: TEXT_BG_COLORS[6] },
    //   { content: 'GH', color: TEXT_BG_COLORS[7] },
    //
    //   { content: 'AB', color: TEXT_BG_COLORS[8] },
    //   { content: 'CD', color: TEXT_BG_COLORS[9] },
    //   { content: 'EF', color: TEXT_BG_COLORS[10] },
    //   { content: 'GH', color: TEXT_BG_COLORS[11] },
    //
    //   { content: 'AB', color: TEXT_BG_COLORS[12] },
    //   { content: 'CD', color: TEXT_BG_COLORS[13] },
    //   { content: 'EF', color: TEXT_BG_COLORS[14] },
    //   { content: 'GH', color: TEXT_BG_COLORS[15] },
    // ];

    if (!coverContents.length) return null;

    let size = null,
      textFontSize = null,
      columnItemCount = null;
    const divContents = [];
    if (coverContents.length === 1) {
      columnItemCount = 1;
      size = hp(24);
      textFontSize = wp(32);
    } else {
      const rows = coverContents.length / COVER_ROW_CELL_COUNT;
      // console.log(`rows=${rows}`);
      switch (rows) {
        case 1:
          columnItemCount = 2;
          size = hp(12);
          textFontSize = wp(7);
          break;
        case 2:
          columnItemCount = 2;
          size = hp(12);
          textFontSize = wp(7);
          break;
        case 3:
          columnItemCount = 3;
          size = hp(5.6);
          textFontSize = wp(4);
          break;
        case 4:
          columnItemCount = 4;
          size = hp(5.6);
          textFontSize = wp(4);
          break;
        default:
          throw new Error(`Invalid rows: ${rows}`);
      }
    }

    const rowItems = [];
    for (let i = 0; i < coverContents.length; i++) {
      if (i !== 0 && i % columnItemCount === 0) {
        divContents.push([...rowItems]);
        rowItems.length = 0;
      }
      rowItems.push(coverContents[i]);
      if (i === coverContents.length - 1) divContents.push([...rowItems]);
    }

    // console.log(`[PlaylistCover] divContents=${divContents}`);

    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          overflow: 'hidden',
        }}>
        {divContents.map((arr, index1) => (
          <View key={index1}>
            {arr.map((item, index2) => (
              <View
                key={`${index1}-${index2}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {item.hasImage ? (
                  <Image
                    source={{ uri: `file://${item.content}` }}
                    style={{
                      height: size,
                      width: size,
                    }}
                  />
                ) : (
                  <Text
                    style={{
                      // flex: 1,
                      height: size,
                      width: size,
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      backgroundColor: item.color,
                      fontSize: textFontSize,
                      fontWeight: 'bold',
                    }}>
                    {item.content}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}

        <View
          style={{
            position: 'absolute',
            // flex: 1,
            height: '100%',
            width: '100%',
            zIndex: 1,
            backgroundColor: colors.black,
            opacity: 0.3,
          }}
        />

        <TouchableOpacity
          onPress={onPlay}
          style={{
            // flex: 1,
            // backgroundColor: colors.black,
            // backgroundColor: 'transparent',
            alignSelf: 'center',
            position: 'absolute',
            zIndex: 2,
            // left: '50%',
            // top: '50%',
            opacity: 1,
          }}>
          <Icon
            name={
              IconUtils.getInfo(isPlaying ? keys.PAUSE : keys.PLAY).name
                .outlined
            }
            // name="ios-play-circle"
            // name="pause-circle"
            // name="play-circle"
            // name="md-play-circle-outline"
            // name="md-pause-circle-outline"
            // type="Ionicons"
            // type="FontAwesome5"
            type={IconUtils.getInfo(keys.PLAY).type}
            color={colors.white1}
            size={hp(5)}
            // size={hp(15)}
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (!id) return null;
  return (
    <TouchableOpacity
      onPress={onEdit.bind(this, info)}
      style={{
        ...styles.container,
        backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
        ...style,
      }}>
      {renderCoverArt()}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 2,
          marginVertical: hp(0.5),
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon
            size={wp(4)}
            name={IconUtils.getInfo(keys.PLAYLISTS).name.filled}
            color={colors.lightGrey}
          />
          <Text style={{ fontSize: wp(3), color: colors.lightGrey }}>
            {info?.track_ids?.length}
          </Text>
        </View>

        <Text
          titleEllipsizeMode="tail"
          style={{
            fontSize: wp(4),
            textAlign: 'center',
            width: wp(
              coverContents.length === COVER_ROW_CELL_COUNT * 2 ? 90 : 28,
            ),
          }}>
          {info.name}
        </Text>

        <Menu
          visible={showMenu}
          onDismiss={setShowMenu.bind(this, false)}
          anchor={
            <IconButton
              style={{
                padding: 0,
                margin: 0,
              }}
              icon={IconUtils.getInfo(keys.VERTICAL_ELLIPSIS).name.default}
              size={wp(4)}
              color={colors.lightGrey}
              onPress={setShowMenu.bind(this, true)}
            />
          }>
          <Menu.Item
            icon={IconUtils.getInfo(keys.PLAY).name.default}
            title={labels.play}
            onPress={() => {
              onPlay(false);
              setShowMenu(false);
            }}
          />
          <Menu.Item
            icon={IconUtils.getInfo(keys.SHUFFLE).name.default}
            title={labels.shuffleAndPlay}
            onPress={() => {
              onShuffle();
              onPlay(false);
              setShowMenu(false);
            }}
          />
          <Menu.Item
            icon={IconUtils.getInfo(keys.ADD_TO_QUEUE).name.default}
            title={labels.addToQueue}
            onPress={() => {
              onAddToQueue();
              setShowMenu(false);
            }}
          />
          <Menu.Item
            icon={IconUtils.getInfo(keys.PLAYLIST_EDIT).name.default}
            title={labels.edit}
            onPress={() => {
              onEdit(info);
              setShowMenu(false);
            }}
          />
          <Menu.Item
            icon={IconUtils.getInfo(keys.DELETE).name.default}
            title={labels.delete}
            onPress={() => {
              onDelete();
              setShowMenu(false);
            }}
          />
          <Menu.Item
            icon={IconUtils.getInfo(keys.INFO).name.default}
            title={labels.showInfo}
            onPress={() => {
              onShowInfo();
              setShowMenu(false);
            }}
          />
        </Menu>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
    marginVertical: hp(1),
  },
});

export default PlaylistCover;

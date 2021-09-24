import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import DraggableFlatList from 'react-native-draggable-flatlist';

// TODO Complete
const Playlist = ({ style, tracks, setTracks, simultaneousHandlers = [] }) => {
  const [draggingTrackIndex, setDraggingTrackIndex] = useState(null);

  // console.log(`playlist tracks=${JSON.stringify(tracks)}`);

  const renderTrackItem = ({ item: track, index, drag, isActive }) => {
    return (
      <View
        style={{
          borderWidth: 1,
          borderColor: 'yellow',
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isActive ? 'red' : track.backgroundColor,
          // alignItems: 'center',
          justifyContent: 'space-between',
          height: hp(10),
          opacity: isActive ? 0.85 : 1,
        }}>
        <Text
          style={{
            marginVertical: hp(0.5),
            width: wp(80),
          }}>
          {`(${index + 1}/${tracks.length}) ID=${track.id}, title=${
            track.title
          }, isActive=${isActive}`}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: 'blue',
            height: hp(10),
            width: wp(10),
          }}
          // onLongPress={() => {
          //   // setDraggingTrackIndex(index);
          //   drag();
          // }}
          onPress={() => {
            drag();
            setDraggingTrackIndex(index);
          }}>
          {/*<Icon name={'play'} />*/}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, style]}>
      {/*<Text>{`Playlist List for ${id}`}</Text>*/}

      {/*<Text>{`Track Count: ${tracks.length}`}</Text>*/}
      {/*{tracks.map((track, index) => (*/}
      {/*  <Text*/}
      {/*    key={index}*/}
      {/*    style={{*/}
      {/*      color:*/}
      {/*        musicInfo.currentlyPlaying.track.id === track.id*/}
      {/*          ? 'white'*/}
      {/*          : 'black',*/}
      {/*      backgroundColor:*/}
      {/*        musicInfo.currentlyPlaying.track.id === track.id*/}
      {/*          ? 'blue'*/}
      {/*          : 'lightgrey',*/}
      {/*      marginVertical: hp(0.5),*/}

      {/*    }}>*/}
      {/*    {`[${index}] ${*/}
      {/*      musicInfo.currentlyPlaying.track.id === track.id ? '->' : ''*/}
      {/*    } ${JSON.stringify(track.title)}`}*/}
      {/*  </Text>*/}
      {/*))}*/}

      <DraggableFlatList
        // onRef={ref => (draggableFlatList.current = ref)}
        // simultaneousHandlers={[bottomScrollView, draggableFlatList]}
        simultaneousHandlers={simultaneousHandlers}
        data={tracks}
        // dragItemOverflow={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderTrackItem}
        renderPlaceholder={({ item, index }) => (
          <View style={{ backgroundColor: 'yellow' }}>
            <Text>{`${index} ${JSON.stringify(item)}`}</Text>
          </View>
        )}
        // onDragBegin={setDraggingTrackIndex}
        onDragEnd={({ data, from, to }) => {
          console.log(`[Current-Playlist] drag end, from=${from}, to=${to}`);
          setTracks(data);
          setDraggingTrackIndex(null);
        }}
        // dragHitSlop={-200}
        dragHitSlop={
          // 1 ? { right: -(width * 0.95 - 20) } : { right: -width }
          draggingTrackIndex === null ? -200 : 0
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 0.5,
    borderWidth: 1,
  },
});

export default Playlist;

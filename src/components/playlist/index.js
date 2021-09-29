import React, { useState } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { Text } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { width } from '../../constants/dimensions';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

///////// Test ////////
const rowTranslateAnimatedValues = {};
Array(20)
  .fill('')
  .forEach((_, i) => {
    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
  });
///////// Test ////////

// TODO Complete:
//  - Swiping gestures: left for reordering, right for deletion
//  - Undo snackbar message for adding back the last removed track
//  - Restore/Ignore changes playlist icon button
//  - Proper intial swiping previews
//  - Long press to select many tracks to re-order or delete them
const Playlist = ({ style, tracks, setTracks }) => {
  const [draggingTrackIndex, setDraggingTrackIndex] = useState(null);

  // console.log(`playlist tracks=${JSON.stringify(tracks)}`);

  const renderTrackItem_SwipingPreview = ({
    item: track,
    index,
    drag,
    isActive,
  }) => {
    return (
      <SwipeRow
        preview
        // directionalDistanceChangeThreshold={80}
        // friction={10}
        // tension={100}
        leftActivationValue={wp(10)}
        leftOpenValue={wp(10)}
        rightOpenValue={-wp(30)}
        rightActivationValue={-wp(10)}>
        <View style={{ backgroundColor: 'blue', height: hp(5) }}>
          <Text>BACKGROUND</Text>
        </View>
        <View style={{ backgroundColor: 'red', height: hp(5) }}>
          <Text>{track.title}</Text>
        </View>
      </SwipeRow>
    );
  };

  const renderTrackItem_Method2 = ({ item: track, index, drag, isActive }) => {
    return (
      <SwipeListView
        data={[track]}
        renderItem={(rowData, rowMap) => {
          console.log(`rowData=${rowData}, rowMap=${rowMap}`);

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
        }}
        // renderHiddenItem={renderHiddenItem}
        leftOpenValue={wp(10)}
        rightOpenValue={-wp(30)}
        // previewRowKey={'0'}
        // previewOpenValue={-40}
        // previewOpenDelay={3000}
        // onRowDidOpen={onRowDidOpen}
      />

      // <SwipeRow
      //   // preview
      //   // directionalDistanceChangeThreshold={80}
      //   // friction={10}
      //   // tension={100}
      //   leftActivationValue={wp(10)}
      //   leftOpenValue={wp(10)}
      //   rightOpenValue={-wp(30)}
      //   rightActivationValue={-wp(10)}>
      //   <View
      //     style={{
      //       backgroundColor: 'blue',
      //       height: hp(10),
      //       alignItems: 'center',
      //     }}>
      //     <Text>BACKGROUND</Text>
      //   </View>
      //   <View
      //     style={{
      //       borderWidth: 1,
      //       borderColor: 'yellow',
      //       flexDirection: 'row',
      //       alignItems: 'center',
      //       backgroundColor: isActive ? 'red' : track.backgroundColor,
      //       // alignItems: 'center',
      //       justifyContent: 'space-between',
      //       height: hp(10),
      //       opacity: isActive ? 0.85 : 1,
      //     }}>
      //     <Text
      //       style={{
      //         marginVertical: hp(0.5),
      //         width: wp(80),
      //       }}>
      //       {`(${index + 1}/${tracks.length}) ID=${track.id}, title=${
      //         track.title
      //       }, isActive=${isActive}`}
      //     </Text>
      //     <TouchableOpacity
      //       style={{
      //         backgroundColor: 'blue',
      //         height: hp(10),
      //         width: wp(10),
      //       }}
      //       // onLongPress={() => {
      //       //   // setDraggingTrackIndex(index);
      //       //   drag();
      //       // }}
      //       onPress={() => {
      //         drag();
      //         setDraggingTrackIndex(index);
      //       }}>
      //       {/*<Icon name={'play'} />*/}
      //     </TouchableOpacity>
      //   </View>
      // </SwipeRow>
    );
  };

  const renderTrackItem_Method1 = ({ item: track, index, drag, isActive }) => {
    return (
      <SwipeRow
        // preview
        // directionalDistanceChangeThreshold={80}
        // friction={10}
        // tension={100}
        leftActivationValue={wp(10)}
        leftOpenValue={wp(10)}
        rightOpenValue={-wp(30)}
        rightActivationValue={-wp(10)}>
        <View
          style={{
            backgroundColor: 'blue',
            height: hp(10),
            alignItems: 'center',
          }}>
          <Text>BACKGROUND</Text>
        </View>
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
      </SwipeRow>
    );
  };

  const renderTrackItem_DraggingPreview = ({
    item: track,
    index,
    drag,
    isActive,
  }) => {
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

  const draggableList = () => (
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
        // renderItem={renderTrackItem_DraggingPreview}
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

  // Swipeable list (dragging not possible, can manually rearrange)
  // Look for the examples: SwipeToDelete, PerRowConfig
  // return (
  //   <SwipeListView
  //     // data={tracks}
  //     // renderItem={renderItem}
  //     // renderHiddenItem={renderHiddenItem}
  //     // leftOpenValue={75}
  //     // rightOpenValue={-150}
  //     // previewRowKey={'0'}
  //     // previewOpenValue={-40}
  //     // previewOpenDelay={3000}
  //     // onRowDidOpen={onRowDidOpen}
  //     data={tracks}
  //     renderItem={renderItem}
  //     renderHiddenItem={renderHiddenItem}
  //     rightOpenValue={width}
  //     previewRowKey={'0'}
  //     previewOpenValue={-40}
  //     previewOpenDelay={3000}
  //     onSwipeValueChange={onSwipeValueChange}
  //     useNativeDriver={false}
  //   />
  // );

  /////////////////////////////// Test render ///////////////////////////////////////
  const [listData, setListData] = useState(
    Array(20)
      .fill('')
      .map((_, i) => ({ key: `${i}`, text: `item #${i}` })),
  );

  // console.log(`this.animationIsRunning=${this.animationIsRunning}`);

  const onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;

    console.log(
      `onSwipeValueChange: key=${JSON.stringify(key)}, value=${JSON.stringify(
        value,
      )}`,
    );

    if (value < -width && !this.animationIsRunning) {
      this.animationIsRunning = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === key);
        newData.splice(prevIndex, 1);
        setListData(newData);
        this.animationIsRunning = false;
      });
    }
  };

  const renderItem = data => (
    <Animated.View
      style={[
        styles.rowFrontContainer,
        {
          height: rowTranslateAnimatedValues[data.item.key].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 50],
          }),
        },
      ]}>
      <TouchableHighlight
        onPress={() => console.log('You touched me')}
        style={styles.rowFront}
        underlayColor={'#AAA'}>
        <View>
          <Text>I am {data.item.text} in a SwipeListView</Text>
        </View>
      </TouchableHighlight>
    </Animated.View>
  );

  const renderHiddenItem = () => (
    <View style={styles.rowBack}>
      <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
        <Text style={styles.backTextWhite}>Move</Text>
        <Text style={styles.backTextWhite}>Delete</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeListView
        // disableRightSwipe
        // leftActivationValue={{}}
        // swipeRowStyle={{
        //   backgroundColor: 'red',
        //   borderRadius: 10
        // }}
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={wp(30)}
        rightOpenValue={-width} // uncomment this
        // rightOpenValue={-150} // remove this
        previewRowKey={'0'}
        previewOpenValue={-40}
        previewOpenDelay={1000}
        onSwipeValueChange={onSwipeValueChange}
        useNativeDriver={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   // flex: 0.5,
  //   borderWidth: 1,
  // },
  leftAction: {
    backgroundColor: 'red',
    width: wp(80),
  },
  actionText: {
    backgroundColor: 'lightgreen',
    width: wp(80),
  },
  rowFrontContainer: {
    // backgroundColor: 'green'
  },
  container: {
    backgroundColor: 'red',
    flex: 1,
    borderWidth: 1,
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingLeft: wp(4),
  },
  backRightBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // bottom: 0,
    justifyContent: 'space-between',
    // position: 'absolute',
    // top: 0,
    // width: 75,
    // backgroundColor: 'blue',
  },
  backRightBtnRight: {
    // backgroundColor: 'red',
    right: wp(2),
    // left: 0,
    // width: wp(50),
    // zIndex: 10,
  },
});

export default Playlist;

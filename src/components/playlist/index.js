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
import Icon from '../icon';

///////// Test ////////
const rowTranslateAnimatedValues = {};
Array(20)
  .fill('')
  .forEach((_, i) => {
    rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
  });
///////// Test ////////

const rearrangeActions = {
  MOVE_UP: 'MOVE_UP',
  MOVE_TO_FIRST: 'MOVE_TO_FIRST',
  MOVE_DOWN: 'MOVE_DOWN',
  MOVE_TO_LAST: 'MOVE_TO_LAST',
};

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

  const [currentActions, setCurrentActions] = useState(null);

  // console.log(`this.animationIsRunning=${this.animationIsRunning}`);

  // console.log(`[re-rendered] currentAction=${currentAction}`);

  const rearrange = (id, action) => {
    console.log(`[rearrange] id=${JSON.stringify(id)}, action=${action}`);
  };

  const onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;

    // console.log(
    //   `onSwipeValueChange: key=${JSON.stringify(key)}, value=${JSON.stringify(
    //     value,
    //   )}`,
    // );

    // console.log(`this.animationIsRunning=${this.animationIsRunning}`);

    if (
      value < 0 &&
      (!currentActions?.hasOwnProperty(key) ||
        currentActions[key] !== 'removing')
    )
      setCurrentActions(prev => ({ ...prev, [key]: 'removing' }));
    else if (value === 0 && currentActions) setCurrentActions(null);
    else if (
      value > 0 &&
      (!currentActions?.hasOwnProperty(key) || currentActions[key] !== 'moving')
    )
      setCurrentActions(prev => ({ ...prev, [key]: 'moving' }));

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
        setCurrentActions(null);
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

          // opacity: 0.3,
        },
      ]}>
      <TouchableHighlight
        onPress={() => console.log('You touched me')}
        style={styles.rowFront}
        underlayColor={'#AAA'}>
        <View>
          {/*<Text>I am {data.item.text} in a SwipeListView</Text>*/}
          <Text>
            key={data.item.key}, index={data.index}
          </Text>
        </View>
      </TouchableHighlight>
    </Animated.View>
  );

  const renderHiddenItem = rowData => {
    let showMove = true,
      showRemove = true;
    if (currentActions?.hasOwnProperty(rowData.item.key)) {
      showMove = currentActions[rowData.item.key] === 'moving';
      showRemove = currentActions[rowData.item.key] === 'removing';
    }

    // let showMove, showRemove;
    //
    // if (
    //   !currentAction ||
    //   currentAction.key !== rowData.item.key ||
    //   currentAction.event === 'moving'
    // )
    //   showMove = true;
    // if (
    //   !currentAction ||
    //   currentAction.key !== rowData.item.key ||
    //   currentAction.event === 'removing'
    // )
    //   showRemove = true;

    return (
      <View
        style={{
          ...styles.rowBack,
          opacity: 1,
          backgroundColor: showMove ? 'blue' : showRemove ? 'red' : 'grey',
        }}>
        {showMove && (
          <View style={[styles.backRightBtn, styles.backRightBtnRight]}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                // alignItems: 'center',
                // justifyContent: 'space-between',
                backgroundColor: 'blue',
                height: '100%',
                width: '100%',
              }}>
              <View
                style={{
                  // backgroundColor: 'black',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginRight: wp(2),
                }}>
                <TouchableOpacity
                  disabled={!rowData.index}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rearrangeActions.MOVE_UP,
                  )}>
                  <Icon name="angle-up" type="FontAwesome5" size={wp(5)} />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={rowData.index === listData.length - 1}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rearrangeActions.MOVE_DOWN,
                  )}>
                  <Icon name="angle-down" type="FontAwesome5" size={wp(5)} />
                </TouchableOpacity>
              </View>

              <View
                style={{
                  // backgroundColor: 'black',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginRight: wp(2),
                }}>
                <TouchableOpacity
                  disabled={!rowData.index}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rearrangeActions.MOVE_TO_FIRST,
                  )}>
                  {/*<Icon name="angle-double-up" type="FontAwesome5" />*/}
                  <Icon
                    name="first-page"
                    type="MaterialIcons"
                    size={wp(6)}
                    style={{
                      // fontWeight: 'bold',
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={rowData.index === listData.length - 1}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rearrangeActions.MOVE_TO_LAST,
                  )}>
                  {/*<Icon name="angle-double-down" type="FontAwesome5" />*/}
                  <Icon
                    name="last-page"
                    type="MaterialIcons"
                    size={wp(6)}
                    style={{
                      // fontWeight: 'bold',
                      transform: [{ rotate: '90deg' }],
                    }}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  marginLeft: wp(2),
                  alignSelf: 'center',
                }}>
                Move (K{rowData.item.key})
              </Text>
            </View>
          </View>
        )}

        {showRemove && (
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'red',
              justifyContent: 'flex-end',
              height: '100%',
              width: '100%',
              paddingRight: wp(2),
            }}>
            <Text>Remove</Text>
            <Icon
              name="ios-remove-circle"
              type="Ionicons"
              size={wp(5)}
              style={{ marginLeft: wp(1) }}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <View
      style={{
        ...styles.container,

        // backgroundColor:
        //   currentAction === 'removing'
        //     ? 'red'
        //     : currentAction === 'moving' && 'blue',
      }}>
      <Text>currentAction: {JSON.stringify(currentActions)}</Text>
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
        stopLeftSwipe={wp(30)}
        rightOpenValue={-width} // uncomment this
        // rightOpenValue={-150} // remove this
        previewRowKey={'0'}
        previewOpenValue={-wp(10)}
        previewOpenDelay={500}
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
    width: wp(80),
  },
  container: {
    flex: 1,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    // backgroundColor: 'grey',
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
    // backgroundColor: 'green',
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

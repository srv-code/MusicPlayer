import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Animated,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  Avatar,
  Divider,
  IconButton,
  List,
  Menu,
  Snackbar,
  Text,
} from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { width } from '../../constants/dimensions';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from '../icon';
import labels from '../../constants/labels';
import colors from '../../constants/colors';
import PlayerUtils from '../../utils/player';
import { PreferencesContext } from '../../context/preferences';
import { MusicContext } from '../../context/music';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';

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
const Playlist = ({ style, onModal, name, tracks, setTracks }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { playerControls } = useContext(MusicContext);

  const [lastTrackRemoved, setLastTrackRemoved] = useState(null);
  const [rowTranslateAnimatedValues, setRowTranslateAnimatedValues] = useState(
    [],
  );
  const [currentActions, setCurrentActions] = useState(null);
  // FIXME Not updating the current playing track currently: setCurrentlyPlayingTrackId
  const [currentlyPlayingTrackId, setCurrentlyPlayingTrackId] = useState(null);
  const [showMoreOptionForTrackId, setShowMoreOptionForTrackId] =
    useState(null);
  const list = useRef(null);

  let animationIsRunning = false;

  useEffect(() => {
    if (Object.keys(rowTranslateAnimatedValues).length !== tracks.length) {
      const animValues = {};
      tracks.forEach(track => {
        animValues[`${track.id}`] = new Animated.Value(1);
        track.key = track.id;
      });
      // console.log(`filling animValues, keys=${Object.keys(animValues)?.length}`);
      setRowTranslateAnimatedValues(animValues);
    }
  }, [tracks]);

  // console.log(`this.animationIsRunning=${this.animationIsRunning}`);
  // console.log(`[re-rendered] currentAction=${currentAction}`);
  // console.log(`track keys=${tracks?.[0]?.key}`);

  const rearrange = (item, fromIndex, action) => {
    // console.log(
    //   `[rearrange] item.title=${item.title}, fromIndex=${fromIndex}, action=${action}`,
    // );

    let toIndex;
    switch (action) {
      case rearrangeActions.MOVE_UP:
      case rearrangeActions.MOVE_TO_FIRST:
        if (fromIndex <= 0)
          throw new Error(
            `Invalid move operation: action: ${action}, fromIndex=${fromIndex}`,
          );
        toIndex = action === rearrangeActions.MOVE_TO_FIRST ? 0 : fromIndex - 1;
        break;

      case rearrangeActions.MOVE_DOWN:
      case rearrangeActions.MOVE_TO_LAST:
        if (fromIndex >= tracks.length - 1)
          throw new Error(
            `Invalid move operation: action: ${action}, fromIndex=${fromIndex}`,
          );
        toIndex =
          action === rearrangeActions.MOVE_TO_LAST
            ? tracks.length - 1
            : fromIndex + 1;
        break;

      default:
        throw new Error(`Invalid action: ${action}`);
    }

    const _tracks = [...tracks];
    const tmp = _tracks[fromIndex];
    _tracks[fromIndex] = _tracks[toIndex];
    _tracks[toIndex] = tmp;
    setTracks(_tracks);

    if (action === rearrangeActions.MOVE_TO_LAST)
      list.current._listRef._scrollRef.scrollToEnd();
    else if (action === rearrangeActions.MOVE_TO_FIRST)
      list.current._listRef._scrollRef.scrollTo({ x: 0, animated: true });
  };

  const onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;

    // console.log(
    //   `onSwipeValueChange: swipeData=${JSON.stringify(
    //     swipeData,
    //   )}, rowTranslateAnimatedValues=${JSON.stringify(
    //     rowTranslateAnimatedValues,
    //   )}`,
    // );

    // console.log(`animationIsRunning=${animationIsRunning}`);

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

    if (value < -width && !animationIsRunning) {
      animationIsRunning = true;
      Animated.timing(rowTranslateAnimatedValues[key], {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        const removeIndex = tracks.findIndex(track => track.key === key);
        setLastTrackRemoved({ index: removeIndex, item: tracks[removeIndex] });
        const newList = [...tracks];
        newList.splice(removeIndex, 1);
        setTracks(newList);
        animationIsRunning = false;
        setCurrentActions(null);
      });
    }
  };

  const renderItem = data => {
    const onPress = () => {
      PlayerUtils.playTracks(tracks, data.index)
        .then(() => {
          playerControls.collapse();
          ToastAndroid.show(
            `${labels.playingFromPlaylist} ${name}`,
            ToastAndroid.SHORT,
          );
        })
        .catch(err => {
          ToastAndroid.show(
            `${labels.couldntPlayTracks} (${err.message}}`,
            ToastAndroid.LONG,
          );
          throw err;
        });
    };

    const renderDescription = () => (
      <View style={styles.trackDescText}>
        <Icon
          name={IconUtils.getInfo(keys.ARTISTS).name.outlined}
          type={IconUtils.getInfo(keys.ARTISTS).type}
          size={wp(3.5)}
          color={colors.lightGrey}
        />
        <Text numberOfLines={1} style={styles.trackSubtitleText}>
          {data.item.artist}
          {/*{Object.keys(data.item)}*/}
        </Text>
      </View>
    );

    const renderLeftComponent = props => {
      if (data.item.artwork)
        return (
          <Avatar.Image
            size={hp(6)}
            source={{ uri: `file://${data.item.artwork}` }}
          />
        );
      return <Avatar.Icon size={hp(6)} icon="music" style={styles.musicIcon} />;
    };

    const renderRightComponent = props => (
      <Menu
        {...props}
        visible={!onModal && showMoreOptionForTrackId === data.item.id}
        onDismiss={setShowMoreOptionForTrackId.bind(this, null)}
        style={{
          zIndex: 99999,
          elevation: 99999,
          // flex: 1,
          // position: 'absolute',
          // top: 0,
        }}
        // anchor={{ x: 0, y: 0 }}
        anchor={
          <IconButton
            {...props}
            icon={IconUtils.getInfo(keys.VERTICAL_ELLIPSIS).name.default}
            onPress={setShowMoreOptionForTrackId.bind(this, data.item.id)}
            // style={{
            //   zIndex: 999,
            // }}
          />
        }>
        <Menu.Item
          icon={IconUtils.getInfo(keys.SKIP_NEXT).name.default}
          title={labels.playNext}
          onPress={() => {
            alert(JSON.stringify(props));
            setShowMoreOptionForTrackId(null);
          }}
          // style={{ zIndex: 999, backgroundColor: 'lightgreen' }}
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

    // FIXME Not working
    const renderDivider = () => {
      if (data.index === tracks.length - 1) {
        return <View style={styles.listItemEndSmallBar} />;
      } else {
        if (currentlyPlayingTrackId) {
          const playingIndex = tracks.findIndex(
            t => t.id === currentlyPlayingTrackId,
          );
          if (playingIndex === -1)
            throw new Error(`Could not find playing track index`);
          if (data.index === playingIndex - 1 || data.index === playingIndex)
            return null;
          else return <Divider inset />;
        } else return <Divider inset />;
      }
    };

    return (
      <Animated.View
        style={{
          ...styles.rowFrontContainer,
          height: rowTranslateAnimatedValues[data.item.key]?.interpolate({
            inputRange: [0, 1],
            outputRange: [0, hp(8)],
          }),

          // opacity: 1,
          borderRadius: currentlyPlayingTrackId === data.item.id ? wp(2) : 0,
          backgroundColor:
            currentlyPlayingTrackId === data.item.id
              ? enabledDarkTheme
                ? colors.darker
                : colors.lighter
              : enabledDarkTheme
              ? colors.dark
              : colors.light,
          elevation: currentlyPlayingTrackId === data.item.id ? 2 : 0,

          // backgroundColor: 'lightgreen',
          // borderWidth: 1,
          // paddingBottom: hp(2),
        }}>
        {/*<TouchableHighlight*/}
        {/*  onPress={() => console.log('You touched me')}*/}
        {/*  style={styles.rowFront}*/}
        {/*  underlayColor={'#AAA'}>*/}
        {/*  <View>*/}
        {/*    <Text>{`[idx=${data.index}, key=${data.item.key}] ${data.item.title}`}</Text>*/}
        {/*  </View>*/}
        {/*</TouchableHighlight>*/}

        <List.Item
          style={styles.trackItemContainer}
          onPress={onPress}
          titleEllipsizeMode={'tail'}
          titleNumberOfLines={1}
          titleStyle={styles.listItemText}
          // title={`[${index}] ${track.title}`}
          title={data.item.title}
          descriptionEllipsizeMode={'tail'}
          descriptionNumberOfLines={1}
          description={renderDescription}
          left={renderLeftComponent}
          right={renderRightComponent}
        />

        {renderDivider()}
      </Animated.View>
    );
  };

  // FIXME Dimension not proper
  const renderHiddenItem = rowData => {
    let showMove = true,
      showRemove = true;
    if (currentActions?.hasOwnProperty(rowData.item.key)) {
      showMove = currentActions[rowData.item.key] === 'moving';
      showRemove = currentActions[rowData.item.key] === 'removing';
    }

    // console.log(
    //   `renderHiddenItem: rowData.item.key=${JSON.stringify(
    //     rowData.item.key,
    //   )}, currentActions=${JSON.stringify(
    //     currentActions,
    //   )}, showMove=${showMove}, showRemove=${showRemove}`,
    // );

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
          // opacity: 1,
          // TODO Take the colors from colors object
          // TODO Modify the colors intensity as per the value in the onSwipe* function
          backgroundColor: showMove ? 'blue' : showRemove ? 'red' : 'grey',
          borderRadius:
            currentlyPlayingTrackId === rowData.item.key ? wp(2) : 0,
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
                    rowData.index,
                    rearrangeActions.MOVE_UP,
                  )}>
                  <Icon name="angle-up" type="FontAwesome5" size={wp(5)} />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={rowData.index === tracks.length - 1}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rowData.index,
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
                    rowData.index,
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
                  disabled={rowData.index === tracks.length - 1}
                  onPress={rearrange.bind(
                    this,
                    rowData,
                    rowData.index,
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
                {labels.move}
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
            <Text>{labels.remove}</Text>
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

  // console.log(
  //   `list=${
  //     list.current &&
  //     JSON.stringify(Object.keys(list.current._listRef._scrollRef))
  //   }`,
  // );

  return (
    <View style={[styles.container, style]}>
      {/*<Text>currentAction: {JSON.stringify(currentActions)}</Text>*/}
      <SwipeListView
        listViewRef={list}
        // simultaneousHandlers={simultaneousHandlers}
        // disableRightSwipe
        // leftActivationValue={{}}
        // swipeRowStyle={{
        //   backgroundColor: 'red',
        //   borderRadius: 10
        // }}
        data={tracks}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        leftOpenValue={wp(30)}
        stopLeftSwipe={wp(30)}
        rightOpenValue={-width} // uncomment this
        // rightOpenValue={-150} // remove this
        previewRowKey={tracks[0]?.key}
        // previewRowIndex={0}
        // previewFirstRow={true}
        previewOpenValue={-wp(10)}
        previewOpenDelay={500}
        onSwipeValueChange={onSwipeValueChange}
        closeOnRowBeginSwipe={true}
        closeOnScroll={false}
        useNativeDriver={false}
        useAnimatedList={true}
      />

      <Snackbar
        visible={Boolean(lastTrackRemoved)}
        duration={2000}
        onDismiss={setLastTrackRemoved.bind(this, null)}
        action={{
          label: labels.undo,
          onPress: () => {
            const _tracks = [...tracks];
            _tracks.splice(lastTrackRemoved.index, 0, lastTrackRemoved.item);
            setTracks(_tracks);
            setLastTrackRemoved(null);
          },
        }}>
        Track Removed
      </Snackbar>
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
    width: wp(88),
    alignItems: 'center',
    textAlignVertical: 'center',
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
    overflow: 'hidden',
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
  trackItemContainer: {
    alignItems: 'center',
    // borderRadius: wp(2),
    // paddingVertical: 0,
    // backgroundColor: 'lightgreen',
    // borderWidth: 1,
    // paddingBottom: hp(5),
  },
  trackSubtitleText: {
    fontSize: wp(3.2),
    color: colors.lightGrey,
    marginLeft: wp(0.5),
  },
  trackDescText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listItemText: {
    fontSize: wp(4),
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
    marginTop: hp(1),
  },
});

export default Playlist;

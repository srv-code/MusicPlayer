import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import screenNames from '../../constants/screen-names';
import TabbedView from '../tabbed-view';
import Settings from '../../screens/settings';
import Search from '../../screens/search';
import Info from '../../screens/info';
import About from '../../screens/about';
import ItemInfo from '../../screens/item-info';
import Player from '../../screens/player';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import CustomHandle from './custom-handle';
import { BlurView } from '@react-native-community/blur';
import { PreferencesContext } from '../../context/preferences';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import colors from '../../constants/colors';
import labels from '../../constants/labels';
import { MusicContext } from '../../context/music';

const createDummyScreen = ({ title, nextScreen }) => (
  <View>
    <Text>{title}</Text>
    {nextScreen && (
      <Button
        icon="next"
        mode="outlined"
        uppercase={false}
        // disabled={!musicData}
        // loading={inProgress === inProgressKeys.DELETE_MUSIC_CACHE}
        // style={styles.button}
        onPress={() => console.log('Navigate to', nextScreen)}>
        `Go to ${nextScreen}`
      </Button>
    )}
  </View>
);

const BottomSheetStack = createStackNavigator();

const CurrentlyPlaying = ({ navigation, extraData }) => {
  // console.log('ScreenA', { extraData });

  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      <Text>{screenNames.currentlyPlaying}</Text>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentPlaylist)}>
        Go to Current Playlist
      </Button>
      <Text>{extraData.snapIndex}</Text>
    </BottomSheetView>
  );
};

//   createDummyScreen({
//   title: 'FlatList Screen',
//   nextScreen: 'ScrollView Screen',
// });

const CurrentPlaylist = ({ navigation, extraData }) => {
  if (extraData.snapIndex === 0)
    navigation.navigate(screenNames.currentlyPlaying);

  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      <Text>{screenNames.currentPlaylist}</Text>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentlyPlaying)}>
        Go to Currently Playing
      </Button>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.songInfo)}>
        Go to Song Info
      </Button>
      <Text>{extraData.snapIndex}</Text>
    </BottomSheetView>
  );
};

//   createDummyScreen({
//   title: 'ScrollView Screen',
//   nextScreen: 'SectionList Screen',
// });

const SongInfo = ({ navigation, extraData }) => {
  if (extraData.snapIndex === 0)
    navigation.navigate(screenNames.currentlyPlaying);

  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      <Text>{screenNames.songInfo}</Text>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentPlaylist)}>
        Go to Current Playlist
      </Button>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentlyPlaying)}>
        Go to Currently Playing
      </Button>
      <Text>{extraData.snapIndex}</Text>
    </BottomSheetView>
  );
};

//   createDummyScreen({
//   title: 'SectionList Screen',
//   nextScreen: 'View Screen',
// });

//   createDummyScreen({
//   title: 'View Screen',
//   nextScreen: 'FlatList Screen',
// });

// export const PlayerBottomSheet = () => {
//   const bottomSheet = useRef(null);
//   const [enableContentPanningGesture, setEnableContentPanningGesture] =
//     useState(true);
//   const [enableHandlePanningGesture, setEnableHandlePanningGesture] =
//     useState(true);
//
//   const handleSnapPress = useCallback(index => {
//     console.log('handleSnapPress:', { index, bottomSheet });
//     bottomSheet.current?.snapToIndex(index);
//   }, []);
//
//   const handleExpandPress = useCallback(() => {
//     bottomSheet.current?.expand();
//   }, []);
//
//   const handleCollapsePress = useCallback(() => {
//     bottomSheet.current?.collapse();
//   }, []);
//
//   const handleClosePress = useCallback(() => {
//     bottomSheet.current?.close();
//   }, []);
//
//   const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
//
//   const animationConfigs = useBottomSheetSpringConfigs({
//     damping: 80,
//     overshootClamping: true,
//     restDisplacementThreshold: 0.1,
//     restSpeedThreshold: 0.1,
//     stiffness: 500,
//   });
//
//   const handleSheetChange = useCallback(index => {
//     // eslint-disable-next-line no-console
//     console.log('handleSheetChange', index);
//   }, []);
//
//   const handleSheetAnimate = useCallback((fromIndex, toIndex) => {
//     // eslint-disable-next-line no-console
//     console.log('handleSheetAnimate', `from ${fromIndex} to ${toIndex}`);
//   }, []);
//
//   return (
//     <View
//       style={{
//         flex: 1,
//         padding: 24,
//       }}>
//       <Text onPress={() => handleSnapPress(2)}>Snap To 90%</Text>
//       <Text onPress={() => handleSnapPress(1)}>Snap To 50%</Text>
//       <Text onPress={() => handleSnapPress(0)}>Snap To 25%</Text>
//       <Text onPress={() => handleExpandPress()}>Expand</Text>
//       <Text onPress={() => handleCollapsePress()}>Collapse</Text>
//       <Text onPress={() => handleClosePress()}>Close</Text>
//       <BottomSheet
//         ref={bottomSheet}
//         index={1}
//         snapPoints={snapPoints}
//         animationConfigs={animationConfigs}
//         animateOnMount={true}
//         enableContentPanningGesture={enableContentPanningGesture}
//         enableHandlePanningGesture={enableHandlePanningGesture}
//         // detached={true}
//         enablePanDownToClose={true}
//         onChange={handleSheetChange}
//         onAnimate={handleSheetAnimate}>
//         <BottomSheetNavigator />
//       </BottomSheet>
//     </View>
//   );
// };

const Stacks = () => {
  const BottomSheetNavigator = ({ snapIndex, enabledDarkTheme }) => {
    const screenOptions = useMemo(
      () => ({
        ...TransitionPresets.SlideFromRightIOS,

        headerShown: snapIndex !== 0,
        safeAreaInsets: { top: 0 },
        cardStyle: {
          backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
          overflow: 'visible',
        },
        headerStyle: {
          backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
          elevation: 0,
        },
        headerTintColor: enabledDarkTheme ? Colors.lighter : Colors.darker,
        headerTitleStyle: {
          fontSize: 16,
          color: enabledDarkTheme ? colors.white : colors.black,
        },
      }),
      [snapIndex],
    );

    return (
      <NavigationContainer independent={true}>
        <BottomSheetStack.Navigator
          initialRouteName={screenNames.currentlyPlaying}
          screenOptions={screenOptions}
          headerMode="screen">
          <BottomSheetStack.Screen
            name={screenNames.currentlyPlaying}
            options={{
              headerLeft: () => null,
              title: labels.currentlyPlaying,
              // headerTitleStyle: {
              //   // fontWeight: 'bold',
              //   fontSize: 18,
              //   // fontWeight: 'light',
              // },
            }}
            // component={() => (
            //   <View style={{ flex: 1, backgroundColor: 'white' }}>
            //     <Text>Screen A</Text>
            //   </View>
            // )}
          >
            {props => <CurrentlyPlaying {...props} extraData={{ snapIndex }} />}
          </BottomSheetStack.Screen>

          <BottomSheetStack.Screen
            name={screenNames.currentPlaylist}
            options={{ title: labels.currentPlaylist }}
            // component={() => (
            //   <View style={{ flex: 1, backgroundColor: 'white' }}>
            //     <Text>Screen B</Text>
            //   </View>
            // )}
          >
            {props => <CurrentPlaylist {...props} extraData={{ snapIndex }} />}
          </BottomSheetStack.Screen>

          <BottomSheetStack.Screen
            name={screenNames.songInfo}
            options={{ title: labels.songInfo }}
            // component={() => (
            //   <View style={{ flex: 1, backgroundColor: 'white' }}>
            //     <Text>Screen C</Text>
            //   </View>
            // )}
          >
            {props => <SongInfo {...props} extraData={{ snapIndex }} />}
          </BottomSheetStack.Screen>
          {/*<BottomSheetStack.Screen*/}
          {/*  name="View Screen"*/}
          {/*  component={ScreenD}*/}
          {/*  // component={() => (*/}
          {/*  //   <View style={{ flex: 1, backgroundColor: 'white' }}>*/}
          {/*  //     <Text>Screen D</Text>*/}
          {/*  //   </View>*/}
          {/*  // )}*/}
          {/*/>*/}
        </BottomSheetStack.Navigator>
      </NavigationContainer>
    );
  };

  const TabbedStack = createStackNavigator();
  const TabbedStackScreens = () => {
    // const bottomSheet = useRef(null);
    const startSnapIndex = 0; // TODO: 0 indicates minimized, to hide pass -1 (when there's no currently playing)
    const snapPoints = useMemo(() => ['10%', '45%', '92%'], []);
    const [snapIndex, setSnapIndex] = useState(startSnapIndex);
    // const [enableContentPanningGesture, setEnableContentPanningGesture] =
    //   useState(true);
    // const [enableHandlePanningGesture, setEnableHandlePanningGesture] =
    //   useState(true);
    // const [bottomSheetRef, setBottomSheetRef] = useState(null);

    // const handleSnapPress = useCallback(index => {
    //   // console.log('handleSnapPress:', { index, bottomSheet });
    //   bottomSheet.current?.snapToIndex(index);
    // }, []);

    // const bottomSheetMinimizeHandler = useCallback(() => {
    //   bottomSheet.current?.snapToIndex(0);
    // }, []);

    const bottomSheetExpandHandler = useCallback(() => {
      bottomSheet.current?.expand();
    }, []);

    const bottomSheetCollapseHandler = useCallback(() => {
      bottomSheet.current?.collapse();
    }, []);

    const bottomSheetCloseHandler = useCallback(() => {
      bottomSheet.current?.close();
    }, []);

    const { bottomSheet, musicInfo, setMusicInfo } = useContext(MusicContext);

    // setTimeout(() => {
    //   console.log('Stacks: updating bottomSheetControls...', { bottomSheet });
    //   if (!musicInfo?.bottomSheetControls && bottomSheet.current)
    //     setMusicInfo(data => ({
    //       ...data,
    //       bottomSheetControls: {
    //         // minimize: handleShowMinimized,
    //         // minimize: () => bottomSheet.current.snapToIndex(0),
    //         // close: handleClosePress,
    //         close: () => bottomSheet.current.close(),
    //       },
    //     }));
    // }, 500);

    useEffect(() => {
      if (!musicInfo?.bottomSheetControls) {
        setMusicInfo(data => ({
          ...data,
          bottomSheetControls: {
            expand: bottomSheetExpandHandler,
            collapse: bottomSheetCollapseHandler,
            // minimize: bottomSheetMinimizeHandler,
            close: bottomSheetCloseHandler,
          },
        }));
      }
    }, []);

    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      overshootClamping: true,
      restDisplacementThreshold: 0.1,
      restSpeedThreshold: 0.1,
      stiffness: 500,
    });

    const handleSheetChange = useCallback(index => {
      // eslint-disable-next-line no-console
      console.log('handleSheetChange', index);
      setSnapIndex(index);
    }, []);

    const handleSheetAnimate = useCallback((fromIndex, toIndex) => {
      // eslint-disable-next-line no-console
      console.log('handleSheetAnimate', `from ${fromIndex} to ${toIndex}`);
    }, []);

    const renderCustomHandle = useCallback(
      props => <CustomHandle {...props} />,
      [],
    );

    const renderBackdrop = useCallback(
      props => <BottomSheetBackdrop {...props} pressBehavior={'collapse'} />,
      [],
    );

    const { enabledDarkTheme } = useContext(PreferencesContext);

    const renderBlurView = () => (
      <BlurView
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
        blurType={enabledDarkTheme ? 'dark' : 'light'}
        blurAmount={5}
        blurRadius={10}
        downsampleFactor={10}
        // overlayColor={'lightgrey'}
        reducedTransparencyFallbackColor={
          enabledDarkTheme ? Colors.darker : Colors.lighter
        }
      />
    );

    return (
      <>
        <TabbedStack.Navigator screenOptions={{ headerShown: false }}>
          <TabbedStack.Screen
            name={screenNames.tracks}
            component={TabbedView}
          />
        </TabbedStack.Navigator>

        {/*<Player />*/}
        <BottomSheet
          // handleStyle={
          //   {
          //     // elevation: 2,
          //   }
          // }
          style={{
            borderTopLeftRadius: 10,
            // borderTopStartRadius: 10,
            borderTopRightRadius: 10,
            // borderTopEndRadius: 10,
            // borderWidth: 1,
            // borderColor: 'red',
            // overflow: 'hidden',
            // marginTop: 15,
            elevation: 2,
          }}
          ref={bottomSheet}
          // ref={_ref => {
          //   if (!bottomSheetRef) setBottomSheetRef(_ref);
          // }}
          // ref={_ref => {
          //   // bottomSheet = _ref;
          //   if (!musicInfo?.bottomSheetControls && _ref) {
          //     console.log('Stack: updating musicInfo...', {
          //       musicInfo,
          //       _ref,
          //     });
          //     setMusicInfo(data => ({
          //       ...data,
          //       bottomSheet: _ref,
          //       bottomSheetControls: {
          //         // minimize: handleShowMinimized,
          //         minimize: () => _ref.snapToIndex(0),
          //         // close: handleClosePress,
          //         close: () => _ref.close(),
          //       },
          //     }));
          //   }
          // }}
          index={snapIndex}
          snapPoints={snapPoints}
          animationConfigs={animationConfigs}
          animateOnMount={true}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          handleComponent={renderCustomHandle}
          backgroundStyle={{
            // backgroundColor: '#222',
            // borderWidth: 1,
            // borderColor: 'blue',
            marginTop: 3,
            // elevation: 2,
            backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.white,
          }}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backdropComponent={snapIndex === 2 ? renderBackdrop : null}
          // detached={true}
          enablePanDownToClose={true}
          onChange={handleSheetChange}
          onAnimate={handleSheetAnimate}>
          {/*<Text>Above</Text>*/}
          {/*<Text>{snapIndex}</Text>*/}
          <BottomSheetNavigator
            snapIndex={snapIndex}
            enabledDarkTheme={enabledDarkTheme}
          />
          {/*{renderBlurView()}*/}
        </BottomSheet>
      </>
    );
  };

  const SearchStack = createStackNavigator();
  const SearchStackScreens = () => (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name={screenNames.search} component={Search} />
      <SearchStack.Screen name={screenNames.itemInfo} component={ItemInfo} />
    </SearchStack.Navigator>
  );

  const RootStack = createStackNavigator();
  return (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen
        name={screenNames.tracks}
        component={TabbedStackScreens}
      />
      <RootStack.Screen name={screenNames.settings} component={Settings} />
      <RootStack.Screen
        name={screenNames.search}
        component={SearchStackScreens}
      />
      <RootStack.Screen name={screenNames.info} component={Info} />
      <RootStack.Screen name={screenNames.about} component={About} />
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
  },
});

export default Stacks;

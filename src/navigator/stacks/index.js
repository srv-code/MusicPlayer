import React, { useCallback, useMemo, useRef, useState } from 'react';
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
import BottomSheet, { useBottomSheetSpringConfigs } from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

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

const ScreenA = ({ navigation }) => {
  console.log('ScreenA', { navigation });

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text>Screen A</Text>
      <Text onPress={() => navigation.navigate('ScrollView Screen')}>
        Go to Screen B
      </Text>
    </View>
  );
};

//   createDummyScreen({
//   title: 'FlatList Screen',
//   nextScreen: 'ScrollView Screen',
// });

const ScreenB = ({ navigation }) => {
  console.log('ScreenB', { navigation });

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Text>Screen B</Text>
      <Text onPress={() => navigation.navigate('FlatList Screen')}>
        Go to Screen A
      </Text>
    </View>
  );
};

//   createDummyScreen({
//   title: 'ScrollView Screen',
//   nextScreen: 'SectionList Screen',
// });

const ScreenC = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }}>
    <Text>Screen C</Text>
  </View>
);

//   createDummyScreen({
//   title: 'SectionList Screen',
//   nextScreen: 'View Screen',
// });

const ScreenD = () => (
  <View style={{ flex: 1, backgroundColor: 'white' }}>
    <Text>Screen D</Text>
  </View>
);

//   createDummyScreen({
//   title: 'View Screen',
//   nextScreen: 'FlatList Screen',
// });

const BottomSheetNavigator = () => {
  const screenOptions = useMemo(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,

      headerShown: true,
      safeAreaInsets: { top: 0 },
      cardStyle: {
        backgroundColor: 'white',
        overflow: 'visible',
      },
    }),
    [],
  );

  const screenAOptions = useMemo(() => ({ headerLeft: () => null }), []);
  return (
    <NavigationContainer independent={true}>
      <BottomSheetStack.Navigator
        screenOptions={screenOptions}
        headerMode="screen">
        <BottomSheetStack.Screen
          name="FlatList Screen"
          options={screenAOptions}
          component={ScreenA}
          // component={() => (
          //   <View style={{ flex: 1, backgroundColor: 'white' }}>
          //     <Text>Screen A</Text>
          //   </View>
          // )}
        />
        <BottomSheetStack.Screen
          name="ScrollView Screen"
          component={ScreenB}
          // component={() => (
          //   <View style={{ flex: 1, backgroundColor: 'white' }}>
          //     <Text>Screen B</Text>
          //   </View>
          // )}
        />
        <BottomSheetStack.Screen
          name="SectionList Screen"
          component={ScreenC}
          // component={() => (
          //   <View style={{ flex: 1, backgroundColor: 'white' }}>
          //     <Text>Screen C</Text>
          //   </View>
          // )}
        />
        <BottomSheetStack.Screen
          name="View Screen"
          component={ScreenD}
          // component={() => (
          //   <View style={{ flex: 1, backgroundColor: 'white' }}>
          //     <Text>Screen D</Text>
          //   </View>
          // )}
        />
      </BottomSheetStack.Navigator>
    </NavigationContainer>
  );
};

export const PlayerBottomSheet = () => {
  const bottomSheet = useRef(null);
  const [enableContentPanningGesture, setEnableContentPanningGesture] =
    useState(true);
  const [enableHandlePanningGesture, setEnableHandlePanningGesture] =
    useState(true);

  const handleSnapPress = useCallback(index => {
    console.log('handleSnapPress:', { index, bottomSheetRef: bottomSheet });
    bottomSheet.current?.snapToIndex(index);
  }, []);

  const handleExpandPress = useCallback(() => {
    bottomSheet.current?.expand();
  }, []);

  const handleCollapsePress = useCallback(() => {
    bottomSheet.current?.collapse();
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheet.current?.close();
  }, []);

  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

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
  }, []);

  const handleSheetAnimate = useCallback(
    (fromIndex: number, toIndex: number) => {
      // eslint-disable-next-line no-console
      console.log('handleSheetAnimate', `from ${fromIndex} to ${toIndex}`);
    },
    [],
  );

  return (
    <View
      style={{
        flex: 1,
        padding: 24,
      }}>
      <Text onPress={() => handleSnapPress(2)}>Snap To 90%</Text>
      <Text onPress={() => handleSnapPress(1)}>Snap To 50%</Text>
      <Text onPress={() => handleSnapPress(0)}>Snap To 25%</Text>
      <Text onPress={() => handleExpandPress()}>Expand</Text>
      <Text onPress={() => handleCollapsePress()}>Collapse</Text>
      <Text onPress={() => handleClosePress()}>Close</Text>
      <BottomSheet
        ref={bottomSheet}
        index={1}
        snapPoints={snapPoints}
        animationConfigs={animationConfigs}
        animateOnMount={true}
        enableContentPanningGesture={enableContentPanningGesture}
        enableHandlePanningGesture={enableHandlePanningGesture}
        // detached={true}
        enablePanDownToClose={true}
        onChange={handleSheetChange}
        onAnimate={handleSheetAnimate}>
        <BottomSheetNavigator />
      </BottomSheet>
    </View>
  );
};

const Stacks = () => {
  const TabbedStack = createStackNavigator();
  const TabbedStackScreens = () => (
    <>
      <TabbedStack.Navigator screenOptions={{ headerShown: false }}>
        <TabbedStack.Screen name={screenNames.tracks} component={TabbedView} />
      </TabbedStack.Navigator>
      {/*<Player />*/}

      {/*sample bottom-sheet */}
      {/*<PlayerBottomSheet />*/}
    </>
  );

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

export default Stacks;

import React, { useMemo } from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import screenNames from '../../constants/screen-names';
import TabbedView from '../tabbed-view';
import Settings from '../../screens/settings';
import Search from '../../screens/search';
import Info from '../../screens/info';
import About from '../../screens/about';
import ItemInfo from '../../screens/item-info';
import { NavigationContainer } from '@react-navigation/native';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import colors from '../../constants/colors';
import labels from '../../constants/labels';
import NowPlaying from '../../screens/now-playing';
import CurrentPlaylist from '../../screens/current-playlist';
import SongInfo from '../../screens/song-info';
import PlayerBottomSheet from '../../components/player-bottom-sheet';

const BottomSheetStack = createStackNavigator();
const BottomSheetNavigator = ({
  snapIndex,
  setSnapIndex,
  enabledDarkTheme,
}) => {
  const screenOptions = useMemo(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,

      headerShown: snapIndex === 2,
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
        initialRouteName={screenNames.nowPlaying}
        screenOptions={screenOptions}
        // headerMode="screen"
      >
        <BottomSheetStack.Screen
          name={screenNames.nowPlaying}
          options={{
            headerLeft: () => null,
            title: labels.nowPlaying,
            headerTitleStyle: {
              fontSize: wp(5),
              textTransform: 'capitalize',
              // backgroundColor: 'lightblue',
              // padding: 0,
              // margin: 0,
            },
            headerTitleContainerStyle: {
              // backgroundColor: 'lightblue',
              width: wp(90),
              alignItems: 'center',
              // padding: 0,
              // margin: 0,
              marginTop: hp(-2),
            },
          }}>
          {props => (
            <NowPlaying {...props} extraData={{ snapIndex, setSnapIndex }} />
          )}
        </BottomSheetStack.Screen>

        <BottomSheetStack.Screen
          name={screenNames.currentPlaylist}
          options={{ title: labels.currentPlaylist }}>
          {props => <CurrentPlaylist {...props} extraData={{ snapIndex }} />}
        </BottomSheetStack.Screen>

        <BottomSheetStack.Screen
          name={screenNames.songInfo}
          options={{ title: labels.songInfo }}>
          {props => <SongInfo {...props} extraData={{ snapIndex }} />}
        </BottomSheetStack.Screen>
      </BottomSheetStack.Navigator>
    </NavigationContainer>
  );
};

const TabbedStack = createStackNavigator();
const TabbedStackNavigator = () => {
  return (
    <>
      <TabbedStack.Navigator screenOptions={{ headerShown: false }}>
        <TabbedStack.Screen
          name={screenNames.tabbedView}
          component={TabbedView}
        />
      </TabbedStack.Navigator>

      <PlayerBottomSheet navigator={BottomSheetNavigator} />
    </>
  );
};

const SearchStack = createStackNavigator();
const SearchStackNavigator = () => (
  <SearchStack.Navigator screenOptions={{ headerShown: false }}>
    <SearchStack.Screen name={screenNames.search} component={Search} />
    <SearchStack.Screen name={screenNames.itemInfo} component={ItemInfo} />
  </SearchStack.Navigator>
);

const RootStack = createStackNavigator();
const RootStackNavigator = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen
      name={screenNames.tracks}
      component={TabbedStackNavigator}
    />
    <RootStack.Screen name={screenNames.settings} component={Settings} />
    <RootStack.Screen
      name={screenNames.search}
      component={SearchStackNavigator}
    />
    <RootStack.Screen name={screenNames.info} component={Info} />
    <RootStack.Screen name={screenNames.about} component={About} />
  </RootStack.Navigator>
);

export default RootStackNavigator;

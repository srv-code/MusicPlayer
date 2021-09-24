import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import PlayerBottomSheet from '../../components/player-bottom-sheet';
import colors from '../../constants/colors';
import labels from '../../constants/labels';
import screenNames from '../../constants/screen-names';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import TabbedView from '../tabbed-view';
import Settings from '../../screens/settings';
import Search from '../../screens/search';
import AppInfo from '../../screens/app-info';
import ItemInfo, {
  getScreenTitle as getItemInfoScreenTitle,
} from '../../screens/item-info';
import About from '../../screens/about';
import NowPlaying from '../../screens/now-playing';
import CurrentPlaylist from '../../screens/current-playlist';

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
        backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
        overflow: 'visible',
        // elevation: 0,
      },
      headerStyle: {
        backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
        elevation: 0,
        // borderWidth: 1, borderColor: 'white',
      },
      headerTintColor: enabledDarkTheme ? colors.lighter : colors.darker,
      headerTitleStyle: {
        fontSize: 16,
        color: enabledDarkTheme ? colors.white : colors.black,
      },
    }),
    [snapIndex, enabledDarkTheme],
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
            headerTitleStyle: styles.headerTitleText,
            headerTitleAlign: 'center',
          }}>
          {props => (
            <NowPlaying {...props} extraData={{ snapIndex, setSnapIndex }} />
          )}
        </BottomSheetStack.Screen>

        <BottomSheetStack.Screen
          name={screenNames.currentPlaylist}
          options={{
            title: labels.currentPlaylist,
            headerTitleStyle: styles.headerTitleText,
            headerTitleAlign: 'center',
          }}>
          {props => <CurrentPlaylist {...props} extraData={{ snapIndex }} />}
        </BottomSheetStack.Screen>

        <BottomSheetStack.Screen
          name={screenNames.itemInfo}
          options={({ route }) => ({
            title: getItemInfoScreenTitle(route.params.type),
            // title: labels.songInfo,
            headerTitleStyle: styles.headerTitleText,
            headerTitleAlign: 'center',
          })}>
          {props => <ItemInfo {...props} extraData={{ snapIndex }} />}
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
    <RootStack.Screen name={screenNames.appInfo} component={AppInfo} />
    <RootStack.Screen name={screenNames.about} component={About} />
  </RootStack.Navigator>
);

const styles = StyleSheet.create({
  headerTitleText: {
    fontSize: wp(5.5),
    textTransform: 'capitalize',
  },
});

export default RootStackNavigator;

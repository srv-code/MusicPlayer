import React, { useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Tracks from '../screens/tracks';
import screenNames from '../constants/screen-names';
import Playlists from '../screens/playlists';
import { BottomNavigation } from 'react-native-paper';
import colors from '../constants/colors';
import { AppContext } from '../context/app';

// const TrackStack = createStackNavigator();
// const TrackStackScreens = () => (
//   <TrackStack.Navigator screenOptions={{ headerShown: false }}>
//     <TrackStack.Screen name={screenNames.tracks} component={Tracks} />
//   </TrackStack.Navigator>
// );
//
// const PlaylistStack = createStackNavigator();
// const PlaylistStackScreens = () => (
//   <PlaylistStack.Navigator screenOptions={{ headerShown: false }}>
//     <PlaylistStack.Screen name={screenNames.playlists} component={Playlists} />
//   </PlaylistStack.Navigator>
// );

// const BottomTabs = createMaterialBottomTabNavigator();
// const BottomTabScreen = () => (
//   <BottomTabs.Navigator>
//     <BottomTabs.Screen
//       name={screenNames.tracks}
//       component={TrackStackScreens}
//     />
//     <BottomTabs.Screen
//       name={screenNames.playlists}
//       component={PlaylistStackScreens}
//     />
//   </BottomTabs.Navigator>
// );

const BottomTabNavigator = () => {
  const { enabledDarkTheme } = useContext(AppContext);

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'tracks',
      title: screenNames.tracks,
      icon: 'album',
      color: enabledDarkTheme ? null : colors.darkBlue2,
    },
    {
      key: 'playlists',
      title: screenNames.playlists,
      icon: 'playlist-music',
      color: enabledDarkTheme ? null : colors.darkBlue,
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    tracks: Tracks,
    playlists: Playlists,
  });

  return (
    <BottomNavigation
      shifting
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

const Navigator = () => (
  <NavigationContainer>
    {/*<BottomTabScreen />*/}
    <BottomTabNavigator />
  </NavigationContainer>
);

export default Navigator;

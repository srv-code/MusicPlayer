import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Tracks from '../screens/tracks';
import screenNames from '../constants/screen-names';
import Playlists from '../screens/playlists';
import { BottomNavigation } from 'react-native-paper';

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
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'tracks',
      title: screenNames.tracks,
      icon: 'album',
      color: '#3F51B5',
    },
    {
      key: 'playlists',
      title: screenNames.playlists,
      icon: 'playlist-music',
      color: '#009688',
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    tracks: Tracks,
    playlists: Playlists,
  });

  return (
    <BottomNavigation
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

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Tracks from '../screens/tracks';
import screenNames from '../constants/screen-names';
import Playlists from '../screens/playlists';

const TrackStack = createStackNavigator();
const TrackStackScreens = () => (
  <TrackStack.Navigator>
    <TrackStack.Screen name={screenNames.tracks} component={Tracks} />
  </TrackStack.Navigator>
);

const PlaylistStack = createStackNavigator();
const PlaylistStackScreens = () => (
  <PlaylistStack.Navigator>
    <PlaylistStack.Screen name={screenNames.playlists} component={Playlists} />
  </PlaylistStack.Navigator>
);

const BottomTabs = createMaterialBottomTabNavigator();
const BottomTabScreen = () => (
  <BottomTabs.Navigator>
    <BottomTabs.Screen
      name={screenNames.tracks}
      component={TrackStackScreens}
    />
    <BottomTabs.Screen
      name={screenNames.playlists}
      component={PlaylistStackScreens}
    />
  </BottomTabs.Navigator>
);

const Navigator = () => (
  <NavigationContainer>
    <BottomTabScreen />
  </NavigationContainer>
);

export default Navigator;

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import screenNames from '../constants/screen-names';
import Tracks from '../screens/tracks';
import Playlists from '../screens/playlists';
import Settings from '../screens/settings';
import Playback from '../screens/playback';
import Icons from '../constants/icons';
import colors from '../constants/colors';

const Navigator = ({ enabledDarkTheme, theme }) => {
  const TrackStack = createStackNavigator();
  const TrackStackScreens = () => (
    <TrackStack.Navigator screenOptions={{ headerShown: false }}>
      <TrackStack.Screen name={screenNames.tracks} component={Tracks} />
    </TrackStack.Navigator>
  );

  const PlaylistStack = createStackNavigator();
  const PlaylistStackScreens = () => (
    <PlaylistStack.Navigator screenOptions={{ headerShown: false }}>
      <PlaylistStack.Screen
        name={screenNames.playlists}
        component={Playlists}
      />
    </PlaylistStack.Navigator>
  );

  const PlaybackStack = createStackNavigator();
  const PlaybackStackScreens = () => (
    <PlaybackStack.Navigator screenOptions={{ headerShown: false }}>
      <PlaybackStack.Screen name={screenNames.playback} component={Playback} />
    </PlaybackStack.Navigator>
  );

  const SettingsStack = createStackNavigator();
  const SettingsStackScreens = () => (
    <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
      <SettingsStack.Screen name={screenNames.settings} component={Settings} />
    </SettingsStack.Navigator>
  );

  const BottomTabs = createMaterialBottomTabNavigator();
  const BottomTabScreen = () => (
    <BottomTabs.Navigator shifting sceneAnimationEnabled>
      <BottomTabs.Screen
        name={screenNames.tracks}
        component={TrackStackScreens}
        options={{
          tabBarLabel: screenNames.tracks,
          tabBarColor: enabledDarkTheme ? null : colors.darkBlue2,
          tabBarIcon: Icons.Album,
        }}
      />
      <BottomTabs.Screen
        name={screenNames.playlists}
        component={PlaylistStackScreens}
        options={{
          tabBarLabel: screenNames.playlists,
          tabBarColor: enabledDarkTheme ? null : colors.darkBlue,
          tabBarIcon: Icons.PlaylistMusic,
        }}
      />
    </BottomTabs.Navigator>
  );

  const RootStack = createStackNavigator();
  const RootStackScreen = () => (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen name={screenNames.tracks} component={BottomTabScreen} />
      <RootStack.Screen
        name={screenNames.playback}
        component={PlaybackStackScreens}
      />
      <RootStack.Screen
        name={screenNames.settings}
        component={SettingsStackScreens}
      />
    </RootStack.Navigator>
  );

  return (
    <NavigationContainer theme={theme}>
      <RootStackScreen />
    </NavigationContainer>
  );
};

export default Navigator;

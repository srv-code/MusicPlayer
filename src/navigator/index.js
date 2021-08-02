import React from 'react';
// import { useWindowDimensions } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { NavigationContainer } from '@react-navigation/native';
import screenNames from '../constants/screen-names';
import Tracks from '../screens/tracks';
// import Splash from '../screens/splash';
import Playlists from '../screens/playlists';
import Settings from '../screens/settings';
import Playback from '../screens/playback';
import Icons from '../constants/icons';
import colors from '../constants/colors';

const routeData = [
  // { name: screenNames.splash, screen: Splash },
  { name: screenNames.playback, screen: Playback },
  { name: screenNames.playlists, screen: Playlists },
  { name: screenNames.settings, screen: Settings },
  { name: screenNames.tracks, screen: Tracks },
];

const Navigator = ({ enabledDarkTheme, theme }) => {
  // const layout = useWindowDimensions();

  // TODO make them inline, for testing purposes only
  const _routes = routeData.map(data => ({ key: data.name, title: data.name }));
  const _sceneMap = {};
  routeData.forEach(data => (_sceneMap[data.name] = data.screen));
  console.log('navigator:', { _routes, _sceneMaps: _sceneMap });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState(
    // // sample
    // [
    //   { key: 'Splash', title: 'Splash' },
    //   { key: 'Tracks', title: 'Tracks' },
    // ],

    _routes,
  );

  const renderScene = SceneMap(
    // (() => {
    //   // TODO move the calculation here
    //   // sample
    //   return {
    //     // Splash: Splash,
    //     Playback: Playback,
    //     Playlists: Playlists,
    //     Settings: Settings,
    //     Tracks: Tracks,
    //   };
    // })(),

    // routeData.map(data => ({ [data.name]: data.screen })),

    _sceneMap,
  );

  return (
    // <NavigationContainer theme={theme}>
    <TabView
      swipeEnabled={true}
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      // initialLayout={{ width: layout.width }}
      renderScene={renderScene}
    />
    // </NavigationContainer>
  );
};
export default Navigator;

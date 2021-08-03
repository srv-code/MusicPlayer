import React, { useState } from 'react';
// import { useWindowDimensions } from 'react-native';
import screenNames from '../../constants/screen-names';
import Playback from '../../screens/playback';
import Playlists from '../../screens/playlists';
import Tracks from '../../screens/tracks';
import { useBackHandler } from '@react-native-community/hooks';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Appbar, Menu } from 'react-native-paper';
import { Platform } from 'react-native';
import colors from '../../constants/colors';

const routeData = [
  { name: screenNames.playback, screen: Playback },
  { name: screenNames.playlists, screen: Playlists },
  { name: screenNames.tracks, screen: Tracks },
];

const TabbedView = ({ navigation }) => {
  // const layout = useWindowDimensions();

  // TODO make them inline, for testing purposes only
  const _routes = routeData.map(data => ({ key: data.name, title: data.name }));
  const _sceneMap = {};
  routeData.forEach(data => (_sceneMap[data.name] = data.screen));

  const [index, setIndex] = useState(0);
  const [routes] = useState(
    // // sample
    // [
    //   { key: 'Splash', title: 'Splash' },
    //   { key: 'Tracks', title: 'Tracks' },
    // ],

    _routes,
  );
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('navigator:', { index, _routes, _sceneMaps: _sceneMap });

  useBackHandler(() => {
    if (showSearch) {
      setShowSearch(false);
      setSearchTerm('');
      return true;
    }
    return false;
  });

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

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  // const _getVisible = (name: string) => !!visible[name];
  // const _toggleMenu = (name: string) => () =>
  //   setVisible({ ...visible, [name]: !visible[name] });
  const toggleMenuVisibility = () => setIsMenuVisible(!isMenuVisible);

  const renderAppbar = () => (
    <Appbar.Header>
      <Appbar.Content title="Music Player" />
      <Appbar.Action icon="magnify" onPress={() => {}} />
      {/*<Appbar.Action*/}
      {/*  icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}*/}
      {/*  onPress={() => {}}*/}
      {/*/>*/}
      <Menu
        visible={isMenuVisible}
        // visible={_getVisible('menu1')}
        // onDismiss={_toggleMenu('menu1')}
        onDismiss={toggleMenuVisibility}
        anchor={
          <Appbar.Action
            icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
            color={colors.white}
            onPress={toggleMenuVisibility}
          />
        }>
        <Menu.Item
          icon="sync"
          title="Sync"
          onPress={() => {
            toggleMenuVisibility();
          }}
        />
        <Menu.Item
          icon="cog-outline"
          title="Settings"
          onPress={() => {
            toggleMenuVisibility();
          }}
        />
      </Menu>
    </Appbar.Header>
  );

  const renderTabView = () => (
    <TabView
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      // initialLayout={{ width: layout.width }}
      renderScene={renderScene}
    />
  );

  return (
    <>
      {renderAppbar()}
      {renderTabView()}
    </>
  );
};

export default TabbedView;

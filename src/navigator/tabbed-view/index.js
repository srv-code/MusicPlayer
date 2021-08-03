import React, { useState } from 'react';
import { useBackHandler } from '@react-native-community/hooks';
import { SceneMap, TabView } from 'react-native-tab-view';
import { Appbar, Menu } from 'react-native-paper';
import { Platform } from 'react-native';
// import { useWindowDimensions } from 'react-native';
import screenNames from '../../constants/screen-names';
import Playlists from '../../screens/playlists';
import Tracks from '../../screens/tracks';
import Favorites from '../../screens/favorites';
import Albums from '../../screens/albums';
import Artists from '../../screens/artists';
import colors from '../../constants/colors';

const routeData = [
  { name: screenNames.favorites, screen: Favorites },
  { name: screenNames.playlists, screen: Playlists },
  { name: screenNames.tracks, screen: Tracks },
  { name: screenNames.albums, screen: Albums },
  { name: screenNames.artists, screen: Artists },
];

const TabbedView = ({ navigation }) => {
  // const layout = useWindowDimensions();

  const [index, setIndex] = useState(0);
  const [routes] = useState(
    routeData.map(data => ({ key: data.name, title: data.name })),
  );
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useBackHandler(() => {
    if (showSearch) {
      setShowSearch(false);
      setSearchTerm('');
      return true;
    }
    return false;
  });

  const renderScene = SceneMap(
    (() => {
      const _sceneMap = {};
      routeData.forEach(data => (_sceneMap[data.name] = data.screen));
      return _sceneMap;
    })(),
  );

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenuVisibility = () => setIsMenuVisible(!isMenuVisible);

  const renderAppbar = () => (
    <Appbar.Header>
      <Appbar.Content title="Music Player" />
      <Appbar.Action icon="magnify" onPress={() => {}} />
      <Menu
        visible={isMenuVisible}
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

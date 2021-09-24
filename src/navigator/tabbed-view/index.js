import React, { useContext, useEffect, useState } from 'react';
import { useBackHandler } from '@react-native-community/hooks';
import { Image, View, StyleSheet } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { Appbar, Badge, Menu, Text } from 'react-native-paper';
import screenNames from '../../constants/screen-names';
import Playlists from '../../screens/playlists';
import Tracks from '../../screens/tracks';
import Favorites from '../../screens/favorites';
import Albums from '../../screens/albums';
import Artists from '../../screens/artists';
import colors from '../../constants/colors';
import { width } from '../../constants/dimensions';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { PreferencesContext } from '../../context/preferences';
import Icon from '../../components/icon';
import labels from '../../constants/labels';
import Icons from '../../constants/icons';
import Folders from '../../screens/folders';
import { MusicContext } from '../../context/music';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';

const routeData = [
  {
    key: screenNames.favorites,
    title: screenNames.favorites,
    screen: Favorites,
    icon: {
      color: colors.red,
      ...IconUtils.getInfo(keys.FAVORITE),
    },
  },
  {
    key: screenNames.playlists,
    title: screenNames.playlists,
    screen: Playlists,
    icon: {
      color: colors.green1,
      ...IconUtils.getInfo(keys.PLAYLISTS),
    },
  },
  {
    key: screenNames.tracks,
    title: screenNames.tracks,
    screen: Tracks,
    icon: {
      color: colors.lightPurple,
      ...IconUtils.getInfo(keys.TRACKS),
    },
  },
  {
    key: screenNames.albums,
    title: screenNames.albums,
    screen: Albums,
    icon: {
      color: colors.lightBlue1,
      ...IconUtils.getInfo(keys.ALBUMS),
    },
  },
  {
    key: screenNames.artists,
    title: screenNames.artists,
    screen: Artists,
    icon: {
      color: colors.darkGreen,
      ...IconUtils.getInfo(keys.ARTISTS),
    },
  },
  {
    key: screenNames.folders,
    title: screenNames.folders,
    screen: Folders,
    icon: {
      color: colors.lightGreen,
      ...IconUtils.getInfo(keys.FOLDERS),
    },
  },
];

const TabbedView = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { musicInfo } = useContext(MusicContext);

  const [currentRouteIndex, setCurrentRouteIndex] = useState(2);
  const [routes] = useState(routeData);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabItemCounts, setTabItemCounts] = useState({
    [screenNames.favorites]: null,
    [screenNames.playlists]: null,
    [screenNames.tracks]: null,
    [screenNames.albums]: null,
    [screenNames.artists]: null,
    [screenNames.folders]: null,
  });

  useBackHandler(() => {
    if (showSearch) {
      setShowSearch(false);
      setSearchTerm('');
      return true;
    }
    return false;
  });

  // console.log(
  //   `[Tabbed-View] playlist count=${
  //     musicInfo?.[keys.PLAYLISTS]?.length
  //   }, fav count=${musicInfo?.[keys.FAVORITE_IDS]?.length}, track count=${
  //     musicInfo?.[keys.TRACKS]?.length
  //   }`,
  // );

  useEffect(() => {
    if (musicInfo) {
      setTabItemCounts({
        [screenNames.favorites]: musicInfo[keys.FAVORITE_IDS]?.length || null,
        [screenNames.playlists]: musicInfo[keys.PLAYLISTS]?.length || null,
        [screenNames.tracks]: musicInfo[keys.TRACKS]?.length || null,
        [screenNames.albums]: musicInfo[keys.ALBUMS]?.length || null,
        [screenNames.artists]: musicInfo[keys.ARTISTS]?.length || null,
        [screenNames.folders]: musicInfo[keys.FOLDERS]?.length || null,
      });
    }
  }, [musicInfo]);

  const renderScene = SceneMap(
    (() => {
      const _sceneMap = {};
      routeData.forEach(data => (_sceneMap[data.key] = data.screen));
      return _sceneMap;
    })(),
  );

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenuVisibility = () => setIsMenuVisible(!isMenuVisible);

  const onDataSync = () => {};

  const renderAppbar = () => (
    <Appbar.Header
      style={{
        backgroundColor: enabledDarkTheme ? colors.darker : colors.darkBlue2,
        elevation: 0,
      }}>
      <Image source={Icons.Logo} resizeMode="stretch" style={styles.logo} />
      <Appbar.Content title={labels.musicPlayer} />
      <Appbar.Action
        icon={IconUtils.getInfo(keys.SEARCH).name.default}
        onPress={navigation.navigate.bind(this, screenNames.search)}
      />
      <Menu
        visible={isMenuVisible}
        onDismiss={toggleMenuVisibility}
        anchor={
          <Appbar.Action
            icon={IconUtils.getInfo(keys.ELLIPSIS).name.default}
            color={colors.white}
            onPress={toggleMenuVisibility}
          />
        }>
        <Menu.Item
          icon={IconUtils.getInfo(keys.SYNC).name.default}
          title={labels.sync}
          onPress={() => {
            onDataSync();
            toggleMenuVisibility();
          }}
        />
        <Menu.Item
          icon={IconUtils.getInfo(keys.SETTINGS).name.default}
          title={labels.settings}
          onPress={() => {
            navigation.navigate(screenNames.settings);
            toggleMenuVisibility();
          }}
        />
        <Menu.Item
          icon={IconUtils.getInfo(keys.DEBUG).name.default}
          title={labels.appInfo}
          onPress={() => {
            navigation.navigate(screenNames.appInfo);
            toggleMenuVisibility();
          }}
        />
        <Menu.Item
          icon={IconUtils.getInfo(keys.INFO).name.default}
          title={labels.about}
          onPress={() => {
            navigation.navigate(screenNames.about);
            toggleMenuVisibility();
          }}
        />
      </Menu>
    </Appbar.Header>
  );

  const renderTabView = () => {
    const renderTabBar = props => (
      <TabBar
        {...props}
        scrollEnabled
        bounces
        // tabStyle={
        //   {
        //     // height: hp(6),
        //     // backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
        //     // height: hp(10),
        //     // justifyContent: 'flex-start',
        //     // zIndex: -1,
        //   }
        // }
        style={{
          ...styles.tabBar,
          backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
        }}
        renderLabel={({ route, focused, color }) => (
          <View style={styles.tabBarItemLabelContainer}>
            <Icon
              type={route.icon.type}
              name={focused ? route.icon.name.filled : route.icon.name.outlined}
              color={route.icon.color}
              size={wp(focused ? 5.5 : 3.8)}
              style={{ opacity: focused ? 1 : 0.5 }}
            />
            <Text
              style={{
                ...styles.tabBarItemLabelTextBase,
                opacity: focused ? 1 : 0.5,
                fontSize: wp(focused ? 5.5 : 3.8),
                fontWeight: focused ? 'bold' : 'normal',
              }}>
              {route.title}
            </Text>

            {tabItemCounts[route.key] ? (
              <Badge
                size={focused ? 20 : 15}
                style={{
                  opacity: focused ? 1 : 0.5,
                  backgroundColor: focused
                    ? colors.lightGrey1
                    : colors.lightGrey,
                  alignSelf: 'center',
                }}>
                {tabItemCounts[route.key]}
              </Badge>
            ) : (
              <View
                style={{
                  width: wp(5),
                  backgroundColor: 'transparent',
                }}
              />
            )}
          </View>
        )}
        renderIndicator={() => null}
      />
    );

    return (
      <TabView
        navigationState={{ index: currentRouteIndex, routes }}
        onIndexChange={setCurrentRouteIndex}
        initialLayout={{ width }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
      />
    );
  };

  return (
    <>
      {renderAppbar()}
      {renderTabView()}
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    height: hp(3.8),
    width: hp(3.8),
    marginLeft: wp(2),
    marginRight: wp(-2),
  },
  tabBarItemLabelContainer: {
    height: hp(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBarItemLabelTextBase: {
    paddingHorizontal: wp(1),
    textAlignVertical: 'center',
    textTransform: 'capitalize',
  },
  tabBar: {
    elevation: 0,
    height: hp(6),
    justifyContent: 'flex-start',
  },
});

export default TabbedView;

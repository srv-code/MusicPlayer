import React, { useContext, useState } from 'react';
import { useBackHandler } from '@react-native-community/hooks';
import { Image, View, StyleSheet } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { Appbar, Badge, Menu, Text } from 'react-native-paper';
import { Platform } from 'react-native';
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
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import Icon from '../../components/icon';
import labels from '../../constants/labels';
import Icons from '../../constants/icons';

const routeData = [
  {
    key: screenNames.favorites,
    title: screenNames.favorites,
    screen: Favorites,
    icon: {
      color: colors.red,
      type: 'MaterialCommunityIcons',
      name: {
        filled: 'heart',
        outlined: 'heart-outline',
      },
    },
  },
  {
    key: screenNames.playlists,
    title: screenNames.playlists,
    screen: Playlists,
    icon: {
      color: colors.green1,
      type: 'MaterialCommunityIcons',
      name: {
        filled: 'playlist-music',
        outlined: 'playlist-music-outline',
      },
    },
  },
  {
    key: screenNames.tracks,
    title: screenNames.tracks,
    screen: Tracks,
    icon: {
      color: colors.lightPurple,
      type: 'Ionicons',
      name: {
        filled: 'musical-notes',
        outlined: 'musical-notes-outline',
      },
    },
  },
  {
    key: screenNames.albums,
    title: screenNames.albums,
    screen: Albums,
    icon: {
      color: colors.lightBlue1,
      type: 'Ionicons',
      name: {
        filled: 'disc',
        outlined: 'disc-outline',
      },
    },
  },
  {
    key: screenNames.artists,
    title: screenNames.artists,
    screen: Artists,
    icon: {
      color: colors.darkGreen,
      type: 'MaterialCommunityIcons',
      name: {
        filled: 'account-music',
        outlined: 'account-music-outline',
      },
    },
  },
];

const TabbedView = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const [currentRouteIndex, setCurrentRouteIndex] = useState(2);
  const [routes] = useState(routeData);
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
      routeData.forEach(data => (_sceneMap[data.key] = data.screen));
      return _sceneMap;
    })(),
  );

  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenuVisibility = () => setIsMenuVisible(!isMenuVisible);

  const onDataSync = () => {};

  const renderAppbar = () => (
    <Appbar.Header>
      <Image source={Icons.Logo} resizeMode="stretch" style={styles.logo} />
      <Appbar.Content title={labels.musicPlayer} />
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
          title={labels.sync}
          onPress={() => {
            onDataSync();
            toggleMenuVisibility();
          }}
        />
        <Menu.Item
          icon="cog-outline"
          title={labels.settings}
          onPress={() => {
            navigation.navigate(screenNames.settings);
            toggleMenuVisibility();
          }}
        />
        <Menu.Item
          icon="bug-outline"
          title={labels.info}
          onPress={() => {
            navigation.navigate(screenNames.info);
            toggleMenuVisibility();
          }}
        />
        <Menu.Item
          icon="information-outline"
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
            <Badge
              size={focused ? 20 : 15}
              style={{
                opacity: focused ? 1 : 0.5,
                backgroundColor: focused ? colors.lightGrey1 : colors.lightGrey,
                alignSelf: 'center',
              }}>
              3
            </Badge>
          </View>
        )}
        renderIndicator={() => null}
        tabStyle={{
          height: hp(6),
          backgroundColor: enabledDarkTheme ? Colors.darker : colors.white2,
        }}
        style={styles.tabBar}
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
    height: hp(3.5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabBarItemLabelTextBase: {
    paddingHorizontal: wp(1),
    textAlignVertical: 'center',
    textTransform: 'capitalize',
  },
  tabBar: {
    elevation: 0,
  },
});

export default TabbedView;

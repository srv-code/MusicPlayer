import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import screenNames from '../../constants/screen-names';
import TabbedView from '../tabbed-view';
import Settings from '../../screens/settings';
import Search from '../../screens/search';

const Stacks = () => {
  const TabbedStack = createStackNavigator();
  const TabbedStackScreens = () => (
    <TabbedStack.Navigator screenOptions={{ headerShown: false }}>
      <TabbedStack.Screen name={screenNames.playback} component={TabbedView} />
    </TabbedStack.Navigator>
  );

  const SettingsStack = createStackNavigator();
  const SettingsStackScreen = () => (
    <SettingsStack.Navigator>
      <SettingsStack.Screen name={screenNames.playback} component={Settings} />
    </SettingsStack.Navigator>
  );

  const SearchStack = createStackNavigator();
  const SearchStackScreen = () => (
    <SearchStack.Navigator>
      <SearchStack.Screen name={screenNames.search} component={Search} />
    </SearchStack.Navigator>
  );

  const RootStack = createStackNavigator();
  return (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen
        name={screenNames.tabbedScreens}
        component={TabbedStackScreens}
      />
      <RootStack.Screen
        name={screenNames.settings}
        component={SettingsStackScreen}
      />
      <RootStack.Screen
        name={screenNames.search}
        component={SearchStackScreen}
      />
    </RootStack.Navigator>
  );
};

export default Stacks;

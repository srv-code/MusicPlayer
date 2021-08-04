import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import screenNames from '../../constants/screen-names';
import TabbedView from '../tabbed-view';
import Settings from '../../screens/settings';
import Search from '../../screens/search';
import Info from '../../screens/info';
import About from '../../screens/about';

const Stacks = () => {
  const TabbedStack = createStackNavigator();
  const TabbedStackScreens = () => (
    <TabbedStack.Navigator screenOptions={{ headerShown: false }}>
      <TabbedStack.Screen name={screenNames.tracks} component={TabbedView} />
    </TabbedStack.Navigator>
  );

  const RootStack = createStackNavigator();
  return (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen
        name={screenNames.tracks}
        component={TabbedStackScreens}
      />
      <RootStack.Screen name={screenNames.settings} component={Settings} />
      <RootStack.Screen name={screenNames.search} component={Search} />
      <RootStack.Screen name={screenNames.info} component={Info} />
      <RootStack.Screen name={screenNames.about} component={About} />
    </RootStack.Navigator>
  );
};

export default Stacks;

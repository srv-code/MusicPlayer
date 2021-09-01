import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootStackNavigator from './stacks';

const Navigator = ({ theme }) => (
  <NavigationContainer theme={theme}>
    <RootStackNavigator />
  </NavigationContainer>
);

export default Navigator;

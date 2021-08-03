import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Stacks from './stacks';

const Navigator = ({ theme }) => {
  return (
    <NavigationContainer theme={theme}>
      <Stacks />
    </NavigationContainer>
  );
};

export default Navigator;

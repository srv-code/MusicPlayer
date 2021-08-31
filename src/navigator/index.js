import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Stacks, { PlayerBottomSheet } from './stacks';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

const Navigator = ({ theme }) => (
  <>
    {/*<NavigationContainer theme={theme}>*/}
    {/*  <Stacks />*/}
    {/*</NavigationContainer>*/}

    <PlayerBottomSheet />
  </>
);

export default Navigator;

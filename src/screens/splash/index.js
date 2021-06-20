import React from 'react';
import { View, Text, Dimensions, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import appColors from '../../constants/colors';
import Icons from '../../constants/icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const { height } = Dimensions.get('screen');
const LOGO_HEIGHT = height * 0.28;
const LOGO_ANIMATION_DURATION = 1500;

const Splash = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={appColors.lightGrey}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duraton={LOGO_ANIMATION_DURATION}
          source={Icons.Logo}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text style={styles.title}>Welcome to the World of Music 🎵</Text>
        <Text style={styles.text}>Your own very personalized music app ❤</Text>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.lightGrey,
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    flex: 1,
    paddingVertical: hp(10),
    paddingHorizontal: hp(10),
  },
  logo: {
    height: LOGO_HEIGHT,
    width: LOGO_HEIGHT,
  },
  title: {
    color: appColors.darkBlue,
    fontSize: wp(10),
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: hp(6),
  },
  text: {
    color: appColors.lightGrey1,
    textAlign: 'center',
    fontSize: wp(5),
    marginTop: hp(3),
    lineHeight: hp(3),
  },
});

export default Splash;

import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  PermissionsAndroid,
  Alert,
  Platform,
  BackHandler,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import appColors from '../../constants/colors';
import Icons from '../../constants/icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import screenNames from '../../constants/screen-names';
import { ActivityIndicator, Text } from 'react-native-paper';

const { height } = Dimensions.get('screen');
const LOGO_HEIGHT = height * 0.28;
const LOGO_ANIMATION_DURATION = 1500;
const SPLASH_TIMEOUT = 1600;
const requiredPermissions = [
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
];

const Splash = ({ navigation }) => {
  console.log('Splash loaded');

  // const [loadingInfo, setLoadingInfo] = useState({
  //   loading: false,
  //   info: null,
  // });

  useEffect(() => {
    setTimeout(() => {
      if (Platform.OS === 'android') {
        console.log('asking permissions');
        PermissionsAndroid.requestMultiple(requiredPermissions)
          .then(response => {
            console.log('permission response:', response);
          })
          .catch(e => console.log('permission error:', e));
      }
      navigation.navigate(screenNames.tracks);
    }, SPLASH_TIMEOUT);

    // checkForInitialDataStatus()
    //   .then(requires => {
    //     if (!requires.length) navigation.navigate(screenNames.tracks);
    //
    //     setTimeout(() => {
    //       initializeData(requires)
    //         .then(() => {
    //           navigation.navigate(screenNames.tracks);
    //         })
    //         .catch(e => Alert.alert('Error', 'Error occurred:' + e));
    //     }, SPLASH_TIMEOUT);
    //   })
    //   .catch(e => Alert.alert('Application Error', 'Error encountered: ' + e));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={appColors.lightGrey}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duration={LOGO_ANIMATION_DURATION}
          source={Icons.Logo}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>

      {/*<View*/}
      {/*  style={{*/}
      {/*    // borderWidth: 1,*/}
      {/*    flexDirection: 'row',*/}
      {/*    alignItems: 'center',*/}
      {/*    justifyContent: 'center',*/}
      {/*  }}>*/}
      {/*  <ActivityIndicator*/}
      {/*    animating={loadingInfo.loading}*/}
      {/*    size={wp(4)}*/}
      {/*    color={appColors.nastyPink}*/}
      {/*    style={{ marginRight: wp(2) }}*/}
      {/*  />*/}
      {/*  <Text style={{ fontSize: wp(4), color: appColors.nastyPink }}>*/}
      {/*    {loadingInfo.info}*/}
      {/*  </Text>*/}
      {/*</View>*/}

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

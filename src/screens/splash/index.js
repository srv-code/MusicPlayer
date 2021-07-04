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
  const [loadingInfo, setLoadingInfo] = useState({
    loading: false,
    info: null,
  });

  const initializeData = async required => {
    for (const require of required) {
      if (require.type === 'permission') {
        setLoadingInfo({ loading: true, info: 'Requesting for permissions' });
        const granted = await PermissionsAndroid.request(
          require.perm,
          // {
          //   title: 'Require Permission',
          //   message: `Music Player requires ${require.perm} permission`,
          // r  // buttonNeutral: 'Not Now',
          //   buttonPositive: 'Yes',
          //   buttonNegative: 'No',
          // }
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Denied',
            'Application permission denied!\nCannot proceed further.',
          );

          Alert.alert(
            'Permission Denied',
            'Application permission denied!\nCannot proceed further.',
            [{ text: 'Exit', onPress: BackHandler.exitApp }],
          );

          BackHandler.exitApp();
        }
      }
    }

    // if (required)
    //   // ask for permissions
    //   setLoadingInfo({ loading: true, info: 'Requesting for permissions' });
    // const result = await PermissionsAndroid.requestMultiple([
    //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //   PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    // ]);

    // console.log('>> permission result:', result);

    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //   console.log('Permission granted');
    // } else {
    //   console.log('Permission denied');
    // }

    // const granted = await PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //   {
    //     title: 'Require Permission',
    //     message: 'Music Player requires storage read permission',
    //     buttonNeutral: 'Not Now',
    //     buttonNegative: 'Cancel',
    //     buttonPositive: 'OK',
    //   },
    // );
  };

  const checkForInitialDataStatus = async () => {
    const requires = [];

    // check for permissions
    if (Platform.OS === 'android') {
      for (const perm of requiredPermissions) {
        if (!(await PermissionsAndroid.check(perm)))
          requires.push({ type: 'permission', perm });
      }
    }

    

    return requires;
  };

  useEffect(() => {
    checkForInitialDataStatus()
      .then(requires => {
        if (!requires.length) navigation.navigate(screenNames.tracks);

        setTimeout(() => {
          initializeData(requires)
            .then(() => {
              navigation.navigate(screenNames.tracks);
            })
            .catch(e => Alert.alert('Error', 'Error occurred:' + e));
        }, SPLASH_TIMEOUT);
      })
      .catch(e => Alert.alert('Application Error', 'Error encountered: ' + e));
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
          duraton={LOGO_ANIMATION_DURATION}
          source={Icons.Logo}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <View
        style={{
          // borderWidth: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <ActivityIndicator
          animating={loadingInfo.loading}
          size={wp(4)}
          color={appColors.nastyPink}
          style={{ marginRight: wp(2) }}
        />
        <Text style={{ fontSize: wp(4), color: appColors.nastyPink }}>
          {loadingInfo.info}
        </Text>
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

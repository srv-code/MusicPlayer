import React, { useEffect, useState } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  StatusBar,
  PermissionsAndroid,
  Platform,
  BackHandler,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import appColors from '../../constants/colors';
import Icons from '../../constants/icons';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { ActivityIndicator, Text } from 'react-native-paper';
import TrackUtils from '../../utils/track';
import AsyncStorage from '@react-native-async-storage/async-storage';
import keys from '../../constants/keys';

const { height } = Dimensions.get('screen');
const LOGO_HEIGHT = height * 0.28;
const LOGO_ANIMATION_DURATION = 1500;
const SPLASH_TIMEOUT = 1600;
const requiredPermissions = [
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
];

// FIXME: Sometimes the keys of music-info are in lowercase so no data is shown in the app
// TODO: Improvement: In case of any thumbnail where the corresponding track is not present, then delete that thumbnail file
// TODO: Update musicInfo in the background (preferably in a background thread) silently without blocking the UI operations

// const Splash = ({ navigation }) => {
const Splash = ({ setShow, setMusicInfo }) => {
  const [loadingInfo, setLoadingInfo] = useState({
    loading: false,
    info: null,
  });

  useEffect(() => {
    setTimeout(async () => {
      const error = {};
      try {
        // Check Android permissions
        if (Platform.OS === 'android') {
          console.log(`[Splash] Checking Android permissions...`);
          setLoadingInfo({
            loading: true,
            info: 'Checking for app permissions...',
          });

          error.title = 'Permission Error';
          error.message = `Application permission error`;

          const response = await PermissionsAndroid.requestMultiple(
            requiredPermissions,
          );
          console.log('[Splash] permission response:', response);
          for (const perm in response)
            if (response[perm] !== PermissionsAndroid.RESULTS.GRANTED)
              throw new Error(`Permission ${perm} denied.`);
        }

        // Check for music app-info from async-storage
        setLoadingInfo({
          loading: true,
          info: 'Loading music tracks...',
        });

        try {
          console.log(`[loadMusicInfo] Storing track info in context...`);
          setMusicInfo(await TrackUtils.loadMusicInfo());
        } catch (e) {
          error.title = e.title;
          error.message = e.message;
          throw e.cause;
        }
      } catch (err) {
        console.log(
          `[Splash] Error: ${error.title}. ${error.message}\n${JSON.stringify(
            err,
          )}`,
        );
        Alert.alert(error.title, `${error.message}\nReason: ${err.message}`, [
          {
            text: 'Exit',
            onPress: BackHandler.exitApp,
            style: 'cancel',
          },
        ]);
        error.caught = true;
      } finally {
        setLoadingInfo({ loading: false, info: null });
        if (!error.caught) setShow(false);
      }
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
          source={Icons.LargeLogo}
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

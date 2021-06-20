import React from 'react';
import { View, Text, Dimensions, StyleSheet, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import appColors from '../../constants/colors';
import Icons from '../../constants/icons';

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;

const Splash = () => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <StatusBar
        backgroundColor={appColors.lightGrey}
        barStyle="light-content"
      />
      <View style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          duraton="1500"
          source={Icons.Logo}
          style={styles.logo}
          resizeMode="stretch"
        />
      </View>
      <Animatable.View
        style={[
          styles.footer,
          // {
          //   backgroundColor: colors.background,
          // },
        ]}
        animation="fadeInUpBig">
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              textAlign: 'center',
              lineHeight: 50,
            },
          ]}>
          Welcome to the World of Music 🎵
        </Text>
        <Text style={styles.text}>Your own very personalized music app ❤</Text>
        {/*<View style={styles.button}>*/}
        {/*  <LinearGradient colors={['#08d4c4', '#01ab9d']} style={styles.signIn}>*/}
        {/*    <Text style={styles.textSign}>Get Started</Text>*/}
        {/*    <MaterialIcons name="navigate-next" color="#fff" size={20} />*/}
        {/*  </LinearGradient>*/}
        {/*</View>*/}
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
    // backgroundColor: appColors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
  },
  title: {
    color: '#05375a',
    fontSize: 30,
    fontWeight: 'bold',
  },
  text: {
    color: '#cfcfcf',
    textAlign: 'center',
    fontSize: 17,
    marginTop: 20,
  },
  button: {
    alignItems: 'flex-end',
    marginTop: 30,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    flexDirection: 'row',
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Splash;

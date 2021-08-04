import React from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { Text } from 'react-native-paper';
import Icon from '../../components/icon';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const About = ({ navigation }) => {
  return (
    <ScreenContainer
      showHeader
      title={screenNames.about}
      iconName="information-outline"
      onBackPress={navigation.goBack}>
      <View style={styles.iconContainer}>
        <Icon name="information-outline" size={hp(20)} />
        <Text style={{ fontSize: wp(7) }}>About</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
});

export default About;

import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { Searchbar, Switch, ToggleButton, Text } from 'react-native-paper';
import Icon from '../../components/icon';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { PreferencesContext } from '../../context/preferences';
import { useBackHandler } from '@react-native-community/hooks';
import labels from '../../constants/labels';

const Settings = ({ navigation }) => {
  const prefInfo = useContext(PreferencesContext);

  const [showSearch, setShowSearch] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');

  useBackHandler(() => {
    if (showSearch) {
      toggleSearch();
      return true;
    }
    return false;
  });

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchedTerm('');
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.info}
      iconName="cog-outline"
      onBackPress={navigation.goBack}
      actionIcons={[{ name: 'magnify', onPress: toggleSearch }]}>
      <View style={styles.iconContainer}>
        <Icon name="cog-outline" size={hp(20)} />
        <Text style={{ fontSize: wp(7) }}>Settings</Text>
      </View>

      {showSearch && (
        <Searchbar
          placeholder="Search within app settings"
          onChangeText={setSearchedTerm}
          value={searchedTerm}
          style={{
            marginTop: hp(2),
          }}
        />
      )}

      <View
        style={{
          marginVertical: hp(2),
        }}>
        <Text>
          {`Preferences Info:
${JSON.stringify(prefInfo)}`}
        </Text>

        {/*<Switch*/}
        {/*  value={prefInfo.enabledDarkTheme}*/}
        {/*  onValueChange={prefInfo.toggleDarkTheme}*/}
        {/*/>*/}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{ fontSize: wp(4.5) }}>Theme</Text>
          <ToggleButton.Row
            onValueChange={prefInfo.toggleDarkTheme}
            value={prefInfo.enabledDarkTheme}>
            <ToggleButton icon="white-balance-sunny" value={false} />
            <ToggleButton icon="moon-waning-crescent" value={true} />
          </ToggleButton.Row>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
});

export default Settings;

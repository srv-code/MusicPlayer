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
import keys from '../../constants/keys';
import IconUtils from '../../utils/icon';

const Settings = ({ navigation }) => {
  const { enabledDarkTheme, setEnabledDarkTheme } =
    useContext(PreferencesContext);

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
      title={screenNames.appInfo}
      iconName={IconUtils.getInfo(keys.SETTINGS).name.default}
      fixedHeight
      onBackPress={navigation.goBack}
      actionIcons={[
        {
          name: IconUtils.getInfo(keys.SEARCH).name.default,
          onPress: toggleSearch,
        },
      ]}>
      <View style={styles.iconContainer}>
        <Icon
          name={IconUtils.getInfo(keys.SETTINGS).name.default}
          size={hp(20)}
        />
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
        {/*        <Text>*/}
        {/*          {`Preferences Info:*/}
        {/*${JSON.stringify(prefInfo)}`}*/}
        {/*        </Text>*/}

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
          <View style={styles.themeToggleContainer}>
            {/* TODO Add system option also */}
            <ToggleButton
              icon={IconUtils.getInfo(keys.LIGHT_MODE).name.default}
              onPress={setEnabledDarkTheme.bind(this, false)}
              status={enabledDarkTheme ? 'unchecked' : 'checked'}
              value={false}
            />
            <ToggleButton
              icon={IconUtils.getInfo(keys.DARK_MODE).name.default}
              onPress={setEnabledDarkTheme.bind(this, true)}
              status={enabledDarkTheme ? 'checked' : 'unchecked'}
              value={true}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  themeToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Settings;

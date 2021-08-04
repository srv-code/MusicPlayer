import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import { Searchbar, Text } from 'react-native-paper';
import Icon from '../../components/icon';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import MusicContext from '../../context/music';
import { PreferencesContext } from '../../context/preferences';
import { useBackHandler } from '@react-native-community/hooks';

const Settings = ({ navigation }) => {
  const prefInfo = useContext(PreferencesContext);

  const [showSearch, setShowSearch] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');

  useBackHandler(() => {
    if (showSearch) {
      cancelSearch();
      return true;
    }
    return false;
  });

  const cancelSearch = () => {
    setShowSearch(!showSearch);
    setSearchedTerm('');
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.info}
      iconName="cog-outline"
      onBackPress={navigation.goBack}
      onSearch={cancelSearch}>
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
        <Text>{`Preferences Info:
${JSON.stringify(prefInfo)}`}</Text>
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

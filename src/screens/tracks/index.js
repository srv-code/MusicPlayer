import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Switch, Text, TouchableRipple } from 'react-native-paper';

const Tracks = ({ navigation }) => {
  const { enabledDarkTheme, toggleDarkTheme } = useContext(PreferencesContext);

  const [searchedTerm, setSearchedTerm] = useState('');

  const onSearchHandler = term => {
    setSearchedTerm(term);
    console.log(`Searched ${term}`);
  };

  return (
    <ScreenContainer
      showHeader
      // headerColor={enabledDarkTheme ? null : colors.darkBlue2}
      title={screenNames.tracks}
      subtitle="Select from your favorite tracks"
      searchPlaceholder="Search among all the tracks"
      searchedTerm={searchedTerm}
      onSearch={onSearchHandler}
      showMore>
      <View style={styles.container}>
        <Text>Tracks screen</Text>

        <TouchableRipple
          onPress={toggleDarkTheme}
          rippleColor={colors.lightBlack}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text>Dark mode</Text>
            <Switch value={enabledDarkTheme} onValueChange={toggleDarkTheme} />
          </View>
        </TouchableRipple>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default Tracks;

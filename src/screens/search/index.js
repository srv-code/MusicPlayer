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
import { useBackHandler } from '@react-native-community/hooks';

const Search = ({ navigation }) => {
  const musicInfo = useContext(MusicContext);

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
      title={screenNames.search}
      iconName="text-search"
      onBackPress={navigation.goBack}
      onSearch={cancelSearch}>
      <View style={styles.iconContainer}>
        <Icon name="text-search" size={hp(20)} />
        <Text style={{ fontSize: wp(7) }}>Search Music</Text>
      </View>

      {showSearch && (
        <Searchbar
          placeholder="Search within music"
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
        <Text>{`Music Info:
${JSON.stringify(musicInfo)}`}</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
});

export default Search;

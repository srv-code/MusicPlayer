import React, { useContext, useState } from 'react';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import { PreferencesContext } from '../../context/preferences';
import {
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Appbar, Searchbar, Text } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../constants/colors';
import { useBackHandler } from '@react-native-community/hooks';
import screenNames from '../../constants/screen-names';

const ScreenContainer = ({
  showHeader,
  onBackPress,
  title,
  subtitle,
  searchPlaceholder,
  searchedTerm,
  onSearch,
  onPressSettings,
  children,
}) => {
  // const [showSearch, setShowSearch] = useState(false);

  // useBackHandler(() => {
  //   if (showSearch) {
  //     setShowSearch(false);
  //     return true;
  //   }
  //   return false;
  // });

  const { enabledDarkTheme } = useContext(PreferencesContext);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
    // backgroundColor: 'red',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      {/*<Text>jdfhkjdfhdkfhkj</Text>*/}
      {/*{showHeader && (*/}
      {/*  <Appbar.Header*/}
      {/*    style={{*/}
      {/*      backgroundColor: enabledDarkTheme ? null : colors.darkBlue2,*/}
      {/*    }}>*/}
      {/*    {onBackPress && <Appbar.BackAction onPress={onBackPress} />}*/}
      {/*    <Appbar.Content title={title} subtitle={subtitle} />*/}
      {/*    {onSearch && (*/}
      {/*      <Appbar.Action*/}
      {/*        icon="magnify"*/}
      {/*        onPress={setShowSearch.bind(this, !showSearch)}*/}
      {/*      />*/}
      {/*    )}*/}
      {/*    {onPressSettings && (*/}
      {/*      <Appbar.Action icon="cog" onPress={onPressSettings} />*/}
      {/*    )}*/}
      {/*  </Appbar.Header>*/}
      {/*)}*/}

      {/*{showSearch && (*/}
      {/*  <Searchbar*/}
      {/*    placeholder={searchPlaceholder || 'Search'}*/}
      {/*    onChangeText={onSearch}*/}
      {/*    value={searchedTerm}*/}
      {/*    style={styles.searchBar}*/}
      {/*  />*/}
      {/*)}*/}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={styles.scrollView}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: wp(3),
  },
  searchBar: {
    marginVertical: hp(1),
    marginHorizontal: wp(3),
  },
});

export default ScreenContainer;

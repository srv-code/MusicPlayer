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
import { Appbar, Searchbar } from 'react-native-paper';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const ScreenContainer = ({
  showHeader,
  headerColor,
  onBackPress,
  title,
  subtitle,
  searchPlaceholder,
  searchedTerm,
  onSearch,
  showMore,
  children,
}) => {
  const [showSearch, setShowSearch] = useState(false);

  const { enabledDarkTheme } = useContext(PreferencesContext);

  const backgroundStyle = {
    flex: 1,
    backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
  };

  const showMoreOptionsHandler = () => {};

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={enabledDarkTheme ? 'dark-content' : 'light-content'}
      />
      {showHeader && (
        <Appbar.Header style={{ backgroundColor: headerColor }}>
          {onBackPress && <Appbar.BackAction onPress={onBackPress} />}
          <Appbar.Content title={title} subtitle={subtitle} />
          {onSearch && (
            <Appbar.Action
              icon="magnify"
              onPress={setShowSearch.bind(this, !showSearch)}
            />
          )}
          {showMore && (
            <Appbar.Action
              icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
              onPress={showMoreOptionsHandler}
            />
          )}
        </Appbar.Header>
      )}

      {showSearch && (
        <Searchbar
          placeholder={searchPlaceholder || 'Search'}
          onChangeText={onSearch}
          value={searchedTerm}
          style={styles.searchBar}
        />
      )}

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

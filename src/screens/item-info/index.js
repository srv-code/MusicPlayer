import React, { useContext, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import labels from '../../constants/labels';
import keys from '../../constants/keys';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useFocusEffect } from '@react-navigation/native';
import Info from '../../components/info';

export const displayModes = {
  SCREEN: 'SCREEN',
  MODAL: 'MODAL',
};

export const getScreenTitle = type => {
  switch (type) {
    case keys.TRACKS:
      return `${labels.track} ${labels.info}`;
    case keys.ALBUMS:
      return `${labels.album} ${labels.info}`;
    case keys.ARTISTS:
      return `${labels.artist} ${labels.info}`;
    case keys.FOLDERS:
      return `${labels.folder} ${labels.info}`;
    case keys.PLAYLISTS:
      return `${labels.playlist} ${labels.info}`;
    default:
      throw new Error(`Invalid type: ${type}`);
  }
};

// FIXME: I suspect the scrolling in MODAL mode is off
// TODO: Add capability for playlists also
// TODO: Move the rendering to a component and use here and all the places required
const ItemInfo = ({ navigation, route, extraData }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const { displayMode, type, data } = route.params;

  console.log(
    `[ItemInfo] displayMode=${JSON.stringify(
      displayMode,
    )}, type=${JSON.stringify(type)}, data=${JSON.stringify(data)}`,
  );

  useEffect(() => {
    if (displayMode === displayModes.MODAL && extraData.snapIndex < 2)
      navigation.navigate(screenNames.nowPlaying);
  }, [extraData?.snapIndex]);

  const Container = ({ children }) => {
    switch (displayMode) {
      case displayModes.SCREEN:
        return (
          <ScreenContainer
            showHeader
            fixedHeight
            title={getScreenTitle(type)}
            onBackPress={navigation.goBack}>
            <View style={styles.container}>{children}</View>
          </ScreenContainer>
        );

      case displayModes.MODAL:
        return (
          <BottomSheetScrollView
            bounces={true}
            focusHook={useFocusEffect}
            contentContainerStyle={{
              // flex: 1,
              paddingHorizontal: wp(4),
              paddingBottom: hp(1),
              overflow: 'visible',
            }}>
            {children}
          </BottomSheetScrollView>
        );

      default:
        throw new Error(`Invalid displayMode: ${displayMode}`);
    }
  };

  return (
    <Container>
      <Info type={type} data={data} />
    </Container>
  );
};

const styles = StyleSheet.create({
  musicIcon: {
    backgroundColor: colors.lightPurple,
  },
});

export default ItemInfo;

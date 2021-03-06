import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { PreferencesContext } from '../../context/preferences';
import { MusicContext } from '../../context/music';
import colors from '../../constants/colors';
import CustomHandle from './sub-components/custom-handle';

export const handlers = {
  setIsContentPanningGestureEnabled: null,
};

const PlayerBottomSheet = ({ navigator: Navigator }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const startSnapIndex = -1; // TODO:: 0 indicates minimized, to hide pass -1 (when there's no currently playing)
  const snapPoints = ['10%', '45%', '92%'];
  const [snapIndex, setSnapIndex] = useState(startSnapIndex);
  const [isContentPanningGestureEnabled, setIsContentPanningGestureEnabled] =
    useState(true);

  // const handleSnapPress = useCallback(index => {
  //   // console.log('handleSnapPress:', { index, bottomSheet });
  //   bottomSheet.current?.snapToIndex(index);
  // }, []);

  const {
    _playerBottomSheet,
    playerControls,
    setPlayerControls,
    setBottomSheetMiniPositionIndex,
  } = useContext(MusicContext);

  const bottomSheetExpandHandler = useCallback(() => {
    _playerBottomSheet.current?.expand();
  }, []);

  const bottomSheetCollapseHandler = useCallback(() => {
    _playerBottomSheet.current?.collapse();
  }, []);

  const bottomSheetCloseHandler = useCallback(() => {
    _playerBottomSheet.current?.close();
  }, []);

  useEffect(() => {
    if (!playerControls.expand) {
      setPlayerControls({
        expand: bottomSheetExpandHandler,
        collapse: bottomSheetCollapseHandler,
        close: bottomSheetCloseHandler,
      });
    }
    handlers.setIsContentPanningGestureEnabled =
      setIsContentPanningGestureEnabled;
  }, []);

  const animationConfigs = useBottomSheetSpringConfigs({
    damping: 80,
    overshootClamping: true,
    restDisplacementThreshold: 0.1,
    restSpeedThreshold: 0.1,
    stiffness: 500,
  });

  const handleSheetChange = useCallback(index => {
    console.log(`handleSheetChange: index=${index}`);
    setSnapIndex(index);
    if (index <= 0) setBottomSheetMiniPositionIndex(index);
  }, []);

  // const handleSheetAnimate = useCallback((fromIndex, toIndex) => {
  //   console.log('handleSheetAnimate', `from ${fromIndex} to ${toIndex}`);
  //   if (toIndex !== 2 && externalHandlers.currentPlaylist.setCloseReason)
  //     externalHandlers.currentPlaylist.setCloseReason('minimizing');
  //   // setPlayerAuxiliaryData(prev => ({
  //   //   ...prev,
  //   //   animatingSnapIndices: {
  //   //     fromIndex,
  //   //     toIndex,
  //   //   },
  //   // }));
  // }, []);

  const renderCustomHandle = useCallback(
    props => <CustomHandle {...props} enabledDarkTheme={enabledDarkTheme} />,
    [enabledDarkTheme],
  );

  const renderBackdrop = useCallback(
    props => <BottomSheetBackdrop {...props} pressBehavior={'collapse'} />,
    [],
  );

  return (
    <BottomSheet
      style={styles.bottomSheet}
      ref={_playerBottomSheet}
      index={snapIndex}
      snapPoints={snapPoints}
      animationConfigs={animationConfigs}
      animateOnMount={true}
      enableContentPanningGesture={isContentPanningGestureEnabled}
      enableHandlePanningGesture={true}
      handleComponent={renderCustomHandle}
      backgroundStyle={{
        marginTop: hp(0.3),
        backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
      }}
      handleIndicatorStyle={styles.bottomSheetHandleIndicator}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      backdropComponent={snapIndex === 2 ? renderBackdrop : null}
      enablePanDownToClose={true}
      onChange={handleSheetChange}
      // onAnimate={handleSheetAnimate}
    >
      <Navigator
        snapIndex={snapIndex}
        setSnapIndex={setSnapIndex}
        enabledDarkTheme={enabledDarkTheme}
      />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 2,
    // backgroundColor: 'red'
  },
  bottomSheetHandleIndicator: {
    backgroundColor: colors.white,
  },
});

export default PlayerBottomSheet;

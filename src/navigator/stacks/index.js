import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import screenNames from '../../constants/screen-names';
import TabbedView from '../tabbed-view';
import Settings from '../../screens/settings';
import Search from '../../screens/search';
import Info from '../../screens/info';
import About from '../../screens/about';
import ItemInfo from '../../screens/item-info';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  useBottomSheetSpringConfigs,
} from '@gorhom/bottom-sheet';
import { NavigationContainer } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import CustomHandle from './custom-handle';
import { PreferencesContext } from '../../context/preferences';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import colors from '../../constants/colors';
import labels from '../../constants/labels';
import { MusicContext } from '../../context/music';

const BottomSheetStack = createStackNavigator();

const CurrentlyPlaying = ({ navigation, extraData }) => {
  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      <Text>{screenNames.currentlyPlaying}</Text>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentPlaylist)}>
        Go to Current Playlist
      </Button>
      <Text>{extraData.snapIndex}</Text>
    </BottomSheetView>
  );
};

const CurrentPlaylist = ({ navigation, extraData }) => {
  if (extraData.snapIndex === 0)
    navigation.navigate(screenNames.currentlyPlaying);

  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      <Text>{screenNames.currentPlaylist}</Text>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentlyPlaying)}>
        Go to Currently Playing
      </Button>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.songInfo)}>
        Go to Song Info
      </Button>
      <Text>{extraData.snapIndex}</Text>
    </BottomSheetView>
  );
};

const SongInfo = ({ navigation, extraData }) => {
  if (extraData.snapIndex === 0)
    navigation.navigate(screenNames.currentlyPlaying);

  return (
    <BottomSheetView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        overflow: 'visible',
      }}>
      <Text>{screenNames.songInfo}</Text>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentPlaylist)}>
        Go to Current Playlist
      </Button>
      <Button
        mode="outlined"
        uppercase={false}
        style={styles.button}
        onPress={navigation.navigate.bind(this, screenNames.currentlyPlaying)}>
        Go to Currently Playing
      </Button>
      <Text>{extraData.snapIndex}</Text>
    </BottomSheetView>
  );
};

const Stacks = () => {
  const BottomSheetNavigator = ({ snapIndex, enabledDarkTheme }) => {
    const screenOptions = useMemo(
      () => ({
        ...TransitionPresets.SlideFromRightIOS,

        headerShown: snapIndex !== 0,
        safeAreaInsets: { top: 0 },
        cardStyle: {
          backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
          overflow: 'visible',
        },
        headerStyle: {
          backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
          elevation: 0,
        },
        headerTintColor: enabledDarkTheme ? Colors.lighter : Colors.darker,
        headerTitleStyle: {
          fontSize: 16,
          color: enabledDarkTheme ? colors.white : colors.black,
        },
      }),
      [snapIndex],
    );

    return (
      <NavigationContainer independent={true}>
        <BottomSheetStack.Navigator
          initialRouteName={screenNames.currentlyPlaying}
          screenOptions={screenOptions}
          headerMode="screen">
          <BottomSheetStack.Screen
            name={screenNames.currentlyPlaying}
            options={{
              headerLeft: () => null,
              title: labels.currentlyPlaying,
            }}>
            {props => <CurrentlyPlaying {...props} extraData={{ snapIndex }} />}
          </BottomSheetStack.Screen>

          <BottomSheetStack.Screen
            name={screenNames.currentPlaylist}
            options={{ title: labels.currentPlaylist }}>
            {props => <CurrentPlaylist {...props} extraData={{ snapIndex }} />}
          </BottomSheetStack.Screen>

          <BottomSheetStack.Screen
            name={screenNames.songInfo}
            options={{ title: labels.songInfo }}>
            {props => <SongInfo {...props} extraData={{ snapIndex }} />}
          </BottomSheetStack.Screen>
        </BottomSheetStack.Navigator>
      </NavigationContainer>
    );
  };

  const TabbedStack = createStackNavigator();
  const TabbedStackScreens = () => {
    const startSnapIndex = 0; // TODO: 0 indicates minimized, to hide pass -1 (when there's no currently playing)
    const snapPoints = useMemo(() => ['10%', '45%', '92%'], []);
    const [snapIndex, setSnapIndex] = useState(startSnapIndex);

    // const handleSnapPress = useCallback(index => {
    //   // console.log('handleSnapPress:', { index, bottomSheet });
    //   bottomSheet.current?.snapToIndex(index);
    // }, []);

    const bottomSheetExpandHandler = useCallback(() => {
      bottomSheet.current?.expand();
    }, []);

    const bottomSheetCollapseHandler = useCallback(() => {
      bottomSheet.current?.collapse();
    }, []);

    const bottomSheetCloseHandler = useCallback(() => {
      bottomSheet.current?.close();
    }, []);

    const { bottomSheet, musicInfo, setMusicInfo } = useContext(MusicContext);

    useEffect(() => {
      if (!musicInfo?.bottomSheetControls) {
        setMusicInfo(data => ({
          ...data,
          bottomSheetControls: {
            expand: bottomSheetExpandHandler,
            collapse: bottomSheetCollapseHandler,
            close: bottomSheetCloseHandler,
          },
        }));
      }
    }, []);

    const animationConfigs = useBottomSheetSpringConfigs({
      damping: 80,
      overshootClamping: true,
      restDisplacementThreshold: 0.1,
      restSpeedThreshold: 0.1,
      stiffness: 500,
    });

    const handleSheetChange = useCallback(index => {
      setSnapIndex(index);
    }, []);

    const handleSheetAnimate = useCallback((fromIndex, toIndex) => {
      console.log('handleSheetAnimate', `from ${fromIndex} to ${toIndex}`);
    }, []);

    const renderCustomHandle = useCallback(
      props => <CustomHandle {...props} />,
      [],
    );

    const renderBackdrop = useCallback(
      props => <BottomSheetBackdrop {...props} pressBehavior={'collapse'} />,
      [],
    );

    const { enabledDarkTheme } = useContext(PreferencesContext);

    return (
      <>
        <TabbedStack.Navigator screenOptions={{ headerShown: false }}>
          <TabbedStack.Screen
            name={screenNames.tracks}
            component={TabbedView}
          />
        </TabbedStack.Navigator>

        <BottomSheet
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            elevation: 2,
          }}
          ref={bottomSheet}
          index={snapIndex}
          snapPoints={snapPoints}
          animationConfigs={animationConfigs}
          animateOnMount={true}
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          handleComponent={renderCustomHandle}
          backgroundStyle={{
            marginTop: 3,
            backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
          }}
          handleIndicatorStyle={{
            backgroundColor: colors.white,
          }}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          backdropComponent={snapIndex === 2 ? renderBackdrop : null}
          enablePanDownToClose={true}
          onChange={handleSheetChange}
          onAnimate={handleSheetAnimate}>
          <BottomSheetNavigator
            snapIndex={snapIndex}
            enabledDarkTheme={enabledDarkTheme}
          />
        </BottomSheet>
      </>
    );
  };

  const SearchStack = createStackNavigator();
  const SearchStackScreens = () => (
    <SearchStack.Navigator screenOptions={{ headerShown: false }}>
      <SearchStack.Screen name={screenNames.search} component={Search} />
      <SearchStack.Screen name={screenNames.itemInfo} component={ItemInfo} />
    </SearchStack.Navigator>
  );

  const RootStack = createStackNavigator();
  return (
    <RootStack.Navigator headerMode="none">
      <RootStack.Screen
        name={screenNames.tracks}
        component={TabbedStackScreens}
      />
      <RootStack.Screen name={screenNames.settings} component={Settings} />
      <RootStack.Screen
        name={screenNames.search}
        component={SearchStackScreens}
      />
      <RootStack.Screen name={screenNames.info} component={Info} />
      <RootStack.Screen name={screenNames.about} component={About} />
    </RootStack.Navigator>
  );
};

const styles = StyleSheet.create({
  button: {
    alignSelf: 'flex-start',
  },
});

export default Stacks;

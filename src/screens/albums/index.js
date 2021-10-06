import React, { useContext, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Modal, Portal, Text } from 'react-native-paper';
import keys from '../../constants/keys';
import IconUtils from '../../utils/icon';
import labels from '../../constants/labels';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { height, width } from '../../constants/dimensions';

// const Playlists = ({ navigation }) => {
const Albums = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  // const [value, setValue] = useState(new Animated.Value(0));
  // const [dummyAnimValue] = useState(new Animated.Value(0));
  const [modalAnimValue] = useState(new Animated.Value(0));
  const [isAnimModalOpen, setIsAnimModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [note, setNote] = useState(null);

  const dynamicStyles = {
    screen: {
      ...styles.screen,
      backgroundColor: enabledDarkTheme ? colors.darker : colors.lighter,
    },
    container: {
      ...styles.container,
      backgroundColor: enabledDarkTheme ? colors.darkest : colors.light,
    },
  };

  // console.log(`animated value: ${JSON.stringify(value)}`);

  const toggleModalOpenState = (action = 'close') => {
    console.log(`[toggleModalOpenState] will ${action} modal`);
    if (action === 'open') setIsAnimModalOpen(true);
    modalAnimValue.setValue(action === 'open' ? 0 : -(height - 200));
    // setNote(null);

    Animated.spring(modalAnimValue, {
      toValue: action === 'open' ? -(height - 200) : 0,
      friction: 5,
      useNativeDriver: true,
    }).start(() => {
      // setNote(action === 'open' ? 'Modal opened' : 'Modal closed');
      if (action === 'close') setIsAnimModalOpen(false);
      console.log(action === 'open' ? 'Modal opened' : 'Modal closed');
    });
  };

  return (
    <ScreenContainer style={dynamicStyles.screen}>
      <View style={dynamicStyles.container}>
        <Text>Animation Tests</Text>
        <Text>Note: {JSON.stringify(note)}</Text>

        {/*<Text*/}
        {/*  onPress={() => {*/}
        {/*    setNote(null);*/}
        {/*    // TODO Test: easing properties, parallel, spring*/}
        {/*    if (0)*/}
        {/*      Animated.timing(dummyAnimValue, {*/}
        {/*        toValue: 200,*/}
        {/*        duration: 1000,*/}
        {/*        // delay: 500,*/}
        {/*        easing: Easing.bounce,*/}
        {/*        useNativeDriver: true,*/}
        {/*      }).start(({ finished }) => {*/}
        {/*        setNote({ finished });*/}
        {/*      });*/}

        {/*    if (1)*/}
        {/*      Animated.spring(dummyAnimValue, {*/}
        {/*        toValue: 200,*/}
        {/*        friction: 5,*/}
        {/*        useNativeDriver: true,*/}
        {/*      }).start(({ finished }) => {*/}
        {/*        setNote({ finished });*/}
        {/*      });*/}
        {/*  }}>*/}
        {/*  Start*/}
        {/*</Text>*/}

        {/*<Text*/}
        {/*  onPress={() => {*/}
        {/*    // setValue(new Animated.Value(0));*/}
        {/*    dummyAnimValue.setValue(0);*/}
        {/*    // value.removeAllListeners();*/}
        {/*    setNote(null);*/}
        {/*    // value.resetAnimation();*/}
        {/*  }}>*/}
        {/*  Reset*/}
        {/*</Text>*/}

        <Text
          onPress={toggleModalOpenState.bind(
            this,
            isAnimModalOpen ? 'close' : 'open',
          )}>
          {isAnimModalOpen ? 'Hide' : 'Show'} Anim Modal
        </Text>

        <Text
          onPress={toggleModalOpenState.bind(
            this,
            isAnimModalOpen ? 'close' : 'open',
          )}>
          {isAnimModalOpen ? 'Close' : 'Open'} Anim Modal
        </Text>

        <Text onPress={setIsModalOpen.bind(this, true)}>Open Modal</Text>

        {/*<View*/}
        {/*  style={{*/}
        {/*    flex: 1,*/}
        {/*    // justifyContent: 'center',*/}
        {/*    // alignItems: 'center',*/}
        {/*  }}>*/}
        {/*  <Animated.View*/}
        {/*    style={{*/}
        {/*      height: 100,*/}
        {/*      width: 100,*/}
        {/*      borderRadius: 51,*/}
        {/*      backgroundColor: 'red',*/}
        {/*      transform: [{ translateX: dummyAnimValue }],*/}
        {/*    }}*/}
        {/*  />*/}
        {/*</View>*/}

        <View
          style={{
            marginTop: 20,
            backgroundColor: 'lightblue',
            alignItems: 'center',
          }}>
          {Array(5)
            .fill()
            .map((item, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: 'orange',
                  width: '80%',
                  alignItems: 'center',
                  padding: 10,
                  marginVertical: 5,
                }}>
                <Text>Item {index + 1}</Text>
              </View>
            ))}
        </View>
      </View>

      <Portal>
        <Animated.View
          style={{
            height: height - 200,
            width,
            borderRadius: 10,
            backgroundColor: 'blue',
            display: isAnimModalOpen ? 'flex' : 'none',
            transform: [{ translateY: modalAnimValue }],
            // alignSelf: 'flex-start',
            // justifyContent: 'flex-start',
            alignItems: 'flex-end',
          }}>
          <Text>Modal Contents</Text>
        </Animated.View>
      </Portal>

      <Portal>
        <Modal
          visible={isModalOpen}
          onDismiss={setIsModalOpen.bind(this, false)}
          contentContainerStyle={{
            backgroundColor: 'white',
          }}>
          <Text>Modal Contents</Text>
        </Modal>
      </Portal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    elevation: 4,
    marginTop: hp(0.4),
    paddingHorizontal: wp(3),
    paddingVertical: hp(2),
  },
});

export default Albums;

import React, {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import colors from '../../constants/colors';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';
import IconUtils from '../../utils/icon';
import keys from '../../constants/keys';
import labels from '../../constants/labels';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// TODO Remove this test component
const MyComponent = forwardRef(({ initialName }, ref) => {
  const [name, setName] = useState(initialName);
  // const [name, setName] = useState('');

  // useEffect(() => {
  //   setName(initialName);
  // }, []);

  useImperativeHandle(ref, () => ({
    // rename: setName,
    setName,
  }));

  return (
    <View>
      <Text>{name}</Text>
      <Text
        onPress={setName.bind(this, `INSIDE=${new Date().getMilliseconds()}`)}>
        Rename
      </Text>
    </View>
  );
});

// const Playlists = ({ navigation }) => {
const Folders = () => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  const myRef = useRef(null);

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

  return (
    <ScreenContainer style={dynamicStyles.screen}>
      <View style={dynamicStyles.container}>
        <Text>Folders screen</Text>

        {/*<Text>{JSON.stringify(Object.keys(props))}</Text>*/}

        {/*<Text*/}
        {/*  onPress={() => {*/}
        {/*    props.jumpTo(screenNames.tracks);*/}
        {/*  }}>*/}
        {/*  Jump to Tracks*/}
        {/*</Text>*/}

        <MyComponent ref={myRef} initialName={'initial'} />

        <Text
          onPress={() => {
            myRef.current.setName(`OUTSIDE=${new Date().getMilliseconds()}`);
          }}>
          Change using myRef
        </Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  screen: {
    // flex: 1,
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

export default Folders;

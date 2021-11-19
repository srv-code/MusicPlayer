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

// TODO: Remove this test component
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

  return (
    <ScreenContainer
      noScroll
      hasRoundedContainer
      varHeights={{ collapsed: hp(14), closed: hp(6) }}>
      <Text>Folders screen</Text>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({});

export default Folders;

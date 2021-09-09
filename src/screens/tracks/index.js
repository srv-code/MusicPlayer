import React, { useContext, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import { PreferencesContext } from '../../context/preferences';
import { Button, Text } from 'react-native-paper';
import { MusicContext } from '../../context/music';
import globalStyles from '../../styles';
import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import TrackPlayer from 'react-native-track-player';
import colors from '../../constants/colors';
import Icon from '../../components/icon';

const Tracks = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);
  const { playerControls } = useContext(MusicContext);

  const dynamicStyles = useMemo(
    () => ({
      container: [
        styles.container,
        {
          backgroundColor: enabledDarkTheme ? Colors.dark : Colors.light,
        },
      ],
      playerButton: [
        styles.playerButton,
        {
          backgroundColor: enabledDarkTheme ? Colors.darker : Colors.lighter,
        },
      ],
    }),
    [enabledDarkTheme],
  );

  return (
    <ScreenContainer style={dynamicStyles.container}>
      {/*<View style={styles.container}>*/}
      {/*{playerControls && (*/}
      {/*  <View>*/}
      {/*    <Text>Player Controls</Text>*/}
      {/*    <View style={{ flexDirection: 'row' }}>*/}
      {/*      <Button*/}
      {/*        onPress={playerControls.close}*/}
      {/*        uppercase={false}*/}
      {/*        mode="outlined"*/}
      {/*        style={globalStyles.button}>*/}
      {/*        Close*/}
      {/*      </Button>*/}
      {/*      <Button*/}
      {/*        onPress={playerControls.expand}*/}
      {/*        uppercase={false}*/}
      {/*        mode="outlined"*/}
      {/*        style={globalStyles.button}>*/}
      {/*        Expand*/}
      {/*      </Button>*/}
      {/*      <Button*/}
      {/*        onPress={playerControls.collapse}*/}
      {/*        uppercase={false}*/}
      {/*        mode="outlined"*/}
      {/*        style={globalStyles.button}>*/}
      {/*        Collapse*/}
      {/*      </Button>*/}
      {/*    </View>*/}
      {/*  </View>*/}
      {/*)}*/}

      {/*{Array(50)*/}
      {/*  .fill()*/}
      {/*  .map((_, index) => (*/}
      {/*    <View*/}
      {/*      key={index}*/}
      {/*      style={{*/}
      {/*        backgroundColor: index % 2 ? 'lightblue' : 'lightgreen',*/}
      {/*        padding: 10,*/}
      {/*        marginBottom: 2,*/}
      {/*      }}>*/}
      {/*      <Text>Song {index + 1}</Text>*/}
      {/*    </View>*/}
      {/*  ))}*/}
      {/*</View>*/}

      {/* Player Controls */}
      <View style={styles.playerControlsContainer}>
        <TouchableOpacity onPress={() => {}}>
          <Icon
            name="sort-amount-down"
            type="FontAwesome5"
            size={wp(4)}
            // color={colors.lightPurple}
            style={{ marginRight: wp(1) }}
          />
        </TouchableOpacity>

        <View style={styles.playerRightButtonContainer}>
          <TouchableOpacity
            style={dynamicStyles.playerButton}
            onPress={() => {}}>
            <Icon name="shuffle" type="Entypo" size={wp(4)} />
          </TouchableOpacity>
          <TouchableOpacity
            style={dynamicStyles.playerButton}
            onPress={() => {}}>
            <Icon name="controller-play" type="Entypo" size={wp(4)} />
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopStartRadius: 25,
    borderTopEndRadius: 25,
    elevation: 4,
    marginTop: hp(0.4),
  },
  iconButton: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerRightButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playerButton: {
    elevation: 2,
    borderRadius: hp(5),
    padding: hp(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: wp(2),
  },
});

export default Tracks;

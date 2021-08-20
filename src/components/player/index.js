import React, { useRef } from 'react';
import { Text } from 'react-native-paper';
import { View } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// TODO:
//  - Show the bottom-sheet in a blur-view

const Player = () => {
  const bottomSheet = useRef(null);

  return (
    <View
      style={{
        backgroundColor: 'pink',
        // flex: 1,
        // zIndex: 10,
        // elevation: 2,
      }}>
      <View>
        <Text onPress={() => bottomSheet.current.snapTo(0)}>snapTo 0</Text>
        <Text onPress={() => bottomSheet.current.snapTo(1)}>snapTo 1</Text>
        <Text onPress={() => bottomSheet.current.snapTo(2)}>snapTo 2</Text>
      </View>

      <BottomSheet
        ref={bottomSheet}
        initialSnap={1}
        snapPoints={[hp(75), hp(10), 0]}
        borderRadius={10}
        renderContent={() => (
          <View
            style={{
              backgroundColor: 'lightgreen',
              // padding: 16,
              height: '100%',
              // width: '98%',
              // borderWidth: 1,
              // borderColor: 'blue',
              elevation: 1,
            }}>
            <Text>Swipe down to close</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Player;

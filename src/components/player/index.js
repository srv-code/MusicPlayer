import React, { useRef } from 'react';
import { Text } from 'react-native-paper';
import { View } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { BlurView } from '@react-native-community/blur';

// TODO:
//  - Show the bottom-sheet in a blur-view

const Player = () => {
  const bottomSheet = useRef(null);

  return (
    <BottomSheet
      ref={bottomSheet}
      initialSnap={1}
      snapPoints={[hp(75), hp(10), 0]}
      borderRadius={10}

      onOpenStart={() => console.log('onOpenStart')}
      onOpenEnd={() => console.log('onOpenEnd')}
      onCloseStart={() => console.log('onCloseStart')}
      onCloseEnd={() => console.log('onCloseEnd')}

      renderContent={() => (
        <View
          style={{
            // backgroundColor: 'lightblue',
            // padding: 16,
            height: '100%',
            // width: '98%',
            // borderWidth: 1,
            // borderColor: 'blue',
            elevation: 1,
          }}>
          <Text>Above BlurView</Text>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            blurType="light"
            blurAmount={10}
            reducedTransparencyFallbackColor="white">
            <Text>Inside BlurView</Text>
          </BlurView>
          <Text>Below BlurView</Text>
        </View>
      )}
    />
  );
};

export default Player;

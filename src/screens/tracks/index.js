import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import { PreferencesContext } from '../../context/preferences';
import { Text } from 'react-native-paper';

const Tracks = ({ navigation }) => {
  const { enabledDarkTheme } = useContext(PreferencesContext);

  return (
    <ScreenContainer>
      <View style={styles.container}>
        {Array(50)
          .fill()
          .map((_, index) => (
            <View
              key={index}
              style={{
                backgroundColor: index % 2 ? 'lightblue' : 'lightgreen',
                padding: 10,
                marginBottom: 2,
              }}>
              <Text>Song {index + 1}</Text>
            </View>
          ))}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Tracks;

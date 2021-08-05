import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ScreenContainer from '../../components/screen-container';
import screenNames from '../../constants/screen-names';
import {
  Caption,
  Headline,
  Paragraph,
  Searchbar,
  Subheading,
  Text,
  Title,
} from 'react-native-paper';
import Icon from '../../components/icon';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import { MusicContext } from '../../context/music';
import { PreferencesContext } from '../../context/preferences';
import { useBackHandler } from '@react-native-community/hooks';
import { List } from 'react-native-paper';
import colors from '../../constants/colors';

const Info = ({ navigation }) => {
  const { musicInfo } = useContext(MusicContext);
  const { enabledDarkTheme } = useContext(PreferencesContext);

  console.log('[Info]', { musicInfo, enabledDarkTheme });

  const [showSearch, setShowSearch] = useState(false);
  const [searchedTerm, setSearchedTerm] = useState('');
  const [expandedAccordionIds, setExpandedAccordionIds] = useState([]);

  useBackHandler(() => {
    if (showSearch) {
      toggleSearch();
      return true;
    }
    return false;
  });

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    setSearchedTerm('');
  };

  const isAccordionExpanded = id => expandedAccordionIds.includes(id);
  const toggleAccordionExpansion = id =>
    setExpandedAccordionIds(
      expandedAccordionIds.includes(id)
        ? expandedAccordionIds.filter(_id => _id !== id)
        : [...expandedAccordionIds, id],
    );

  const renderData = () => {
    const accordionIds = {
      tracks: 'tracks',
      albums: 'albums',
      artists: 'artists',
      folders: 'folders',
    };

    return (
      <View>
        <List.Section titleStyle={styles.titleText} title="Music Info">
          <List.Accordion
            id={accordionIds.tracks}
            expanded={isAccordionExpanded(accordionIds.tracks)}
            onPress={toggleAccordionExpansion.bind(this, accordionIds.tracks)}
            title={`${accordionIds.tracks} (${musicInfo?.tracks?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="music" />}>
            {musicInfo?.tracks ? (
              <FlatList
                data={musicInfo.tracks}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: track }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      paddingVertical: hp(1),
                      borderRadius: 10,
                      flexWrap: 'wrap',
                      paddingHorizontal: wp(2),
                    }}>
                    <Text>
                      {`title: ${track.title}
id: ${track.id}
duration: ${track.duration}
genre: ${track.genre}
fileName: ${track.fileName}
album: ${track.album}
author: ${track.author}
path: ${track.path}`}
                    </Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={accordionIds.albums}
            expanded={isAccordionExpanded(accordionIds.albums)}
            onPress={toggleAccordionExpansion.bind(this, accordionIds.albums)}
            title={`${accordionIds.albums} (${musicInfo?.albums?.length || 0})`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="disc" />}>
            {musicInfo?.albums ? (
              <FlatList
                data={musicInfo.albums}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: album }) => (
                  <List.Item
                    style={{
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      borderRadius: 10,
                      flexWrap: 'wrap',
                    }}
                    titleStyle={styles.text}
                    title={album}
                  />
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={accordionIds.artists}
            expanded={isAccordionExpanded(accordionIds.artists)}
            onPress={toggleAccordionExpansion.bind(this, accordionIds.artists)}
            title={`Artists (${musicInfo?.artists?.length || 0})`}
            left={props => <List.Icon {...props} icon="account-music" />}>
            {musicInfo?.artists ? (
              <FlatList
                data={musicInfo.artists}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: artist }) => (
                  <List.Item
                    style={{
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      borderRadius: 10,
                      flexWrap: 'wrap',
                    }}
                    titleStyle={styles.text}
                    title={artist}
                  />
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>

          <List.Accordion
            id={accordionIds.folders}
            expanded={isAccordionExpanded(accordionIds.folders)}
            onPress={toggleAccordionExpansion.bind(this, accordionIds.folders)}
            title={`${accordionIds.folders} (${
              musicInfo?.folders?.length || 0
            })`}
            titleStyle={styles.accordionTitleText}
            left={props => <List.Icon {...props} icon="folder-music" />}>
            {musicInfo?.folders ? (
              <FlatList
                data={musicInfo.folders}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item: folder }) => (
                  <List.Item
                    style={{
                      marginBottom: hp(1),
                      backgroundColor: colors.lightGrey,
                      borderRadius: 10,
                      flexWrap: 'wrap',
                    }}
                    titleStyle={styles.text}
                    title={folder.name}
                    description={folder.path}
                  />
                )}
              />
            ) : (
              <Text style={styles.errorText}>{`N/A`}</Text>
            )}
          </List.Accordion>
        </List.Section>

        <List.Section titleStyle={styles.titleText} title="Preferences">
          <List.Item
            titleStyle={
              enabledDarkTheme === null || enabledDarkTheme === undefined
                ? styles.errorText
                : styles.text
            }
            title={`enabledDarkTheme: ${enabledDarkTheme ?? 'N/A'}`}
          />
        </List.Section>
      </View>
    );
  };

  return (
    <ScreenContainer
      showHeader
      title={screenNames.info}
      iconName="bug-outline"
      onBackPress={navigation.goBack}
      actionIcons={[
        {
          name: 'arrow-collapse',
          onPress: setExpandedAccordionIds.bind(this, []),
        },
        { name: 'magnify', onPress: toggleSearch },
      ]}>
      <View style={styles.iconContainer}>
        <Icon name="bug-outline" size={hp(20)} />
        <Text style={{ fontSize: wp(7) }}>Information</Text>
      </View>

      {showSearch && (
        <Searchbar
          placeholder="Search within app info"
          onChangeText={setSearchedTerm}
          value={searchedTerm}
          style={{
            marginTop: hp(2),
          }}
        />
      )}

      <View
        style={{
          marginVertical: hp(2),
        }}>
        {renderData()}
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
  },
  titleText: {
    fontSize: wp(5),
  },
  text: {
    fontSize: wp(3.5),
  },
  errorText: {
    fontSize: wp(3.5),
    color: 'red',
  },
  accordionTitleText: {
    textTransform: 'capitalize',
  },
});

export default Info;

// import React, { useContext, useState } from 'react';
// import { StyleSheet, Alert, TouchableOpacity, View } from 'react-native';
// import {
//   Avatar,
//   IconButton,
//   List,
//   Menu,
//   Snackbar,
//   Text,
// } from 'react-native-paper';
// import { BlurView } from '@react-native-community/blur';
// import BottomSheet from 'reanimated-bottom-sheet';
// import {
//   heightPercentageToDP as hp,
//   widthPercentageToDP as wp,
// } from 'react-native-responsive-screen';
// import { PreferencesContext } from '../../context/preferences';
// import { MusicContext } from '../../context/music';
// import Colors from 'react-native/Libraries/NewAppScreen/components/Colors';
// import values from '../../constants/values';
// import Icon from '../../components/icon';
// import globalStyles from './styles';
// import colors from '../../constants/colors';
// import DateTimeUtils from '../../utils/datetime';
// import keys from '../../constants/keys';
// import labels from '../../constants/labels';
// import screenNames from '../../constants/screen-names';
//
// // TODO:
// //  - Show the bottom-sheet in a blur-view
//
// // FIXME:
// //  - Issues with BottomSheet component:
// //    - Cannot use navigation (solution: will be passed by the screen)
// //    - Cannot be notified when expanding/collapsing the sheet (try using the event functions)
// const Player = () => {
//   const { enabledDarkTheme } = useContext(PreferencesContext);
//   const { musicInfo, setMusicInfo } = useContext(MusicContext);
//
//   const [showMoreOptionsForId, setShowMoreOptionsForId] = useState(null);
//   const [showInfoInSnackBar, setShowInfoInSnackBar] = useState(null);
//
//   const renderContent = () => {
//     const currentSongInfo = {
//       album: 'Zindagi Na Milegi Dobara',
//       artist: 'Shankar-Ehsaan-Loy, Shankar Mahadevan',
//       coverExists: false,
//       coverFilePath: 'file:///storage/emulated/0/14.jpg',
//       duration: '357381',
//       fileName: 'Der Lagi Lekin - Zindagi Na Milegi Dobara 128 Kbps.mp3',
//       folder: {
//         name: 'Download',
//         path: '/storage/emulated/0/Download',
//       },
//       genre: null,
//       id: '14',
//       path: '/storage/emulated/0/Download/Der Lagi Lekin - Zindagi Na Milegi Dobara 128 Kbps.mp3',
//       title: 'Der Lagi Lekin',
//     };
//
//     const renderDescription = data => (
//       <Text style={styles.trackDescText}>
//         <Icon
//           name={'clock-time-five-outline'}
//           size={wp(3.2)}
//           color={colors.lightGrey}
//         />
//         <Text style={styles.trackSubtitleText}>
//           {DateTimeUtils.msToTime(data.duration)}
//         </Text>
//         {data.artist && (
//           <>
//             <Icon
//               name={'dot-single'}
//               type={'Entypo'}
//               size={wp(3.2)}
//               color={colors.lightGrey}
//             />
//             <Icon
//               name={'account-music'}
//               size={wp(3.2)}
//               color={colors.lightGrey}
//             />
//             <Text style={styles.trackSubtitleText}>{data.artist}</Text>
//           </>
//         )}
//         {/*<Icon*/}
//         {/*  name={'dot-single'}*/}
//         {/*  type={'Entypo'}*/}
//         {/*  size={wp(3.2)}*/}
//         {/*  color={colors.lightGrey}*/}
//         {/*/>*/}
//         {/*<Icon name={'folder-music'} size={wp(3.2)} color={colors.lightGrey} />*/}
//         {/*<Text style={styles.trackSubtitleText}>{data.folder.name}</Text>*/}
//       </Text>
//     );
//
//     const renderLeftComponent = (data, props) => {
//       return data.coverExists ? (
//         <Avatar.Image size={hp(6)} source={{ uri: data.coverFilePath }} />
//       ) : (
//         <Avatar.Icon size={hp(6)} icon={'music'} style={styles.musicIcon} />
//       );
//     };
//
//     const renderRightComponent = (data, props, listItemId) => (
//       <Menu
//         {...props}
//         visible={showMoreOptionsForId === listItemId}
//         onDismiss={showMoreOptionsForId}
//         anchor={
//           <IconButton
//             {...props}
//             icon="dots-vertical"
//             onPress={setShowMoreOptionsForId.bind(this, listItemId)}
//           />
//         }>
//         <Menu.Item
//           icon="skip-next-outline"
//           title={labels.playNext}
//           onPress={() => {
//             alert(JSON.stringify(props));
//             showMoreOptionsForId(null);
//           }}
//         />
//         <Menu.Item
//           icon="playlist-plus"
//           title={labels.addToPlaylist}
//           onPress={() => {
//             showMoreOptionsForId(null);
//             alert(JSON.stringify(props));
//           }}
//         />
//         <Menu.Item
//           icon="table-column-plus-after"
//           title={labels.addToQueue}
//           onPress={() => {
//             // alert(JSON.stringify(props));
//             showMoreOptionsForId(null);
//             setShowInfoInSnackBar({
//               message: labels.addedToQueue,
//               actions: {
//                 label: labels.dismiss,
//                 onPress: setShowInfoInSnackBar.bind(this, null),
//               },
//             });
//           }}
//         />
//         <Menu.Item
//           icon="information-variant"
//           title={labels.showInfo}
//           onPress={() => {
//             // alert(JSON.stringify(props));
//             // navigation.navigate(screenNames.itemInfo, { type, data }); // TODO check if possible to implement
//             // setInfoModalData({ type, data });
//             setShowMoreOptionsForId(null);
//           }}
//         />
//       </Menu>
//     );
//
//     return (
//       <View style={styles.sheetBody}>
//         <BlurView
//           style={styles.blurView}
//           blurType={enabledDarkTheme ? 'dark' : 'light'}
//           blurAmount={5}
//           blurRadius={10}
//           downsampleFactor={10}
//           // overlayColor={'lightgrey'}
//           reducedTransparencyFallbackColor={
//             enabledDarkTheme ? Colors.darker : Colors.lighter
//           }
//         />
//
//         <View style={styles.topBrokenBarContainer}>
//           {[
//             {
//               transform: [{ rotate: '15deg' }],
//               marginRight: wp(-0.4),
//             },
//             {
//               transform: [{ rotate: '-15deg' }],
//               marginLeft: wp(-0.4),
//             },
//           ].map((style, index) => (
//             <View key={index} style={[styles.brokenBar, style]} />
//           ))}
//         </View>
//
//         <List.Item
//           onPress={() => {
//             Alert.alert(`Current Song Info`, JSON.stringify(currentSongInfo)); // TODO add functionality later
//           }}
//           titleEllipsizeMode={'tail'}
//           titleNumberOfLines={1}
//           titleStyle={styles.listItemText}
//           title={currentSongInfo.title}
//           descriptionEllipsizeMode={'tail'}
//           descriptionNumberOfLines={1}
//           description={renderDescription.bind(this, currentSongInfo)}
//           left={props => renderLeftComponent(currentSongInfo, props)}
//           right={props => renderRightComponent(currentSongInfo, props, -1)} // TODO add later
//         />
//
//         <TouchableOpacity
//           onPress={setMusicInfo.bind(this, values.RESET_MUSIC_DATA)}
//           hitSlop={globalStyles.buttonHitSlop}>
//           <Icon name={'close'} size={wp(5)} />
//         </TouchableOpacity>
//
//         <Text>Inside BlurView</Text>
//       </View>
//     );
//   };
//
//   // if (musicInfo.stopped) return null; // TODO remove this, for debug purpose only
//   return (
//     <>
//       <BottomSheet
//         initialSnap={2}
//         snapPoints={[hp(75), hp(45), hp(10)]}
//         borderRadius={10}
//         renderContent={renderContent}
//       />
//
//       <Snackbar
//         visible={Boolean(showInfoInSnackBar)}
//         duration={showInfoInSnackBar?.duration ?? 1500}
//         onDismiss={() => {
//           if (showInfoInSnackBar.onDismiss) showInfoInSnackBar.onDismiss();
//           setShowInfoInSnackBar(null);
//         }}
//         action={showInfoInSnackBar?.actions}>
//         {showInfoInSnackBar?.message}
//       </Snackbar>
//     </>
//   );
// };
//
// const styles = StyleSheet.create({
//   sheetBody: {
//     height: '100%',
//     elevation: 2,
//     paddingVertical: hp(1.5),
//     paddingHorizontal: wp(3),
//     borderRadius: 10,
//     // borderWidth: 1,
//   },
//   blurView: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
//   topBrokenBarContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexDirection: 'row',
//   },
//   brokenBar: {
//     // opacity: 0.5,
//     height: hp(0.5),
//     width: wp(4),
//     backgroundColor: '#a1a1a1',
//     borderRadius: 10,
//   },
//   listItemText: {
//     fontSize: wp(3.5),
//     marginBottom: hp(0.3),
//   },
//   trackDescText: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   trackSubtitleText: {
//     fontSize: wp(3.2),
//     color: colors.lightGrey,
//     marginLeft: wp(0.2),
//   },
// });
//
// export default Player;

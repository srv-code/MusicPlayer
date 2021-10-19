import keys from '../constants/keys';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class PlaylistUtils {
  static delete = async (id, list, musicInfo, setMusicInfo) => {
    const newList = list.filter(pl => pl.id !== id);

    // console.log(`[PlaylistUtils.delete] newList=${JSON.stringify(newList)}`);

    setMusicInfo({
      ...musicInfo,
      [keys.PLAYLISTS]: newList,
    });
    await AsyncStorage.setItem(keys.PLAYLISTS, JSON.stringify(newList));
  };
}

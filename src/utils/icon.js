import { SortingOptions } from '../constants/tracks';
import keys from '../constants/keys';
import { Platform } from 'react-native';

export default class IconUtils {
  // TODO Apply this everywhere applicable
  static getInfo = type => {
    switch (type) {
      case keys.FAVORITE:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            filled: 'heart',
            outlined: 'heart-outline',
            default: 'heart-outline',
          },
        };

      case keys.PLAYLISTS:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            filled: 'playlist-music',
            outlined: 'playlist-music-outline',
            default: 'playlist-music-outline',
          },
        };

      case keys.PLAYLIST_EDIT:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            default: 'playlist-edit',
          },
        };

      case keys.TRACKS:
        return {
          type: 'Ionicons',
          name: {
            filled: 'musical-notes',
            outlined: 'musical-notes-outline',
            default: 'music',
          },
        };

      case keys.TITLE:
      case SortingOptions.TITLE:
        return {
          type: 'MaterialCommunityIcons',
          name: { outlined: 'format-text', default: 'format-text' },
        };

      case keys.DURATION:
      case SortingOptions.DURATION:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            outlined: 'clock-time-five-outline',
            default: 'clock-time-five-outline',
          },
        };

      case keys.ALBUMS:
      case SortingOptions.ALBUM:
        return {
          type: 'Ionicons',
          name: {
            filled: 'disc',
            outlined: 'disc-outline',
            default: 'album',
          },
        };

      case keys.ARTISTS:
      case SortingOptions.ARTIST:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            filled: 'account-music',
            outlined: 'account-music-outline',
            default: 'account-music-outline',
          },
        };

      case keys.FOLDERS:
      case SortingOptions.FOLDER:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            filled: 'folder-music',
            outlined: 'folder-music-outline',
            default: 'folder-music-outline',
          },
        };

      case keys.INFO:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            filled: 'information-variant',
            outlined: 'information-outline',
            default: 'information-outline',
          },
        };

      case keys.DEBUG:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            default: 'bug-outline',
          },
        };

      case keys.REPEAT_OFF:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            default: 'repeat-off',
          },
        };

      case keys.REPEAT_ONCE:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            default: 'repeat-once',
          },
        };

      case keys.REPEAT:
        return {
          type: 'MaterialCommunityIcons',
          name: {
            default: 'repeat',
          },
        };

      case keys.SKIP_BACK:
        return {
          type: 'Ionicons',
          name: {
            filled: 'ios-play-skip-back',
          },
        };

      case keys.SKIP_NEXT:
        return {
          type: 'Ionicons',
          name: {
            filled: 'ios-play-skip-forward',
            default: 'skip-next-outline',
          },
        };

      case keys.PLAY:
        return {
          type: 'FontAwesome5',
          name: {
            filled: 'play',
          },
        };

      case keys.PAUSE:
        return {
          type: 'FontAwesome5',
          name: {
            filled: 'pause',
          },
        };

      case keys.TEXT_DOT:
        return {
          type: 'Entypo',
          name: {
            filled: 'dot-single',
          },
        };

      case keys.CROSS_WITH_CIRCLE:
        return {
          type: 'Entypo',
          name: {
            filled: 'circle-with-cross',
          },
        };

      case keys.CHECK:
        return {
          type: 'Entypo',
          name: {
            filled: 'check',
          },
        };

      case keys.SHUFFLE:
        return {
          type: 'Entypo',
          name: {
            filled: 'shuffle',
          },
        };

      case keys.VERTICAL_ELLIPSIS:
        return {
          name: {
            default: 'dots-vertical',
          },
        };

      case keys.ADD_TO_PLAYLIST:
        return {
          name: {
            default: 'playlist-plus',
          },
        };

      case keys.ADD_TO_QUEUE:
        return {
          name: {
            default: 'table-column-plus-after',
          },
        };

      case keys.SEARCH:
        return {
          name: {
            default: 'magnify',
          },
        };

      case keys.TEXT_SEARCH:
        return {
          name: {
            default: 'text-search',
          },
        };

      case keys.SETTINGS:
        return {
          name: {
            default: 'cog-outline',
          },
        };

      case keys.EXPAND:
        return {
          name: {
            default: 'arrow-expand',
          },
        };

      case keys.COLLAPSE:
        return {
          name: {
            default: 'arrow-collapse',
          },
        };

      case keys.DELETE:
        return {
          name: {
            default: 'delete',
          },
        };

      case keys.ELLIPSIS:
        return {
          name: {
            default:
              Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical',
          },
        };

      case keys.SYNC:
        return {
          name: {
            default: 'sync',
          },
        };

      case keys.LIGHT_MODE:
        return {
          name: {
            default: 'white-balance-sunny',
          },
        };

      case keys.DARK_MODE:
        return {
          name: {
            default: 'moon-waning-crescent',
          },
        };

      case keys.SORT_ASCENDING:
        return {
          name: {
            default: 'sort-ascending',
          },
        };

      case keys.SORT_ASCENDING_ALT:
        return {
          type: 'FontAwesome5',
          name: {
            filled: 'sort-amount-down-alt',
          },
        };

      case keys.SORT_DESCENDING:
        return {
          name: {
            default: 'sort-descending',
          },
        };

      case keys.SORT_DESCENDING_ALT:
        return {
          type: 'FontAwesome5',
          name: {
            filled: 'sort-amount-up-alt',
          },
        };

      case keys.ACTION:
        return {
          name: {
            outlined: 'rocket-launch-outline',
            filled: 'rocket-launch',
          },
        };

      default:
        throw new Error(`Invalid type: ${type}`);
    }
  };
}

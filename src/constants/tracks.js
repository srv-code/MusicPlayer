import labels from './labels';
import keys from './keys';

const sortingOptions = {
  TITLE: labels.title,
  TRACKS: labels.tracks,
  CREATED_ON: labels.createdOn,
  UPDATED_ON: labels.updatedOn,
  ARTIST: labels.artist,
  ALBUM: labels.album,
  DURATION: labels.duration,
  FOLDER: labels.folder,
};

const sortingOrders = {
  ASCENDING: keys.SORT_ASCENDING,
  DECREASING: keys.SORT_DESCENDING,
};

export { sortingOptions, sortingOrders };

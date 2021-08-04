import React, { createContext } from 'react';

const musicContextValue = {
  lastUpdated: null,
  tracks: {
    loaded: 0,
  },
  artists: {},
};

const MusicContext = createContext();

export default MusicContext;
export { musicContextValue };

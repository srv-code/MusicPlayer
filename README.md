# Music Player

A cross-platform (Android & iOS) music player.

### Known bugs: 🪲

1. Songs that dont have album cover is not being detected.
2. Cannot control player from notification tray

### Improvements:

1. Cannot open app when pressing the notification (implement React-Native-Linking)
2. Capabilities: Like/Dislike/Rating
3. Show a loader below the FlatList when its loading rest of the items
4. Apply a file logger and sends the error logs to the developer team (with the prior permission of the user) to improve performance

### Finalising

1. Apply `useMemo` & `useCallback` wherever possible and do each case studies

# Browser Caching Feature

## Overview
The app now uses browser caching (IndexedDB + localStorage) for faster loading and offline access to previously fetched data.

## What Gets Cached

### IndexedDB (Large Data)
- **Video Transcripts**: Full video info + transcript data
- **Channel Videos**: Channel video lists
- **Expiry**: 24 hours for videos, 12 hours for channels

### localStorage (Small Data)
- **Transcripts List**: Your saved transcripts
- **AI Settings**: AI provider configurations
- **Expiry**: 5-10 minutes

## Benefits

1. **Faster Loading**: Previously fetched videos load instantly from cache
2. **Reduced Server Load**: Less API calls to backend
3. **Better UX**: Smooth experience when revisiting content
4. **Bandwidth Savings**: No need to re-download transcripts

## Cache Indicators

- **Green "Cached" badge**: Shows when data is loaded from cache
- **Settings Page**: View cache statistics (videos/channels cached)

## Managing Cache

### Automatic Expiry
- Cache automatically expires after set time periods
- Expired data is removed on next access

### Manual Clearing
1. Go to **Settings**
2. Find **Browser Cache** section
3. Click **Clear Browser Cache**

### What Happens When Cache is Cleared
- All cached videos and channels are removed
- Next fetch will retrieve fresh data from server
- Saved transcripts in database are NOT affected

## Technical Details

### Cache Structure
```javascript
// IndexedDB Stores
- videos: { videoId, videoInfo, transcript, timestamp }
- channels: { channelUrl, channelData, timestamp }
- settings: { key, value }

// localStorage Keys
- yt-transcript:transcripts
- yt-transcript:ai-settings
```

### Cache Flow
1. User requests data
2. Check cache first
3. If found and not expired → return cached data
4. If not found or expired → fetch from server
5. Store fresh data in cache

## Privacy & Storage

- All cache is stored locally in your browser
- No data is sent to external servers
- Cache is per-browser (not synced across devices)
- Clearing browser data will remove all cache

## Troubleshooting

### Cache Not Working
- Check browser supports IndexedDB
- Ensure sufficient storage space
- Try clearing cache and re-fetching

### Stale Data
- Cache expires automatically
- Manually clear cache for fresh data
- Saved transcripts always fetch latest from server

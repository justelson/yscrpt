# YouTube Shorts Support

## Can I Fetch Transcripts from YouTube Shorts?

**Short Answer**: Usually no, but the app will try.

## Why Shorts Don't Have Transcripts

YouTube Shorts typically don't have transcripts for several reasons:

1. **No Auto-Captions**: YouTube doesn't automatically generate captions for most Shorts
2. **Creator Choice**: Most Shorts creators don't manually add captions
3. **Short Duration**: Videos under 60 seconds often skip auto-caption generation
4. **Different Format**: Shorts use a different video format optimized for mobile

## What the App Does

The app now:
- ✅ Accepts YouTube Shorts URLs (`youtube.com/shorts/VIDEO_ID`)
- ✅ Attempts to fetch transcripts from Shorts
- ✅ Provides clear error messages when transcripts aren't available
- ✅ Explains why Shorts typically don't have transcripts

## Supported URL Formats

### Regular Videos
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
```

### YouTube Shorts
```
https://www.youtube.com/shorts/VIDEO_ID
```

### Channels
```
https://www.youtube.com/@channelname
https://www.youtube.com/channel/CHANNEL_ID
```

## When Shorts MIGHT Have Transcripts

In rare cases, a Short may have a transcript if:
- The creator manually added captions
- The Short was originally a longer video that was trimmed
- The creator enabled auto-captions before uploading

## Workarounds

If you need content from a Short:

1. **Check Creator's Channel**: Look for a longer version of the video
2. **Manual Transcription**: Use speech-to-text tools
3. **Request Captions**: Ask the creator to add captions
4. **Wait for Updates**: YouTube may improve Shorts caption support

## Error Messages

### "YouTube Shorts typically don't have transcripts"
- This is expected behavior
- Most Shorts don't have captions
- Try a regular video instead

### "No transcript available for this video"
- The video (Short or regular) doesn't have captions
- Creator didn't enable captions
- Auto-captions weren't generated

## Technical Details

The app uses the same API for both regular videos and Shorts, but:
- Shorts are detected by URL pattern or duration < 60 seconds
- Special error messages are shown for Shorts
- The app still attempts to fetch transcripts (in case they exist)

## Future Improvements

Potential enhancements:
- Audio extraction and transcription using AI
- Integration with speech-to-text APIs
- Community-contributed transcripts
- OCR for on-screen text in Shorts

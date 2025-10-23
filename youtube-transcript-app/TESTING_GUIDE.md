# Testing Guide for Bug Fixes

## Quick Start

### 1. Start the Application
```bash
# Terminal 1 - Start the server
cd youtube-transcript-app
npm run server

# Terminal 2 - Start the client
cd youtube-transcript-app
npm run dev
```

### 2. Open Browser Console
- Press F12 (or Cmd+Option+I on Mac)
- Go to Console tab
- Keep it open during testing

---

## Test Issue #1: Chat Messages Not Saving

### Steps to Test

1. **Navigate to AI Tools**
   - Click "AI Tools" in sidebar
   - Select "Chat" tool

2. **Select a Transcript**
   - Choose any saved transcript
   - Or fetch a new one first

3. **Have a Conversation**
   - Type: "What is this video about?"
   - Wait for AI response
   - Type: "Can you summarize the key points?"
   - Wait for AI response

4. **Save to Memories**
   - Click "Save to Memories" button
   - Should see success message

5. **Check Server Console**
   Look for these logs:
   ```
   === SAVE MEMORY REQUEST ===
   Type: chat
   Title: Chat - [Video Title]
   Messages: Array with 4 items
   First message: { role: 'user', content: '...', timestamp: '...' }
   ✓ Memory saved successfully: { messagesCount: 4, ... }
   ✓ Verified saved memory: { messagesInDb: 4, ... }
   ```

6. **View the Memory**
   - Navigate to "Memories" page
   - Click on the chat memory you just saved

7. **Check Browser Console**
   Look for:
   ```
   Chat memory: {
     hasMessages: true,
     messagesLength: 4,
     messagesType: 'object'
   }
   ```

8. **Verify UI Display**
   - Should see all messages in conversation format
   - User messages on right (blue)
   - AI messages on left (gray)
   - Message count should match

### Expected Results ✅
- ✅ Server logs show messages being saved
- ✅ Server logs show 4 messages (2 user + 2 AI)
- ✅ Browser console shows messages array
- ✅ UI displays all 4 messages
- ✅ Messages are in correct order
- ✅ User/AI labels are correct

### If It Fails ❌
Check:
1. Server console for error messages
2. Browser console for error messages
3. Network tab (F12 → Network) for failed requests
4. MongoDB connection status

---

## Test Issue #2: Channel Search Not Working

### Steps to Test

1. **Navigate to Fetch Page**
   - Click "Fetch" in sidebar

2. **Switch to Channel Mode**
   - Click "Channel Videos" button

3. **Enter Channel URL**
   Examples to try:
   - `https://www.youtube.com/@mkbhd`
   - `https://www.youtube.com/@veritasium`
   - `https://www.youtube.com/channel/UCBJycsmduvYEL83R_U4JriQ` (MKBHD)

4. **Set Video Limit**
   - Enter a number (e.g., 10)

5. **Click Fetch**
   - Should see loading indicator
   - Wait for results

6. **Check Server Console**
   Look for:
   ```
   Fetching channel videos...
   Channel: [Channel Name]
   Videos found: 10
   ```

7. **Verify UI Display**
   - Should see channel name
   - Should see grid of videos
   - Each video should have:
     - Thumbnail
     - Title
     - View count
     - Upload date
     - Duration

8. **Click a Video**
   - Click any video card
   - Should fetch that video's transcript
   - Should see video info and transcript

### Expected Results ✅
- ✅ Channel videos load successfully
- ✅ No "server not running" error
- ✅ Videos display in grid
- ✅ Clicking video fetches transcript
- ✅ Specific error messages if something fails

### Test Error Handling

1. **Invalid URL**
   - Enter: `https://www.youtube.com/invalid`
   - Should see: "Invalid channel URL format"

2. **Non-existent Channel**
   - Enter: `https://www.youtube.com/@nonexistentchannel12345`
   - Should see: "Failed to fetch channel videos"

3. **Server Down Test**
   - Stop the server (Ctrl+C in server terminal)
   - Try to fetch a channel
   - Should see: "Cannot connect to server. Make sure backend is running on http://localhost:3001"
   - Restart server: `npm run server`

### Expected Error Messages ✅
- ✅ Invalid URL → "Invalid channel URL format"
- ✅ Server down → "Cannot connect to server"
- ✅ API error → Specific error from YouTube API
- ✅ Network error → "Cannot connect to server"

---

## Additional Tests

### Test Single Video Fetch
1. Switch to "Single Video" mode
2. Enter video URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
3. Click Fetch
4. Should see video info and transcript

### Test Memory Display
1. Go to Memories page
2. Check different memory types:
   - Chat memories (should show messages)
   - Flashcard memories (should show cards)
   - Question memories (should show Q&A)
   - Summary memories (should show text)

### Test Download Functionality
1. Open a memory
2. Click Download button
3. Choose format (TXT, JSON, or MD)
4. Verify file downloads correctly

---

## Troubleshooting

### Server Won't Start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill the process if needed
taskkill /PID [PID_NUMBER] /F

# Restart server
npm run server
```

### Client Won't Start
```bash
# Check if port 5173 is in use
netstat -ano | findstr :5173

# Kill the process if needed
taskkill /PID [PID_NUMBER] /F

# Restart client
npm run dev
```

### MongoDB Connection Issues
```bash
# Check .env file
# Make sure MONGODB_URI is set correctly
```

### Clear Cache
```bash
# Browser: F12 → Application → Clear Storage → Clear site data
# Or: Ctrl+Shift+Delete → Clear browsing data
```

---

## Success Criteria

### Issue #1 - Chat Messages ✅
- [x] Messages save to database
- [x] Messages retrieve from database
- [x] Messages display in UI
- [x] Message count is accurate
- [x] No console errors

### Issue #2 - Channel Search ✅
- [x] Channel search works
- [x] Videos display correctly
- [x] Error messages are specific
- [x] Server down detection works
- [x] No false "server not running" errors

---

## Reporting Issues

If you find any issues during testing:

1. **Check Console Logs**
   - Browser console (F12)
   - Server console (terminal)

2. **Take Screenshots**
   - Error messages
   - Console logs
   - Network tab

3. **Note Steps to Reproduce**
   - What you did
   - What you expected
   - What actually happened

4. **Check Network Tab**
   - F12 → Network
   - Look for failed requests
   - Check request/response details

---

## Quick Reference

### Server Logs to Watch For
```
✓ Memory saved successfully
✓ Verified saved memory
=== GET MEMORIES ===
Chat memories: [count]
```

### Browser Console Logs to Watch For
```
Chat memory: { hasMessages: true, messagesLength: 4 }
Saving chat with messages: [array]
Memory data to save: { type: 'chat', messages: [...] }
```

### Common Error Messages
- "Cannot connect to server" → Server is down
- "Invalid YouTube URL" → URL format is wrong
- "No transcript available" → Video has no captions
- "Failed to save" → Database or server error

---

## Done! 🎉

If all tests pass, both issues are fixed!

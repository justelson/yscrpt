# Bug Fix: AI Tools Routing Issue

## Problem
When selecting a transcript to use with AI tools, the app would navigate to an undefined route and immediately redirect back, preventing users from using AI tools.

## Root Cause
MongoDB returns documents with `_id` field, but the code was looking for `id` field when matching transcripts.

### The Issue:
```javascript
// This was failing because transcript.id was undefined
const transcript = transcripts.find((t) => t.id === transcriptId);
```

MongoDB documents have `_id` (with underscore), not `id`.

## Solution
Updated the code to check both `_id` and `id` fields for compatibility:

### Fixed Code:
```javascript
// Now works with both MongoDB (_id) and other databases (id)
const transcript = transcripts.find((t) => (t._id || t.id) === transcriptId);
```

## Files Changed

### 1. AIToolsRouter.jsx
- **ChatToolWrapper**: Updated transcript lookup to use `(t._id || t.id)`
- **GenericToolWrapper**: Updated transcript lookup to use `(t._id || t.id)`
- **TranscriptSelector**: Updated navigation to use `transcript._id || transcript.id`

## Testing
To verify the fix works:

1. Go to **AI Tools** page
2. Click any AI tool (Chat, Questions, Summary, etc.)
3. Select a transcript from the list
4. Should navigate to the tool with the transcript loaded
5. Tool should display transcript content correctly

## Why This Happened
- MongoDB uses `_id` as the default primary key field
- The code was written expecting `id` field
- When transcripts were fetched from MongoDB, they had `_id`
- The find() method couldn't match `transcriptId` with `transcript.id` (undefined)
- This caused the component to think transcript wasn't found
- Navigate component redirected back to selection page

## Prevention
- Always check MongoDB document structure when working with IDs
- Use `_id` for MongoDB documents
- Add fallback checks `(_id || id)` for compatibility
- Test with actual database data, not mock data

## Related Components
These components correctly use `_id`:
- **LibraryView.jsx**: Already using `transcript._id` ✓
- **SettingsView.jsx**: Not directly using transcript IDs ✓
- **FetchView.jsx**: Not using transcript IDs ✓

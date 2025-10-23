# Memory Structure Fix

## Problem
Memories were not storing complete information from MongoDB, causing errors and missing data in the MemoriesView.

## Changes Made

### 1. Updated Memory Model (`server/models/Memory.js`)

Added missing fields to properly store all memory types:

```javascript
{
  userId: ObjectId,           // User who created it
  transcriptId: ObjectId,     // Reference to transcript
  type: String,               // 'chat', 'questions', 'flashcards', etc.
  title: String,              // Display title
  videoTitle: String,         // Original video title
  toolName: String,           // AI tool used
  result: String,             // Raw result text/JSON
  cards: [{                   // For flashcards/questions
    question: String,
    answer: String,
    front: String,
    back: String
  }],
  messages: [{                // For chat conversations
    role: String,
    content: String,
    timestamp: Date
  }],
  metadata: {                 // Additional info
    provider: String,
    model: String,
    options: Mixed
  },
  createdAt: Date
}
```

### 2. Fixed GenericTool Save Function

Updated `handleSaveToMemories` to save complete data:

**Before:**
```javascript
await api.saveMemory({
  videoTitle: transcript.title,
  toolName: toolConfig.name,
  result: JSON.stringify({ type: ..., cards: ... }),
});
```

**After:**
```javascript
await api.saveMemory({
  type: toolConfig.id,                    // ✅ Proper type field
  title: `${toolConfig.name} - ${transcript.title}`,  // ✅ Display title
  videoTitle: transcript.title,
  toolName: toolConfig.name,
  transcriptId: transcript._id,           // ✅ Reference
  cards: parsedCards,                     // ✅ Structured cards
  result: result,                         // ✅ Raw result
  metadata: { provider, options },        // ✅ Metadata
});
```

### 3. Added Backward Compatibility

MemoriesView now normalizes old memory formats:

- Parses old JSON string results
- Extracts type and cards from old format
- Generates missing titles
- Handles undefined types gracefully

## Memory Types

### Flashcards
```javascript
{
  type: 'flashcards',
  title: 'Flashcards - Video Title',
  cards: [
    { question: '...', answer: '...' }
  ]
}
```

### Questions
```javascript
{
  type: 'questions',
  title: 'Questions - Video Title',
  cards: [
    { question: '...', answer: '...' }
  ]
}
```

### Summary/KeyPoints/Rewrite/Translate
```javascript
{
  type: 'summary',
  title: 'Summary - Video Title',
  result: 'Generated text content...'
}
```

### Chat (Future)
```javascript
{
  type: 'chat',
  title: 'Chat - Video Title',
  messages: [
    { role: 'user', content: '...', timestamp: Date },
    { role: 'assistant', content: '...', timestamp: Date }
  ]
}
```

## Benefits

1. **Complete Data**: All memory information is properly stored
2. **Type Safety**: Enum validation for memory types
3. **Backward Compatible**: Old memories still work
4. **Better Display**: Proper titles and type labels
5. **Structured Cards**: Flashcards/questions stored as objects, not JSON strings
6. **Metadata**: Track which AI provider and options were used

## Testing

To verify the fix:

1. **Create New Memory**:
   - Go to AI Tools
   - Generate flashcards or questions
   - Click "Save to Memories"
   - Check Memories page - should display correctly

2. **View Old Memories**:
   - Old memories should still display
   - Type should be inferred from toolName
   - Title should be generated if missing

3. **Play Flashcards**:
   - Click "Play" on flashcard memory
   - Should show cards correctly
   - Navigation should work

## Migration (Optional)

To update existing memories in database:

```javascript
// Run this in MongoDB shell or create a migration script
db.memories.find({}).forEach(memory => {
  if (!memory.type && memory.toolName) {
    memory.type = memory.toolName.toLowerCase();
  }
  if (!memory.title) {
    memory.title = `${memory.toolName} - ${memory.videoTitle}`;
  }
  if (memory.result && !memory.cards) {
    try {
      const parsed = JSON.parse(memory.result);
      if (parsed.cards) {
        memory.cards = parsed.cards;
      }
    } catch (e) {}
  }
  db.memories.save(memory);
});
```

## Files Changed

1. `server/models/Memory.js` - Updated schema
2. `src/components/ai-tools/GenericTool.jsx` - Fixed save function
3. `src/components/MemoriesView.jsx` - Added normalization

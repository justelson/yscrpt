# Memory Preview - All Types Supported

## Overview
All memory types can now be viewed in a well-formatted preview mode in the Memories page.

## Supported Memory Types

### 1. Flashcards
- **Display**: Interactive flip cards
- **Features**:
  - Card navigation (Previous/Next)
  - Flip animation to reveal answer
  - Progress bar
  - Score tracking (Correct/Wrong)
  - Card counter (e.g., "Card 3 of 10")

### 2. Questions
- **Display**: Interactive study cards
- **Features**:
  - Same as flashcards
  - "Study" button instead of "Play"
  - Question/Answer format
  - Progress tracking

### 3. Chat Conversations
- **Display**: Chat bubble interface
- **Features**:
  - User messages: Blue bubbles, right-aligned
  - AI messages: White bubbles with border, left-aligned
  - Role labels ("You" / "AI")
  - Scrollable conversation history
  - Message count display
  - "View Chat" button

### 4. Summary
- **Display**: Full-text viewer
- **Features**:
  - Clean, readable layout
  - Scrollable content area
  - Copy to clipboard button
  - Download button (TXT, JSON, MD)
  - "View" button in list

### 5. Key Points
- **Display**: Full-text viewer
- **Features**:
  - Same as Summary
  - Formatted key points display
  - Easy copying and downloading

### 6. Rewrite
- **Display**: Full-text viewer
- **Features**:
  - Same as Summary
  - Shows rewritten script
  - Style information in metadata

### 7. Translate
- **Display**: Full-text viewer
- **Features**:
  - Same as Summary
  - Shows translated text
  - Target language in metadata

## UI Components

### Memory List View
Each memory card shows:
- Title
- Type description (e.g., "5 flashcards", "Chat conversation", "Summary")
- Creation date
- Action buttons based on type:
  - **Flashcards/Questions**: "Play" or "Study" button
  - **Chat**: "View Chat" button
  - **Text types**: "View" + "Copy" buttons
  - **All types**: Download and Delete buttons

### Preview Modes

#### Interactive Mode (Flashcards/Questions)
```
┌─────────────────────────────────┐
│ Back to Memories    Score: 3/5 │
├─────────────────────────────────┤
│ Title                           │
│ Card 4 of 10                    │
│ ████████░░░░░░░░░░░░ 40%       │
├─────────────────────────────────┤
│                                 │
│     [Flip Card Animation]       │
│                                 │
│     Question or Answer          │
│                                 │
├─────────────────────────────────┤
│   [Flip to Answer/Question]     │
│   [Wrong]         [Correct]     │
│   [Previous]      [Next]        │
└─────────────────────────────────┘
```

#### Chat Mode
```
┌─────────────────────────────────┐
│ Back to Memories                │
├─────────────────────────────────┤
│ Chat - Video Title              │
│ 8 messages                      │
├─────────────────────────────────┤
│                                 │
│              ┌──────────┐       │
│              │ You      │       │
│              │ Question │       │
│              └──────────┘       │
│                                 │
│  ┌──────────┐                  │
│  │ AI       │                  │
│  │ Answer   │                  │
│  └──────────┘                  │
│                                 │
└─────────────────────────────────┘
```

#### Text Viewer Mode (Summary/KeyPoints/Rewrite/Translate)
```
┌─────────────────────────────────┐
│ Back    [Copy] [Download]       │
├─────────────────────────────────┤
│ Title                           │
│ Type - Video Title              │
├─────────────────────────────────┤
│                                 │
│  Full text content displayed    │
│  in a scrollable area with      │
│  proper formatting and          │
│  whitespace preservation        │
│                                 │
└─────────────────────────────────┘
```

## Features by Type

| Type | View | Copy | Download | Play/Study | Score |
|------|------|------|----------|------------|-------|
| Flashcards | ✅ | ✅ | ✅ | ✅ | ✅ |
| Questions | ✅ | ✅ | ✅ | ✅ | ✅ |
| Chat | ✅ | ✅ | ✅ | ✅ | ❌ |
| Summary | ✅ | ✅ | ✅ | ❌ | ❌ |
| Key Points | ✅ | ✅ | ✅ | ❌ | ❌ |
| Rewrite | ✅ | ✅ | ✅ | ❌ | ❌ |
| Translate | ✅ | ✅ | ✅ | ❌ | ❌ |

## Download Formats

All memory types support 3 download formats:

### 1. Text (.txt)
- Plain text format
- Easy to read
- Compatible with all text editors

### 2. JSON (.json)
- Structured data format
- Includes all metadata
- Machine-readable

### 3. Markdown (.md)
- Formatted text
- Headers and styling
- Great for documentation

## User Experience

### Navigation Flow
1. **Memories List** → Click "View"/"Play"/"View Chat"
2. **Preview Mode** → View/interact with content
3. **Back Button** → Return to list

### Quick Actions
- **Copy**: One-click clipboard copy
- **Download**: Choose format and download
- **Delete**: Remove from memories
- **Play/Study**: Interactive learning mode

## Technical Implementation

### State Management
- `playingMemory`: Currently viewed memory
- `currentCardIndex`: For flashcards/questions
- `showAnswer`: Flip card state
- `score`: Tracking correct/wrong answers

### Conditional Rendering
```javascript
if (memory.type === 'chat') {
  // Show chat interface
} else if (['summary', 'keypoints', 'rewrite', 'translate'].includes(memory.type)) {
  // Show text viewer
} else if (memory.type === 'flashcards' || memory.type === 'questions') {
  // Show interactive cards
}
```

### Data Structure
Each memory type has appropriate fields:
- **Flashcards/Questions**: `cards` array
- **Chat**: `messages` array
- **Text types**: `result` string

## Benefits

1. **Unified Interface**: All memory types accessible from one place
2. **Type-Appropriate Display**: Each type shown in the best format
3. **Quick Access**: View without leaving the page
4. **Export Options**: Download in multiple formats
5. **Interactive Learning**: Flashcards and questions with scoring
6. **Conversation Review**: Chat history with proper formatting
7. **Content Preview**: Text-based memories in readable format

## Future Enhancements

Potential improvements:
- Search within memories
- Filter by type
- Sort by date/name
- Edit memories
- Share memories
- Print-friendly view
- Bulk export
- Memory collections/folders

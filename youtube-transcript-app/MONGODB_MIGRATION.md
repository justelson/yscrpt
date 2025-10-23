# MongoDB Migration Guide

This guide will help you migrate from InstantDB to MongoDB.

## Prerequisites

1. **Install MongoDB**
   - Download and install MongoDB from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

2. **Install Dependencies** (Already done)
   ```bash
   npm install mongoose express-session bcryptjs jsonwebtoken dotenv cors
   ```

## Setup Steps

### 1. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and update:
```
MONGODB_URI=mongodb://localhost:27017/youtube-transcript-app
SESSION_SECRET=your-random-secret-key-here
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For MongoDB Atlas, use:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtube-transcript-app
```

### 2. Update package.json

Add to your `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "server": "node server/index.js",
    "dev:all": "concurrently \"npm run dev\" \"npm run server\""
  }
}
```

Install concurrently for running both servers:
```bash
npm install -D concurrently
```

### 3. Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
- Already running in the cloud

### 4. Start the Application

**Option 1: Run both servers together**
```bash
npm run dev:all
```

**Option 2: Run separately**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## What Changed

### Backend
- ✅ MongoDB database with Mongoose ODM
- ✅ Session-based authentication
- ✅ RESTful API endpoints
- ✅ Models: User, Transcript, AISettings, Memory

### Frontend
- ⚠️ Need to replace InstantDB calls with API calls
- ⚠️ Update authentication flow
- ⚠️ Update data fetching/mutations

## Next Steps

### Replace InstantDB Usage

The following files need to be updated to use the new API:

1. **App.jsx** - Replace `db.useAuth()` with API calls
2. **GoogleSuccess.jsx** - Use `/api/auth/google` endpoint
3. **Sidebar.jsx** - Use `/api/user/profile` endpoint
4. **FetchView.jsx** - Use `/api/transcripts` endpoint
5. **LibraryView.jsx** - Use `/api/transcripts` endpoint
6. **AISettings.jsx** - Use `/api/ai-settings` endpoint
7. **MemoriesView.jsx** - Use `/api/memories` endpoint
8. **UserProfileSettings.jsx** - Use `/api/user/profile` endpoint

### Example API Usage

```javascript
import api from './lib/api';

// Get current user
const { user } = await api.getCurrentUser();

// Save transcript
await api.saveTranscript({
  videoId,
  title,
  transcript,
  // ... other fields
});

// Get transcripts
const transcripts = await api.getTranscripts();

// Delete transcript
await api.deleteTranscript(id);
```

## Testing

1. Start MongoDB
2. Start the backend server
3. Start the frontend
4. Sign in with Google
5. Test creating/viewing/deleting transcripts
6. Test AI settings
7. Test memories

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas, check network access and database user permissions

### CORS Issues
- Ensure CLIENT_URL in .env matches your frontend URL
- Check that credentials: 'include' is set in API calls

### Session Issues
- Clear browser cookies
- Check SESSION_SECRET is set
- Ensure cookies are enabled in browser

## Production Deployment

### Environment Variables
Set these in your production environment:
- `MONGODB_URI` - Your production MongoDB connection string
- `SESSION_SECRET` - Strong random secret
- `NODE_ENV=production`
- `CLIENT_URL` - Your production frontend URL

### Security Considerations
- Use HTTPS in production
- Set secure cookies
- Use strong SESSION_SECRET
- Implement rate limiting
- Add input validation
- Use environment-specific MongoDB databases

## Rollback Plan

If you need to rollback to InstantDB:
1. Keep the old `src/lib/instantdb.js` file
2. Revert component changes
3. Remove MongoDB dependencies
4. Stop MongoDB server

## Support

For issues:
1. Check MongoDB logs
2. Check server console for errors
3. Check browser console for API errors
4. Verify environment variables are set correctly

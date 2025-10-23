# 🚀 Quick Start Guide

## Get Started in 3 Steps!

### Step 1: Setup MongoDB

**Option A: MongoDB Atlas (Easiest - Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a free cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string

**Option B: Local MongoDB**
```bash
# Install MongoDB from https://www.mongodb.com/try/download/community
# Then start it:
mongod
```

### Step 2: Configure Environment

Create `.env` file in the root directory:

```env
# For MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtube-transcript-app

# Or for Local MongoDB:
# MONGODB_URI=mongodb://localhost:27017/youtube-transcript-app

SESSION_SECRET=change-this-to-a-random-secret-key
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Step 3: Start the App

```bash
npm run dev:all
```

That's it! Open http://localhost:5173

---

## 🎯 First Time Usage

1. **Create Account**
   - Click "Sign up"
   - Enter name, email, and password (min 6 chars)
   - Or click "Sign in with Google"

2. **Fetch a Transcript**
   - Go to "Fetch Transcript"
   - Paste a YouTube URL
   - Click "Fetch Transcript"
   - Click "Save to Library"

3. **View Your Library**
   - Click "My Library"
   - See all saved transcripts
   - Download or delete as needed

4. **Use AI Tools** (Optional)
   - Click "AI Tools"
   - Configure API keys in Settings
   - Use AI features on transcripts

---

## 🔑 Features

✅ Password & Google authentication
✅ Save YouTube transcripts
✅ AI-powered analysis
✅ Profile picture upload
✅ Organized library
✅ Export transcripts (SRT, TXT, JSON)

---

## 🆘 Need Help?

Check `MIGRATION_COMPLETE.md` for detailed documentation and troubleshooting.

**Common Issues:**
- Can't connect to MongoDB? Check your MONGODB_URI in .env
- Session not working? Make sure SESSION_SECRET is set
- CORS errors? Verify CLIENT_URL matches your frontend URL

---

## 📚 Documentation

- `MIGRATION_COMPLETE.md` - Full documentation
- `MONGODB_MIGRATION.md` - Migration guide
- `.env.example` - Environment variable template

Enjoy using y
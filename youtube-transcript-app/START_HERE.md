# ⚠️ IMPORTANT: Start Backend Server First!

## The Error You're Seeing

If you see: `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`

**This means the backend server is not running!**

---

## ✅ How to Fix

### Option 1: Run Both Servers Together (Recommended)

```bash
npm run dev:all
```

This starts both the backend (port 3001) and frontend (port 5173) together.

### Option 2: Run Separately

**Terminal 1 - Backend (MUST START FIRST):**
```bash
npm run server
```

Wait for: `Server running on http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```

---

## 🔧 Before Starting

### 1. Install MongoDB

**MongoDB Atlas (Cloud - Easiest):**
- Go to https://www.mongodb.com/cloud/atlas
- Create free account and cluster
- Get connection string

**Local MongoDB:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Then start:
mongod
```

### 2. Create .env File

Create `.env` in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/youtube-transcript-app
SESSION_SECRET=your-random-secret-key-here
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

For MongoDB Atlas, use:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/youtube-transcript-app
```

---

## 🚀 Quick Start

1. **Setup MongoDB** (see above)

2. **Create .env file** (see above)

3. **Start the app:**
   ```bash
   npm run dev:all
   ```

4. **Open browser:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

---

## ✅ Verify Backend is Running

You should see in the terminal:
```
MongoDB Connected: localhost
Server running on http://localhost:3001
```

If you see this, the backend is ready!

---

## 🐛 Troubleshooting

### "Cannot connect to server"
- ✅ Make sure backend is running: `npm run server`
- ✅ Check backend is on port 3001
- ✅ Look for "Server running" message

### "MongoDB connection failed"
- ✅ Check MongoDB is running (if local)
- ✅ Verify MONGODB_URI in .env
- ✅ For Atlas: check network access settings

### "Session not working"
- ✅ Check SESSION_SECRET is set in .env
- ✅ Clear browser cookies
- ✅ Restart backend server

---

## 📚 Full Documentation

- `MIGRATION_COMPLETE.md` - Complete guide
- `MONGODB_MIGRATION.md` - Migration details
- `.env.example` - Environment template

---

## 🎯 Summary

**The key is: Backend MUST be running before you can sign up/sign in!**

Run: `npm run dev:all` and you're good to go! 🚀

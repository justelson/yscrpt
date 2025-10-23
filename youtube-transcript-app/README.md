# YouTube Transcript App

Extract, analyze, and transform YouTube video transcripts with AI.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup MongoDB
- **Cloud (Recommended):** Sign up at https://www.mongodb.com/cloud/atlas
- **Local:** Install from https://www.mongodb.com/try/download/community

### 3. Configure Environment
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/youtube-transcript-app
SESSION_SECRET=your-random-secret-key
PORT=3001
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Start the App
```bash
npm run dev:all
```

Open http://localhost:5173

## ⚠️ Important

**Backend must be running before you can sign up/sign in!**

If you see JSON parsing errors, the backend isn't running. Use `npm run dev:all` to start both servers.

## 📚 Documentation

- **START_HERE.md** - Troubleshooting guide
- **MIGRATION_COMPLETE.md** - Full documentation
- **MONGODB_MIGRATION.md** - Setup details

## ✨ Features

- ✅ Password & Google authentication
- ✅ Save YouTube transcripts
- ✅ AI-powered analysis
- ✅ Profile picture upload
- ✅ Organized library
- ✅ Export (SRT, TXT, JSON)

## 🛠️ Tech Stack

- **Frontend:** React, Vite, TailwindCSS
- **Backend:** Express, MongoDB, Mongoose
- **Auth:** Bcrypt, Sessions, Google OAuth
- **AI:** Groq, Google Gemini

## 📝 Scripts

```bash
npm run dev        # Start frontend only
npm run server     # Start backend only
npm run dev:all    # Start both (recommended)
npm run build      # Build for production
```

## 🆘 Support

Check `START_HERE.md` if you encounter any issues.

---

Made with ❤️ for content creators, students, and researchers

# ✅ Setup Checklist

Use this checklist to get your app running:

## 📋 Pre-Flight Checklist

### 1. MongoDB Setup
- [ ] MongoDB installed OR MongoDB Atlas account created
- [ ] MongoDB running (if local) OR connection string obtained (if Atlas)
- [ ] Connection string tested

### 2. Environment Configuration
- [ ] `.env` file created in root directory
- [ ] `MONGODB_URI` set in .env
- [ ] `SESSION_SECRET` set in .env (random string)
- [ ] `PORT` set to 3001
- [ ] `CLIENT_URL` set to http://localhost:5173

### 3. Dependencies
- [ ] `npm install` completed successfully
- [ ] No error messages during installation

### 4. Start Application
- [ ] Backend started: `npm run server` OR
- [ ] Both servers started: `npm run dev:all`
- [ ] See "MongoDB Connected" message
- [ ] See "Server running on http://localhost:3001" message
- [ ] Frontend accessible at http://localhost:5173

---

## 🧪 Testing Checklist

### Authentication
- [ ] Can create account with email/password
- [ ] Can sign in with email/password
- [ ] Can sign in with Google
- [ ] Session persists on page refresh
- [ ] Can sign out successfully
- [ ] Invalid credentials are rejected

### Profile
- [ ] Profile displays in sidebar
- [ ] Can upload profile picture
- [ ] Google profile picture syncs automatically
- [ ] Can update name
- [ ] Changes save and persist

### Transcripts
- [ ] Can fetch transcript from YouTube URL
- [ ] Can save transcript to library
- [ ] Can view saved transcripts in library
- [ ] Can search transcripts
- [ ] Can delete transcripts
- [ ] Can download transcripts (SRT, TXT, JSON)

### AI Features (Optional)
- [ ] Can access AI Settings
- [ ] Can save API keys
- [ ] Can use AI tools
- [ ] Can save results to memories
- [ ] Can view memories
- [ ] Can delete memories

---

## 🐛 Troubleshooting Checklist

### If you see JSON parsing errors:
- [ ] Backend server is running
- [ ] Backend shows "Server running" message
- [ ] Can access http://localhost:3001 in browser
- [ ] No firewall blocking port 3001

### If MongoDB connection fails:
- [ ] MongoDB is running (if local)
- [ ] MONGODB_URI is correct in .env
- [ ] Network access configured (if Atlas)
- [ ] Database user created (if Atlas)
- [ ] IP address whitelisted (if Atlas)

### If session doesn't persist:
- [ ] SESSION_SECRET is set in .env
- [ ] Cookies are enabled in browser
- [ ] Not using incognito/private mode
- [ ] Backend server hasn't restarted

### If Google sign-in fails:
- [ ] Google OAuth credentials are valid
- [ ] Redirect URI is configured correctly
- [ ] Backend is running
- [ ] CORS is configured properly

---

## 📝 Environment Variables Checklist

Your `.env` file should have:

```env
✅ MONGODB_URI=mongodb://localhost:27017/youtube-transcript-app
✅ SESSION_SECRET=your-random-secret-key-here
✅ PORT=3001
✅ CLIENT_URL=http://localhost:5173
✅ NODE_ENV=development
```

---

## 🎯 Success Criteria

You're ready to go when:

✅ Backend terminal shows:
```
MongoDB Connected: localhost
Server running on http://localhost:3001
```

✅ Frontend opens at http://localhost:5173

✅ You can create an account and sign in

✅ Profile picture displays in sidebar

✅ You can save and view transcripts

---

## 📚 Documentation Reference

- **Having errors?** → Read `START_HERE.md`
- **Need full docs?** → Read `MIGRATION_COMPLETE.md`
- **Quick overview?** → Read `README.md`
- **Final summary?** → Read `FINAL_SUMMARY.md`

---

## ✨ All Done?

If all checkboxes are checked, congratulations! 🎉

Your app is fully set up and ready to use!

Start using it:
1. Create an account or sign in with Google
2. Paste a YouTube URL
3. Fetch and save transcripts
4. Explore AI tools
5. Build your library!

Enjoy! 🚀

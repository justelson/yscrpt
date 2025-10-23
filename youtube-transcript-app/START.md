# Quick Start Guide

## Running the Application

You need TWO terminal windows:

### Terminal 1 - Start Backend Server
```bash
cd youtube-transcript-app
npm run server
```
Wait for: "Server running on http://localhost:3001"

### Terminal 2 - Start Frontend
```bash
cd youtube-transcript-app
npm run dev
```
Wait for: "Local: http://localhost:5173/"

Then open http://localhost:5173 in your browser!

## Testing the App

Try these YouTube URLs:
- https://www.youtube.com/watch?v=dQw4w9WgXcQ
- Any YouTube video URL with captions/subtitles

## Troubleshooting

**Port already in use?**
- Kill the process using that port or change the port in the code

**No transcript available?**
- The video might not have captions/subtitles enabled

**CORS errors?**
- Make sure the backend server is running on port 3001

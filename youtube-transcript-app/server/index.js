import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Innertube } from 'youtubei.js';
import connectDB from './db.js';
import User from './models/User.js';
import Transcript from './models/Transcript.js';
import AISettings from './models/AISettings.js';
import Memory from './models/Memory.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
}));

// Middleware to check authentication
const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Extract video ID from URL (including Shorts)
function extractVideoId(url) {
    // Handle regular YouTube URLs
    const regularRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const regularMatch = url.match(regularRegex);
    if (regularMatch) return regularMatch[1];

    // Handle YouTube Shorts URLs (youtube.com/shorts/VIDEO_ID)
    const shortsRegex = /youtube\.com\/shorts\/([^"&?/\s]{11})/;
    const shortsMatch = url.match(shortsRegex);
    if (shortsMatch) return shortsMatch[1];

    return null;
}

// ============ AUTH ROUTES ============

// Email/Password Sign Up
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password
        const bcrypt = await import('bcryptjs');
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            email,
            password: hashedPassword,
            name: name || '',
        });

        req.session.userId = user._id;
        res.json({ user: { id: user._id, email: user.email, name: user.name, photoURL: user.photoURL } });
    } catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

// Email/Password Sign In
app.post('/api/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Find user (include password field)
        const user = await User.findOne({ email }).select('+password');
        if (!user || !user.password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check password
        const bcrypt = await import('bcryptjs');
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        req.session.userId = user._id;
        res.json({ user: { id: user._id, email: user.email, name: user.name, photoURL: user.photoURL } });
    } catch (error) {
        console.error('Sign in error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// Google Sign In - Create or get user
app.post('/api/auth/google', async (req, res) => {
    try {
        const { email, name, photoURL, googleId } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                email,
                name: name || '',
                photoURL: photoURL || '',
                googleId,
            });
        } else if (googleId && !user.googleId) {
            user.googleId = googleId;
            user.name = name || user.name;
            user.photoURL = photoURL || user.photoURL;
            await user.save();
        }

        req.session.userId = user._id;
        res.json({ user: { id: user._id, email: user.email, name: user.name, photoURL: user.photoURL } });
    } catch (error) {
        console.error('Google auth error:', error);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// Get current user
app.get('/api/auth/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const user = await User.findById(req.session.userId).select('-__v');
        if (!user) {
            req.session.destroy();
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user: { id: user._id, email: user.email, name: user.name, photoURL: user.photoURL } });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// Sign out
app.post('/api/auth/signout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to sign out' });
        }
        res.json({ message: 'Signed out successfully' });
    });
});

// ============ USER PROFILE ROUTES ============

// Get user profile
app.get('/api/user/profile', requireAuth, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select('-__v');
        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Update user profile
app.put('/api/user/profile', requireAuth, async (req, res) => {
    try {
        const { name, photoURL } = req.body;
        const user = await User.findByIdAndUpdate(
            req.session.userId,
            { name, photoURL },
            { new: true, runValidators: true }
        ).select('-__v');
        res.json(user);
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// ============ TRANSCRIPT ROUTES ============

// Get video info and transcript
app.post('/api/video-info', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const youtube = await Innertube.create();
        const info = await youtube.getInfo(videoId);

        const videoDetails = {
            title: info.basic_info.title,
            author: info.basic_info.author,
            lengthSeconds: info.basic_info.duration,
            viewCount: info.basic_info.view_count,
            uploadDate: info.basic_info.upload_date,
            description: info.basic_info.short_description,
            thumbnails: info.basic_info.thumbnail,
            videoId: videoId,
        };

        res.json(videoDetails);
    } catch (error) {
        console.error('Error fetching video info:', error);
        res.status(500).json({ error: 'Failed to fetch video information' });
    }
});

// Get transcript
app.post('/api/transcript', async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const videoId = extractVideoId(url);
        if (!videoId) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
        }

        const youtube = await Innertube.create();
        const info = await youtube.getInfo(videoId);

        // Check if it's a Short
        const isShort = url.includes('/shorts/') || info.basic_info.duration < 60;

        // Get transcript
        let transcriptData;
        try {
            transcriptData = await info.getTranscript();
        } catch (transcriptError) {
            console.error('Transcript fetch error:', transcriptError);

            if (isShort) {
                return res.status(404).json({
                    error: 'YouTube Shorts typically don\'t have transcripts. Most Shorts creators don\'t add captions, and YouTube doesn\'t auto-generate them for short videos.',
                    isShort: true
                });
            }

            return res.status(404).json({
                error: 'No transcript available for this video. The creator may not have enabled captions.',
                isShort: false
            });
        }

        if (!transcriptData || !transcriptData.transcript) {
            if (isShort) {
                return res.status(404).json({
                    error: 'This Short doesn\'t have a transcript. YouTube Shorts rarely have captions.',
                    isShort: true
                });
            }
            return res.status(404).json({
                error: 'No transcript available for this video',
                isShort: false
            });
        }

        // Format transcript
        const transcript = transcriptData.transcript.content.body.initial_segments.map(
            (segment) => ({
                text: segment.snippet.text,
                offset: segment.start_ms,
                duration: segment.end_ms - segment.start_ms,
            })
        );

        res.json({ transcript, isShort });
    } catch (error) {
        console.error('Error fetching transcript:', error);
        res.status(500).json({
            error: 'Failed to fetch transcript. The video might not have captions available.',
        });
    }
});

// Get channel videos
app.post('/api/channel-videos', async (req, res) => {
    try {
        const { channelUrl, limit = 10 } = req.body;

        if (!channelUrl) {
            return res.status(400).json({ error: 'Channel URL is required' });
        }

        const youtube = await Innertube.create();

        // Extract channel ID or handle from URL
        let channel;
        if (channelUrl.includes('/@')) {
            const handle = channelUrl.split('/@')[1].split('/')[0];
            channel = await youtube.getChannel(handle);
        } else if (channelUrl.includes('/channel/')) {
            const channelId = channelUrl.split('/channel/')[1].split('/')[0];
            channel = await youtube.getChannel(channelId);
        } else {
            return res.status(400).json({ error: 'Invalid channel URL format' });
        }

        const videos = await channel.getVideos();

        // Get the first N videos
        const videoList = videos.videos.slice(0, limit).map(video => ({
            videoId: video.id,
            title: video.title.text,
            author: video.author.name,
            lengthSeconds: video.duration.seconds,
            viewCount: video.view_count?.text || '0',
            uploadDate: video.published.text,
            thumbnails: video.thumbnails,
            description: video.description || '',
        }));

        res.json({
            channelName: channel.metadata.title,
            videos: videoList
        });
    } catch (error) {
        console.error('Error fetching channel videos:', error);
        res.status(500).json({ error: 'Failed to fetch channel videos' });
    }
});

// Save transcript
app.post('/api/transcripts', requireAuth, async (req, res) => {
    try {
        const transcript = await Transcript.create({
            ...req.body,
            userId: req.session.userId,
        });
        res.json(transcript);
    } catch (error) {
        console.error('Save transcript error:', error);
        res.status(500).json({ error: 'Failed to save transcript' });
    }
});

// Get user's transcripts
app.get('/api/transcripts', requireAuth, async (req, res) => {
    try {
        const transcripts = await Transcript.find({ userId: req.session.userId })
            .sort({ createdAt: -1 })
            .select('-__v');
        res.json(transcripts);
    } catch (error) {
        console.error('Get transcripts error:', error);
        res.status(500).json({ error: 'Failed to get transcripts' });
    }
});

// Delete transcript
app.delete('/api/transcripts/:id', requireAuth, async (req, res) => {
    try {
        const transcript = await Transcript.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.userId,
        });
        if (!transcript) {
            return res.status(404).json({ error: 'Transcript not found' });
        }
        res.json({ message: 'Transcript deleted' });
    } catch (error) {
        console.error('Delete transcript error:', error);
        res.status(500).json({ error: 'Failed to delete transcript' });
    }
});

// Delete all transcripts
app.delete('/api/transcripts', requireAuth, async (req, res) => {
    try {
        const result = await Transcript.deleteMany({ userId: req.session.userId });
        res.json({ message: `Deleted ${result.deletedCount} transcripts` });
    } catch (error) {
        console.error('Delete all transcripts error:', error);
        res.status(500).json({ error: 'Failed to delete transcripts' });
    }
});

// ============ AI SETTINGS ROUTES ============

// Get AI settings
app.get('/api/ai-settings', requireAuth, async (req, res) => {
    try {
        let settings = await AISettings.findOne({ userId: req.session.userId });
        if (!settings) {
            settings = await AISettings.create({ userId: req.session.userId });
        }
        res.json(settings);
    } catch (error) {
        console.error('Get AI settings error:', error);
        res.status(500).json({ error: 'Failed to get AI settings' });
    }
});

// Update AI settings
app.put('/api/ai-settings', requireAuth, async (req, res) => {
    try {
        const settings = await AISettings.findOneAndUpdate(
            { userId: req.session.userId },
            { ...req.body, updatedAt: Date.now() },
            { new: true, upsert: true, runValidators: true }
        );
        res.json(settings);
    } catch (error) {
        console.error('Update AI settings error:', error);
        res.status(500).json({ error: 'Failed to update AI settings' });
    }
});

// ============ MEMORY ROUTES ============

// Save memory
app.post('/api/memories', requireAuth, async (req, res) => {
    try {
        console.log('=== SAVE MEMORY REQUEST ===');
        console.log('Request body keys:', Object.keys(req.body));
        console.log('Type:', req.body.type);
        console.log('Title:', req.body.title);
        console.log('Messages:', req.body.messages ? `Array with ${req.body.messages.length} items` : 'undefined');

        // Log first message if exists
        if (req.body.messages && req.body.messages.length > 0) {
            console.log('First message:', JSON.stringify(req.body.messages[0], null, 2));
        }

        // Validate required fields
        if (!req.body.type) {
            console.error('ERROR: Type is missing!');
            return res.status(400).json({ error: 'Type is required' });
        }

        if (!req.body.title) {
            console.error('ERROR: Title is missing!');
            return res.status(400).json({ error: 'Title is required' });
        }

        const memory = await Memory.create({
            ...req.body,
            userId: req.session.userId,
        });

        console.log('✓ Memory saved successfully:', {
            id: memory._id,
            type: memory.type,
            messagesCount: memory.messages?.length,
            cardsCount: memory.cards?.length,
            hasMessages: !!memory.messages,
        });

        // Verify what was actually saved
        const savedMemory = await Memory.findById(memory._id);
        console.log('✓ Verified saved memory:', {
            id: savedMemory._id,
            messagesInDb: savedMemory.messages?.length,
            firstMessageInDb: savedMemory.messages?.[0],
        });

        res.json(memory);
    } catch (error) {
        console.error('✗ Save memory error:', error.message);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to save memory: ' + error.message });
    }
});

// Get user's memories
app.get('/api/memories', requireAuth, async (req, res) => {
    try {
        const memories = await Memory.find({ userId: req.session.userId })
            .sort({ createdAt: -1 })
            .select('-__v');

        console.log('=== GET MEMORIES ===');
        console.log('Total memories:', memories.length);

        // Log chat memories specifically
        const chatMemories = memories.filter(m => m.type === 'chat');
        console.log('Chat memories:', chatMemories.length);
        if (chatMemories.length > 0) {
            console.log('First chat memory:', {
                id: chatMemories[0]._id,
                title: chatMemories[0].title,
                hasMessages: !!chatMemories[0].messages,
                messagesCount: chatMemories[0].messages?.length,
                firstMessage: chatMemories[0].messages?.[0],
            });
        }

        res.json(memories);
    } catch (error) {
        console.error('Get memories error:', error);
        res.status(500).json({ error: 'Failed to get memories' });
    }
});

// Delete memory
app.delete('/api/memories/:id', requireAuth, async (req, res) => {
    try {
        const memory = await Memory.findOneAndDelete({
            _id: req.params.id,
            userId: req.session.userId,
        });
        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }
        res.json({ message: 'Memory deleted' });
    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ error: 'Failed to delete memory' });
    }
});

// Serve static files from the React app build directory
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../dist')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

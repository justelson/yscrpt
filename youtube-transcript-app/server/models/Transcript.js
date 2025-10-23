import mongoose from 'mongoose';

const transcriptSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    videoId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: String,
    lengthSeconds: Number,
    viewCount: String,
    uploadDate: String,
    description: String,
    thumbnails: mongoose.Schema.Types.Mixed,
    transcript: [{
        text: String,
        offset: Number,
        duration: Number,
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

transcriptSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Transcript', transcriptSchema);

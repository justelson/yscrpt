import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    transcriptId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transcript',
    },
    type: {
        type: String,
        required: false, // Temporarily optional for debugging
        enum: ['chat', 'questions', 'flashcards', 'summary', 'keypoints', 'rewrite', 'translate'],
    },
    title: {
        type: String,
        required: true,
    },
    videoTitle: String,
    toolName: String,
    result: String,
    // For flashcards and questions
    cards: [{
        question: String,
        answer: String,
        front: String,  // For flashcards
        back: String,   // For flashcards
    }],
    // For chat conversations
    messages: [{
        role: String,
        content: String,
        timestamp: Date,
    }],
    // Additional metadata
    metadata: {
        provider: String,
        model: String,
        options: mongoose.Schema.Types.Mixed,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

memorySchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('Memory', memorySchema);

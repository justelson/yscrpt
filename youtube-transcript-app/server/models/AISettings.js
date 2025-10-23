import mongoose from 'mongoose';

const aiSettingsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    groqApiKey: String,
    geminiApiKey: String,
    groqUnlocked: {
        type: Boolean,
        default: false,
    },
    geminiUnlocked: {
        type: Boolean,
        default: false,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('AISettings', aiSettingsSchema);

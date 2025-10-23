import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        select: false, // Don't return password by default
    },
    name: {
        type: String,
        default: '',
    },
    photoURL: {
        type: String,
        default: '',
    },
    googleId: {
        type: String,
        sparse: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('User', userSchema);

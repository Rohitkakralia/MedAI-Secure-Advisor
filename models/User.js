import mongoose from 'mongoose';
import { DstAlphaFactor } from 'three';
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    name: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: function() {
            return this.provider === 'credentials';
        }
    },
    provider: {
        type: String,
        enum: ['credentials', 'google'],
        default: 'credentials'
    },
    profilePicture: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    location: {
        type: String,
        default: ''
    },
    Qualification: {
        type: String,
        default: ''
    },
    specialty: {
        type: String,
        default: ''
    },
    Years_in_Practice: {
        type: Number,
        default: 0
    },
    Hospital_Affiliation: {
        type: String,
        default: ''
    },
    licenseNumber: {
        type: String,
        default: ''
    },
    mobile: {
        type: String,
        default: ''
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    role: {
        type: String,
        enum: ['patient', 'doctor', 'admin'],
        default: 'patient'
    }
}, {
    timestamps: true
});

export default mongoose.models.User || model('User', userSchema);
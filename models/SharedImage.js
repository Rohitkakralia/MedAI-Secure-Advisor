// file: models/SharedImage.js
import mongoose from 'mongoose';

const SharedImageSchema = new mongoose.Schema({
  // Sender information
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  senderName: {
    type: String,
    required: true
  },
  
  
  // Receiver information
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverName: {
    type: String,
    required: true
  },
 
  
  // Sharing metadata
  sharedAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['shared', 'viewed', 'downloaded', 'deleted'],
    default: 'shared'
  },
  
  // Image information
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image',
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  iv: {
    type: String,
    required: true
  },
  
  // Patient information
  patientName: {
    type: String,
    default: 'Not specified'
  },
  patientAge: {
    type: Number,
    default: 0
  },
  patientDisease: {
    type: String,
    default: 'Not specified'
  },
  patientGender: {
    type: String,
    default: 'Not specified'
  },
  
  // Optional comments
  notes: {
    type: String
  }
});

// Index for faster queries
SharedImageSchema.index({ sender: 1, receiver: 1 });
SharedImageSchema.index({ receiver: 1, isRead: 1 });

// Create the model if it doesn't exist or get it if it does
const SharedImage = mongoose.models.SharedImage || mongoose.model('SharedImage', SharedImageSchema);

export default SharedImage;
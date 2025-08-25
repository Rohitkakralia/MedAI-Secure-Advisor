import mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true 
  },
  userName: { 
    type: String, 
    required: true 
  },  
  hash: { 
    type: String, 
    required: true 
  },
  iv: { 
    type: String 
  },
  fileName: { 
    type: String 
  },
  patientName: { 
    type: String 
  },
  patientAge: { 
    type: Number 
  },
  patientDisease: { 
    type: String 
  },
  patientGender: { 
    type: String 
  },
  fileType: {  // New field for storing file type
    type: String,
    default: "application/octet-stream"
  },
  uploadDate: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.models.Image || mongoose.model('Image', ImageSchema);
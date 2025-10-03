import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctorId: {type: String},
  patientEmail: { type: String },  // we can link via email if needed
  calendlyEventUri: { type: String, required: true, unique: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String }, // active, canceled, completed
});

export default mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);

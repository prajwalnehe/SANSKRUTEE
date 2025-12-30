import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    value: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

// Ensure only one document exists per key
settingsSchema.index({ key: 1 }, { unique: true });

const Settings = mongoose.models.Settings || mongoose.model('Settings', settingsSchema);
export default Settings;
export { Settings };






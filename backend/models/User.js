import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    // Optional for OAuth users
    passwordHash: { type: String },
    // OAuth fields
    googleId: { type: String, unique: true, sparse: true, index: true },
    avatar: { type: String },
    provider: { type: String, enum: ['local', 'google'], default: 'google' },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.hashPassword = async function hashPassword(plainPassword) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainPassword, salt);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
export { User };



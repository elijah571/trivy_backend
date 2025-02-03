import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, default: 'Teacher' }, 
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true });

export const Teacher = mongoose.model('Teacher', teacherSchema);

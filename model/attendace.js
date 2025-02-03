// models/attendance.js
import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', required: true },
  students: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
      status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
      remarks: { type: String, default: '' },
    }
  ],
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export const Attendance = mongoose.model('Attendance', attendanceSchema);

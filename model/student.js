// models/student.js
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

// Import the Attendance model
import { Attendance } from './attendace.js';  

const studentSchema = new mongoose.Schema(
  {
    studentID: { 
      type: String, 
      unique: true, 
      default: () => uuidv4(),  // Default student ID if not provided
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    grade: { type: String, required: true },
    dob: { type: Date, required: true },
   
    attendance: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attendance' }],
  },
  { timestamps: true }
);

export const Student = mongoose.model('Student', studentSchema);

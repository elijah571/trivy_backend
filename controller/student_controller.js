// controllers/student_controller.js
import mongoose from 'mongoose';
import { Student } from '../model/student.js';
import { Attendance } from '../model/attendace.js'; 
import { v4 as uuidv4 } from 'uuid';

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const { name, grade, dob, email, studentID } = req.body;

    // Validate required fields
    if (!name || !grade || !dob) {
      return res.status(400).json({ message: 'Name, grade, and date of birth are required.' });
    }

    // Validate date of birth
    if (isNaN(new Date(dob))) {
      return res.status(400).json({ message: 'Invalid date of birth.' });
    }

    // Ensure email is provided (if email is required)
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    // Validate email format
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    // Generate studentID if not provided
    const newStudentID = studentID || uuidv4();  // Use provided studentID or generate one

    // Create a new student document
    const student = new Student({
      studentID: newStudentID,
      name,
      grade,
      dob,
      email,
    });

    // Save the student to the database
    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (err) {
    console.error(err);  // Log the error to the console for debugging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all students with populated attendance
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('attendance');  // Populate attendance
    res.status(200).json(students);
  } catch (err) {
    console.error(err);  // Log the error to the console for debugging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get student by ID with populated attendance
export const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Check if studentId is valid
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format.' });
    }

    // Find student and populate attendance
    const student = await Student.findById(studentId).populate('attendance');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error(err);  // Log the error to the console for debugging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update student information
export const updateStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Check if studentId is valid
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format.' });
    }

    const { name, grade, dob, email } = req.body;

    const updatedStudentData = {};

    if (name) updatedStudentData.name = name;
    if (grade) updatedStudentData.grade = grade;
    if (dob) updatedStudentData.dob = dob;
    if (email) updatedStudentData.email = email;

    // Update student details
    const student = await Student.findByIdAndUpdate(studentId, updatedStudentData, { new: true });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student updated successfully', student });
  } catch (err) {
    console.error(err);  // Log the error to the console for debugging
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    // Check if studentId is valid
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid student ID format.' });
    }

    // Delete student
    const student = await Student.findByIdAndDelete(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

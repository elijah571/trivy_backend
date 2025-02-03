import bcryptjs from 'bcryptjs';
import { Teacher } from "../model/teacher.js";
import { generateToken } from '../utils/generateToken.js';

// Create a new teacher
export const createTeacher = async (req, res) => {
  try {
    const { username, password, name, email, role } = req.body;

    // Check if the teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Teacher already exists' });
    }

    const hashPassword = await bcryptjs.hash(password, 10);  

    // Create and save new teacher
    const teacher = new Teacher({
      username,
      password: hashPassword,
      name,
      email,
      role,
    });

    await teacher.save();
    return res.status(201).json({ message: 'Teacher created successfully', teacher });

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login teacher
export const loginTeacher = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Compare the entered password with the hashed password
    const isMatch = await bcryptjs.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(res, teacher._id);

    // Send back user details (including username)
    return res.status(200).json({
      id: teacher._id,
      username: teacher.username,
      email: teacher.email,
      role: teacher.role,
      token,
      message: 'Login successful',
    });

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get all teachers
export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    return res.status(200).json(teachers);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get teacher by ID
export const getTeacherById = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.status(200).json(teacher);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update teacher information
export const updateTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;
    const { username, password, name, email, role } = req.body;

    // If password is provided, hash it
    let hashedPassword = password;
    if (password) {
      hashedPassword = await bcryptjs.hash(password, 10);
    }

    // Update teacher details
    const teacher = await Teacher.findByIdAndUpdate(
      teacherId,
      { username, password: hashedPassword, name, email, role },
      { new: true }
    );

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.status(200).json({ message: 'Teacher updated successfully', teacher });

  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete teacher
export const deleteTeacher = async (req, res) => {
  try {
    const teacherId = req.params.id;

    // Delete teacher
    const teacher = await Teacher.findByIdAndDelete(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    return res.status(200).json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Admin functionality
export const admin = async (req, res) => {
  const { username, password, name, email } = req.body;

  // Check if all required fields are provided
  if (!username || !password || !name || !email) {
    return res.status(400).json({ message: 'Please provide all fields' });
  }

  try {
    // Check if user with the same username or email already exists
    const existingUser = await Teacher.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password before saving it
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new admin user
    const adminUser = new Teacher({
      username,
      password: hashedPassword,
      name,
      email,
      role: 'admin',
      isAdmin: true, // Ensure the user is an admin
    });

    // Save the new admin user to the database
    await adminUser.save();
    
    // Respond with success message
    return res.status(201).json({ message: 'Admin user created successfully' });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Logout teacher
export const logoutTeacher = (req, res) => {
  try {
    res.clearCookie('token'); // Clear the token from the cookies
    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

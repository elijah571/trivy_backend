import express from 'express';
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} from '../controller/student_controller.js';  
import { authorized, isAdmin, isTeacher } from '../middleware/authenticate_user.js';

const studentRouter = express.Router();

// Route to create a new student (can be restricted to Admin or Teacher)
studentRouter.post('/', authorized, isAdmin, createStudent);

// Route to get all students
studentRouter.get('/', authorized, getAllStudents);

// Route to get a specific student by ID
studentRouter.get('/:id', authorized, isTeacher, getStudentById);

// Route to update student information (only Admin)
studentRouter.put('/:id', authorized, isAdmin, updateStudent);

// Route to delete a student (only Admin)
studentRouter.delete('/:id', authorized, isAdmin, deleteStudent);

export default studentRouter;

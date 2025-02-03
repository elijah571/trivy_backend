import express from 'express';
import { createTeacher, loginTeacher, getAllTeachers, getTeacherById, updateTeacher, deleteTeacher, admin, logoutTeacher } from "../controller/teacher_controller.js"
import { authorized, isTeacher, isAdmin } from '../middleware/authenticate_user.js';

const teacher_router = express.Router();
//Route for Admin
teacher_router.post('/create-admin', admin)
// Route to create a new teacher
teacher_router.post('/create', isAdmin,   createTeacher);
                  
// Route to login teacher (this will generate and send the token)
teacher_router.post('/login', loginTeacher);
//Route to logout teacher
teacher_router.post('/logout', logoutTeacher)

// Route to get all teachers (protected route, authorized users only)
teacher_router.get('/', authorized, isAdmin, getAllTeachers);

// Route to get a specific teacher by ID (protected route)
teacher_router.get('/:id', authorized,  isTeacher, getTeacherById);

// Route to update teacher information (protected route)
teacher_router.put('/:id', authorized, isAdmin, updateTeacher);

// Route to delete a teacher (protected route)
teacher_router.delete('/:id', authorized, isAdmin, deleteTeacher);

export default teacher_router;

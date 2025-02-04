import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/dataBase.js';
import cookieParser from 'cookie-parser';
import teacher_router from './route/teacher_route.js';
import studentRouter from './route/student_route.js';
import attendanceRouter from './route/atendance_route.js';

dotenv.config();

// Initialize the app first
const app = express();

// Set up the port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: 'https://trivy-frontend-eiisy01w5-elijahs-projects-e0099976.vercel.app',
  credentials: true, // Allows cookies to be sent
};


// Connect to the database
connectDb();

app.use(express.json());

// Routes
app.use('/api/teachers', teacher_router);
app.use('/api/students', studentRouter);
app.use('/api/attendance', attendanceRouter);

// Start the server
app.listen(PORT, () => {
  console.log("Server running on Port:", PORT);
});

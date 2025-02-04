import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/dataBase.js';
import cookieParser from 'cookie-parser';
import teacher_router from './route/teacher_route.js';
import studentRouter from './route/student_route.js';
import attendanceRouter from './route/attendance_route.js';

dotenv.config();

// Initialize the app
const app = express();

// Set up the port
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cookieParser());  // Initialize cookieParser before other middleware
app.use(express.json());  // Parse JSON payloads

// Update CORS options for local and production environments
const corsOptions = {
  origin: [
    'https://trivy-frontend.onrender.com',  // Production Frontend (Render)
    'https://trivy-frontend-eiisy01w5-elijahs-projects-e0099976.vercel.app',  // Other frontend URL (Vercel)
    'https://trivy-frontend.vercel.app',    // Another production frontend URL (Vercel)
    'http://localhost:5173',                // Local development frontend
  ],
  credentials: true,  // Allows cookies to be sent with the request
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific methods (optional)
};

// Use CORS middleware with the configured options
app.use(cors(corsOptions));

// Connect to the database
connectDb();

// Define Routes
app.use('/api/teachers', teacher_router);
app.use('/api/students', studentRouter);
app.use('/api/attendance', attendanceRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});

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

// CORS configuration to accept requests from any frontend
app.use(cors({
  origin: "*", // Allows all origins
  methods: ["POST", "GET", "PUT", "DELETE"], // Allow these HTTP methods
  credentials: true, // Allows cookies to be sent
}));

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

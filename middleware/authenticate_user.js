import jwt from "jsonwebtoken";
import {Teacher} from "../model/teacher.js"
export const authorized = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Not authorized, token expired' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const isTeacher = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (teacher.role.toLowerCase() !== 'teacher') {
      return res.status(403).json({ message: 'Access denied, not a teacher' });
    }

    req.teacher = teacher;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (!teacher.isAdmin) {
      return res.status(403).json({ message: 'Access denied, not an admin' });
    }

    req.teacher = teacher;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const isTeacherOrAdmin = async (req, res, next) => {
  try {
    const teacher = await Teacher.findById(req.user.id);

    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    if (teacher.role.toLowerCase() === 'teacher' || teacher.isAdmin) {
      req.teacher = teacher;
      return next();
    }

    return res.status(403).json({ message: 'Access denied, not authorized' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

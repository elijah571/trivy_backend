import { Attendance } from '../model/attendace.js';
import { Teacher } from '../model/teacher.js';
import { Student } from '../model/student.js';

// ✅ Mark Attendance for Students
export const markAttendance = async (req, res) => {
  try {
    const teacherId = req.user.id; // Get teacher ID from authenticated user

    // Ensure teacher exists
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: 'Teacher not found' });
    }

    // Validate students
    const studentIds = req.body.studentStatuses.map(status => status.studentId);
    const students = await Student.find({ '_id': { $in: studentIds } });

    if (students.length !== studentIds.length) {
      return res.status(404).json({ message: 'Some students not found' });
    }

    // Prepare attendance records
    const studentsAttendance = req.body.studentStatuses.map(status => ({
      student: status.studentId,
      status: status.status,
      remarks: status.remarks || 'No remarks', // Default remark if empty
    }));

    // Save attendance
    const attendance = new Attendance({
      teacher: teacherId,
      students: studentsAttendance,
      date: req.body.date || new Date(),
    });

    await attendance.save();
    res.status(201).json({ message: 'Attendance marked successfully', attendance });

  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const getTeacherAttendance = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    let attendanceRecords;
    if (teacherId === "all") {
      // Fetch all attendance records
      attendanceRecords = await Attendance.find()
        .populate("teacher")
        .populate("students.student");
    } else {
      // Fetch attendance records for a specific teacher
      attendanceRecords = await Attendance.find({ teacher: teacherId })
        .populate("teacher")
        .populate("students.student");
    }

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: "No attendance records found" });
    }

    res.status(200).json(attendanceRecords);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getAllAttendance = async (req, res) => {
  try {
    // Fetch all attendance, sorted by date (latest first)
    const attendanceRecords = await Attendance.find()
      .populate('teacher', 'name email')
      .populate('students.student', 'name')
      .sort({ date: -1 });

    if (!attendanceRecords.length) {
      return res.status(404).json({ message: 'No attendance records found' });
    }

    res.status(200).json(attendanceRecords);
  } catch (err) {
    console.error('Error fetching all attendance:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ✅ Delete Attendance
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the attendance record by ID
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    res.status(200).json({ message: 'Attendance record deleted successfully' });
  } catch (err) {
    console.error('Error deleting attendance:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};


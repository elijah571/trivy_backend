import jwt from 'jsonwebtoken';

export const generateToken = async (res, teacher) => {
  try {
    // Include additional information in the payload (e.g., role, isAdmin)
    const token = jwt.sign(
      { id: teacher._id, role: teacher.role, isAdmin: teacher.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set the token in cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true if in production (requires HTTPS)
      maxAge: 24 * 60 * 60 * 1000,  // 1 day expiration
    });

    
  } catch (error) {
    res.status(500).json({ message: 'Error generating token', error: error.message });
  }
};

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const authController = {
  // POST /api/auth/signup
  async signup(req, res) {
    const connection = await pool.getConnection();
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required (name, email, password, role)' });
      }

      if (!['student', 'admin', 'placement_cell'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }

      // Check if user exists
      const [existing] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Start transaction
      await connection.beginTransaction();

      // Insert into users
      const [userResult] = await connection.execute(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role]
      );
      const userId = userResult.insertId;

      // If student, also insert into students table with placeholders
      if (role === 'student') {
        await connection.execute(
          'INSERT INTO students (user_id, name, roll_no, branch, joined_year, semester, cgpa) VALUES (?, ?, NULL, NULL, NULL, NULL, NULL)',
          [userId, name]
        );
      }

      await connection.commit();

      // Generate JWT
      const accessToken = jwt.sign(
        { id: userId, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.status(201).json({
        accessToken,
        user: {
          id: userId,
          name,
          email,
          role,
        },
      });
    } catch (error) {
      await connection.rollback();
      console.error('Signup error:', error);
      res.status(500).json({ message: 'Server error' });
    } finally {
      connection.release();
    }
  },

  // POST /api/auth/signin
  async signin(req, res) {
    try {
      const { email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = users[0];

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Get display name
      let displayName = email.split('@')[0];
      if (user.role === 'student') {
        const [students] = await pool.execute('SELECT name FROM students WHERE user_id = ?', [user.id]);
        if (students.length > 0 && students[0].name) {
          displayName = students[0].name;
        }
      }

      // Generate JWT
      const accessToken = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.json({
        accessToken,
        user: {
          id: user.id,
          name: displayName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('Signin error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Legacy route aliases
  async register(req, res) {
    return authController.signup(req, res);
  },

  async login(req, res) {
    return authController.signin(req, res);
  },

  // GET /api/auth/me
  async getMe(req, res) {
    try {
      const [users] = await pool.execute('SELECT id, email, role FROM users WHERE id = ?', [req.user.id]);
      if (users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = users[0];
      let displayName = user.email.split('@')[0];

      if (user.role === 'student') {
        const [students] = await pool.execute('SELECT name FROM students WHERE user_id = ?', [user.id]);
        if (students.length > 0 && students[0].name) {
          displayName = students[0].name;
        }
      }

      res.json({
        user: {
          id: user.id,
          name: displayName,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('GetMe error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // POST /api/auth/logout
  async logout(req, res) {
    res.json({ message: 'Logged out successfully' });
  },
};

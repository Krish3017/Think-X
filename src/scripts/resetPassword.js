import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function resetPassword(email, newPassword) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const [result] = await connection.execute(
      'UPDATE users SET password_hash = ? WHERE email = ?',
      [hashedPassword, email]
    );

    if (result.affectedRows === 0) {
      console.log(`❌ User not found: ${email}`);
    } else {
      console.log(`✅ Password updated for: ${email}`);
      console.log(`   New password: ${newPassword}`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

// Usage: node src/scripts/resetPassword.js
const email = process.argv[2] || 'krishramanandi2007@gmail.com';
const password = process.argv[3] || 'password123';

resetPassword(email, password);

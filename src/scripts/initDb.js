import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function initDatabase() {
    // First connect without database to create it
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306'),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'thinkx';

    console.log(`Creating database "${dbName}" if not exists...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    // mysql2 execute() with prepared statements can't handle USE; use query instead
    await connection.query(`USE \`${dbName}\``);

    // Create tables
    const tables = [
        `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('student', 'admin', 'placement_cell') NOT NULL DEFAULT 'student',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

        `CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      roll_no VARCHAR(50),
      name VARCHAR(255) NOT NULL,
      branch VARCHAR(100),
      joined_year INT,
      semester INT,
      cgpa DECIMAL(4,2),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS student_skills (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      skill_name VARCHAR(100) NOT NULL,
      proficiency_level ENUM('beginner', 'intermediate', 'advanced', 'expert') DEFAULT 'beginner',
      progress INT DEFAULT 0,
      is_current BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS placements (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      company_name VARCHAR(255),
      role_offered VARCHAR(255),
      package_lpa DECIMAL(6,2),
      status ENUM('applied', 'shortlisted', 'interviewed', 'offered', 'accepted', 'rejected') DEFAULT 'applied',
      applied_date DATE,
      result_date DATE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS student_activity (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      platform ENUM('leetcode', 'github') NOT NULL,
      current_streak INT DEFAULT 0,
      longest_streak INT DEFAULT 0,
      total_count INT DEFAULT 0,
      activity_date DATE,
      daily_count INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS student_resumes (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      file_url VARCHAR(500),
      file_name VARCHAR(255),
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS resume_analysis (
      id INT AUTO_INCREMENT PRIMARY KEY,
      resume_id INT NOT NULL,
      overall_score INT DEFAULT 0,
      detected_skills JSON,
      missing_skills JSON,
      suggestions JSON,
      analyzed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (resume_id) REFERENCES student_resumes(id) ON DELETE CASCADE
    )`,

        `CREATE TABLE IF NOT EXISTS training_programs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      skill_tags JSON,
      provider VARCHAR(255),
      duration_hours INT,
      difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
      url VARCHAR(500),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

        `CREATE TABLE IF NOT EXISTS admin_metrics (
      id INT AUTO_INCREMENT PRIMARY KEY,
      metric_name VARCHAR(100) NOT NULL,
      metric_value DECIMAL(10,2),
      metric_date DATE,
      category VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,
    ];

    for (const sql of tables) {
        await connection.execute(sql);
    }

    console.log('✅ All tables created successfully');

    // Insert sample data for testing
    console.log('Inserting sample data...');

    // Check if sample data already exists
    const [existingUsers] = await connection.execute('SELECT COUNT(*) as count FROM users');
    if (existingUsers[0].count > 0) {
        console.log('Sample data already exists, skipping...');
        await connection.end();
        return;
    }

    // Sample user (password: "password123" hashed with bcrypt)
    const bcryptHash = '$2a$10$xVqYLGMHz4P5OJnnVIGqkeSUGPdZwNfHP7XtWIzbLiJPmDNGN3NRe';

    await connection.execute(
        'INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)',
        ['alex@example.com', bcryptHash, 'student']
    );

    const [userResult] = await connection.execute('SELECT LAST_INSERT_ID() as id');
    const userId = userResult[0].id;

    await connection.execute(
        'INSERT INTO students (user_id, roll_no, name, branch, joined_year, semester, cgpa) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, 'CS2021001', 'Alex Johnson', 'Computer Science', 2021, 6, 8.5]
    );

    const [studentResult] = await connection.execute('SELECT LAST_INSERT_ID() as id');
    const studentId = studentResult[0].id;

    // Skills
    const skills = [
        ['Python', 'advanced', 80, true],
        ['JavaScript', 'intermediate', 65, true],
        ['SQL', 'intermediate', 60, true],
        ['Git', 'intermediate', 55, true],
        ['HTML/CSS', 'advanced', 75, true],
        ['React', 'beginner', 20, false],
        ['AWS', 'beginner', 15, false],
        ['Docker', 'beginner', 10, false],
        ['TypeScript', 'beginner', 25, false],
        ['ML', 'beginner', 30, false],
    ];

    for (const [name, level, progress, isCurrent] of skills) {
        await connection.execute(
            'INSERT INTO student_skills (student_id, skill_name, proficiency_level, progress, is_current) VALUES (?, ?, ?, ?, ?)',
            [studentId, name, level, progress, isCurrent]
        );
    }

    // Placements
    const placements = [
        ['Google', 'SDE Intern', 45.00, 'applied', '2026-01-15', null],
        ['Microsoft', 'Software Engineer', 40.00, 'shortlisted', '2025-12-20', null],
        ['Amazon', 'SDE-1', 38.00, 'interviewed', '2025-11-10', null],
    ];

    for (const [company, roleOffered, pkg, status, appliedDate, resultDate] of placements) {
        await connection.execute(
            'INSERT INTO placements (student_id, company_name, role_offered, package_lpa, status, applied_date, result_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [studentId, company, roleOffered, pkg, status, appliedDate, resultDate]
        );
    }

    // Activity - LeetCode
    await connection.execute(
        'INSERT INTO student_activity (student_id, platform, current_streak, longest_streak, total_count) VALUES (?, ?, ?, ?, ?)',
        [studentId, 'leetcode', 12, 28, 156]
    );

    // Activity - GitHub
    await connection.execute(
        'INSERT INTO student_activity (student_id, platform, current_streak, longest_streak, total_count) VALUES (?, ?, ?, ?, ?)',
        [studentId, 'github', 8, 45, 342]
    );

    // Activity heatmap data (daily entries)
    for (let i = 0; i < 84; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (83 - i));
        const dateStr = date.toISOString().split('T')[0];
        const dailyCount = Math.floor(Math.random() * 10);

        await connection.execute(
            'INSERT INTO student_activity (student_id, platform, current_streak, longest_streak, total_count, activity_date, daily_count) VALUES (?, ?, 0, 0, 0, ?, ?)',
            [studentId, 'leetcode', dateStr, dailyCount]
        );

        const ghCount = Math.floor(Math.random() * 10);
        await connection.execute(
            'INSERT INTO student_activity (student_id, platform, current_streak, longest_streak, total_count, activity_date, daily_count) VALUES (?, ?, 0, 0, 0, ?, ?)',
            [studentId, 'github', dateStr, ghCount]
        );
    }

    // Resume
    await connection.execute(
        'INSERT INTO student_resumes (student_id, file_url, file_name) VALUES (?, ?, ?)',
        [studentId, '/uploads/alex_resume.pdf', 'alex_resume.pdf']
    );

    const [resumeResult] = await connection.execute('SELECT LAST_INSERT_ID() as id');
    const resumeId = resumeResult[0].id;

    // Resume analysis
    await connection.execute(
        'INSERT INTO resume_analysis (resume_id, overall_score, detected_skills, missing_skills, suggestions) VALUES (?, ?, ?, ?, ?)',
        [
            resumeId,
            72,
            JSON.stringify(['Python', 'JavaScript', 'SQL', 'Git', 'HTML/CSS']),
            JSON.stringify(['React', 'AWS', 'Docker', 'TypeScript', 'ML']),
            JSON.stringify([
                'Add project metrics and quantifiable achievements',
                'Include cloud computing certifications',
                'Add more recent projects with modern frameworks',
            ]),
        ]
    );

    // Training programs
    const programs = [
        ['React Masterclass', 'Complete React course with hooks and patterns', '["React", "JavaScript", "TypeScript"]', 'Udemy', 40, 'intermediate', 'https://example.com/react'],
        ['AWS Cloud Practitioner', 'AWS fundamentals and certification prep', '["AWS", "Cloud"]', 'AWS Training', 30, 'beginner', 'https://example.com/aws'],
        ['Docker & Kubernetes', 'Container orchestration from scratch', '["Docker", "Kubernetes", "DevOps"]', 'Coursera', 25, 'intermediate', 'https://example.com/docker'],
        ['Machine Learning A-Z', 'Complete ML pipeline with Python', '["ML", "Python", "Data Science"]', 'Coursera', 50, 'beginner', 'https://example.com/ml'],
        ['TypeScript Deep Dive', 'Advanced TypeScript patterns', '["TypeScript", "JavaScript"]', 'Frontend Masters', 20, 'intermediate', 'https://example.com/ts'],
    ];

    for (const [title, desc, skillTags, provider, hours, difficulty, url] of programs) {
        await connection.execute(
            'INSERT INTO training_programs (title, description, skill_tags, provider, duration_hours, difficulty, url) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [title, desc, skillTags, provider, hours, difficulty, url]
        );
    }

    // Admin metrics
    const adminMetrics = [
        ['placement_rate', 72.5, '2026-02-01', 'placement'],
        ['avg_cgpa', 7.8, '2026-02-01', 'academic'],
        ['active_students', 450, '2026-02-01', 'engagement'],
        ['resume_upload_rate', 65.0, '2026-02-01', 'resume'],
    ];

    for (const [name, value, date, category] of adminMetrics) {
        await connection.execute(
            'INSERT INTO admin_metrics (metric_name, metric_value, metric_date, category) VALUES (?, ?, ?, ?)',
            [name, value, date, category]
        );
    }

    console.log('✅ Sample data inserted successfully');
    console.log('📧 Test account: alex@example.com / password123 (role: student)');

    await connection.end();
}

initDatabase().catch(err => {
    console.error('❌ Database initialization failed:', err);
    process.exit(1);
});

// ------------------------ IMPORTS ------------------------
const express = require('express');
const path = require('path');
const bcrypt = require('bcryptjs'); // for hashing passwords
const db = require('./db.cjs');

const app = express();
const PORT = 3000;

// ------------------------ MIDDLEWARE ------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS) from "public" folder
app.use(express.static(path.join(__dirname, '..', 'public')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// ------------------------ STUDENT ROUTES ------------------------

// Student registration
app.post('/student-register', async (req, res) => {
  try {
    const { name, roll_no, department, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO students (name, roll_no, department, username, password) VALUES (?, ?, ?, ?, ?)',
      [name, roll_no, department, username, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ success: false, message: 'Username or Roll number already exists!' });
          }
          return res.status(500).json({ success: false, message: err.message });
        }
        res.json({ success: true, message: 'Student registered successfully!', id: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Student login
app.post('/student-login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM students WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.json({ success: false, message: 'User not found' });

    const student = results[0];
    const match = await bcrypt.compare(password, student.password);
    if (match) res.json({ success: true, student_id: student.id, name: student.name });
    else res.json({ success: false, message: 'Incorrect password' });
  });
});

// Submit complaint
app.post('/submit-complaint', (req, res) => {
  const { student_id, complaint_type, complaint_text } = req.body;

  db.query(
    'INSERT INTO complaints (student_id, complaint_type, complaint_text) VALUES (?, ?, ?)',
    [student_id, complaint_type, complaint_text],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ success: true, complaint_id: result.insertId });
    }
  );
});

// ------------------------ ADMIN ROUTES ------------------------

// Admin registration
app.post('/admin-register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO admins (username, password) VALUES (?, ?)',
      [username, hashedPassword],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            return res.json({ success: false, message: 'Username already exists!' });
          }
          return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Admin registered successfully!', id: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin login
app.post('/admin-login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM admins WHERE username = ?', [username], async (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.json({ success: false, message: 'Admin not found' });

    const admin = results[0];
    const match = await bcrypt.compare(password, admin.password);
    if (match) res.json({ success: true, admin_id: admin.id });
    else res.json({ success: false, message: 'Incorrect password' });
  });
});

// Admin view all complaints
app.get('/all-complaints', (req, res) => {
  db.query(
    `SELECT c.id, s.name, s.roll_no, c.complaint_type, c.complaint_text, c.status, c.date
     FROM complaints c
     JOIN students s ON c.student_id = s.id
     ORDER BY c.date DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    }
  );
});

// ------------------------ DASHBOARD ROUTES ------------------------

// Serve Student Dashboard
app.get('/student-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'student_dashboard.html'));
});

// Serve Admin Dashboard
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin_dashboard.html'));
});

// ------------------------ SERVER START ------------------------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

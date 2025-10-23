const db = require('../db.cjs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerStudent = (req, res) => {
  const { name, roll_no, department, username, password } = req.body;

  if (!name || !roll_no || !department || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if username already exists
  db.query('SELECT * FROM student WHERE username = ?', [username], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length > 0) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO student (name, roll_no, department, username, password) VALUES (?, ?, ?, ?, ?)',
      [name, roll_no, department, username, hashedPassword],
      (err) => {
        if (err) return res.status(500).json({ error: 'Failed to register student' });
        res.status(201).json({ message: 'Student registered successfully' });
      }
    );
  });
};

exports.loginStudent = (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM student WHERE username = ?', [username], async (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (result.length === 0) return res.status(404).json({ error: 'User not found' });

    const student = result[0];
    const validPassword = await bcrypt.compare(password, student.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: student.id, username: student.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      student: { id: student.id, name: student.name, roll_no: student.roll_no }
    });
  });
};
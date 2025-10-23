const db = require('../db.cjs');

exports.submitComplaint = (req, res) => {
  const { student_id, complaint_type, complaint_text } = req.body;

  if (!student_id || !complaint_type || !complaint_text) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const sql = 'INSERT INTO complaint (student_id, complaint_type, complaint_text) VALUES (?, ?, ?)';
  db.query(sql, [student_id, complaint_type, complaint_text], (err) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.status(200).json({ message: 'Complaint submitted successfully' });
  });
};

exports.getComplaints = (req, res) => {
  const sql = `
    SELECT c.id, s.name AS student_name, c.complaint_type, c.complaint_text, c.status, c.date
    FROM complaint c
    JOIN student s ON c.student_id = s.id
    ORDER BY c.date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch complaints' });
    res.status(200).json(results);
  });
};
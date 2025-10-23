require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("../../student_complaint_system/routes/db");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// 🧍 Register Student
app.post("/api/register", (req, res) => {
  const { name, roll_no, department, username, password } = req.body;
  const sql = `INSERT INTO students (name, roll_no, department, username, password)
               VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, roll_no, department, username, password], (err) => {
    if (err) return res.status(500).json({ message: "Error registering student", error: err });
    res.json({ message: "Student registered successfully ✅" });
  });
});

// 🔐 Login (Student/Admin)
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  const checkStudent = "SELECT * FROM students WHERE username=? AND password=?";
  const checkAdmin = "SELECT * FROM admins WHERE username=? AND password=?";

  db.query(checkStudent, [username, password], (err, studentResult) => {
    if (err) return res.status(500).send(err);
    if (studentResult.length > 0) {
      return res.json({ role: "student", message: "Student login successful ✅" });
    }

    db.query(checkAdmin, [username, password], (err2, adminResult) => {
      if (err2) return res.status(500).send(err2);
      if (adminResult.length > 0) {
        return res.json({ role: "admin", message: "Admin login successful ✅" });
      }

      res.status(401).json({ message: "Invalid username or password ❌" });
    });
  });
});

// 🧾 Submit Complaint
app.post("/api/complaints", (req, res) => {
  const { roll_no, complaint_type, complaint_text } = req.body;
  const getStudent = "SELECT id FROM students WHERE roll_no=?";

  db.query(getStudent, [roll_no], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).json({ message: "Student not found" });

    const student_id = result[0].id;
    const insertComplaint = "INSERT INTO complaints (student_id, complaint_type, complaint_text) VALUES (?, ?, ?)";

    db.query(insertComplaint, [student_id, complaint_type, complaint_text], (err2) => {
      if (err2) return res.status(500).send(err2);
      res.json({ message: "Complaint submitted successfully ✅" });
    });
  });
});

// 📋 View Complaints (Admin)
app.get("/api/complaints", (req, res) => {
  const sql = `
    SELECT c.id, s.roll_no, s.name, c.complaint_type, c.complaint_text, c.status, c.date
    FROM complaints c
    JOIN students s ON c.student_id = s.id
    ORDER BY c.date DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

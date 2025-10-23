const express = require('express');
const { registerStudent, loginStudent } = require('../controllers/studentController.cjs');

const router = express.Router();

// POST /api/students/register
router.post('/register', registerStudent);

// POST /api/students/login
router.post('/login', loginStudent);

module.exports = router;
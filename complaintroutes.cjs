const express = require('express');
const { submitComplaint, getComplaints } = require('../controllers/complaintController.cjs');

const router = express.Router();

// POST /api/complaints/submit
router.post('/submit', submitComplaint);

// GET /api/complaints/all
router.get('/all', getComplaints);

module.exports = router;
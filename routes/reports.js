const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/db');
const router = express.Router();

const ALLOWED_STATUSES = ['new', 'reviewed', 'closed'];

// submit anonymous report (no auth required)
router.post('/', async (req, res) => {

    try {
        const { incident_details } = req.body;
        if (!incident_details || incident_details.trim() === '') {
            return res.status(400).json({ error: 'Incident details are required.' });
        }

        const [result] = await pool.query(
            'INSERT INTO harassment_reports (incident_details) VALUES (?)',
            [incident_details.trim()]
        );
        
        res.status(201).json({ message: 'Report submitted successfully.', id: result.insertId}); 
    } catch (error) {
        console.error('Submit Report Error:', error);
        res.status(500).json({ error: 'Failed to submit report.'});
    }
});

//admin: list and update (simple auth check by role)
router.get('/admin', auth, async (req, res) => {

    try {

        if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
        const [rows] =await pool.query('SELECT * FROM harassment_reports ORDER BY timestamp DESC');
        res.json(rows);
    } catch (error) {

        res.status(500).json({ error: 'Failed to load reports.'});
    }
});

router.put('/admin/:id', auth, async (req, res) => {

    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden: Admin access required.' });
        }
        const { status } = req.body;

        if (!status || !ALLOWED_STATUSES.includes(status)) {
            return res.status(400).json({
                error: `Invalid status. Allowed values: ${ALLOWED_STATUSES.join(', ')}`
            });
        }

        const [result] = await pool.query(
            'UPDATE harassment_reports SET status = ? WHERE id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Report not found.' });
        }
        
        res.json({ message: 'Report updated successfully.' });
    } catch (error) {

        res.status(500).json({ error: 'Failed to update report.'});
    }
});

module.exports = router;

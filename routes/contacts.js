const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// list
router.get('/', auth, async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM contacts WHERE user_id = ?', 
            [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Fetch Contacts Error:', error);
        res.status(500).json({ error: 'Failed to load contacts' });
    }
});

//add (enforce max 3)
router.post('/', auth, async (req, res) => {
    const { name, phone_or_email } = req.body;

    if (!name || !phone_or_email) {
        return res.status(400).json({ error: 'Name and contact details are required' });
    }

    try {
        const [existing] = await pool.query(
            'SELECT COUNT(*) AS c FROM contacts WHERE user_id = ?', 
            [req.user.id]
        );
        
        if (existing[0].c >= 3) {
            return res.status(400).json({ error: 'MAX 3 contacts allowed' });
        }

        const [result] = await pool.query(
            'INSERT INTO contacts (user_id, name, phone_or_email) VALUES (?, ?, ?)', 
            [req.user.id, name.trim(), phone_or_email.trim()]
        );

        res.status(201).json({ message: 'Contact added successfully', id: result.insertId });
    } catch (error) {
        console.error('Add Contact Error:', error);
        res.status(500).json({ error: 'Failed to add contact' });
    }
});

//Update contact
router.put('/:id', auth, async (req, res) => {
    const { name, phone_or_email } = req.body;
    
    if (!name || !phone_or_email) {
        return res.status(400).json({ error: 'Name and contact details are required.' });
    }

    try {
        const [result] = await pool.query(
            'UPDATE contacts SET name=?, phone_or_email=? WHERE id=? AND user_id=?', 
            [name.trim(), phone_or_email.trim(), req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact not found or unauthorized' });
        }

        res.json({ message: 'Contact updated successfully' });
    } catch (error) {
        console.error('Update Contact Error:', error);
        res.status(500).json({ error: 'Failed to update contact.' });
    }
});

router.post('/emergency', auth, async (req, res) => {
    try {
        const [contacts] = await pool.query(
            'SELECT phone_or_email FROM contacts WHERE user_id = ?', 
            [req.user.id]
        );

        if (contacts.length === 0) {
            return res.status(400).json({ error: 'No contacts found' });
        }

        const notified = [];
        for (const c of contacts) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_USER,
                    to: c.phone_or_email,
                    subject: 'W.I.S.E. Emergency Alert',
                    text: 'This is an emergency alert from W.I.S.E. Management. Please check on the user.'
                });
                notified.push(c.phone_or_email);
            } catch (e) {
                console.error("Email failed for:", c.phone_or_email, e.message);
            }
        }

        res.json({ message: 'Emergency alert sent successfully.', notified });
    } catch (error) {
        console.error('Emergency Dispatch Error:', error);
        res.status(500).json({ error: 'Failed to send emergency alert' });
    }
});

//Delete contact
router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM contacts WHERE id=? AND user_id=?', 
            [req.params.id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Contact not found or unauthorized' });
        }

        res.json({ message: 'Contact deleted successfully' });
    } catch (error) {
        console.error('Delete Contact Error:', error);
        res.status(500).json({ error: 'Failed to delete contact' });
    }
});

module.exports = router;


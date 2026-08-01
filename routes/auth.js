const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const router = express.Router();
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.error('FATAL EEROR: JWT_SECRET environment variable is not defined.');
}

router.post('/register', async (req, res) => {
    const { business_name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    
    try {

        const hash = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
            'INSERT INTO users (business_name, email, password_hash) VALUES (?, ?, ?)',
            [business_name || '', email, hash]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
	console.error(err);
        res.status(400).json({ error: err.message});
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    try {
        
    const [rows] = await pool.query('SELECT id, email, password_hash, role FROM users WHERE email = ?', [email]);
		
	console.log("Login lookup:", email, rows);
		
    const user = rows[0];
		
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h'});
    res.json({ token });
    } catch(error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Login process failed due to server error.'});
    }
});

module.exports = router;

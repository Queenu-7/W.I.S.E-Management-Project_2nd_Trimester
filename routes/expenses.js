const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/db');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { category, description, amount, date } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Enter a valid amount' });
    }

    try {
        const expenseDate = date || new Date().toISOString().split('T')[0];

        const [result] = await pool.query(
            'INSERT INTO expenses (user_id, category, description, amount, date) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, category || 'General', description || '', amount, expenseDate]
        );

        res.status(201).json({ 
            message: 'Expense added successfully', 
            id: result.insertId 
        });
    } catch (error) {
        console.error('Create Expense Error:', error);
        res.status(500).json({ error: 'Failed to create expense' });
    }
});

//Get expenses
router.get('/', auth, async (req, res) => {
    try{
        const [rows] = await pool.query(
            'SELECT * FROM expenses WHERE user_id = ? ORDER BY date DESC, created_at DESC', [req.user.id]
        );
        res.json(rows);
    } catch (error) {
        console.error('Fetch Expenses Error:', error);
        res.status(500).json({ error: 'Failed to load expenses' });
    }
})

//Update expense
router.put('/:id', auth, async (req, res) => {
    const { category, description, amount, date} = req.body;

    if (amount !== undefined && amount <= 0) {
        return res.status(400).json({ error: 'Amount must be greater than zero' });
    }

    try {
        const [result] = await pool.query(
            `UPDATE expenses 
            SET category= COALESCE(?, category), 
                description= COALESCE(?, description), 
                amount= COALESCE(?, amount), 
                date= COALESCE(?, date) 
            WHERE id=? AND user_id=?`, 
            [
                category !== undefined ? category : null, 
                description !== undefined ? description : null, 
                amount !== undefined ? amount : null, 
                date !== undefined ? date : null, 
                req.params.id, 
                req.user.id
            ]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Expense not found or unauthorized ' });
    }
    
    res.json({ message: 'Expense updated successfully' });
    } catch (error) {
        console.error('Update Expense Error:', error);
        res.status(500).json({ error: 'Failed to update expense' });
    }
});

//Delete expense
router.delete('/:id', auth, async (req, res) => {
    try {
        const [result] = await pool.query (
        'DELETE FROM expenses where id=? AND user_id=?', [req.params.id, req.user.id]
    );

    if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Expense not found or unauthorized' });
    }

    res.json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Delete Expense Error:', error);
        res.status(500).json({ error: 'Failed to delete expense' });
    }
});

module.exports = router;

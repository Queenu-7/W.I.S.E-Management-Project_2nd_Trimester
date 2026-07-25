const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/db');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const { product_id, quantity } = req.body;
    
    let conn;
    try {
        const qty = Number(quantity);
        if (!product_id || isNaN(qty) || qty <= 0) {
            return res.status(400).json({ error: 'Valid product ID and positive quantity are required.'});
        }

        conn = await pool.getConnection();
        await conn.beginTransaction();

        const [pRows] = await conn.query(
            'SELECT id, quantity, unit_price FROM products WHERE id=? AND user_id=? FOR UPDATE',
            [product_id, req.user.id] 
        );

        const product = pRows[0];
        if (!product) {
            await conn.rollback();
            return res.status(404).json({ error: 'Product not found or unauthorized.' });
        }

        if (product.quantity < qty) {
            await conn.rollback();
            return res.status(400).json({ error: 'Insufficient stock available.'});
        }

        const total = parseFloat(product.unit_price) * qty;

        await conn.query(
            'INSERT INTO sales (user_id, product_id, quantity, total) VALUES (?, ?, ?, ?)',
            [req.user.id, product_id, qty, total]
        );

        await conn.query(
            'UPDATE products SET quantity = quantity - ? WHERE id =?',
            [qty, product_id]
        );

        await conn.commit();
        res.status(201).json({ message: 'Sale recorded successfully.', total });
    } catch (err) {
        if (conn) await conn.rollback();
        console.error('Record Sale Error:', err);
        res.status(500).json({ error: 'Failed to record sale.' });
    } finally {
        if (conn) conn.release();
    }
});

router.get('/', auth, async (req, res) => {

    try {

        const [rows] = await pool.query(
            `SELECT s.id, s.product_id, p.name AS product_name, s.quantity, s.total, s.created_at
            FROM sales s
            LEFT JOIN products p ON s.product_id = p.id
            WHERE s.user_id = ?
            ORDER BY s.id DESC`, 
            [req.user.id]
        );
    res.json(rows);
    } catch (error) {

        res.status(500).json({ error: 'Failed to load sales.'});
    } 
});

module.exports = router;

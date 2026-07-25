const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/db');
const router = express.Router();

router.get('/', auth, async (req, res) => {
    
    try {

        const [rows] = await pool.query('SELECT * FROM products WHERE user_id = ? ORDER BY id DESC', [req.user.id]);
        
        res.json(rows);
    } catch (error) {
        console.error('Fetch products error:', error);
        res.status(500).json({ error: 'Failed to load products.'});
    } 
});
 
router.post('/', auth, async (req, res) => {

    try {
        const { name, quantity, unit_price } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Product name is required.'});
    }

    const qty = quantity !== undefined ? Number(quantity) : 0;
    const price = unit_price !== undefined ? Number(unit_price) : 0;

    if (qty < 0 || price < 0) {
        return res.status(400).json({ error: 'Quantity and unit price cannot be negative.' });
    }

    const [result] = await pool.query(
        'INSERT INTO products (user_id, name, quantity, unit_price) VALUES (?, ?, ?, ?)',
        [req.user.id, name.trim(), qty, price]
    );

    res.status(201).json({ message: 'Product added successfully.', id: result.insertId });
    } catch (error) {
        console.error('Add product error:', error);
        res.status(500).json({ error: 'Failed to add product.'});
    }
});

router.put('/:id', auth, async (req, res) => {

    try {
        const { name, quantity, unit_price } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Product name is required.'});
        }

        const qty = quantity !== undefined ? Number(quantity) : 0;
        const price = unit_price !== undefined ? Number(unit_price) : 0;

        if (qty < 0 || price < 0) {
            return res.status(400).json({ error: 'Quantity and unit price cannot be negative.' });
        }
        const [result] = await pool.query('UPDATE products SET name=?, quantity=?, unit_price=? WHERE id=? AND user_id=?', [name.trim(), qty, price, req.params.id, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized.'});
        }

        res.json({ message: 'Product updated successfully.' });
    } catch (error) {
        console.error('Update Product error:', error);
        res.status(500).json({ error: 'Failed to update product.'})
    }
});

router.delete('/:id', auth, async (req, res) => {
    
    try {
        const [result] = await pool.query('DELETE FROM products WHERE id=? AND user_id=?', [req.params.id, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Product not found or unauthorized.'});
        }
        
        res.json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Delete product Error:', error);
        res.status(500).json({ error: 'Failed to delete product.'});
    }
});

module.exports = router;

const express = require('express');
const auth = require('../middleware/auth');
const pool = require('../config/db');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;

        // Run all independent DB queries concurrently using Promise.all
        const [
            [[products]],
            [[sales]],
            [[expenses]]
        ] = await Promise.all([
            pool.query('SELECT COUNT(*) AS total FROM products WHERE user_id = ?', [userId]),
            pool.query('SELECT COUNT(*) AS total, IFNULL(SUM(total), 0) AS revenue FROM sales WHERE user_id = ?', [userId]),
            pool.query('SELECT IFNULL(SUM(amount), 0) AS total FROM expenses WHERE user_id = ?', [userId])
        ]);

        const revenue = Number(sales.revenue);
        const expenseTotal = Number(expenses.total);

        res.json({
            products: products.total,
            sales: sales.total,
            revenue,
            expenses: expenseTotal,
            profit: revenue - expenseTotal
    });
    } catch (error) {
        console.error('Dashboard Data Fetch Error:', error);
        res.status(500).json({error: 'Failed to load dashboard data.'});
    }
});

module.exports = router;


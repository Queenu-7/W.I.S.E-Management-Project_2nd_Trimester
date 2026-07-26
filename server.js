const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const salesRoutes = require('./routes/sales');
const expenseRoutes = require('./routes/expenses');
const contactRoutes = require('./routes/contacts');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/ping', (req, res) => res.json({ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

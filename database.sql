CREATE DATABASE wise_db;
USE wise_db;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('merchant', 'admin') DEFAULT 'merchant',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    quantity INT DEFAULT 0,
    unit_price DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category VARCHAR(100),
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL,
    date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(255),
    phone_or_email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE harassment_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    incident_details TEXT NOT NULL,
    status ENUM('new','reviewed','closed') DEFAULT 'new',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, business_name, email, password_hash, role)
VALUES (1, 'KigaliTech Store', 'demo@wise.com', '$2a$10$wK1V3z/hBqO7Y91X4uX8EOhM4QO9Z4uN2Q3Y8H2.zX2Y1Z2Y1Z2Y1', 'merchant')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO products (user_id, name, quantity, unit_price) VALUES
(1, 'POS Terminal Paper Rolls', 50, 15000.00),
(1, 'Barcode Scanner', 12, 45000.00),
(1, 'Cash Drawer', 5, 85000.00),
(1, 'Receipt Printer', 8, 120000.00);

INSERT INTO sales (user_id, product_id, quantity, total) VALUES
(1, 1, 5, 75000.00),
(1, 2, 1, 45000.00);

INSERT INTO expenses (user_id, category, description, amount, date) VALUES
(1, 'Utilities', 'Store Electricity Bill', 25000.00, CURDATE()),
(1, 'Rent', 'Monthly Shop Rent', 150000.00, CURDATE());

INSERT INTO contacts (user_id, name, phone_or_email) VALUES
(1, 'Local Helpline', 'support@helpline.org'),
(1, 'Security Dispatch', '+250784646392');


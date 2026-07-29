# W.I.S.E. Management (Women's Integrated Safety and Enterprise Management)

## Overview

W.I.S.E Management is a web-based business Management platform developed to support women entreprenuers in Rwanda by combining enterprise management tools with workplace safety features in a single application.
The platform enables users to manage inventory, record sales, track expenses and monitor business performance while also providing tools improve presonal safety throygh trusted emergency contacts and anonymous incident reporting.

---

## Problem Statement

Many women-owned small businesses in Rwanda still rely on manual bookkeeping methods, making it difficult to accurately manage inventory, sales and expenses. In addition to these business challenges, many women entrepreneurs face workplace safety concerns with limited access to integrated digital support.
Existing business applications focus on financial management but ignore user safety, while emergency applications provide safety services without business functionality.
W.I.S.E. Management bridges this gap by integrating both enterprise management and safety support into one easy-to-use platform.

---

## Features
### Authentication
- User regstration
- Secure login
- Protected routes using authentication middleware

### Business Management
- Product inventory management
- Record sales transactions 
- Expense tracking
- Business dashboard with finacial summaries

### Safety Features
- Manage trusted emergency contacts
- Submit anonymous incident reports

---

## Technology Stack

### Frontend
- HTML5
- CSS3(embedded within HTML pages)
- Javascript

### Backend
- Node.js
- Express.js

### Database
- MySQL

### Additional Packages
- mysql2
- bcrypt
- jsonwebtoken (JWT)
- express

---

## Project Structure

```
W.I.S.E Management
│
├── config
│   └── db.js
│
├── js
│   ├── dashboard.js
│   └── main.js
│
├── middleware
│   └── auth.js
│
├── routes
│   ├── auth.js
│   ├── contacts.js
│   ├── dashboard.js
│   ├── expenses.js
│   ├── products.js
│   ├── reports.js
│   └── sales.js
│
├── dashboard.html
├── index.html
├── database.sql
├── server.js
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

---

## Database

The project uses a MySQL relational database.

Main tables include:

- Users
- Products
- Expenses
- Contacts
- Harassment_Reports
The database schema is contained in:

```
database.sql
```

---

## Installation

### Clone the repository

```bash
git clone <https://github.com/Queenu-7/W.I.S.E-Management-Project_2nd_Trimester.git>
```

### Navigate into the project

```bash
cd wise-management
```

### Install dependencies

```bash
npm install
```

### Configure the database

1. Create a MySQL database.
2. Import the `database.sql` file.
3. Update the database credentials inside:

```
config/db.js
```

### Start the server

```bash
npm start
```

or during development

```bash
npm run dev
```

The application is deployed so it will run on:

```
Render.com
```

---

## Functional Modules

| Module | Description |
|---------|-------------|
| Authentication | User registration and login |
| Inventory | Add, edit, update and delete products |
| Sales | Record sales and update stock |
| Expenses | Record business expenses |
| Dashboard | View financial summaries |
| Contacts | Manage trusted emergency contacts |
| Reports | Submit anonymous incident reports |

---

## Security

The application includes several security measures including:

- Password encryption
- Authentication middleware
- Protected API routes
- MySQL prepared statements to reduce SQL injection risks

---

## Future Improvements
 Potential future enhancements include:

 - SMS emergency notifications
 - Email emergency alerts
 - Mobile application support
 - Kinyarwanda language interface
 - Cloud deployment
 - Data analytics and reporting
 - Business performance forecasting

## WEBSITE LINK







  




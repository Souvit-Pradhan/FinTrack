# FinTrack – Personal Finance Management System

FinTrack is a full-stack personal finance management application for tracking income and expenses in one place. Users can create an account, securely log in, record transactions, and monitor their overall financial activity through a simple dashboard.

## Features

- User registration and login
- JWT-based authentication
- Add income and expense transactions
- Categorize transactions
- Record transaction dates
- View total balance, income, and expenses
- View recent transaction history
- Delete transactions
- Income and expense overview
- Light and dark mode
- Responsive interface

## Tech Stack

### Frontend
- React.js
- Vite
- CSS

### Backend
- Node.js
- Express.js
- REST API
- JWT

### Database
- MongoDB
- Mongoose

## Project Structure

```text
FinTrack/
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Transaction.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── transactions.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
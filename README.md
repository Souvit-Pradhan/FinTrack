# FinTrack – Personal Finance Management System

A beginner-friendly full-stack finance tracker built with the same core stack listed on my resume:
- React.js
- Node.js
- Express.js
- MongoDB
- REST API
- JWT authentication

## Features
- Register and login
- Add income and expense transactions
- View balance, total income and total expenses
- Delete transactions
- Simple dashboard
- Protected API routes using JWT

## Project structure
FinTrack/
  client/       React frontend
  server/       Express + MongoDB backend

## Run locally

### 1. Backend
cd server
npm install
Create a `.env` file:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fintrack
JWT_SECRET=replace_with_a_secret

npm run dev

### 2. Frontend
Open another terminal:
cd client
npm install
npm run dev

Then open the URL shown by Vite.

## Interview explanation
React handles the user interface. The React app sends HTTP requests to the Express REST API. Express validates the request and uses Mongoose to read/write MongoDB. JWT is used to identify the logged-in user on protected routes.

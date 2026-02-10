# React Quiz App

A simple quiz application built with **React (Vite)** for an internship frontend challenge.

## 🚀 Features
- Login using username & password (no backend, local state)
- Fetch quiz questions from **OpenTDB API**
- Choose number of questions and question type
- One question per page
- Countdown timer
- Automatic result when time is up
- Show total questions & answered questions
- Resume quiz after browser/tab is closed (localStorage)
- Result summary (correct, wrong, answered)

## 🛠 Tech Stack
- React.js
- Vite
- JavaScript (ES6)
- OpenTDB API
- LocalStorage

## 📦 Project Structure
src/
├── pages/
│ ├── LoginPage.jsx
│ ├── StartPage.jsx
│ ├── KuisPage.jsx
│ └── HasilPage.jsx
├── utils/
│ ├── auth.js
│ ├── penyimpanan.js
│ └── trivia.js
├── App.jsx
├── main.jsx
└── styles.css

## ▶️ How to Run Locally
```bash
npm install
npm run dev

Then open:
http://localhost:5173

🧠 Notes

This project focuses on frontend logic and user experience
Authentication is simulated (no backend)
Resume feature uses browser localStorage

📹 Demo Video
Demo video link will be provided separately via Loom.
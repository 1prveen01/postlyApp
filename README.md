# 📝 Postly — A Full-Stack Social Media App

Postly is a modern **full-stack social media application** that combines the simplicity of **Twitter-style posting** with **YouTube-like engagement** features.  
Users can post updates, like/dislike posts, and interact with content in real time.

Built with **Next.js**, **Tailwind CSS**, **Express.js**, and **MongoDB**, it demonstrates scalable full-stack architecture with JWT-based authentication and clean UI.

---

## 🚀 Live Demo

Frontend (Vercel): [https://postly-app-phi.vercel.app](https://postly-app-phi.vercel.app)  
Backend (Render): [https://postly-backend.onrender.com](https://postly-backend.onrender.com)

---

## 🧠 Features

### 👥 User & Auth
- Secure **JWT Authentication** (Access & Refresh tokens)
- **Login / Signup** flow with validation
- Protected routes (only logged-in users can access `/dashboard` and `/explore`)

### 🗨️ Posts / Tweets
- Create, read, and delete posts
- Display all posts with user info (avatar, username, date/time)
- Like / Unlike functionality with real-time updates
- Like counts persist across refreshes

### 💾 Backend
- RESTful Express API
- MongoDB for database with Mongoose models
- Controllers for Tweets, Likes, and Users
- Error handling & middleware for validation and authentication

### 🖥️ Frontend
- Built using **Next.js (App Router)** and **React Hooks**
- Fully responsive UI built with **Tailwind CSS**
- Axios for API calls
- Persistent authentication via localStorage
- Optimistic UI updates for likes

---

## ⚙️ Tech Stack

### **Frontend**
- [Next.js 14](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)

### **Backend**
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Zod](https://zod.dev/) for request validation
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) for authentication

---

## 🧩 Project Structure

postly/
│
├── frontend/ # Next.js frontend
│ ├── app/
│ ├── components/
│ ├── lib/
│ ├── public/
│ ├── tailwind.config.js
│ └── package.json
│
├── backend/ # Express backend
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── middlewares/
│ │ ├── routes/
│ │ ├── utils/
│ │ └── index.js
│ ├── .env
│ └── package.json
│
└── README.md



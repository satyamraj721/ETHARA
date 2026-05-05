# 🚀 ETHARA — Team Task Manager

A **production-ready full-stack Team Task Management SaaS** with role-based authentication, project collaboration, and real-time dashboard analytics.

🔗 **Live Frontend**: [https://victorious-dedication-production-cf92.up.railway.app](https://victorious-dedication-production-cf92.up.railway.app)  
⚙️ **Live Backend API**: [https://ethara-production-57c4.up.railway.app](https://ethara-production-57c4.up.railway.app)  
📦 **GitHub**: [https://github.com/satyamraj721/ETHARA](https://github.com/satyamraj721/ETHARA)

---

## 🔑 Test Credentials (Live App)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin5@example.com | 123456 |
| **Member** | memberrbac1@example.com | 123456 |

---

## ✨ Features

- 🔐 **Authentication** — Secure Signup/Login with JWT
- 👥 **Role-Based Access Control** — Admin & Member roles
- 📁 **Project Management** — Create projects, assign members
- ✅ **Task Tracking** — Status (TODO / In Progress / Done), priority, due dates, assigneeshj
- 📊 **Dashboard** — Visual stats, recent activity, overdue tasks
- 📱 **Responsive UI** — Modern Tailwind CSS design

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Node.js, Express.js |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Database** | PostgreSQL, Prisma ORM |
| **Auth** | JWT, bcrypt |
| **Deployment** | Railway (Backend + DB + Frontend) |

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend** | https://victorious-dedication-production-cf92.up.railway.app |
| **Backend API** | https://ethara-production-57c4.up.railway.app |
| **Database** | PostgreSQL on Railway |

---

## 🎯 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL
- Git

### 1. Clone & Install
```bash
git clone https://github.com/satyamraj721/ETHARA.git
cd ETHARA
npm install
```

### 2. Backend Setup
```bash
cp .env.example .env
# Update .env with your DATABASE_URL and JWT_SECRET

npx prisma generate
npx prisma db push
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:3001
```

### 4. Run Development Servers

**Terminal 1 — Backend:**
```bash
npm run dev  # http://localhost:3001
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev  # http://localhost:5173
```

---

## 🧪 Test Accounts

Use these credentials to test the live app:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin5@example.com | 123456 |
| **Member** | memberrbac1@example.com | 123456 |

---

## 🔗 API Reference

Base URL: `https://ethara-production-57c4.up.railway.app`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | ❌ | Register as Admin or Member |
| POST | `/auth/login` | ❌ | Login and get JWT token |
| GET | `/dashboard` | ✅ | Get dashboard stats |
| POST | `/projects` | ✅ Admin | Create new project |
| GET | `/projects` | ✅ | Get all projects |
| POST | `/tasks` | ✅ | Create a task |
| GET | `/tasks` | ✅ | Get all tasks |

### Signup Payload Example
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass",
  "role": "ADMIN"
}
```

---

## 📁 Project Structure

```
ETHARA/
├── controllers/     # Business logic
├── middleware/      # Auth & validation
├── prisma/          # DB schema & migrations
├── routes/          # API route definitions
├── utils/           # Helper functions
├── frontend/        # React + Vite + Tailwind
├── server.js        # Entry point
└── seed.js          # Test data seeder
```

---

## 🚀 Deployment (Railway)

1. Push code to GitHub
2. Connect repo to Railway
3. Add PostgreSQL plugin
4. Set environment variables:
   - `DATABASE_URL` — from Railway Postgres
   - `JWT_SECRET` — your secret key
5. Deploy ✅

---

## 📄 License

MIT — Built with ❤️ by [Satyam Raj](https://github.com/satyamraj721)

# 🚀 Team Task Manager - Full-Stack SaaS Platform

[![Backend](https://img.shields.io/badge/Backend-Node_Express-Prisma-blue)](https://github.com/badges/shields/)
[![Frontend](https://img.shields.io/badge/Frontend-React-Vite-Tailwind-green)](https://github.com/badges/shields/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL-Prisma-orange)](https://github.com/badges/shields/)

A **production-ready full-stack team task management SaaS** with role-based authentication, project collaboration, and real-time dashboard analytics. Perfect for small teams and enterprises.

## ✨ Features
- **Authentication**: Secure signup/login for **Admin** & **Member** roles (self-select during signup)
- **Role-Based Access**: Admins manage users/projects; Members handle tasks
- **Project Management**: Create projects, assign members, track progress
- **Task Tracking**: Status (TODO/In Progress/Done), priority, due dates, assignees
- **Dashboard**: Visual stats, recent activity
- **Responsive UI**: Modern Tailwind CSS design

## 🛠️ Tech Stack
| Backend | Frontend | Database | Tools |
|---------|----------|----------|-------|
| Node.js, Express | React 18, Vite | PostgreSQL, Prisma ORM | JWT, bcrypt, Axios |
| Prisma Client | Tailwind CSS | Migrations | Nodemon, ESLint |

## 🎯 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+
- PostgreSQL (local/Docker/Supabase)
- Git

### 1. Clone & Install
```bash
git clone <your-repo> team-task-manager
cd team-task-manager
```

### 2. Backend Setup
```bash
# Install deps
npm install

# Copy .env.example to .env
cp .env.example .env

# Update .env:
# DATABASE_URL="postgresql://user:pass@localhost:5432/teamtasks?schema=public"
# JWT_SECRET="your-super-secret-jwt-key-min32chars"
# PORT=3001

# Prisma setup
npx prisma generate
npx prisma db push  # or migrate dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Copy .env
cp .env.example .env
# VITE_API_URL=http://localhost:3001
```

### 4. Run Development Servers
**Terminal 1 (Backend):**
```bash
npm run dev  # http://localhost:3001
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev  # http://localhost:5173
```

### 5. Pre-seeded Test Accounts (Admin & Member)

**Run seed first (one-time):**
```bash
node seed.js
```

**Test Credentials (seed.js):**
| Role | Email | Password | User ID |
|------|-------|----------|---------|
| **Admin** | `admin@example.com` | `admin123` | `admin-123` |
| **Member** | `member@example.com` | `member123` | `member-123` |

**Usage example**: Add member by **email** `member@example.com` (no need UUID!)

**Login**: http://localhost:5173 → Use above → Dashboard!

**Or create new via Signup**: /signup → Select Admin/Member role

## 📱 Screenshots
```
[Add screenshots: signup form, dashboard, projects]
Signup: Role selector for Admin/Member
Dashboard: Task stats, quick actions
```

## 🔗 API Documentation
Base URL: `http://localhost:3001`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | - | Create Admin/Member |
| POST | `/auth/login` | - | JWT Login |
| GET | `/dashboard` | ✓ | Stats |
| POST | `/projects` | ✓ Admin | New project |
| GET | `/projects` | ✓ | My projects |
| POST | `/tasks` | ✓ | Create task |

**Signup Payload:**
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securepass",
  "role": "ADMIN"  // or "MEMBER"
}
```

## 🚀 Production Deployment
- **Backend**: Railway/Render/Heroku → `npm run build && npm start`
- **Frontend**: Vercel/Netlify → `npm run build`
- **Database**: Supabase/Neon/PlanetScale

## 🧪 Testing

**Seed test users:**
```bash
node seed.js
# Creates: admin@example.com/admin123 (Admin), member@example.com/member123 (Member)
```

**Prisma Studio:**
```bash
npx prisma studio
```

**Test Signup API:**
```bash
curl -X POST http://localhost:3001/auth/signup \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"ADMIN"}'
```


## 📈 Project Structure
```
├── controllers/     # Business logic
├── middleware/      # Auth/Validation
├── prisma/          # DB Schema
├── frontend/        # React+Vite+Tailwind
├── routes/          # API Routes
└── utils/           # Helpers
```

## 🤝 Contributing
1. Fork → Branch `feature/xyz`
2. PR with description/tests

## 📄 License
MIT

**Built with ❤️ for recruiters - Ready for production!** 👨‍💻


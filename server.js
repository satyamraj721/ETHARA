const express = require('express');
const cors = require('cors');
require('dotenv').config();

const prisma = require('./utils/prisma');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/project');
const taskRoutes = require('./routes/task');
const dashboardRoutes = require('./routes/dashboard');
const userRoutes = require('./routes/user');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} in use, trying ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error("Server error:", err);
    }
  });
};

prisma.$connect()
  .then(() => {
    console.log('Prisma connected');
    startServer(PORT);
  })
  .catch((error) => {
    console.error('Prisma connection error:', error);
    process.exit(1);
  });
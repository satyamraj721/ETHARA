require("dotenv").config();

const express = require("express");
const cors = require("cors");

const prisma = require("./utils/prisma");
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");
const dashboardRoutes = require("./routes/dashboard");
const userRoutes = require("./routes/user");

const app = express();

// 🔴 IMPORTANT: Check env early
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing. Check Railway variables.");
  process.exit(1);
}

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", userRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 3000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

// 🔌 Connect DB
async function init() {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected");
    startServer();
  } catch (error) {
    console.error("❌ Prisma connection error:", error.message);
    process.exit(1);
  }
}

init();

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

// 🔍 Basic env debug
if (!process.env.DATABASE_URL) {
  console.warn("⚠️ DATABASE_URL is missing (check Railway variables)");
}

// Middleware
app.use(cors());
app.use(express.json());

// Health check (VERY IMPORTANT for Railway)
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/users", userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

const PORT = process.env.PORT || 3000;

// 🚀 Start server
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

// 🔌 Initialize DB connection
async function init() {
  try {
    console.log("⏳ Connecting to database...");

    await prisma.$connect();

    console.log("✅ Database connected successfully");

    startServer();
  } catch (error) {
    console.error("❌ Database connection failed:");
    console.error(error); // full error (important)

    process.exit(1);
  }
}

// Handle unexpected crashes (production safety)
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
  process.exit(1);
});

// Run app
init();

import express from "express";
import cors from "cors";
import "dotenv/config";
import taskRouter from "./routes/taskRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// REST API Routes
// Primary routes strictly matching kLab coding challenge requirements:
app.use("/tasks", taskRouter);

// API prefixed routes:
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "healthy",
    message: "kLab Tech Upskill Task Management REST API",
    version: "1.0.0",
    database: "SQLite (Prisma ORM)",
    endpoints: {
      getAllTasks: "GET /tasks",
      getSingleTask: "GET /tasks/:id",
      createTask: "POST /tasks",
      updateTask: "PUT /tasks/:id",
      deleteTask: "DELETE /tasks/:id",
      filterByStatus: "GET /tasks?status=Pending or GET /tasks?status=Completed",
      userAuth: ["POST /api/user/register", "POST /api/user/login", "POST /api/user/guest-login"],
    },
  });
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 kLab Task Management API running at http://localhost:${port}`);
  console.log(`📋 REST Endpoints ready: http://localhost:${port}/tasks`);
});

export default app;

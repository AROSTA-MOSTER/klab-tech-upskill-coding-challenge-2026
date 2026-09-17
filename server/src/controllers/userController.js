import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";
import { JWT_SECRET } from "../middleware/auth.js";

// Helper to generate JWT token
const createToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });
};

// 1. REGISTER USER
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password",
      });
    }

    // Check if user already exists
    const exists = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
      },
    });

    const token = createToken(user.id);
    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. LOGIN USER
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user.id);
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. GET CURRENT LOGGED IN USER
export const getUserProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. QUICK DEMO / GUEST LOGIN
export const guestLogin = async (req, res) => {
  try {
    let guest = await prisma.user.findFirst({
      where: { email: "guest@klab.rw" },
    });

    if (!guest) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("guest123", salt);
      guest = await prisma.user.create({
        data: {
          name: "kLab Evaluator",
          email: "guest@klab.rw",
          password: hashedPassword,
        },
      });

      // Pre-seed a few sample tasks for immediate demonstration
      await prisma.task.createMany({
        data: [
          {
            title: "Welcome to kLab Task Manager!",
            description: "Review the features: create, edit, filter, and mark tasks as Completed or Pending.",
            status: "Pending",
            priority: "High",
            completed: false,
            ownerId: guest.id,
          },
          {
            title: "Explore REST API Endpoints",
            description: "Test GET /tasks, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id.",
            status: "Completed",
            priority: "Medium",
            completed: true,
            ownerId: guest.id,
          },
        ],
      });
    }

    const token = createToken(guest.id);
    res.json({
      success: true,
      message: "Guest login successful",
      token,
      user: { id: guest.id, name: guest.name, email: guest.email },
    });
  } catch (error) {
    console.error("Guest login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

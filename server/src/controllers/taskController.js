import prisma from "../lib/prisma.js";

// Helper to normalize task status & completed boolean
function normalizeTaskData(data) {
  const normalized = { ...data };

  let isCompleted = false;
  if (normalized.status !== undefined && normalized.status !== null) {
    isCompleted = String(normalized.status).trim().toLowerCase() === "completed";
  } else if (normalized.completed !== undefined && normalized.completed !== null) {
    if (typeof normalized.completed === "boolean") {
      isCompleted = normalized.completed;
    } else {
      const lower = String(normalized.completed).trim().toLowerCase();
      isCompleted = lower === "completed" || lower === "yes" || lower === "true";
    }
  }

  normalized.completed = isCompleted;
  normalized.status = isCompleted ? "Completed" : "Pending";

  if (normalized.dueDate) {
    normalized.dueDate = new Date(normalized.dueDate);
  }

  return normalized;
}

// 1. GET ALL TASKS (with optional status filtering: ?status=Pending | ?status=Completed)
export const getTasks = async (req, res) => {
  try {
    const { status, priority } = req.query;
    const where = {};

    // Scope to user if ownerId available
    if (req.user?.id) {
      where.ownerId = req.user.id;
    }

    // Filter by status if provided (e.g. ?status=Pending or ?status=Completed)
    if (status) {
      where.status = status;
    }

    // Filter by priority if provided (e.g. ?priority=High)
    if (priority) {
      where.priority = priority;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. GET SINGLE TASK BY ID
export const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({ success: true, task });
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. CREATE A TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, completed, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const normalized = normalizeTaskData({
      title: title.trim(),
      description: description ? description.trim() : "",
      priority: priority || "Low",
      dueDate: dueDate || null,
      completed,
      status,
    });

    const task = await prisma.task.create({
      data: {
        ...normalized,
        ownerId: req.user?.id || null,
      },
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// 4. UPDATE A TASK
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if task exists
    const existing = await prisma.task.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const normalized = normalizeTaskData(req.body);
    delete normalized.id;
    delete normalized.createdAt;
    delete normalized.updatedAt;

    const task = await prisma.task.update({
      where: { id },
      data: normalized,
    });

    res.json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(400).json({ success: false, message: err.message });
  }
};

// 5. DELETE A TASK
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.task.findUnique({
      where: { id },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

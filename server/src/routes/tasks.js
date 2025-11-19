import { Router } from "express";
import Task from "../models/Task.js";

const router = Router();

// GET /api/tasks -> lista todas las tareas
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: 1 });
    res.json(tasks);
  } catch (err) {
    console.error("Error getting tasks:", err);
    res.status(500).json({ message: "Error getting tasks" });
  }
});

// POST /api/tasks -> crea tarea
router.post("/", async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error creating task:", err);
    res
      .status(400)
      .json({ message: "Error creating task", error: err.message });
  }
});

// PATCH /api/tasks/:id/complete -> toggle completed
router.patch("/:id/complete", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = task.status === "completed" ? "pending" : "completed";
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Error completing task:", err);
    res
      .status(400)
      .json({ message: "Error completing task", error: err.message });
  }
});

// PATCH /api/tasks/:id/meme -> guardar URL meme
router.patch("/:id/meme", async (req, res) => {
  try {
    const { meme } = req.body;
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { meme },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (err) {
    console.error("Error updating meme:", err);
    res
      .status(400)
      .json({ message: "Error updating meme", error: err.message });
  }
});

// DELETE /api/tasks/:id -> borrar tarea
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res
      .status(400)
      .json({ message: "Error deleting task", error: err.message });
  }
});

export default router;

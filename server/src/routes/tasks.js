// server/routes/tasks.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const tasksFile = path.resolve("./data/mockTasks.json");

// Obtener todas las tareas
router.get("/", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(tasksFile));
  res.json(tasks);
});

// Crear nueva tarea
router.post("/", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(tasksFile));
  const newTask = { id: Date.now(), ...req.body };
  tasks.push(newTask);
  fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
  res.json(newTask);
});

export default router;

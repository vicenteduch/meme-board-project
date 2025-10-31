// server/routes/boards.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const tasksFile = path.resolve("./data/mockTasks.json");

// Obtener el tablero completo (todas las tareas)
router.get("/", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(tasksFile));
  res.json({
    boardName: "Meme Task Board",
    owner: "user1", // en el futuro se vinculará al usuario autenticado
    tasks,
  });
});

// Obtener tablero por ID de usuario (mock)
router.get("/:userId", (req, res) => {
  const tasks = JSON.parse(fs.readFileSync(tasksFile));
  const userTasks = tasks.filter((t) => t.assignedTo === req.params.userId);
  res.json({
    boardName: `Tablero de ${req.params.userId}`,
    owner: req.params.userId,
    tasks: userTasks,
  });
});

export default router;

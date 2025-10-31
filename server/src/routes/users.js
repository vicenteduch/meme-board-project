// server/routes/users.js
import express from "express";

const router = express.Router();

// Datos mock de usuarios
const users = [
  { id: "user1", name: "Vicente", role: "admin" },
  { id: "user2", name: "Esther", role: "member" },
];

// Obtener todos los usuarios (mock)
router.get("/", (req, res) => {
  res.json(users);
});

// Obtener usuario por ID
router.get("/:id", (req, res) => {
  const user = users.find((u) => u.id === req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(user);
});

export default router;

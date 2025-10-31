// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import tasksRouter from "./routes/tasks.js";
import usersRouter from "./routes/users.js";
import boardsRouter from "./routes/boards.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Rutas principales
app.use("/api/tasks", tasksRouter);
app.use("/api/users", usersRouter);
app.use("/api/boards", boardsRouter);

app.get("/", (req, res) => res.send("API funcionando 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor escuchando en puerto ${PORT}`));

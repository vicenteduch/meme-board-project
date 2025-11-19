import { Router } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, displayName, email, password } = req.body;

    if (!name || !displayName || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existing = await User.findOne({
      $or: [{ username: name }, { email }],
    });

    if (existing) {
      return res.status(409).json({ message: "User or email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const sessionToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      username: name,
      displayName,
      email,
      passwordHash,
      role: "member",
      sessionToken,
    });

    res.status(201).json({
      user: user.toJSON(),
      token: sessionToken,
    });
  } catch (err) {
    console.error("❌ Error in /auth/register:", err);
    res.status(500).json({ message: "Error registering user" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { name, password } = req.body;

    if (!name || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ username: name });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    user.sessionToken = sessionToken;
    await user.save();

    res.json({
      user: user.toJSON(),
      token: sessionToken,
    });
  } catch (err) {
    console.error("❌ Error in /auth/login:", err);
    res.status(500).json({ message: "Error logging in" });
  }
});

router.get("/me", async (req, res) => {
  try {
    const auth = req.headers.authorization || "";
    const [, token] = auth.split(" ");

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const user = await User.findOne({ sessionToken: token });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }

    res.json(user.toJSON());
  } catch (err) {
    console.error("❌ Error in /auth/me:", err);
    res.status(500).json({ message: "Error getting current user" });
  }
});

export default router;

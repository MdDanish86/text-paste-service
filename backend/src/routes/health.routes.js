import express from "express";
import { connectDB } from "../config/db.js";

const router = express.Router();

router.get("/healthz", async (req, res) => {
  try {
    await connectDB();
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false });
  }
});

export default router;

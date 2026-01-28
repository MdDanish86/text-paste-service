import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import pasteRoutes from "./routes/paste.routes.js";
import htmlRoutes from "./routes/html.routes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

await connectDB();

app.use("/api", healthRoutes);
app.use("/api", pasteRoutes);
app.use("/", pasteRoutes);
app.use("/", htmlRoutes);

export default app;

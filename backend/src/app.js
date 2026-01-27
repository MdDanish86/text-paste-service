import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import healthRoutes from "./routes/health.routes.js";
import pasteRoutes from "./routes/paste.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api",healthRoutes);
app.use("/api",pasteRoutes);
app.use("/",pasteRoutes);

export default app;

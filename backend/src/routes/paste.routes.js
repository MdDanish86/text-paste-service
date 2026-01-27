import express from "express";
import { createPaste, getPaste } from "../controllers/paste.controller.js";
import Paste from "../models/paste.js";
import { getNow } from "../utils/time.js";

const router = express.Router();

//API routes
router.post("/pastes",createPaste);
router.get("/pastes/:id",getPaste);

// HTML route 
router.get("/p/:id", async (req, res) => {
    const paste = await Paste.findById(req.params.id);
    if (!paste) return res.status(404).send("Paste not found");

    const now = getNow(req);

    if (paste.expiresAt && paste.expiresAt <= now) return res.status(404).send("Paste not found ");
    if (paste.maxViews !== null && paste.views >= paste.maxViews) return res.status(404).send("Paste not found");

    paste.views +=1;
    await paste.save();

    res.setHeader("Content-type", "text/html");
    res.send(`
        <html>
          <head><title>Paste</title></head>
          <body style="white-space: pre-wrap; font-family: monospace; padding: 20px;">
          ${escapeHtml(paste.content)}
         </body>
        </html>        
    `);
});

function escapeHtml(text) {
    return text 
    .replace(/&/g, "&amp;")
    .replace(/>/g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default router;
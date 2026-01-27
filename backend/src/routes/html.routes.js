import express from "express";
import Paste from "../models/paste.js";
import { getNow } from "../utils/time.js";

const router = express.Router();

router.get("/p/:id", async (req, res) => {
  const { id } = req.params;
  const paste = await Paste.findById(id);

  if (!paste) return res.status(404).send("Not found");

  const now = getNow(req);

  if (paste.expiresAt && paste.expiresAt <= now) return res.status(404).send("Not found");
  if (paste.maxViews !== null && paste.views >= paste.maxViews) return res.status(404).send("Not found");

  paste.views += 1;
  await paste.save();

  res.send(`
    <html>
      <head>
        <title>Paste</title>
        <style>
          body { font-family: sans-serif; padding: 40px; }
          pre { background: #f4f4f4; padding: 20px; border-radius: 6px; }
        </style>
      </head>
      <body>
        <h2>Paste</h2>
        <pre>${paste.content}</pre>
      </body>
    </html>
  `);
});

export default router;

import Paste from "../models/paste.js";
import { nanoid } from "nanoid";
import { getNow } from "../utils/time.js";

export async function createPaste(req, res) {
  const { content, ttl_seconds, max_views } = req.body;

  // Validation
  if (!content || typeof content !== "string" || !content.trim()) {
    return res.status(400).json({ error: "content is required" });
  }

  if (ttl_seconds !== undefined && (!Number.isInteger(ttl_seconds) || ttl_seconds < 1)) {
    return res.status(400).json({ error: "Invalid ttl_seconds" });
  }

  if (max_views !== undefined && (!Number.isInteger(max_views) || max_views < 1)) {
    return res.status(400).json({ error: "Invalid max_views" });
  }

  const expiresAt = ttl_seconds
    ? new Date(Date.now() + ttl_seconds * 1000)
    : null;

  const paste = await Paste.create({
    _id: nanoid(10),
    content,
    expiresAt,
    maxViews: max_views ?? null,
  });

  const baseUrl = process.env.BASE_URL;

  res.status(201).json({
    id: paste._id,
    url: `${baseUrl}/p/${paste._id}`,
  });
}

export async function getPaste(req, res) {
  const { id } = req.params;
  const paste = await Paste.findById(id);

  if (!paste) return res.status(404).json({ error: "Not found" });

  const now = getNow(req);

  // TTL check
  if (paste.expiresAt && paste.expiresAt <= now) {
    return res.status(404).json({ error: "Not found" });
  }

  // View limit check
  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return res.status(404).json({ error: "Not found" });
  }

  paste.views += 1;
  await paste.save();

  const remainingViews =
    paste.maxViews === null ? null : paste.maxViews - paste.views;

  res.json({
    content: paste.content,
    remaining_views: remainingViews,
    expires_at: paste.expiresAt,
  });
}

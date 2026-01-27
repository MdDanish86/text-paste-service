import { useState } from "react";
import { createPaste } from "./api";

export default function App() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [views, setViews] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    const data = await createPaste({
      content,
      ttl_seconds: ttl ? Number(ttl) : undefined,
      max_views: views ? Number(views) : undefined,
    });

    if (data.error) return setError(data.error);
    setResult(data);
  }

  return (
    <main style={{ maxWidth: 600, margin: "3rem auto" }}>
      <h1>Pastebin Lite</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={8}
          style={{ width: "100%" }}
          placeholder="Enter paste..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <input
          type="number"
          placeholder="TTL seconds (optional)"
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max views (optional)"
          value={views}
          onChange={(e) => setViews(e.target.value)}
        />

        <button>Create Paste</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <p>
          URL:{" "}
          <a href={result.url} target="_blank">
            {result.url}
          </a>
        </p>
      )}
    </main>
  );
}

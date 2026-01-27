const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function createPaste(payload) {
    const res = await fetch(`${API_BASE}/api/pastes`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    return res.json();
}
// src/api/chatApi.js
const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://127.0.0.1:8000";

async function parseJsonSafe(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return { raw: text };
  }
}

export async function chat({ doc_id, question }) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ doc_id, question }),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    if (res.status === 429) {
      const msg =
        data?.detail || data?.error?.message || "Límite de la API alcanzado. Intente más tarde.";
      throw new Error(msg);
    }

    const msg =
      data?.detail ||
      data?.message ||
      data?.error?.message ||
      `Error del servidor (HTTP ${res.status})`;

    throw new Error(msg);
  }

  return data; // {answer: "..."} normalmente
}

import { createContext, useState } from "react";

export const ClassContext = createContext(null);

export function ClassProvider({ children }) {
  const [docId, setDocId] = useState(null);
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [messages, setMessages] = useState([]); // ← AGREGADO

  console.log("🧠 CONTEXT RENDER → docId:", docId);

  return (
    <ClassContext.Provider
      value={{
        docId,
        setDocId,
        content,
        setContent,
        fileName,
        setFileName,
        messages,      // ← AGREGADO
        setMessages,   // ← AGREGADO
      }}
    >
      {children}
    </ClassContext.Provider>
  );
}
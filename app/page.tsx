"use client";

import { useState } from "react";
import html2pdf from "html2pdf.js";

export default function Home() {
  const [draft, setDraft] = useState("");
  const [ebook, setEbook] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEbook = async () => {
    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({ draft }),
    });

    const data = await res.json();
    setEbook(data.ebook);
    setLoading(false);
  };

  const downloadPDF = () => {
    const element = document.getElementById("ebook");

    html2pdf()
      .from(element)
      .set({
        margin: 10,
        filename: "ebook.pdf",
        jsPDF: { format: "a4" },
      })
      .save();
  };

  return (
    <main style={{ maxWidth: 900, margin: "auto", padding: 20 }}>
      <h1>📚 Ebook AI PRO</h1>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Digite seu rascunho..."
        rows={8}
        style={{ width: "100%" }}
      />

      <button onClick={generateEbook}>
        {loading ? "Gerando..." : "Gerar Ebook"}
      </button>

      {ebook && (
        <>
          <button onClick={downloadPDF}>📄 Baixar PDF</button>

          <div
            id="ebook"
            style={{ background: "#fff", padding: 20, marginTop: 20 }}
            dangerouslySetInnerHTML={{ __html: ebook }}
          />
        </>
      )}
    </main>
  );
}
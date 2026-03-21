"use client";

import { useState } from "react";

export default function EbookClient() {
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

  const downloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    const element = document.getElementById("ebook");
    if (!element) return;

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
        style={{ width: "100%", marginBottom: 10 }}
      />

      <button onClick={generateEbook}>
        {loading ? "Gerando..." : "Gerar Ebook"}
      </button>

      {ebook && (
        <>
          <button onClick={downloadPDF}>📄 Baixar PDF</button>

          <div
            id="ebook"
            style={{
              background: "#fff",
              padding: 20,
              marginTop: 20,
              borderRadius: 8,
            }}
            dangerouslySetInnerHTML={{ __html: ebook }}
          />
        </>
      )}
    </main>
  );
}
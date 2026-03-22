"use client";

import { useState } from "react";

export default function Home() {
  const [draft, setDraft] = useState("");
  const [ebook, setEbook] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEbook = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",

        // 🔥 ESSENCIAL
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          draft: draft,
        }),
      });

      const data = await res.json();

      console.log("Resposta API:", data);

      if (data.ebook) {
        setEbook(data.ebook);
      } else {
        alert("Erro ao gerar ebook");
      }

    } catch (error) {
      console.error(error);
      alert("Erro na requisição");
    }

    setLoading(false);
  };

  const downloadPDF = async () => {
    if (typeof window === "undefined") return;

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
    <main
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <h1>📚 Ebook AI PRO</h1>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Digite seu rascunho..."
        rows={10}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 10,
        }}
      />

      <button onClick={generateEbook}>
        {loading ? "Gerando..." : "Gerar Ebook"}
      </button>

      {ebook && (
        <>
          <button onClick={downloadPDF}>
            📄 Baixar PDF
          </button>

          <div
            id="ebook"
            style={{
              background: "#fff",
              padding: 20,
              marginTop: 20,
              borderRadius: 8,
            }}
            dangerouslySetInnerHTML={{
              __html: ebook,
            }}
          />
        </>
      )}
    </main>
  );
}
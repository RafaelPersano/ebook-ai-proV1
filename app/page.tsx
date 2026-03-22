"use client";

import { useState } from "react";

export default function Home() {

  const [topic, setTopic] = useState("");
  const [author, setAuthor] = useState("");
  const [style, setStyle] = useState("business");
  const [titles, setTitles] = useState("");
  const [ebook, setEbook] = useState("");
  const [loading, setLoading] = useState(false);

  async function generateTitles() {

    setLoading(true);

    const res = await fetch("/api/titles", {
      method: "POST",
      body: JSON.stringify({ topic })
    });

    const data = await res.json();

    setTitles(data.titles);

    setLoading(false);
  }

  async function generateEbook() {

    setLoading(true);

    const res = await fetch("/api/generate", {
      method: "POST",
      body: JSON.stringify({
        topic,
        author,
        style,
        title: titles
      })
    });

    const data = await res.json();

    setEbook(data.ebook);

    setLoading(false);
  }

  function exportPDF() {

    const element =
      document.getElementById("ebook");

    const opt = {
      margin: 10,
      filename: "ebook-profissional.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  }

  return (

    <main style={{ padding: 40 }}>

      <h1>📚 Gerador Profissional de Ebook</h1>

      <input
        placeholder="Tema do Ebook"
        value={topic}
        onChange={(e) =>
          setTopic(e.target.value)
        }
        style={{
          width: "100%",
          padding: 12,
          marginTop: 10
        }}
      />

      <input
        placeholder="Nome do Autor"
        value={author}
        onChange={(e) =>
          setAuthor(e.target.value)
        }
        style={{
          width: "100%",
          padding: 12,
          marginTop: 10
        }}
      />

      {/* ESTILO EDITORIAL */}

      <select
        value={style}
        onChange={(e) =>
          setStyle(e.target.value)
        }
        style={{
          width: "100%",
          padding: 12,
          marginTop: 10
        }}
      >

        <option value="business">
          Business (Executivo)
        </option>

        <option value="modern">
          Moderno
        </option>

        <option value="academic">
          Acadêmico
        </option>

      </select>

      <button
        onClick={generateTitles}
        style={{
          marginTop: 12,
          padding: 12
        }}
      >
        🎯 Gerar Títulos
      </button>

      {titles && (

        <div style={{ marginTop: 20 }}>

          <h3>Títulos sugeridos:</h3>

          <pre>
            {titles}
          </pre>

          <button
            onClick={generateEbook}
            style={{
              marginTop: 12,
              padding: 14
            }}
          >
            📖 Criar Ebook
          </button>

        </div>

      )}

      {loading && <p>Gerando conteúdo...</p>}

      {ebook && (

        <>

          <button
            onClick={exportPDF}
            style={{
              marginTop: 20,
              padding: 14,
              background: "#000",
              color: "#fff"
            }}
          >
            📄 Exportar PDF
          </button>

          <div
            id="ebook"
            style={{
              marginTop: 40
            }}
            dangerouslySetInnerHTML={{
              __html: ebook
            }}
          />

        </>

      )}

<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

    </main>

  );

}
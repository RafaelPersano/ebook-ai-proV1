"use client";

import { useState } from "react";

export default function Home() {

  const [topic, setTopic] =
    useState("");

  const [author, setAuthor] =
    useState("Autor Independente");

  const [titles, setTitles] =
    useState("");

  const [selectedTitle, setSelectedTitle] =
    useState("");

  const [ebook, setEbook] =
    useState("");

  const [loadingTitles, setLoadingTitles] =
    useState(false);

  const [loadingEbook, setLoadingEbook] =
    useState(false);

  /* 🎯 GERAR TÍTULOS */

  const generateTitles = async () => {

    try {

      if (!topic) {

        alert("Digite um tema primeiro");

        return;

      }

      setLoadingTitles(true);

      const res =
        await fetch("/api/titles", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            topic
          })

        });

      const data =
        await res.json();

      if (data.error) {

        alert(data.error);

        return;

      }

      /* 🧠 LIMPAR TEXTO */

      let cleanTitles =
        data.titles
          .replace(/Claro!.*?:/gi, "")
          .replace(/Aqui estão.*?:/gi, "")
          .trim();

      setTitles(cleanTitles);

    }

    catch (error) {

      console.error(error);

      alert("Erro ao gerar títulos");

    }

    finally {

      setLoadingTitles(false);

    }

  };

  /* 📘 GERAR EBOOK */

  const generateEbook = async () => {

    try {

      if (!selectedTitle) {

        alert("Escolha um título");

        return;

      }

      setLoadingEbook(true);

      const res =
        await fetch("/api/generate", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            topic,
            author,
            title: selectedTitle,
            style: "business"

          })

        });

      const data =
        await res.json();

      if (data.error) {

        alert(data.error);

        return;

      }

      setEbook(data.ebook);

    }

    catch (error) {

      console.error(error);

      alert("Erro ao gerar ebook");

    }

    finally {

      setLoadingEbook(false);

    }

  };

  /* 📥 DOWNLOAD HTML */

  const downloadHTML = () => {

    const blob =
      new Blob([ebook], {

        type: "text/html"

      });

    const url =
      URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "ebook.html";

    a.click();

  };

  return (

    <main
      style={{

        maxWidth: "900px",

        margin: "40px auto",

        fontFamily: "Arial"

      }}
    >

      <h1>
        Gerador Profissional de Ebook
      </h1>

      {/* TEMA */}

      <div>

        <label>
          Tema do Ebook:
        </label>

        <input

          type="text"

          value={topic}

          onChange={(e) =>
            setTopic(e.target.value)
          }

          style={{

            width: "100%",

            padding: "10px",

            marginTop: "5px",

            marginBottom: "15px"

          }}

        />

      </div>

      {/* AUTOR */}

      <div>

        <label>
          Nome do Autor:
        </label>

        <input

          type="text"

          value={author}

          onChange={(e) =>
            setAuthor(e.target.value)
          }

          style={{

            width: "100%",

            padding: "10px",

            marginTop: "5px",

            marginBottom: "15px"

          }}

        />

      </div>

      {/* BOTÃO TÍTULOS */}

      <button

        onClick={generateTitles}

        disabled={loadingTitles}

        style={{

          padding: "12px 20px",

          fontSize: "16px",

          cursor: "pointer",

          marginBottom: "20px"

        }}

      >

        {loadingTitles
          ? "Gerando..."
          : "Gerar Títulos"}

      </button>

      {/* LISTA TÍTULOS */}

      {titles && (

        <div>

          <h2>
            Títulos sugeridos:
          </h2>

          <textarea

            value={titles}

            readOnly

            style={{

              width: "100%",

              height: "150px",

              padding: "10px"

            }}

          />

          <label
            style={{

              marginTop: "15px",

              display: "block"

            }}
          >

            Escolha um título:
          </label>

          <input

            type="text"

            placeholder="Cole aqui o título escolhido"

            value={selectedTitle}

            onChange={(e) =>
              setSelectedTitle(
                e.target.value
              )
            }

            style={{

              width: "100%",

              padding: "10px",

              marginTop: "5px"

            }}

          />

        </div>

      )}

      {/* GERAR EBOOK */}

      {selectedTitle && (

        <button

          onClick={generateEbook}

          disabled={loadingEbook}

          style={{

            padding: "12px 20px",

            fontSize: "16px",

            marginTop: "20px"

          }}

        >

          {loadingEbook
            ? "Gerando Ebook..."
            : "Gerar Ebook"}

        </button>

      )}

      {/* DOWNLOAD */}

      {ebook && (

        <div>

          <button

            onClick={downloadHTML}

            style={{

              padding: "12px 20px",

              fontSize: "16px",

              marginTop: "20px"

            }}

          >

            Baixar Ebook HTML
          </button>

          {/* PREVIEW */}

          <div

            style={{

              marginTop: "40px",

              border: "1px solid #ccc",

              padding: "20px"

            }}

            dangerouslySetInnerHTML={{
              __html: ebook
            }}

          />

        </div>

      )}

    </main>

  );

}
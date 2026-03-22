export async function POST(req: Request) {

  try {

    const {
      topic,
      author,
      style,
      title
    } = await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

      return Response.json({
        error: "API Key não encontrada"
      });

    }

    /* 🎯 GERAR TÍTULO PROFISSIONAL */

    const titleRes =
      await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({

            model: "google/gemini-2.5-pro",

            messages: [

              {
                role: "user",
                content: `
Crie um título profissional e altamente vendável para um ebook sobre:

${topic}

O título deve parecer um best-seller.
Retorne apenas o título.
`
              }

            ]

          })

        }

      );

    const titleData =
      await titleRes.json();

    const finalTitle =
      titleData.choices?.[0]
        ?.message?.content
        || title;

    /* 📖 GERAR EBOOK PROFUNDO */

    const textRes =
      await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({

            model: "google/gemini-2.5-pro",

            messages: [

              {
                role: "user",
                content: `
Crie um ebook profissional profundo.

TEMA:
${topic}

AUTOR:
${author}

ESTILO:
${style}

REQUISITOS OBRIGATÓRIOS:

Criar:

✔ Introdução profissional

✔ 6 capítulos

Cada capítulo deve ter:

- 3 parágrafos longos
- entre 180 e 250 palavras cada
- exemplos reais de mercado
- estudos de caso
- análises estratégicas

Incluir:

✔ Tabelas financeiras reais
✔ Gráficos em SVG
✔ Dados atuais de mercado
✔ Tendências recentes
✔ Referências reais

Adicionar:

<h2>Bibliografia</h2>

Com fontes reais como:

- McKinsey
- Gartner
- Statista
- Harvard Business Review
- Deloitte
- World Economic Forum

FORMATO:

HTML PROFISSIONAL.

Cada capítulo:

<h2>Capítulo X</h2>

Depois:

Inserir:

<img class="chapter-image"/>

Depois:

3 parágrafos longos.

Depois:

Inserir tabela.

Depois:

Inserir gráfico SVG.

`
              }

            ]

          })

        }

      );

    const textData =
      await textRes.json();

    if (!textData.choices) {

      return Response.json({
        error: textData
      });

    }

    const content =
      textData.choices[0]
        .message.content;

    /* 🎨 CAPA */

    const coverUrl =
      `https://placehold.co/1024x1792?text=${encodeURIComponent(finalTitle)}`;

    /* 📘 LAYOUT EDITORIAL */

    const finalHTML = `

<style>

body {

font-family: Georgia, serif;
line-height: 1.9;
font-size: 18px;
color: #333;

}

h1 {

font-size: 42px;
text-align: center;
margin-top: 80px;

}

h2 {

margin-top: 60px;
page-break-before: always;

}

p {

text-align: justify;

orphans: 3;
widows: 3;

}

.chapter-image {

width: 100%;
margin: 30px 0;

}

table {

width: 100%;
border-collapse: collapse;
margin-top: 20px;

}

td, th {

border: 1px solid #ccc;
padding: 10px;

}

svg {

width: 100%;
margin-top: 20px;

}

footer {

position: fixed;
bottom: 10mm;
text-align: center;
font-size: 12px;
color: #777;

}

.cover {

page-break-after: always;

}

</style>

<div class="cover">

<img src="${coverUrl}"
style="
width:100%;
border-radius:10px;
"
/>

<h1>

${finalTitle}

</h1>

<p style="text-align:center;">

Autor: ${author}

</p>

</div>

${content}

<footer>

Página <span class="pageNumber"></span>

</footer>

`;

    return Response.json({

      ebook: finalHTML

    });

  }

  catch (error: any) {

    return Response.json({

      error: error.message

    });

  }

}
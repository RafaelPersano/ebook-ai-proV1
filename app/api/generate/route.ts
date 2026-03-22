export async function POST(req: Request) {

  try {

    const {
      topic,
      author
    } = await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return Response.json({
        error: "API Key não configurada"
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
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `
Crie um título BESTSELLER profissional para um ebook sobre:

${topic}

O título deve ser:
- chamativo
- vendável
- moderno
`
              }
            ]
          })
        }
      );

    const titleData =
      await titleRes.json();

    const title =
      titleData.choices[0]
        .message.content;

    /* 🎨 CAPA */

    const coverRes =
      await fetch(
        "https://openrouter.ai/api/v1/images/generations",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "openai/dall-e-3",
            prompt: `
Professional ebook cover.

Title: ${title}

Modern design.
Clean typography.
Minimalist style.
Best seller visual.
`,
            size: "1024x1792"
          })
        }
      );

    const coverData =
      await coverRes.json();

    const cover =
      coverData?.data?.[0]?.url;

    /* 📖 TEXTO PROFISSIONAL */

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
            model: "openai/gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: `
Crie um ebook profissional para venda digital.

TEMA:
${topic}

AUTOR:
${author}

REQUISITOS:

- 6 capítulos
- Cada capítulo com:
  - 3 parágrafos completos
  - linguagem profissional
  - dados atualizados de mercado
  - exemplos reais
- Criar Introdução
- Criar Sumário
- Criar Conclusão
- Criar Chamada para ação

FORMATO:

HTML PROFISSIONAL.

Cada capítulo:

<h2>Capítulo</h2>

3 parágrafos completos.

Não usar textos curtos.

`
              }
            ]
          })
        }
      );

    const textData =
      await textRes.json();

    const content =
      textData.choices[0]
        .message.content;

    /* 🖼️ ILUSTRAÇÃO POR CAPÍTULO */

    const chapterImages = [];

    for (let i = 1; i <= 6; i++) {

      const imgRes =
        await fetch(
          "https://openrouter.ai/api/v1/images/generations",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "openai/dall-e-3",
              prompt: `
Vector illustration.

Topic: ${topic}

Chapter ${i}

Flat design.
Minimalist.
Professional ebook illustration.
`,
              size: "1024x1024"
            })
          }
        );

      const imgData =
        await imgRes.json();

      chapterImages.push(
        imgData?.data?.[0]?.url
      );

    }

    /* 📘 LAYOUT EDITORIAL */

    const finalHTML = `

<div style="
max-width:760px;
margin:auto;
font-family: 'Georgia', serif;
line-height:1.8;
font-size:18px;
color:#333;
padding:60px;
">

<!-- CAPA -->

<img src="${cover}"
style="
width:100%;
margin-bottom:50px;
border-radius:10px;
"/>

<h1 style="
text-align:center;
font-size:42px;
margin-bottom:10px;
">
${title}
</h1>

<p style="
text-align:center;
font-size:18px;
color:#777;
">
Autor: ${author}
</p>

<hr/>

<!-- CONTEÚDO -->

${content}

<footer style="
margin-top:60px;
padding-top:20px;
border-top:1px solid #ddd;
font-size:14px;
text-align:center;
color:#888;
page-break-inside: avoid;
">

Página <span class="pageNumber"></span>

<br/>

© ${new Date().getFullYear()}
${author}

</footer>

</div>

`;

    return Response.json({
      ebook: finalHTML
    });

  } catch (error: any) {

    return Response.json({
      error: error.message
    });

  }

}
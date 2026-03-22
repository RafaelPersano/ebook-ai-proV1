export async function POST(req: Request) {

  try {

    const {
      topic,
      author,
      title
    } = await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    // 🎨 CAPA

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
Professional bestselling ebook cover.

Title: ${title}

Topic: ${topic}

Minimalist modern design.
`,
            size: "1024x1792"
          })
        }
      );

    const coverData =
      await coverRes.json();

    const cover =
      coverData?.data?.[0]?.url;

    // 🧠 TEXTO PROFUNDO

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
Crie um ebook BESTSELLER profissional.

TÍTULO:
${title}

AUTOR:
${author}

TEMA:
${topic}

REQUISITOS:

- 8 capítulos profundos
- Introdução forte
- Sumário
- Conclusão
- Linguagem profissional
- Narrativa envolvente
- Exemplos práticos
- Dicas acionáveis

FORMATO HTML.

Inclua:

- Rodapé com paginação
- Numeração de páginas
- Layout estilo livro

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

    const finalHTML = `

<div style="
max-width:800px;
margin:auto;
font-family:Georgia, serif;
line-height:1.8;
font-size:18px;
color:#333;
">

<img src="${cover}" style="
width:100%;
margin-bottom:40px;
border-radius:12px;
"/>

<h3 style="
text-align:center;
margin-bottom:40px;
">
Autor: ${author}
</h3>

${content}

<footer style="
margin-top:60px;
border-top:1px solid #ccc;
padding-top:20px;
text-align:center;
font-size:14px;
color:#888;
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
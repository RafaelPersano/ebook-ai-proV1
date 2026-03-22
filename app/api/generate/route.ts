export async function POST(req: Request) {
  try {
    const { draft } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return Response.json({
        error: "OPENROUTER_API_KEY não configurada"
      });
    }

    // 🎨 GERAR CAPA
    const imageResponse = await fetch(
      "https://openrouter.ai/api/v1/images/generations",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/dall-e-3",
          prompt: `Professional ebook cover, modern design, clean typography, title about: ${draft}`,
          size: "1024x1792"
        }),
      }
    );

    const imageData = await imageResponse.json();

    const coverUrl =
      imageData?.data?.[0]?.url ||
      "https://placehold.co/1024x1792?text=Ebook+Cover";

    // 🧠 GERAR EBOOK PROFISSIONAL
    const textResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",

          messages: [
            {
              role: "user",
              content: `
Você é um escritor profissional especialista em ebooks virais.

Crie um ebook COMPLETO e PROFUNDO em HTML.

REQUISITOS OBRIGATÓRIOS:

- Título forte e chamativo
- Subtítulo profissional
- Introdução envolvente
- 6 a 8 capítulos
- Cada capítulo com 800 a 1200 palavras
- Conteúdo profundo
- Exemplos reais
- Listas práticas
- Dicas acionáveis
- Conclusão poderosa
- Chamada para ação final

FORMATAÇÃO HTML:

Crie:

<h1>Título do Ebook</h1>

<h2>Subtítulo</h2>

<h2>Introdução</h2>

Depois:

<h2>Sumário</h2>

<ul>
<li><a href="#cap1">Capítulo 1</a></li>
<li><a href="#cap2">Capítulo 2</a></li>
<li><a href="#cap3">Capítulo 3</a></li>
<li><a href="#cap4">Capítulo 4</a></li>
<li><a href="#cap5">Capítulo 5</a></li>
<li><a href="#cap6">Capítulo 6</a></li>
</ul>

Depois escreva:

<h2 id="cap1">Capítulo 1</h2>

(conteúdo profundo)

<div style="page-break-after: always;"></div>

<h2 id="cap2">Capítulo 2</h2>

(conteúdo profundo)

<div style="page-break-after: always;"></div>

Continue até:

Conclusão  
Chamada para ação

TEMA DO EBOOK:

${draft}

`
            }
          ],
        }),
      }
    );

    const textData = await textResponse.json();

    if (!textResponse.ok) {
      return Response.json({
        error: textData
      });
    }

    const ebookContent =
      textData?.choices?.[0]?.message?.content;

    // 🎨 HTML FINAL PROFISSIONAL
    const finalHTML = `

<div style="
max-width:800px;
margin:auto;
font-family:Georgia, serif;
line-height:1.8;
font-size:18px;
color:#333;
">

<img src="${coverUrl}" 
style="
width:100%;
border-radius:12px;
margin-bottom:40px;
"/>

<style>

h1 {
font-size:42px;
text-align:center;
margin-bottom:30px;
}

h2 {
font-size:28px;
margin-top:50px;
border-bottom:2px solid #eee;
padding-bottom:10px;
}

p {
margin-bottom:20px;
}

ul {
margin-left:20px;
}

footer {
margin-top:60px;
font-size:14px;
text-align:center;
color:#888;
border-top:1px solid #eee;
padding-top:20px;
}

</style>

${ebookContent}

<footer>
© ${new Date().getFullYear()} Ebook AI PRO  
Criado automaticamente com Inteligência Artificial
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
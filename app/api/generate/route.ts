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

    /* 📘 PROMPT PROFISSIONAL */

    const prompt = `

Crie um ebook PROFISSIONAL COMPLETO para venda online.

TEMA:
${topic}

TÍTULO:
${title}

AUTOR:
${author}

ESTILO:
${style}

O ebook deve parecer um BEST-SELLER profissional vendido na Hotmart.

---

ESTRUTURA OBRIGATÓRIA:

1️⃣ CAPA

Criar título forte.
Criar subtítulo profissional.

---

2️⃣ SUMÁRIO

Criar sumário estruturado com:

Introdução  
Capítulo 1  
Capítulo 2  
Capítulo 3  
Capítulo 4  
Capítulo 5  
Capítulo 6  
Conclusão  
Bibliografia  

---

3️⃣ INTRODUÇÃO

4 parágrafos completos  
Explicando:

- problema do mercado
- oportunidade
- importância do tema
- o que o leitor aprenderá

---

4️⃣ CAPÍTULOS

Criar:

6 capítulos completos.

Cada capítulo deve conter:

✔ Título forte  
✔ Ilustração SVG no topo  
✔ 3 parágrafos longos  
(180–250 palavras cada)

✔ Exemplo real  
✔ Estudo de caso  
✔ Dados atuais de mercado  

✔ Tabela financeira real  
✔ Gráfico SVG com dados  

---

5️⃣ CONCLUSÃO

3 parágrafos fortes.

---

6️⃣ BIBLIOGRAFIA

Citar fontes reais:

- McKinsey
- Gartner
- Statista
- Deloitte
- Harvard Business Review
- World Economic Forum

---

FORMATO:

Retornar HTML PROFISSIONAL.

Usar:

<h1>
<h2>
<p>
<table>
<svg>

Criar:

✔ Ilustrações SVG  
✔ Gráficos SVG  
✔ Tabelas HTML  

`;

    /* 📡 CHAMADA GEMINI */

    const response =
      await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {

            Authorization:
              `Bearer ${apiKey}`,

            "Content-Type":
              "application/json"

          },

          body: JSON.stringify({

            model:
              "google/gemini-2.5-pro",

            temperature: 0.7,

            max_tokens: 12000,

            messages: [

              {
                role: "user",
                content: prompt
              }

            ]

          })

        }

      );

    const data =
      await response.json();

    if (!data.choices) {

      console.error(data);

      return Response.json({
        error: data
      });

    }

    const content =
      data.choices[0]
        .message.content;

    /* 🎨 CAPA AUTOMÁTICA */

    const cover =
      `https://placehold.co/1024x1792/png?text=${encodeURIComponent(title)}`;

    /* 📘 LAYOUT EDITORIAL */

    const finalHTML = `

<style>

body {

font-family: Georgia, serif;
line-height: 1.9;
font-size: 18px;
color: #333;

margin: 40px;

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

img {

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

.cover {

page-break-after: always;

}

.toc {

page-break-after: always;

}

footer {

position: fixed;

bottom: 10mm;

text-align: center;

font-size: 12px;

color: #777;

}

</style>

<div class="cover">

<img src="${cover}" />

<h1>${title}</h1>

<p style="text-align:center;">
Autor: ${author}
</p>

</div>

<div class="toc">

<h2>Sumário</h2>

<ol>

<li>Introdução</li>
<li>Capítulo 1</li>
<li>Capítulo 2</li>
<li>Capítulo 3</li>
<li>Capítulo 4</li>
<li>Capítulo 5</li>
<li>Capítulo 6</li>
<li>Conclusão</li>
<li>Bibliografia</li>

</ol>

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

    console.error(error);

    return Response.json({

      error:
        error.message

    });

  }

}
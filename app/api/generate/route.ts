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

    /* 🎯 PROMPT PROFISSIONAL PROFUNDO */

    const prompt = `

Crie um ebook PROFISSIONAL profundo,
com conteúdo consistente e vendável.

Tema:
${topic}

Autor:
${author}

Título:
${title}

---

OBJETIVO:

Criar um ebook realista,
com densidade de conteúdo,
como um produto vendido na Hotmart.

---

ESTRUTURA OBRIGATÓRIA:

1️⃣ SUMÁRIO

Criar lista estruturada:

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

2️⃣ INTRODUÇÃO

Criar 4 parágrafos longos.

Explicar:

- cenário atual do mercado
- crescimento do setor
- oportunidades reais
- impacto econômico

Usar dados plausíveis.

---

3️⃣ CAPÍTULOS

Criar 6 capítulos completos.

Cada capítulo deve conter:

✔ mínimo 3 parágrafos longos  
✔ entre 180 e 250 palavras cada  

Cada capítulo deve incluir:

- explicação aprofundada
- análise estratégica
- exemplo realista
- estudo de caso
- contexto de mercado
- tendências recentes

Evitar conteúdo superficial.

Criar narrativa contínua.

Cada capítulo deve evoluir
sobre o anterior.

---

4️⃣ TABELAS FINANCEIRAS

Criar tabelas com:

- investimento inicial
- custo operacional
- receita estimada
- lucro projetado

Formato:

<table>
<tr><th>Item</th><th>Valor</th></tr>
<tr><td>Investimento</td><td>R$ 15.000</td></tr>
</table>

---

5️⃣ GRÁFICOS SVG

Criar gráficos mostrando:

- crescimento do mercado
- projeção de receita

Usar SVG simples.

---

6️⃣ CONCLUSÃO

Criar 3 parágrafos longos.

Mostrar:

- visão futura
- oportunidades
- recomendações práticas

---

7️⃣ BIBLIOGRAFIA

Criar lista baseada em:

- relatórios empresariais
- estudos de mercado
- análises estratégicas

---

FORMATO:

Retornar HTML PROFISSIONAL.

Usar:

<h1>
<h2>
<p>
<table>
<svg>

Cada capítulo deve ser consistente,
coerente
e aprofundado.

Escrever como especialista.

`;

    /* 📖 GERAR TEXTO */

    const textResponse =
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

            max_tokens: 14000,

            messages: [

              {
                role: "user",
                content: prompt
              }

            ]

          })

        }

      );

    const textData =
      await textResponse.json();

    if (!textData.choices) {

      return Response.json({
        error: textData
      });

    }

    let ebookHTML =
      textData.choices[0]
        .message.content;

    /* 🎨 CAPA */

    const coverPrompt = `

Professional ebook cover.

Topic:
${topic}

Style:
Modern business book cover.

Minimalist.
Professional typography.

`;

    const coverResponse =
      await fetch(
        "https://openrouter.ai/api/v1/images/generations",
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
              "google/gemini-2.0-flash-exp-image",

            prompt:
              coverPrompt,

            size:
              "1024x1792"

          })

        }

      );

    const coverData =
      await coverResponse.json();

    const coverUrl =
      coverData?.data?.[0]?.url;

    /* 🖼 ILUSTRAÇÕES */

    const chapterImages = [];

    for (let i = 1; i <= 6; i++) {

      const imgPrompt = `

Professional vector illustration.

Chapter ${i}

Topic:
${topic}

Minimalist style.

`;

      const imgResponse =
        await fetch(
          "https://openrouter.ai/api/v1/images/generations",
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
                "google/gemini-2.0-flash-exp-image",

              prompt:
                imgPrompt,

              size:
                "1024x1024"

            })

          }

        );

      const imgData =
        await imgResponse.json();

      const imageUrl =
        imgData?.data?.[0]?.url;

      chapterImages.push(imageUrl);

    }

    /* INSERIR IMAGENS */

    chapterImages.forEach(
      (img, index) => {

        const regex =
          new RegExp(
            `<h2>Capítulo ${index + 1}[^<]*</h2>`
          );

        ebookHTML =
          ebookHTML.replace(

            regex,

            `<h2>Capítulo ${index + 1}</h2>
             <img src="${img}"
             style="width:100%;
             margin:30px 0;
             border-radius:12px;" />`

          );

      }
    );

    /* 📘 LAYOUT FINAL */

    const finalHTML = `

<style>

body {

font-family: Georgia, serif;
line-height: 1.9;
font-size: 18px;
margin: 40px;

}

h1 {

font-size: 42px;
text-align: center;

}

h2 {

margin-top: 60px;
page-break-before: always;

}

img {

width: 100%;
margin: 30px 0;

}

p {

text-align: justify;

}

table {

width: 100%;
border-collapse: collapse;

}

td, th {

border: 1px solid #ccc;
padding: 10px;

}

</style>

<img src="${coverUrl}"
style="
width:100%;
margin-bottom:40px;
border-radius:14px;
"
/>

<h1>${title}</h1>

<p style="text-align:center;">
Autor: ${author}
</p>

${ebookHTML}

`;

    return Response.json({

      ebook: finalHTML

    });

  }

  catch (error: any) {

    return Response.json({

      error:
        error.message

    });

  }

}
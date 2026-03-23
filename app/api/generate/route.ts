export async function POST(req: Request) {

  try {

    console.log("📘 Gerando Ebook...");

    const {
      topic,
      author,
      title
    } = await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

      return Response.json({

        error: "API Key não encontrada"

      }, { status: 500 });

    }

    /* 🧠 PROMPT PROFISSIONAL REAL */

    const prompt = `

Crie um ebook PROFISSIONAL e profundo.

Tema:
${topic}

Título:
${title}

Autor:
${author}

OBJETIVO:

Criar um ebook vendável
no estilo Hotmart.

ESTRUTURA:

<h1>Introdução</h1>

Criar 4 parágrafos longos.

Cada parágrafo com
mínimo 180 palavras.

---

<h2>Capítulo 1</h2>

Criar 3 parágrafos longos.

Incluir:

- exemplo realista
- estratégia prática

---

<h2>Capítulo 2</h2>

Criar 3 parágrafos longos.

Incluir:

- estudo de caso
- análise de mercado

---

<h2>Capítulo 3</h2>

Criar 3 parágrafos longos.

Incluir:

- crescimento do setor
- oportunidades

---

<h2>Capítulo 4</h2>

Criar 3 parágrafos longos.

Incluir:

- custos
- estrutura operacional

---

<h2>Capítulo 5</h2>

Criar 3 parágrafos longos.

Incluir:

- marketing
- vendas

---

<h2>Capítulo 6</h2>

Criar 3 parágrafos longos.

Incluir:

- escala
- crescimento

---

<h2>Tabela Financeira</h2>

Criar tabela HTML:

<table>
<tr>
<th>Item</th>
<th>Valor</th>
</tr>
<tr>
<td>Investimento Inicial</td>
<td>R$ 15.000</td>
</tr>
<tr>
<td>Receita Mensal</td>
<td>R$ 8.000</td>
</tr>
<tr>
<td>Lucro Estimado</td>
<td>R$ 5.000</td>
</tr>
</table>

---

<h2>Conclusão</h2>

Criar 3 parágrafos longos.

Mostrar visão futura.

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

            max_tokens: 9000,

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

      console.error(textData);

      return Response.json({

        error: "Erro ao gerar texto"

      });

    }

    let ebookHTML =
      textData
        .choices[0]
        .message
        .content;

    console.log("✅ Texto gerado");

    /* 🎨 GERAR CAPA */

    let coverUrl =
      "https://placehold.co/1024x1792/png";

    try {

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
                `Professional ebook cover about ${topic}`,

              size:
                "1024x1792"

            })

          }

        );

      const coverData =
        await coverResponse.json();

      if (coverData?.data?.[0]?.url) {

        coverUrl =
          coverData.data[0].url;

      }

    }

    catch (err) {

      console.log(
        "⚠️ Capa não gerada — usando placeholder"
      );

    }

    /* 🖼 ILUSTRAÇÕES */

    for (let i = 1; i <= 6; i++) {

      try {

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
                  `Illustration for Chapter ${i} about ${topic}`,

                size:
                  "1024x1024"

              })

            }

          );

        const imgData =
          await imgResponse.json();

        const imgUrl =
          imgData?.data?.[0]?.url;

        if (imgUrl) {

          const regex =
            new RegExp(
              `<h2>Capítulo ${i}[^<]*</h2>`
            );

          ebookHTML =
            ebookHTML.replace(

              regex,

              `<h2>Capítulo ${i}</h2>
               <img src="${imgUrl}"
               style="width:100%;margin:25px 0;border-radius:12px;" />`

            );

        }

      }

      catch {

        console.log(
          `⚠️ Falha imagem capítulo ${i}`
        );

      }

    }

    /* 📘 HTML FINAL */

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

margin-top:20px;

}

td, th {

border: 1px solid #ccc;
padding: 10px;

}

</style>

<img src="${coverUrl}"
style="width:100%;margin-bottom:40px;border-radius:14px;"
/>

<h1>${title}</h1>

<p style="text-align:center;">
Autor: ${author}
</p>

${ebookHTML}

`;

    console.log("✅ Ebook pronto");

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
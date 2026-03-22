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

    /* 📘 PROMPT DO EBOOK */

    const ebookPrompt = `

Crie um ebook profissional completo.

TEMA:
${topic}

Criar:

✔ Sumário  
✔ Introdução  
✔ 6 capítulos  
✔ mínimo 3 parágrafos por capítulo  
✔ pesquisa de mercado atualizada  
✔ estudo de caso  
✔ tabela financeira  
✔ gráfico SVG  
✔ conclusão  
✔ bibliografia  

Formato HTML.

Cada capítulo deve começar com:

<h2>Capítulo X - Título</h2>

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

            max_tokens: 12000,

            messages: [

              {
                role: "user",
                content: ebookPrompt
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

    /* 🎨 GERAR CAPA */

    const coverPrompt = `

Professional ebook cover.

Topic:
${topic}

Style:
Modern business book cover.

Clean typography.
Professional layout.
Minimalist.
High contrast.

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

    /* 🖼 GERAR ILUSTRAÇÕES DOS CAPÍTULOS */

    const chapterImages = [];

    for (let i = 1; i <= 6; i++) {

      const imgPrompt = `

Professional vector illustration.

Chapter ${i}

Topic:
${topic}

Minimalist vector style.
Modern book illustration.

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

    /* 🧠 INSERIR IMAGENS NOS CAPÍTULOS */

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
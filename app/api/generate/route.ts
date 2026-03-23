export async function POST(req: Request) {

  try {

    console.log("📘 Gerando ebook");

    const {
      topic,
      title,
      author
    } = await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

      return Response.json({
        error: "API Key não encontrada"
      });

    }

    const prompt = `

Crie um ebook profissional em HTML.

Tema:
${topic}

Título:
${title}

Autor:
${author}

Criar:

<h1>Introdução</h1>
4 parágrafos

<h2>Capítulo 1</h2>
3 parágrafos

<h2>Capítulo 2</h2>
3 parágrafos

<h2>Capítulo 3</h2>
3 parágrafos

<h2>Conclusão</h2>
3 parágrafos

Usar apenas HTML básico.

`;

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

            max_tokens: 6000,

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

    console.log("📦 RAW:", data);

    if (!data.choices) {

      return Response.json({
        error: "Erro ao gerar ebook"
      });

    }

    /* 🧠 CORREÇÃO GEMINI */

    let content =
      data.choices[0]
        .message.content;

    if (Array.isArray(content)) {

      content =
        content
          .map(c => c.text || "")
          .join("\n");

    }

    return Response.json({

      ebook:
        content

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
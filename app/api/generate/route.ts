export async function POST(req: Request) {

  try {

    console.log("📘 /api/generate chamado");

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

Crie um pequeno ebook em HTML.

Tema:
${topic}

Título:
${title}

Autor:
${author}

Criar:

- Introdução
- 3 capítulos
- Conclusão

Usar:

<h1>
<h2>
<p>

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

            messages: [

              {
                role: "user",
                content: prompt
              }

            ],

            max_tokens: 3000

          })

        }

      );

    const data =
      await response.json();

    if (!data.choices) {

      console.log(data);

      return Response.json({
        error: "Erro ao gerar ebook"
      });

    }

    return Response.json({

      ebook:
        data.choices[0]
          .message.content

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
export async function POST(req: Request) {

  try {

    const { topic } =
      await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

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

                content: `

Crie 7 títulos BESTSELLER
altamente vendáveis.

Tema:

${topic}

Foco:

- vendas online
- Hotmart
- alto impacto
- curiosidade

Retorne lista numerada.

`

              }

            ]

          })

        }

      );

    const data =
      await response.json();

    return Response.json({

      titles:
        data.choices[0]
          .message.content

    });

  }

  catch (error: any) {

    return Response.json({

      error:
        error.message

    });

  }

}
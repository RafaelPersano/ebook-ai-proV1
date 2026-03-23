export async function POST(req: Request) {

  try {

    console.log("📩 /api/titles chamado");

    const { topic } =
      await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

      return Response.json({
        error: "API Key não encontrada"
      }, { status: 500 });

    }

    const prompt = `

Crie 7 títulos de ebook
altamente vendáveis.

Tema:
${topic}

Retorne apenas lista numerada.

Exemplo:

1. Como Ganhar Dinheiro com IA
2. O Método SaaS Milionário

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

            max_tokens: 500

          })

        }

      );

    const data =
      await response.json();

    if (!data.choices) {

      console.log(data);

      return Response.json({
        error: "Erro ao gerar títulos"
      });

    }

    return Response.json({

      titles:
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
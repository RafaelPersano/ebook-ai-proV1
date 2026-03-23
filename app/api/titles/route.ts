export async function POST(req: Request) {

  try {

    console.log("📩 Requisição recebida em /api/titles");

    const body = await req.json();

    const topic = body.topic;

    if (!topic) {

      return Response.json({
        error: "Tema não enviado"
      }, { status: 400 });

    }

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

      console.error(
        "❌ OPENROUTER_API_KEY não encontrada"
      );

      return Response.json({
        error:
          "API Key não configurada"
      }, { status: 500 });

    }

    /* 🎯 PROMPT PROFISSIONAL */

    const prompt = `

Crie 7 títulos de ebook
altamente vendáveis
no estilo BESTSELLER.

Tema:
${topic}

Regras:

- títulos curtos
- altamente persuasivos
- com curiosidade
- estilo Hotmart
- foco em vendas

Retorne:

Lista numerada.

Exemplo:

1. Como Ganhar Dinheiro com IA
2. O Método Oculto do SaaS

`;

    /* 🚀 CHAMADA API */

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

            temperature: 0.8,

            max_tokens: 500,

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

    console.log("📦 Resposta OpenRouter:", data);

    if (!data.choices) {

      return Response.json({
        error: data
      }, { status: 500 });

    }

    const titles =
      data.choices[0]
        .message.content;

    return Response.json({

      titles

    });

  }

  catch (error: any) {

    console.error(
      "❌ Erro interno:",
      error
    );

    return Response.json({

      error:
        error.message

    }, { status: 500 });

  }

}
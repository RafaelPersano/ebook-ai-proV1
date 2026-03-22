export async function POST(req: Request) {

  try {

    const { topic } =
      await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

      return Response.json({
        error: "API Key não encontrada"
      });

    }

    if (!topic) {

      return Response.json({
        error: "Tema não informado"
      });

    }

    /* 🎯 GERAR TÍTULOS BESTSELLER */

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

            temperature: 0.9,

            max_tokens: 500,

            messages: [

              {

                role: "user",

                content: `

Crie 7 títulos de ebook altamente vendáveis.

TEMA:
${topic}

Requisitos:

- estilo best-seller
- linguagem forte
- foco comercial
- atrativo para vendas online
- ideal para Hotmart
- despertar curiosidade
- parecer livro líder de mercado

Formato:

Retorne uma lista numerada:

1.
2.
3.
4.
5.
6.
7.

Não escreva explicações.
Somente os títulos.

`

              }

            ]

          })

        }

      );

    const data =
      await response.json();

    /* 🧠 TRATAMENTO DE ERRO */

    if (!data.choices) {

      console.error(
        "Erro OpenRouter:",
        data
      );

      return Response.json({

        error: data

      });

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
      "Erro interno:",
      error
    );

    return Response.json({

      error:
        error.message

    });

  }

}
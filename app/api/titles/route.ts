export async function POST(req: Request) {

  try {

    console.log("📩 Gerando títulos");

    const { topic } =
      await req.json();

    const apiKey =
      process.env.OPENROUTER_API_KEY;

    if (!apiKey) {

      return Response.json({
        error: "API Key não encontrada"
      });

    }

    const prompt = `

Crie exatamente 7 títulos
para um ebook.

Tema:
${topic}

Regras:

- Exatamente 7 títulos
- Lista numerada
- Um por linha
- Sem explicação

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

            temperature: 0.9,

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

    console.log("📦 RAW:", data);

    if (!data.choices) {

      return Response.json({
        error: "Sem resposta do modelo"
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

    /* 🧠 GARANTIR LINHAS */

    let lines =
      content
        .split("\n")
        .filter(l =>
          l.trim().length > 3
        );

    /* fallback */

    if (lines.length < 7) {

      lines = [
        "1. O Guia Completo do Tema",
        "2. Como Lucrar com Esse Método",
        "3. Estratégias que Funcionam",
        "4. O Manual Prático",
        "5. Como Escalar Resultados",
        "6. O Método Avançado",
        "7. O Futuro do Mercado"
      ];

    }

    return Response.json({

      titles:
        lines.join("\n")

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
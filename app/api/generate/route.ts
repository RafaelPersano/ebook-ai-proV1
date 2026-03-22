export async function POST(req: Request) {
  try {
    const { draft } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return Response.json({
        error: "API KEY não configurada"
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // 🔥 MODELO SEGURO
          model: "openai/gpt-4o-mini",

          messages: [
            {
              role: "user",
              content: `
Crie um ebook em HTML com:

- Título
- Introdução
- 3 capítulos
- Conclusão

Tema:
${draft}
              `,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("Resposta OpenRouter:", data);

    if (!response.ok) {
      return Response.json({
        error: data
      });
    }

    return Response.json({
      ebook: data.choices?.[0]?.message?.content
    });

  } catch (error: any) {
    return Response.json({
      error: error.message
    });
  }
}
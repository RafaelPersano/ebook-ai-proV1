export async function POST(req: Request) {
  try {
    const { draft } = await req.json();

    console.log("Draft recebido:", draft);

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return Response.json({
        error: "OPENROUTER_API_KEY não encontrada"
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
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "user",
              content: `Crie um ebook em HTML baseado neste texto:\n\n${draft}`
            }
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
    console.error("Erro interno:", error);

    return Response.json({
      error: error.message
    });
  }
}
export async function POST(req: Request) {
  const { draft } = await req.json();

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: `Crie um ebook profissional em HTML com:
- Título
- Sumário
- Capítulos
- Conclusão

Baseado nisso:
${draft}`,
          },
        ],
      }),
    });

    const data = await res.json();

    return Response.json({
      ebook: data.choices?.[0]?.message?.content || "Erro ao gerar ebook",
    });
  } catch (error) {
    return Response.json(
      { error: "Erro ao gerar ebook" },
      { status: 500 }
    );
  }
}
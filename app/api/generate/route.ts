export async function POST(req: Request) {
  const { draft } = await req.json();

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          {
            role: "system",
            content: `
Crie um ebook profissional com:
- capa
- sumário
- capítulos
- rodapé
- páginas com <div class="page">
`,
          },
          {
            role: "user",
            content: draft,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  return Response.json({
    ebook: data.choices?.[0]?.message?.content,
  });
}
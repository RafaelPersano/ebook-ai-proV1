export async function POST(req: Request) {

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
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: `
Crie 5 títulos de ebook BESTSELLER altamente vendáveis sobre:

${topic}

Retorne em lista.
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
      data.choices[0].message.content
  });

}
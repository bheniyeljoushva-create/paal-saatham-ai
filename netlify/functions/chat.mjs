export default async (request) => {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Use POST for chat." }), {
      status: 405,
      headers: { "Content-Type": "application/json", "Allow": "POST" }
    });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "AI setup needed: add OPENAI_API_KEY in Netlify environment variables." }), {
      status: 503,
      headers: { "Content-Type": "application/json" }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON request." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, 1000) : "";
  if (!message) {
    return new Response(JSON.stringify({ error: "Type a message first." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const history = Array.isArray(body.history) ? body.history.slice(-10).map((item) => ({
    role: item && item.role === "assistant" ? "assistant" : "user",
    content: String(item && item.content ? item.content : "").slice(0, 1000)
  })).filter((item) => item.content) : [];

  const input = [...history, { role: "user", content: message }];

  try {
    const apiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        instructions: "You are Paal Saatham, a friendly, kind chatbot. Reply naturally in simple Tanglish (Tamil written using English letters) when the user uses Tanglish; otherwise follow their language. Keep replies warm, short, clear, and conversational. Use chlm and friendly emojis occasionally, but do not claim to be a real person or romantic partner. Be supportive if the user feels sad, and encourage talking to a trusted person when appropriate. Never ask for passwords, API keys, or sensitive personal data. If the user is in immediate danger, encourage contacting a trusted adult or local emergency services.",
        input
      })
    });

    const result = await apiResponse.json();
    if (!apiResponse.ok) {
      const message = apiResponse.status === 401 || apiResponse.status === 403
        ? "AI key is not accepted. Check the OPENAI_API_KEY setting in Netlify."
        : apiResponse.status === 429
          ? "AI service limit reached. Check your API billing and limits."
          : "AI service couldn't reply just now. Please try again.";
      return new Response(JSON.stringify({ error: message }), {
        status: apiResponse.status === 429 ? 429 : 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    const reply = typeof result.output_text === "string" ? result.output_text.trim() : "";
    if (!reply) {
      return new Response(JSON.stringify({ error: "No reply came back. Please try again." }), {
        status: 502,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Could not reach the AI service. Please try again." }), {
      status: 502,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  try {
    const { messages } = req.body;
    
    console.log("MESSAGES REÇUS:", JSON.stringify(messages));
    
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + process.env.GROQ_API_KEY
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 2000,
        messages: messages
      })
    });
    
    const data = await response.json();
    console.log("GROQ FULL RESPONSE:", JSON.stringify(data));
    
    const text = data.choices?.[0]?.message?.content || "";
    console.log("GROQ TEXT:", text);
    
    return res.status(200).json({ content: [{ text: text }] });
  } catch (err) {
    console.log("ERREUR:", err.message);
    return res.status(500).json({ error: err.message });
  }
}

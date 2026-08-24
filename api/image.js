export const maxDuration = 60;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt } = req.body;
    const styleMap = {
      gastronomique: "elegant fine dining, dark moody atmosphere, candlelight, gold accents, luxury table setting",
      brasserie: "parisian brasserie, vintage warm tones, zinc counter, bistro atmosphere, natural light",
      moderne: "minimalist modern restaurant, clean white space, architectural lighting, contemporary design",
      mediterraneen: "mediterranean terrace, blue and white, sunlight, sea view, fresh herbs and seafood",
      japonais: "japanese restaurant, zen atmosphere, bamboo, soft light, clean lines, cherry blossom",
      rustique: "rustic farmhouse restaurant, wooden table, stone, countryside, warm candlelight, local produce",
    };

    const baseStyle = styleMap[req.body.style] || styleMap.gastronomique;
    const clean = `${prompt}, ${baseStyle}, professional food photography, high quality, cinematic, no text, no watermark`;

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;

    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/black-forest-labs/flux-1-schnell`,
      {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + apiToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: clean, steps: 8 })
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error("Cloudflare error " + response.status + ": " + text.substring(0, 300));
    }

    const data = await response.json();

    if (!data.success || !data.result?.image) {
      throw new Error("Pas d'image: " + JSON.stringify(data).substring(0, 200));
    }

    return res.status(200).json({ image: `data:image/jpeg;base64,${data.result.image}` });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

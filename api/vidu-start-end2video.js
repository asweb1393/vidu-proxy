export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido. Usa POST." });

  const API_KEY = process.env.VIDU_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "La llave API no está configurada en el servidor." });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: "Body JSON inválido." }); }
  }

  const viduUrl = "https://api.vidu.com/ent/v2/startend2video";
  try {
    const response = await fetch(viduUrl, {
      method: "POST",
      headers: {
        "Authorization": `Token ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({ error: "Error al conectar con la API de Vidu.", details: error.message });
  }
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido. Usa GET." });

  const API_KEY = process.env.VIDU_API_KEY;
  if (!API_KEY) return res.status(500).json({ error: "La llave API no está configurada en el servidor." });

  const id = req.query?.id || req.query?.task_id;
  if (!id) return res.status(400).json({ error: "Falta el parámetro id." });

  const viduUrl = `https://api.vidu.com/ent/v2/task/${encodeURIComponent(id)}`;
  try {
    const response = await fetch(viduUrl, {
      method: "GET",
      headers: {
        "Authorization": `Token ${API_KEY}`
      }
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(502).json({ error: "Error al conectar con la API de Vidu.", details: error.message });
  }
}

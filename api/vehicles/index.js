// api/vehicles/index.js - CORRECTED
export default async function handler(req, res) {
  console.log("🎯 VEHICLES API HIT:", req.method, new Date().toISOString());
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://yzemotorpro-theta.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    console.log("🔄 Handling OPTIONS preflight");
    return res.status(200).end();
  }

  // Handle POST
  if (req.method === 'POST') {
    console.log("📨 Handling POST request");
    try {
      console.log("Request body:", req.body);
      
      // Simple validation
      const { title, make, model, year, price, state } = req.body;
      if (!title || !make || !model || !year || !price || !state) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      
      return res.status(201).json({ 
        success: true,
        message: "VEHICLE CREATED SUCCESSFULLY!",
        data: req.body,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method not allowed
  console.log("❌ Method not allowed:", req.method);
  return res.status(405).json({ error: "Method not allowed" });
}

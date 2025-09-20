// api/vehicles.js (in the ROOT of your project)
import sql from './src/app/api/utils/sql.js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yzemotorpro-theta.vercel.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  console.log("🚗 API endpoint hit:", req.method, req.url);
  
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      console.log("📦 Request body:", req.body);

      const { title, vehicle_type, make, model, year, price, state } = req.body;

      // Simple validation
      if (!title || !vehicle_type || !make || !model || !year || !price || !state) {
        console.log("❌ Missing required fields");
        return res.status(400).json({ error: "Missing required fields" });
      }

      // First, just return a success message without database
      console.log("✅ Validation passed - would insert into database");
      
      return res.status(201).json({ 
        success: true,
        message: "Vehicle would be created successfully",
        data: req.body
      });

    } catch (error) {
      console.error("❌ Error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: "Method not allowed" });
}

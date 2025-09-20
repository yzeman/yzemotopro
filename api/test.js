// api/test.js - MUST use CommonJS syntax (not ES modules)
module.exports = async (req, res) => {
  console.log("🎯 API TEST ENDPOINT HIT:", req.method, req.url);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    console.log("🔄 Handling OPTIONS preflight");
    return res.status(200).end();
  }

  // Handle POST
  if (req.method === 'POST') {
    console.log("📨 Handling POST request");
    return res.status(200).json({ 
      message: "POST API IS WORKING!",
      method: "POST",
      timestamp: new Date().toISOString()
    });
  }

  // Handle GET
  if (req.method === 'GET') {
    console.log("📖 Handling GET request");
    return res.status(200).json({ 
      message: "GET API IS WORKING!",
      method: "GET", 
      timestamp: new Date().toISOString()
    });
  }

  console.log("❌ Method not allowed:", req.method);
  return res.status(405).json({ error: "Method not allowed" });
};

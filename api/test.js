// api/test.js - SIMPLE TEST
module.exports = async (req, res) => {
  console.log("✅ TEST endpoint hit:", req.method);
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle POST
  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: "API IS FINALLY WORKING!",
      timestamp: new Date().toISOString()
    });
  }

  // Handle GET
  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: "GET API is working!",
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
};

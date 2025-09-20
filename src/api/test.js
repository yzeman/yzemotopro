// src/api/test.js
export default async function handler(req, res) {
  console.log("🎯 API ENDPOINT HIT:", req.method);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return res.status(200).json({ 
      message: "POST API IS WORKING!",
      timestamp: new Date().toISOString()
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ 
      message: "GET API IS WORKING!",
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: "Method not allowed" });
}

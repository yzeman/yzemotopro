// netlify/functions/vehicles.js
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Handle POST
  if (event.httpMethod === 'POST') {
    try {
      const body = JSON.parse(event.body);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Vehicle created on Netlify!",
          data: body
        })
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Internal error" })
      };
    }
  }

  return { statusCode: 405, headers, body: 'Method not allowed' };
};

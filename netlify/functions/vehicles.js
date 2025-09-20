// netlify/functions/vehicles.js
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'EXISTS' : 'MISSING!');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Handle GET - Get all vehicles
  if (event.httpMethod === 'GET' && event.path === '/.netlify/functions/vehicles') {
    try {
      const result = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: result.rows
        })
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Internal server error",
          message: error.message 
        })
      };
    }
  }

  // Handle GET - Get single vehicle by ID
  if (event.httpMethod === 'GET' && event.path.includes('/vehicles/')) {
    try {
      const id = event.path.split('/').pop();
      const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
      
      if (result.rows.length === 0) {
        return { 
          statusCode: 404, 
          headers,
          body: JSON.stringify({ error: "Vehicle not found" }) 
        };
      }
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: result.rows[0]
        })
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Internal server error",
          message: error.message 
        })
      };
    }
  }

  // Handle POST - Create new vehicle
  if (event.httpMethod === 'POST') {
    try {
      const vehicle = JSON.parse(event.body);
      
      // Insert into database
      const result = await pool.query(
        `INSERT INTO vehicles (title, vehicle_type, make, model, year, price, state) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [vehicle.title, vehicle.vehicle_type, vehicle.make, vehicle.model, 
         vehicle.year, vehicle.price, vehicle.state]
      );
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Vehicle created successfully!",
          data: result.rows[0]
        })
      };
    } catch (error) {
      console.error('Database error:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: "Internal server error",
          message: error.message 
        })
      };
    }
  }

  // Method not allowed
  return { 
    statusCode: 405, 
    headers,
    body: JSON.stringify({ error: 'Method not allowed' }) 
  };
};

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
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Handle GET - Get all vehicles
  if (event.httpMethod === 'GET' && event.path === '/.netlify/functions/vehicles') {
    try {
      const urlParams = new URLSearchParams(event.queryStringParameters || {});
      const search = urlParams.get('search') || '';
      const type = urlParams.get('type') || '';
      const limit = parseInt(urlParams.get('limit')) || 100;
      
      let query = 'SELECT * FROM vehicles WHERE is_sold = false';
      const values = [];
      let paramIndex = 1;

      if (search) {
        query += ` AND (LOWER(title) LIKE LOWER($${paramIndex}) OR LOWER(make) LIKE LOWER($${paramIndex}) OR LOWER(model) LIKE LOWER($${paramIndex}))`;
        values.push(`%${search}%`);
        paramIndex++;
      }

      if (type) {
        query += ` AND vehicle_type = $${paramIndex}`;
        values.push(type);
        paramIndex++;
      }

      query += ` ORDER BY is_featured DESC, created_at DESC LIMIT $${paramIndex}`;
      values.push(limit);

      const result = await pool.query(query, values);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          vehicles: result.rows,
          pagination: {
            total: result.rows.length,
            limit: limit
          }
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
        `INSERT INTO vehicles (title, vehicle_type, make, model, year, price, mileage, state, city, description, image_url, images, features, fuel_type, transmission, engine_size, color, vin, condition, is_featured) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20) RETURNING *`,
        [
          vehicle.title, vehicle.vehicle_type, vehicle.make, vehicle.model, 
          vehicle.year, vehicle.price, vehicle.mileage, vehicle.state, vehicle.city,
          vehicle.description, vehicle.image_url, vehicle.images || [], vehicle.features || [],
          vehicle.fuel_type, vehicle.transmission, vehicle.engine_size, vehicle.color,
          vehicle.vin, vehicle.condition || 'used', vehicle.is_featured || false
        ]
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

  // Handle PUT - Update vehicle
  if (event.httpMethod === 'PUT' && event.path.includes('/vehicles/')) {
    try {
      const id = event.path.split('/').pop();
      const updates = JSON.parse(event.body);
      
      // Build dynamic update query
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 1}`)
        .join(', ');
      
      const values = Object.values(updates);
      values.push(id);
      
      const result = await pool.query(
        `UPDATE vehicles SET ${setClause} WHERE id = $${values.length} RETURNING *`,
        values
      );
      
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
          message: "Vehicle updated successfully!",
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

  // Handle DELETE - Remove vehicle
  if (event.httpMethod === 'DELETE' && event.path.includes('/vehicles/')) {
    try {
      const id = event.path.split('/').pop();
      const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
      
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
          message: "Vehicle deleted successfully!",
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

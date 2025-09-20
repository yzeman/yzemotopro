// src/app/api/vehicles.create.ts
import sql from '@/app/api/utils/sql';
import type { ActionFunctionArgs } from '@react-router/node';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yzemotorpro-theta.vercel.app',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function action({ request }: ActionFunctionArgs) {
  console.log("🚗 POST /api/vehicles called");

  // Handle OPTIONS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = await request.json();
    console.log("📦 Request body:", body);

    const {
      title, vehicle_type, make, model, year, price, state,
      mileage, city, description, image_url, images = [],
      features = [], fuel_type, transmission, engine_size,
      color, vin, condition = "used", is_featured = false
    } = body;

    // Validate required fields
    if (!title || !vehicle_type || !make || !model || !year || !price || !state) {
      return Response.json({ error: "Missing required fields" }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Validate vehicle type
    const validTypes = ["truck", "car", "van", "jeep", "pickup"];
    if (!validTypes.includes(vehicle_type)) {
      return Response.json({ error: "Invalid vehicle type" }, { 
        status: 400,
        headers: corsHeaders
      });
    }

    // Insert into database
    const result = await sql`
      INSERT INTO vehicles (
        title, vehicle_type, make, model, year, price, mileage, state, city,
        description, image_url, images, features, fuel_type, transmission, engine_size,
        color, vin, condition, is_featured
      ) VALUES (
        ${title}, ${vehicle_type}, ${make}, ${model}, ${year}, ${price}, 
        ${mileage}, ${state}, ${city}, ${description}, ${image_url}, 
        ${images}, ${features}, ${fuel_type}, ${transmission}, ${engine_size}, 
        ${color}, ${vin}, ${condition}, ${is_featured}
      ) RETURNING *
    `;

    return Response.json(result[0], { 
      status: 201,
      headers: corsHeaders
    });

  } catch (error) {
    console.error("❌ Error creating vehicle:", error);
    return Response.json({ error: "Failed to create vehicle" }, { 
      status: 500,
      headers: corsHeaders
    });
  }
}

// Export both action and loader for OPTIONS
export async function loader({ request }: ActionFunctionArgs) {
  return new Response(null, { 
    status: 200, 
    headers: corsHeaders 
  });
      }

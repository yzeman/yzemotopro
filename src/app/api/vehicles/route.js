// src/app/api/vehicles/route.js
import sql from '@/app/api/utils/sql'; // ← CORRECT (default import)

// This handles POST requests to /api/vehicles
export async function action({ request }) {
  console.log("🚗 POST /api/vehicles called");

  try {
    const body = await request.json();
    console.log("📦 Request body:", body);

    // Validate required fields
    const { title, vehicle_type, make, model, year, price, state } = body;
    if (!title || !vehicle_type || !make || !model || !year || !price || !state) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate vehicle type
    const validTypes = ["truck", "car", "van", "jeep", "pickup"];
    if (!validTypes.includes(vehicle_type)) {
      return Response.json(
        { error: "Invalid vehicle type" },
        { status: 400 }
      );
    }

    // Your database insert logic here (keep your original SQL code)
    const result = await sql`
      INSERT INTO vehicles (...) VALUES (...) RETURNING *
    `;

    console.log("✅ Vehicle created successfully:", result[0]);
    return Response.json(result[0], { status: 201 });

  } catch (error) {
    console.error("❌ Error creating vehicle:", error);
    return Response.json(
      { error: "Failed to create vehicle: " + error.message },
      { status: 500 }
    );
  }
}

// This handles OPTIONS requests for CORS
export async function loader({ request }) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://yzemotorpro-theta.vercel.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
                }
export { POST, OPTIONS };

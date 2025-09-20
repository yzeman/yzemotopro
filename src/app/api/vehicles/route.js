import sql from "@/app/api/utils/sql";

// CORS headers configuration
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yzemotorpro-theta.vercel.app',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true'
};

// Helper function to create CORS responses
function jsonWithCors(data, options = {}) {
  const response = Response.json(data, options);
  
  // Add CORS headers
  for (const [key, value] of Object.entries(corsHeaders)) {
    response.headers.set(key, value);
  }
  
  return response;
}

// GET - List vehicles with search and filtering
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const state = searchParams.get("state") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // Use parameterized query with proper $1, $2, $3 syntax
    let whereClause = `WHERE is_sold = false`;
    const values = [];
    let paramIndex = 1;

    // Add search filter
    if (search) {
      whereClause += ` AND (LOWER(title) LIKE LOWER($${paramIndex}) OR LOWER(make) LIKE LOWER($${paramIndex}) OR LOWER(model) LIKE LOWER($${paramIndex}) OR LOWER(description) LIKE LOWER($${paramIndex}))`;
      values.push(`%${search}%`);
      paramIndex++;
    }

    // Add type filter
    if (type) {
      whereClause += ` AND vehicle_type = $${paramIndex}`;
      values.push(type);
      paramIndex++;
    }

    // Add state filter
    if (state) {
      whereClause += ` AND LOWER(state) = LOWER($${paramIndex})`;
      values.push(state);
      paramIndex++;
    }

    // Add price filters
    if (minPrice) {
      whereClause += ` AND price >= $${paramIndex}`;
      values.push(parseFloat(minPrice));
      paramIndex++;
    }

    if (maxPrice) {
      whereClause += ` AND price <= $${paramIndex}`;
      values.push(parseFloat(maxPrice));
      paramIndex++;
    }

    // Add ordering and pagination
    const query = `SELECT * FROM vehicles ${whereClause} ORDER BY is_featured DESC, created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const vehicles = await sql(query, values);

    // Check if no vehicles found
    if (!vehicles || vehicles.length === 0) {
      return jsonWithCors({ 
        vehicles: [], 
        message: "No vehicles found",
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      });
    }

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM vehicles ${whereClause}`;
    const countResult = await sql(countQuery, values.slice(0, -2));
    const total = parseInt(countResult[0].total);

    return jsonWithCors({
      vehicles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return jsonWithCors(
      { error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

// POST - Create new vehicle with debug logging
export async function POST(request) {
  console.log("ðŸš— POST /api/vehicles called");
  
  try {
    const body = await request.json();
    console.log("ðŸ“¦ Request body:", JSON.stringify(body, null, 2));

    const {
      title,
      vehicle_type,
      make,
      model,
      year,
      price,
      mileage,
      state,
      city,
      description,
      image_url,
      images = [],
      features = [],
      fuel_type,
      transmission,
      engine_size,
      color,
      vin,
      condition = "used",
      is_featured = false,
    } = body;

    console.log("ðŸ” Validating fields...");

    // Validate required fields
    if (!title || !vehicle_type || !make || !model || !year || !price || !state) {
      console.log("âŒ Missing required fields");
      return jsonWithCors(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate vehicle type
    const validTypes = ["truck", "car", "van", "jeep", "pickup"];
    if (!validTypes.includes(vehicle_type)) {
      console.log("âŒ Invalid vehicle type:", vehicle_type);
      return jsonWithCors(
        { error: "Invalid vehicle type" }, 
        { status: 400 }
      );
    }

    console.log("âœ… Validation passed, inserting into database...");

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

    console.log("âœ… Vehicle created successfully:", result[0]);
    
    return jsonWithCors(result[0], { status: 201 });
    
  } catch (error) {
    console.error("âŒ Error creating vehicle:", error);
    return jsonWithCors(
      { error: "Failed to create vehicle: " + error.message },
      { status: 500 },
    );
  }
}

// OPTIONS - Handle CORS preflight requests
export async function OPTIONS() {
  return new Response(null, { 
    status: 200, 
    headers: corsHeaders 
  });
}


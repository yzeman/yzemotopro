import sql from "@/app/api/utils/sql";

// GET - List vehicles with search and filtering
export async function GET(request) {
  console.log("GET request received for vehicles API");
  
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const state = searchParams.get("state") || "";
    const limit = parseInt(searchParams.get("limit") || "12");

    // Use parameterized query with sql template literal
    let whereClause = `WHERE is_sold = false`;
    const queryParams = [];

    if (search) {
      whereClause += ` AND (LOWER(title) LIKE LOWER($1) OR LOWER(make) LIKE LOWER($1) OR LOWER(model) LIKE LOWER($1))`;
      queryParams.push(`%${search}%`);
    }

    if (type) {
      const paramIndex = queryParams.length + 1;
      whereClause += ` AND vehicle_type = $${paramIndex}`;
      queryParams.push(type);
    }

    if (state) {
      const paramIndex = queryParams.length + 1;
      whereClause += ` AND LOWER(state) = LOWER($${paramIndex})`;
      queryParams.push(state);
    }

    const query = `SELECT * FROM vehicles ${whereClause} ORDER BY is_featured DESC, created_at DESC LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);

    const vehicles = await sql(query, queryParams);

    return Response.json({
      vehicles,
      pagination: {
        page: 1,
        limit,
        total: vehicles.length,
        totalPages: Math.ceil(vehicles.length / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return Response.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

// POST - Create new vehicle
export async function POST(request) {
  console.log("POST request received for vehicles API");
  
  try {
    // First get the body and log it
    const body = await request.json();
    console.log("Request body:", JSON.stringify(body));

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

    // Validate required fields
    if (
      !title ||
      !vehicle_type ||
      !make ||
      !model ||
      !year ||
      !price ||
      !state
    ) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate vehicle type
    const validTypes = ["truck", "car", "van", "jeep", "pickup"];
    if (!validTypes.includes(vehicle_type)) {
      return Response.json({ error: "Invalid vehicle type" }, { status: 400 });
    }

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

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return Response.json(
      { error: "Failed to create vehicle" },
      { status: 500 },
    );
  }
}

// Export all HTTP methods
export { GET, POST };

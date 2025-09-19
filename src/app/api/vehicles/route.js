import sql from "@/app/api/utils/sql";

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

    // Get total count
    const countQuery = `SELECT COUNT(*) as total FROM vehicles ${whereClause}`;
    const countResult = await sql(countQuery, values.slice(0, -2)); // Remove limit/offset params
    const total = parseInt(countResult[0].total);

    return Response.json({
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
    return Response.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 },
    );
  }
}

// POST - Create new vehicle (this part is correct)
export async function POST(request) {
  try {
    const body = await request.json();
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

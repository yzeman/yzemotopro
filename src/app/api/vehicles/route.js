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

    // Build dynamic query
    let query = `
      SELECT * FROM vehicles 
      WHERE is_sold = false
    `;
    const values = [];
    let paramCount = 0;

    // Add search filter
    if (search) {
      paramCount++;
      query += ` AND (
        LOWER(title) LIKE LOWER($${paramCount})
        OR LOWER(make) LIKE LOWER($${paramCount})
        OR LOWER(model) LIKE LOWER($${paramCount})
        OR LOWER(description) LIKE LOWER($${paramCount})
      )`;
      values.push(`%${search}%`);
    }

    // Add type filter
    if (type) {
      paramCount++;
      query += ` AND vehicle_type = $${paramCount}`;
      values.push(type);
    }

    // Add state filter
    if (state) {
      paramCount++;
      query += ` AND LOWER(state) = LOWER($${paramCount})`;
      values.push(state);
    }

    // Add price filters
    if (minPrice) {
      paramCount++;
      query += ` AND price >= $${paramCount}`;
      values.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND price <= $${paramCount}`;
      values.push(parseFloat(maxPrice));
    }

    // Add ordering and pagination
    query += ` ORDER BY is_featured DESC, created_at DESC`;

    paramCount++;
    query += ` LIMIT $${paramCount}`;
    values.push(limit);

    paramCount++;
    query += ` OFFSET $${paramCount}`;
    values.push(offset);

    const vehicles = await sql(query, values);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total FROM vehicles 
      WHERE is_sold = false
    `;
    const countValues = [];
    let countParamCount = 0;

    if (search) {
      countParamCount++;
      countQuery += ` AND (
        LOWER(title) LIKE LOWER($${countParamCount})
        OR LOWER(make) LIKE LOWER($${countParamCount})
        OR LOWER(model) LIKE LOWER($${countParamCount})
        OR LOWER(description) LIKE LOWER($${countParamCount})
      )`;
      countValues.push(`%${search}%`);
    }

    if (type) {
      countParamCount++;
      countQuery += ` AND vehicle_type = $${countParamCount}`;
      countValues.push(type);
    }

    if (state) {
      countParamCount++;
      countQuery += ` AND LOWER(state) = LOWER($${countParamCount})`;
      countValues.push(state);
    }

    if (minPrice) {
      countParamCount++;
      countQuery += ` AND price >= $${countParamCount}`;
      countValues.push(parseFloat(minPrice));
    }

    if (maxPrice) {
      countParamCount++;
      countQuery += ` AND price <= $${countParamCount}`;
      countValues.push(parseFloat(maxPrice));
    }

    const countResult = await sql(countQuery, countValues);
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

// POST - Create new vehicle
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

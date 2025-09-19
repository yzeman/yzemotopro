import sql from "@/app/api/utils/sql";

// GET - Simple vehicle list
export async function GET(request) {
  try {
    const vehicles = await sql`SELECT * FROM vehicles WHERE is_sold = false ORDER BY created_at DESC LIMIT 100`;
    return Response.json({ vehicles });
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return Response.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

// POST - Create new vehicle
export async function POST(request) {
  console.log("POST request received for vehicles API");
  
  try {
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
    if (!title || !vehicle_type || !make || !model || !year || !price || !state) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
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
    return Response.json({ error: "Failed to create vehicle" }, { status: 500 });
  }
}

// Export all HTTP methods
export { GET, POST };

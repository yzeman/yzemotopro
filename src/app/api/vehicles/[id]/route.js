import sql from "@/app/api/utils/sql";

// GET - Get single vehicle by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const vehicles = await sql`
      SELECT * FROM vehicles 
      WHERE id = ${parseInt(id)} AND is_sold = false
    `;

    if (vehicles.length === 0) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return Response.json(vehicles[0]);
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return Response.json({ error: "Failed to fetch vehicle" }, { status: 500 });
  }
}

// PUT - Update vehicle
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Build dynamic update query
    const updates = [];
    const values = [];
    let paramCount = 0;

    const allowedFields = [
      "title",
      "vehicle_type",
      "make",
      "model",
      "year",
      "price",
      "mileage",
      "state",
      "city",
      "description",
      "image_url",
      "images",
      "features",
      "fuel_type",
      "transmission",
      "engine_size",
      "color",
      "vin",
      "condition",
      "is_featured",
      "is_sold",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        paramCount++;
        updates.push(`${field} = $${paramCount}`);
        values.push(body[field]);
      }
    }

    if (updates.length === 0) {
      return Response.json({ error: "No fields to update" }, { status: 400 });
    }

    // Add updated_at timestamp
    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    // Add ID for WHERE clause
    paramCount++;
    values.push(parseInt(id));

    const query = `
      UPDATE vehicles 
      SET ${updates.join(", ")} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await sql(query, values);

    if (result.length === 0) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return Response.json(result[0]);
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return Response.json(
      { error: "Failed to update vehicle" },
      { status: 500 },
    );
  }
}

// DELETE - Delete vehicle
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const result = await sql`
      DELETE FROM vehicles 
      WHERE id = ${parseInt(id)} 
      RETURNING *
    `;

    if (result.length === 0) {
      return Response.json({ error: "Vehicle not found" }, { status: 404 });
    }

    return Response.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return Response.json(
      { error: "Failed to delete vehicle" },
      { status: 500 },
    );
  }
}

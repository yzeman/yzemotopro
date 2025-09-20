// Simplified POST handler for testing
import { NextResponse } from 'next/server';

export async function POST(request) {
  console.log("✅ POST /api/vehicles called successfully!");

  try {
    const body = await request.json();
    console.log("📦 Request body received:", body);

    // Simple validation
    if (!body.make) {
      return NextResponse.json(
        { error: "Make is required" },
        { status: 400 }
      );
    }

    // Simulate a success response
    return NextResponse.json(
      { message: "Vehicle created successfully!", receivedData: body },
      { status: 201 }
    );

  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

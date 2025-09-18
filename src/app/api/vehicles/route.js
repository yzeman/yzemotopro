import { NextResponse } from 'next/server';

// Simple in-memory storage (replace with real database later)
let vehicles = [];
let nextId = 1;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  
  let filteredVehicles = vehicles;
  
  if (search) {
    filteredVehicles = filteredVehicles.filter(vehicle =>
      vehicle.title.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(search.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (type && type !== 'all') {
    filteredVehicles = filteredVehicles.filter(vehicle =>
      vehicle.vehicle_type === type
    );
  }
  
  return NextResponse.json({ vehicles: filteredVehicles });
}

export async function POST(request) {
  try {
    const vehicleData = await request.json();
    
    const newVehicle = {
      id: nextId++,
      ...vehicleData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    vehicles.push(newVehicle);
    
    return NextResponse.json(newVehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updates = await request.json();
    
    const index = vehicles.findIndex(v => v.id === parseInt(id));
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    vehicles[index] = {
      ...vehicles[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    
    return NextResponse.json(vehicles[index]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update vehicle' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    const index = vehicles.findIndex(v => v.id === parseInt(id));
    
    if (index === -1) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }
    
    vehicles.splice(index, 1);
    
    return NextResponse.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete vehicle' },
      { status: 500 }
    );
  }
}

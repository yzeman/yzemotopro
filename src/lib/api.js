const NETLIFY_API = 'https://yzemotorpro.netlify.app/.netlify/functions';

// Admin vehicles endpoints
export const adminApi = {
  // Get all vehicles with filters
  getVehicles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${NETLIFY_API}/vehicles?${queryString}`);
    return response.json();
  },

  // Get single vehicle
  getVehicle: async (id) => {
    const response = await fetch(`${NETLIFY_API}/vehicles/${id}`);
    return response.json();
  },

  // Create vehicle
  createVehicle: async (vehicleData) => {
    const response = await fetch(`${NETLIFY_API}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });
    return response.json();
  },

  // Update vehicle
  updateVehicle: async (id, vehicleData) => {
    const response = await fetch(`${NETLIFY_API}/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData)
    });
    return response.json();
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    const response = await fetch(`${NETLIFY_API}/vehicles/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};

const NETLIFY_API = 'https://yzemotorpro.netlify.app/.netlify/functions';

export const getVehicles = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${NETLIFY_API}/vehicles?${queryString}`);
  return response.json();
};

export const getVehicle = async (id) => {
  const response = await fetch(`${NETLIFY_API}/vehicles/${id}`);
  return response.json();
};

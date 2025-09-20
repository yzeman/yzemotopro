import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const NETLIFY_API = 'https://yzemotorpro.netlify.app/.netlify/functions';

// Helper function to handle API responses
async function handleApiResponse(response) {
  const contentType = response.headers.get("content-type");
  
  if (!response.ok) {
    if (contentType?.includes("text/html")) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): Please check the API route`);
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  if (!contentType?.includes("application/json")) {
    throw new Error("Server returned non-JSON response");
  }
  
  return response.json();
}

export function useAdminVehicles(searchParams = {}) {
  const queryClient = useQueryClient();

  const { data: vehiclesData, isLoading } = useQuery({
    queryKey: ["admin-vehicles", searchParams],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append("limit", "100");

      if (searchParams.search) {
        params.append("search", searchParams.search);
      }
      if (searchParams.type) {
        params.append("type", searchParams.type);
      }

      // CHANGE THIS LINE:
      const response = await fetch(`${NETLIFY_API}/vehicles?${params}`);
      return handleApiResponse(response);
    },
  });

  const createVehicle = useMutation({
    mutationFn: async (vehicleData) => {
      // CHANGE THIS LINE:
      const response = await fetch(`${NETLIFY_API}/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const updateVehicle = useMutation({
    mutationFn: async ({ id, data }) => {
      // CHANGE THIS LINE:
      const response = await fetch(`${NETLIFY_API}/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: async (id) => {
      // CHANGE THIS LINE:
      const response = await fetch(`${NETLIFY_API}/vehicles/${id}`, {
        method: "DELETE",
      });
      return handleApiResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const toggleFeatured = (vehicle) => {
    updateVehicle.mutate({
      id: vehicle.id,
      data: { is_featured: !vehicle.is_featured },
    });
  };

  return {
    vehicles: vehiclesData?.vehicles || [],
    isLoading,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    toggleFeatured,
  };
}

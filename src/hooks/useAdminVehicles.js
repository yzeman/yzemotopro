import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

      const response = await fetch(`/api/vehicles?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      return response.json();
    },
  });

  const createVehicle = useMutation({
    mutationFn: async (vehicleData) => {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehicleData),
      });
      if (!response.ok) {
        throw new Error("Failed to create vehicle");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const updateVehicle = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update vehicle");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    },
  });

  const deleteVehicle = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`/api/vehicles/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }
      return response.json();
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

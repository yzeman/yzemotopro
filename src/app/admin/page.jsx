"use client";

import { useState, useEffect } from "react";
import { useAdminVehicles } from "@/hooks/useAdminVehicles";
import { useVehicleForm } from "@/hooks/useVehicleForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { VehicleForm } from "@/components/admin/VehicleForm";
import { VehicleList } from "@/components/admin/VehicleList";
import { Lock } from "lucide-react";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    // Check if already authenticated in session
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // Simple password check - you can change this password
    if (password === "YzeMotor2024") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "authenticated");
      setError("");
    } else {
      setError("Incorrect password");
      setPassword("");
    }
  };

  const {
    vehicles,
    isLoading,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    toggleFeatured,
  } = useAdminVehicles({
    search: searchTerm,
    type: selectedType,
  });

  const {
    showForm,
    editingVehicle,
    formData,
    setFormData,
    newFeature,
    setNewFeature,
    newImageUrl,
    setNewImageUrl,
    handleShowAddForm,
    handleShowEditForm,
    handleCloseForm,
    handleSubmit,
    addFeature,
    removeFeature,
    addImageUrl,
    removeImageUrl,
    isSaving,
  } = useVehicleForm({ createVehicle, updateVehicle });

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] flex items-center justify-center">
        <div className="max-w-md w-full bg-white dark:bg-[#1E1E1E] rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Lock size={32} className="text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black dark:text-white mb-2">
              Admin Access
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter the admin password to continue
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <AdminHeader
        onAddVehicle={handleShowAddForm}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {showForm && (
          <VehicleForm
            editingVehicle={editingVehicle}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isSaving={isSaving}
            onClose={handleCloseForm}
            newFeature={newFeature}
            setNewFeature={setNewFeature}
            addFeature={addFeature}
            removeFeature={removeFeature}
            newImageUrl={newImageUrl}
            setNewImageUrl={setNewImageUrl}
            addImageUrl={addImageUrl}
            removeImageUrl={removeImageUrl}
          />
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Loading vehicles...
            </p>
          </div>
        ) : (
          <VehicleList
            vehicles={vehicles}
            onEdit={handleShowEditForm}
            onDelete={deleteVehicle.mutate}
            onToggleFeatured={toggleFeatured}
            onAddVehicle={handleShowAddForm}
          />
        )}
      </div>
    </div>
  );
}

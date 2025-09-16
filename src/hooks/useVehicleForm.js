import { useState, useEffect } from "react";

const initialFormData = {
  title: "",
  vehicle_type: "car",
  make: "",
  model: "",
  year: new Date().getFullYear(),
  price: "",
  mileage: "",
  state: "",
  city: "",
  description: "",
  image_url: "",
  images: [],
  features: [],
  fuel_type: "",
  transmission: "",
  engine_size: "",
  color: "",
  vin: "",
  condition: "used",
  is_featured: false,
};

export function useVehicleForm({ createVehicle, updateVehicle }) {
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [newFeature, setNewFeature] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");

  useEffect(() => {
    if (editingVehicle) {
      setFormData({
        ...initialFormData,
        ...editingVehicle,
        features: editingVehicle.features || [],
        images: editingVehicle.images || [],
      });
    } else {
      setFormData(initialFormData);
    }
  }, [editingVehicle]);

  const resetForm = () => {
    setFormData(initialFormData);
    setNewFeature("");
    setNewImageUrl("");
    setEditingVehicle(null);
  };
  
  const handleCloseForm = () => {
    resetForm();
    setShowForm(false);
  }

  const handleShowAddForm = () => {
    resetForm();
    setShowForm(true);
  };
  
  const handleShowEditForm = (vehicle) => {
    setEditingVehicle(vehicle);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.make || !formData.model || !formData.price || !formData.state) {
      alert("Please fill in all required fields");
      return;
    }

    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      year: parseInt(formData.year),
      mileage: formData.mileage ? parseInt(formData.mileage) : null,
    };

    const mutation = editingVehicle ? updateVehicle : createVehicle;
    const mutationArgs = editingVehicle ? { id: editingVehicle.id, data: submitData } : submitData;

    mutation.mutate(mutationArgs, {
      onSuccess: () => {
        handleCloseForm();
      }
    });
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }));
      setNewFeature("");
    }
  };

  const removeFeature = (featureToRemove) => {
    setFormData((prev) => ({ ...prev, features: prev.features.filter((f) => f !== featureToRemove) }));
  };
  
  const addImageUrl = () => {
    if (newImageUrl.trim() && !formData.images.includes(newImageUrl.trim())) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (imageToRemove) => {
    setFormData((prev) => ({ ...prev, images: prev.images.filter((i) => i !== imageToRemove) }));
  };

  return {
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
    isSaving: createVehicle.isPending || updateVehicle.isPending,
  };
}

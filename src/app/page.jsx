import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Filter,
  Phone,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Eye,
} from "lucide-react";

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch vehicles with search parameters
  const { data, isLoading, error } = useQuery({
    queryKey: [
      "vehicles",
      {
        search: searchTerm,
        type: selectedType,
        state: selectedState,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
        page: currentPage,
      },
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (selectedType) params.append("type", selectedType);
      if (selectedState) params.append("state", selectedState);
      if (priceRange.min) params.append("minPrice", priceRange.min);
      if (priceRange.max) params.append("maxPrice", priceRange.max);
      params.append("page", currentPage.toString());

      const response = await fetch(`/api/vehicles?${params}`);
      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const vehicleTypes = [
    { value: "", label: "All Types" },
    { value: "truck", label: "Trucks" },
    { value: "car", label: "Cars" },
    { value: "van", label: "Vans" },
    { value: "jeep", label: "Jeeps" },
    { value: "pickup", label: "Pickups" },
  ];

  const states = [
    { value: "", label: "All States" },
    { value: "Alabama", label: "Alabama" },
    { value: "Alaska", label: "Alaska" },
    { value: "Arizona", label: "Arizona" },
    { value: "Arkansas", label: "Arkansas" },
    { value: "California", label: "California" },
    { value: "Colorado", label: "Colorado" },
    { value: "Connecticut", label: "Connecticut" },
    { value: "Delaware", label: "Delaware" },
    { value: "Florida", label: "Florida" },
    { value: "Georgia", label: "Georgia" },
    { value: "Hawaii", label: "Hawaii" },
    { value: "Idaho", label: "Idaho" },
    { value: "Illinois", label: "Illinois" },
    { value: "Indiana", label: "Indiana" },
    { value: "Iowa", label: "Iowa" },
    { value: "Kansas", label: "Kansas" },
    { value: "Kentucky", label: "Kentucky" },
    { value: "Louisiana", label: "Louisiana" },
    { value: "Maine", label: "Maine" },
    { value: "Maryland", label: "Maryland" },
    { value: "Massachusetts", label: "Massachusetts" },
    { value: "Michigan", label: "Michigan" },
    { value: "Minnesota", label: "Minnesota" },
    { value: "Mississippi", label: "Mississippi" },
    { value: "Missouri", label: "Missouri" },
    { value: "Montana", label: "Montana" },
    { value: "Nebraska", label: "Nebraska" },
    { value: "Nevada", label: "Nevada" },
    { value: "New Hampshire", label: "New Hampshire" },
    { value: "New Jersey", label: "New Jersey" },
    { value: "New Mexico", label: "New Mexico" },
    { value: "New York", label: "New York" },
    { value: "North Carolina", label: "North Carolina" },
    { value: "North Dakota", label: "North Dakota" },
    { value: "Ohio", label: "Ohio" },
    { value: "Oklahoma", label: "Oklahoma" },
    { value: "Oregon", label: "Oregon" },
    { value: "Pennsylvania", label: "Pennsylvania" },
    { value: "Rhode Island", label: "Rhode Island" },
    { value: "South Carolina", label: "South Carolina" },
    { value: "South Dakota", label: "South Dakota" },
    { value: "Tennessee", label: "Tennessee" },
    { value: "Texas", label: "Texas" },
    { value: "Utah", label: "Utah" },
    { value: "Vermont", label: "Vermont" },
    { value: "Virginia", label: "Virginia" },
    { value: "Washington", label: "Washington" },
    { value: "West Virginia", label: "West Virginia" },
    { value: "Wisconsin", label: "Wisconsin" },
    { value: "Wyoming", label: "Wyoming" },
    { value: "District of Columbia", label: "Washington D.C." },
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const openWhatsApp = (vehicle) => {
    const message = `Hi! I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed for ${formatPrice(vehicle.price)}. Could we discuss details?`;
    const whatsappUrl = `https://wa.me/17062183401?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1E1E1E] border-b border-[#E9E9E9] dark:border-[#333333] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="https://raw.createusercontent.com/6293bec5-1f32-4248-bdb5-c9f05f944693/"
                alt="YzeMotor Pro"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-black dark:text-white">
                  YzeMotor Pro
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Quality Vehicles
                </p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4">
              <a
                href="tel:+17062183401"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <Phone size={16} />
                <span className="hidden sm:inline">(706) 218-3401</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-black dark:text-white mb-6">
            Find Your Perfect Vehicle
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Quality trucks, cars, vans, jeeps, and pickups. Contact us directly
            on WhatsApp for quick negotiations.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {states.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>

              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                Search
              </button>
            </div>

            {/* Price Range */}
            <div className="flex gap-4 items-center justify-center">
              <input
                type="number"
                placeholder="Min Price"
                value={priceRange.min}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
              />
              <span className="text-gray-400">to</span>
              <input
                type="number"
                placeholder="Max Price"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white text-sm"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Listings */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Loading vehicles...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 dark:text-red-400">
                Error loading vehicles. Please try again.
              </p>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-black dark:text-white">
                  Available Vehicles
                  {data?.pagination && (
                    <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                      ({data.pagination.total} total)
                    </span>
                  )}
                </h3>
              </div>

              {/* Vehicle Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data?.vehicles?.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Vehicle Image */}
                    <div className="relative h-64 bg-gray-100 dark:bg-gray-800">
                      <img
                        src={vehicle.image_url}
                        alt={vehicle.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Watermark */}
                      <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 px-3 py-1 rounded-lg">
                        <span className="text-sm font-bold text-black dark:text-white">
                          YzeMotor Pro
                        </span>
                      </div>
                      {/* Featured Badge */}
                      {vehicle.is_featured && (
                        <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded-lg text-sm font-bold">
                          Featured
                        </div>
                      )}
                    </div>

                    {/* Vehicle Details */}
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-black dark:text-white mb-2">
                        {vehicle.title}
                      </h4>

                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>{vehicle.year}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin size={16} />
                          <span>
                            {vehicle.city}, {vehicle.state}
                          </span>
                        </div>
                        {vehicle.mileage && (
                          <div className="flex items-center gap-1">
                            <Eye size={16} />
                            <span>{vehicle.mileage.toLocaleString()} mi</span>
                          </div>
                        )}
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                        {vehicle.description}
                      </p>

                      {/* Features */}
                      {vehicle.features && vehicle.features.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {vehicle.features
                              .slice(0, 3)
                              .map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                                >
                                  {feature}
                                </span>
                              ))}
                            {vehicle.features.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                +{vehicle.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {formatPrice(vehicle.price)}
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`/vehicles/${vehicle.id}`}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-black dark:text-white rounded-lg transition-colors text-sm"
                          >
                            View Details
                          </a>
                          <button
                            onClick={() => openWhatsApp(vehicle)}
                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-medium"
                          >
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {data?.pagination && data.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    Previous
                  </button>

                  <span className="text-gray-600 dark:text-gray-400">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(data.pagination.totalPages, prev + 1),
                      )
                    }
                    disabled={currentPage === data.pagination.totalPages}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* No Results */}
              {data?.vehicles?.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600 dark:text-gray-400">
                    No vehicles found matching your criteria.
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedType("");
                      setSelectedState("");
                      setPriceRange({ min: "", max: "" });
                      setCurrentPage(1);
                    }}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

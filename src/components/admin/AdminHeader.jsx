import { ArrowLeft, Plus, Search } from "lucide-react";

export function AdminHeader({
  onAddVehicle,
  searchTerm = "",
  onSearchChange,
  selectedType = "",
  onTypeChange,
}) {
  const vehicleTypes = [
    { value: "", label: "All Types" },
    { value: "truck", label: "Trucks" },
    { value: "car", label: "Cars" },
    { value: "van", label: "Vans" },
    { value: "jeep", label: "Jeeps" },
    { value: "pickup", label: "Pickups" },
  ];

  return (
    <header className="bg-white dark:bg-[#1E1E1E] border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            <a
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Site</span>
            </a>

            <div className="flex items-center gap-3">
              <img
                src="https://raw.createusercontent.com/6293bec5-1f32-4248-bdb5-c9f05f944693/"
                alt="YzeMotor Pro"
                className="w-10 h-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-black dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage your vehicle inventory
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onAddVehicle}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Plus size={20} />
            Add Vehicle
          </button>
        </div>

        {/* Search Section */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1 max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by vehicle name or title..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={selectedType}
            onChange={(e) => onTypeChange?.(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {vehicleTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>

          {(searchTerm || selectedType) && (
            <button
              onClick={() => {
                onSearchChange?.("");
                onTypeChange?.("");
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

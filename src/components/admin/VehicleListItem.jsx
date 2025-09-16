import { Edit, Trash2, Star, StarOff } from "lucide-react";
import { formatPrice } from "@/utils/formatters";

export function VehicleListItem({ vehicle, onEdit, onDelete, onToggleFeatured }) {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-16 w-24">
            <img
              className="h-16 w-24 rounded-lg object-cover"
              src={vehicle.image_url}
              alt={vehicle.title}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-black dark:text-white">
              {vehicle.title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 capitalize">
          {vehicle.vehicle_type}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white">
        {formatPrice(vehicle.price)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {vehicle.city ? `${vehicle.city}, ${vehicle.state}` : vehicle.state}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          {vehicle.is_featured && (
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200">
              Featured
            </span>
          )}
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              vehicle.is_sold
                ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
            }`}
          >
            {vehicle.is_sold ? "Sold" : "Available"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFeatured(vehicle)}
            className={`p-2 rounded-lg transition-colors ${
              vehicle.is_featured
                ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900"
            }`}
            title={vehicle.is_featured ? "Remove from featured" : "Mark as featured"}
          >
            {vehicle.is_featured ? <Star size={16} /> : <StarOff size={16} />}
          </button>
          <button
            onClick={() => onEdit(vehicle)}
            className="p-2 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            title="Edit vehicle"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to delete this vehicle?")) {
                onDelete(vehicle.id);
              }
            }}
            className="p-2 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
            title="Delete vehicle"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

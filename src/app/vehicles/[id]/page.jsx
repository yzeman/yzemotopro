import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Fuel,
  Settings,
  Phone,
  MessageCircle,
  Eye,
  Gauge,
  Palette,
  Wrench,
  Car,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Facebook,
  Twitter,
} from "lucide-react";

export default function VehicleDetailPage({ params }) {
  const { id } = params;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    data: vehicle,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["vehicle", id],
    queryFn: async () => {
      const response = await fetch(`/api/vehicles/${id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch vehicle");
      }
      return response.json();
    },
  });

  // Update document head with meta tags when vehicle loads
  useState(() => {
    if (vehicle) {
      // Set page title
      document.title = `${vehicle.title} - ${formatPrice(vehicle.price)} | YzeMotor Pro`;

      // Remove existing meta tags
      const existingMetas = document.querySelectorAll(
        'meta[property^="og:"], meta[name^="twitter:"], meta[name="description"]',
      );
      existingMetas.forEach((meta) => meta.remove());

      // Create new meta tags
      const metaTags = [
        {
          property: "og:title",
          content: `${vehicle.title} - ${formatPrice(vehicle.price)}`,
        },
        {
          property: "og:description",
          content:
            vehicle.description ||
            `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale at YzeMotor Pro. Contact us for details!`,
        },
        { property: "og:image", content: vehicle.image_url },
        {
          property: "og:url",
          content: `${window.location.origin}/vehicles/${vehicle.id}`,
        },
        { property: "og:type", content: "product" },
        { property: "og:site_name", content: "YzeMotor Pro" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:title",
          content: `${vehicle.title} - ${formatPrice(vehicle.price)}`,
        },
        {
          name: "twitter:description",
          content:
            vehicle.description ||
            `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale at YzeMotor Pro`,
        },
        { name: "twitter:image", content: vehicle.image_url },
        {
          name: "description",
          content:
            vehicle.description ||
            `${vehicle.year} ${vehicle.make} ${vehicle.model} for sale at YzeMotor Pro. Contact us for details!`,
        },
      ];

      metaTags.forEach((tag) => {
        const meta = document.createElement("meta");
        if (tag.property) meta.setAttribute("property", tag.property);
        if (tag.name) meta.setAttribute("name", tag.name);
        meta.setAttribute("content", tag.content);
        document.head.appendChild(meta);
      });
    }
  }, [vehicle]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const openWhatsApp = (vehicle) => {
    const message = `Hi! I'm interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} listed for ${formatPrice(vehicle.price)}. Could we discuss details? Vehicle ID: ${vehicle.id}`;
    const whatsappUrl = `https://wa.me/17062183401?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const shareVehicle = () => {
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/vehicles/${vehicle.id}`,
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${window.location.origin}/vehicles/${vehicle.id}`)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    const text = `Check out this ${vehicle.year} ${vehicle.make} ${vehicle.model} for ${formatPrice(vehicle.price)} at YzeMotor Pro!`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(`${window.location.origin}/vehicles/${vehicle.id}`)}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // Combine main image and additional images
  const getAllImages = (vehicle) => {
    const images = [];
    if (vehicle.image_url) {
      images.push(vehicle.image_url);
    }
    if (vehicle.images && vehicle.images.length > 0) {
      images.push(...vehicle.images);
    }
    return images;
  };

  const nextImage = (images) => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (images) => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading vehicle details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Vehicle Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The vehicle you're looking for doesn't exist or has been sold.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Listings
          </a>
        </div>
      </div>
    );
  }

  const allImages = getAllImages(vehicle);

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1E1E1E] border-b border-[#E9E9E9] dark:border-[#333333] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Back */}
            <div className="flex items-center gap-6">
              <a
                href="/"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Listings</span>
              </a>

              <div className="flex items-center gap-3">
                <img
                  src="https://raw.createusercontent.com/6293bec5-1f32-4248-bdb5-c9f05f944693/"
                  alt="YzeMotor Pro"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <h1 className="text-lg font-bold text-black dark:text-white">
                    YzeMotor Pro
                  </h1>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex items-center gap-4">
              {/* Share Button */}
              <div className="relative">
                <button
                  onClick={shareVehicle}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Share2 size={16} />
                  <span className="hidden sm:inline">Share</span>
                </button>

                {/* Share Menu */}
                {showShareMenu && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
                    <div className="p-4">
                      <h4 className="font-semibold text-black dark:text-white mb-3">
                        Share this vehicle
                      </h4>

                      <div className="space-y-2">
                        <button
                          onClick={copyToClipboard}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Copy size={16} />
                          <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
                        </button>

                        <button
                          onClick={shareOnFacebook}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Facebook size={16} />
                          <span>Share on Facebook</span>
                        </button>

                        <button
                          onClick={shareOnTwitter}
                          className="w-full flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Twitter size={16} />
                          <span>Share on Twitter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Images */}
          <div className="space-y-6">
            {/* Main Image Gallery */}
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden">
              {allImages.length > 0 ? (
                <>
                  <img
                    src={allImages[currentImageIndex]}
                    alt={`${vehicle.title} - Image ${currentImageIndex + 1}`}
                    className="w-full h-96 object-cover"
                  />

                  {/* Watermark */}
                  <div className="absolute top-6 left-6 bg-white/95 dark:bg-black/95 px-4 py-2 rounded-lg">
                    <span className="text-lg font-bold text-black dark:text-white">
                      YzeMotor Pro
                    </span>
                  </div>

                  {/* Featured Badge */}
                  {vehicle.is_featured && (
                    <div className="absolute top-6 right-6 bg-yellow-500 text-black px-4 py-2 rounded-lg font-bold">
                      ⭐ Featured
                    </div>
                  )}

                  {/* Navigation Arrows */}
                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(allImages)}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={() => nextImage(allImages)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                      {currentImageIndex + 1} / {allImages.length}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                  <div className="text-center">
                    <Car size={48} className="mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No images available
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 relative rounded-lg overflow-hidden transition-all ${
                      currentImageIndex === index
                        ? "ring-4 ring-blue-500 ring-opacity-75"
                        : "hover:ring-2 hover:ring-blue-300"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${vehicle.title} - Thumbnail ${index + 1}`}
                      className="w-20 h-16 object-cover"
                    />
                    {/* Small watermark on thumbnails */}
                    <div className="absolute top-1 left-1 bg-white/90 dark:bg-black/90 px-1 py-0.5 rounded text-xs font-bold text-black dark:text-white">
                      YMP
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Contact Section */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4">
                Interested? Contact Us Now!
              </h3>
              <p className="text-green-700 dark:text-green-400 mb-4">
                Get in touch via WhatsApp for quick responses and negotiations.
              </p>
              <button
                onClick={() => openWhatsApp(vehicle)}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-semibold text-lg"
              >
                <MessageCircle size={24} />
                Contact on WhatsApp
              </button>
              <p className="text-center text-green-600 dark:text-green-400 mt-3 font-medium">
                📞 (706) 218-3401
              </p>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            {/* Vehicle Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                {vehicle.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
                <span className="capitalize bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {vehicle.vehicle_type}
                </span>
                {vehicle.condition && (
                  <span className="capitalize bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">
                    {vehicle.condition}
                  </span>
                )}
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                {formatPrice(vehicle.price)}
              </div>
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Calendar size={16} />
                  <span className="text-sm">Year</span>
                </div>
                <div className="text-xl font-bold text-black dark:text-white">
                  {vehicle.year}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Eye size={16} />
                  <span className="text-sm">Mileage</span>
                </div>
                <div className="text-xl font-bold text-black dark:text-white">
                  {vehicle.mileage
                    ? `${vehicle.mileage.toLocaleString()} mi`
                    : "N/A"}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <MapPin size={16} />
                  <span className="text-sm">Location</span>
                </div>
                <div className="text-lg font-bold text-black dark:text-white">
                  {vehicle.city
                    ? `${vehicle.city}, ${vehicle.state}`
                    : vehicle.state}
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                  <Fuel size={16} />
                  <span className="text-sm">Fuel Type</span>
                </div>
                <div className="text-lg font-bold text-black dark:text-white">
                  {vehicle.fuel_type || "N/A"}
                </div>
              </div>
            </div>

            {/* Detailed Specifications */}
            <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-black dark:text-white mb-6">
                Specifications
              </h3>

              <div className="space-y-4">
                {vehicle.make && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Car size={16} />
                      <span>Make & Model</span>
                    </div>
                    <span className="font-semibold text-black dark:text-white">
                      {vehicle.make} {vehicle.model}
                    </span>
                  </div>
                )}

                {vehicle.engine_size && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Settings size={16} />
                      <span>Engine</span>
                    </div>
                    <span className="font-semibold text-black dark:text-white">
                      {vehicle.engine_size}
                    </span>
                  </div>
                )}

                {vehicle.transmission && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Wrench size={16} />
                      <span>Transmission</span>
                    </div>
                    <span className="font-semibold text-black dark:text-white">
                      {vehicle.transmission}
                    </span>
                  </div>
                )}

                {vehicle.color && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Palette size={16} />
                      <span>Color</span>
                    </div>
                    <span className="font-semibold text-black dark:text-white">
                      {vehicle.color}
                    </span>
                  </div>
                )}

                {vehicle.vin && (
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Gauge size={16} />
                      <span>VIN</span>
                    </div>
                    <span className="font-mono text-sm font-semibold text-black dark:text-white">
                      {vehicle.vin}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-6">
                  Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {vehicle.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white dark:bg-[#1E1E1E] border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-black dark:text-white mb-4">
                  Description
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-black dark:text-white mb-4">
            Ready to Buy This Vehicle?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
            Contact us directly on WhatsApp for immediate assistance,
            negotiations, and to schedule a viewing. We're here to help you get
            the best deal!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => openWhatsApp(vehicle)}
              className="flex items-center gap-3 px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-semibold text-lg"
            >
              <MessageCircle size={24} />
              Contact on WhatsApp
            </button>
            <a
              href="tel:+17062183401"
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold text-lg"
            >
              <Phone size={24} />
              Call (706) 218-3401
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

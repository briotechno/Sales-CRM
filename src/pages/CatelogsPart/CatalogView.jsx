import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
    Package,
    DollarSign,
    CheckCircle,
    Share2,
    Clock,
    ChevronLeft,
    ChevronRight,
    Target,
    Building2,
} from "lucide-react";

import { useGetCatalogByIdQuery } from "../../store/api/catalogApi";
import { useGetBusinessInfoQuery } from "../../store/api/businessApi";

export default function CatalogView() {
    const { id } = useParams();
    const { data: catalog, isLoading, error } = useGetCatalogByIdQuery(id);
    const { data: businessInfo } = useGetBusinessInfoQuery();
    const [activeTab, setActiveTab] = useState("features");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading catalog...</p>
                </div>
            </div>
        );
    }

    if (!catalog || error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="text-center bg-white p-12 rounded-lg shadow-lg">
                    <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Catalog Not Found</h2>
                    <p className="text-gray-600 mb-6">The catalog you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: catalog.name,
                    text: catalog.description,
                    url: window.location.href,
                });
            } catch (err) {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Link copied to clipboard!");
        }
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % catalog.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + catalog.images.length) % catalog.images.length);
    };

    // Check if field has value
    const hasValue = (value) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && Object.keys(value).length === 0) return false;
        return true;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {businessInfo?.logo ? (
                            <img
                                src={businessInfo.logo}
                                alt={businessInfo.name}
                                className="w-10 h-10 rounded-lg object-cover"
                            />
                        ) : (
                            <div className="bg-orange-500 text-white p-2 rounded-lg">
                                <Package size={24} />
                            </div>
                        )}
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">
                                {businessInfo?.name || "Business Catalog"}
                            </h1>
                            <p className="text-xs text-gray-500 font-normal">Product Catalog</p>
                        </div>
                    </div>
                    <button
                        onClick={handleShare}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-all shadow-sm"
                    >
                        <Share2 size={16} />
                        Share
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                {hasValue(catalog.category) && (
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-normal">
                        <span>catlog test</span>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">{catalog.name}</span>
                    </div>
                )}

                <div className="max-w-2xl mx-auto">
                    {/* Main Image */}
                    <div className="space-y-4 mb-6">
                        {/* Main Image */}
                        <div className="relative overflow-hidden rounded-lg shadow-lg aspect-video bg-white group">
                            <img
                                src={catalog.image || (catalog.images && catalog.images[currentImageIndex])}
                                alt={catalog.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Status Badge */}
                            {hasValue(catalog.status) && (
                                <div
                                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold shadow-md ${catalog.status === "Active"
                                        ? "bg-green-500 text-white"
                                        : "bg-gray-500 text-white"
                                        }`}
                                >
                                    {catalog.status}
                                </div>
                            )}

                            {/* Image Navigation */}
                            {catalog.images && catalog.images.length > 1 && (
                                <>
                                    <button
                                        onClick={prevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronLeft size={20} className="text-gray-800" />
                                    </button>
                                    <button
                                        onClick={nextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <ChevronRight size={20} className="text-gray-800" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Category Badge */}
                    {hasValue(catalog.category) && (
                        <div className="inline-block px-3 py-1 bg-orange-100 text-orange-600 rounded text-xs font-semibold mb-4">
                            {catalog.category}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
                        {catalog.name}
                    </h1>

                    {/* Description */}
                    {hasValue(catalog.description) && (
                        <div className="border-l-4 border-orange-500 pl-4 py-2 mb-6">
                            <p className="text-sm text-gray-700 font-normal leading-relaxed">
                                {catalog.description}
                            </p>
                        </div>
                    )}

                    {/* Delivery Info */}
                    {hasValue(catalog.deliveryTime) && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Clock className="text-orange-500" size={16} />
                                <span className="text-xs text-gray-500 font-medium">Delivery</span>
                            </div>
                            <p className="text-base font-bold text-gray-900">{catalog.deliveryTime}</p>
                        </div>
                    )}

                    {/* Vendor Info */}
                    {hasValue(catalog.vendor) && (
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6">
                            <p className="text-xs text-gray-500 font-medium mb-1">Vendor</p>
                            <p className="text-base font-bold text-gray-900">{catalog.vendor}</p>
                        </div>
                    )}

                    {/* Price Card */}
                    {hasValue(catalog.maxPrice) && (
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center mb-12">
                            <div className="text-orange-500 mb-2 flex justify-center">
                                <DollarSign size={24} />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                ₹{parseFloat(catalog.maxPrice).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mt-1">
                                Estimated Price Range
                            </div>
                        </div>
                    )}
                </div>




                {/* Tabbed Content Section */}
                {(hasValue(catalog.features) || hasValue(catalog.specifications)) && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                        {/* Tab Headers */}
                        <div className="flex border-b border-gray-200">
                            {hasValue(catalog.features) && (
                                <button
                                    onClick={() => setActiveTab("features")}
                                    className={`flex-1 px-6 py-4 font-semibold text-sm transition-all relative ${activeTab === "features"
                                        ? "text-orange-500 bg-white"
                                        : "text-gray-600 hover:text-gray-900 bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <CheckCircle size={18} />
                                        <span>Key Features</span>
                                    </div>
                                    {activeTab === "features" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                                    )}
                                </button>
                            )}
                            {hasValue(catalog.specifications) && (
                                <button
                                    onClick={() => setActiveTab("specifications")}
                                    className={`flex-1 px-6 py-4 font-semibold text-sm transition-all relative ${activeTab === "specifications"
                                        ? "text-orange-500 bg-white"
                                        : "text-gray-600 hover:text-gray-900 bg-gray-50"
                                        }`}
                                >
                                    <div className="flex items-center justify-center gap-2">
                                        <Target size={18} />
                                        <span>Specifications</span>
                                    </div>
                                    {activeTab === "specifications" && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500"></div>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Tab Content */}
                        <div className="p-6">
                            {activeTab === "features" && hasValue(catalog.features) && (
                                <div className="space-y-3">
                                    {catalog.features.map((feature, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm text-gray-900 font-medium flex-1">{feature}</p>
                                            <CheckCircle className="text-green-500 flex-shrink-0" size={18} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === "specifications" && hasValue(catalog.specifications) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(catalog.specifications).map(([key, value], index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            <span className="text-sm text-gray-600 font-medium">{key}</span>
                                            <span className="text-sm text-gray-900 font-bold">{value}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 pt-6 border-t border-gray-200 text-center">
                    <p className="text-xs text-gray-500 font-normal">
                        &copy; {new Date().getFullYear()} {businessInfo?.name || "Business"}. All rights reserved.
                        {hasValue(catalog.catalog_id) && ` | Catalog ID: ${catalog.catalog_id}`}
                    </p>
                </div>
            </main>
        </div>
    );
}

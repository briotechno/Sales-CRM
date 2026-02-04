import React, { useState } from "react";
import {
    Package,
    DollarSign,
    CheckCircle,
    Share,
    Clock,
    ChevronLeft,
    ChevronRight,
    Building2,
    Tag,
    Info,
    FileText,
    ShieldCheck,
    Hash,
    Briefcase,
    Mail,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Modal from "../../components/common/Modal";

const ViewCatalogModal = ({ isOpen, onClose, catalog, businessInfo }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    if (!catalog) return null;

    const DESCRIPTION_LIMIT = 250;
    const isLongDescription = (catalog.description?.length || 0) > DESCRIPTION_LIMIT;
    const displayDescription = isLongDescription && !isDescriptionExpanded
        ? `${catalog.description.substring(0, DESCRIPTION_LIMIT)}...`
        : catalog.description;

    const formatCurrencyShorthand = (value) => {
        const num = Number(value);
        if (isNaN(num) || num === 0) return "0";

        if (num >= 10000000) { // 1 Crore = 10,000,000
            return (num / 10000000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " Cr";
        } else if (num >= 100000) { // 1 Lakh = 100,000
            return (num / 100000).toLocaleString(undefined, { maximumFractionDigits: 2 }) + " Lakh";
        }
        return num.toLocaleString();
    };

    const hasValue = (value) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && Object.keys(value).length === 0) return false;
        return true;
    };

    const nextImage = () => {
        if (catalog.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev + 1) % catalog.images.length);
        }
    };

    const prevImage = () => {
        if (catalog.images?.length > 0) {
            setCurrentImageIndex((prev) => (prev - 1 + catalog.images.length) % catalog.images.length);
        }
    };

    const handleShare = async () => {
        const url = `${window.location.origin}/catalog/view/${catalog.catalog_id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: catalog.name,
                    text: catalog.description,
                    url: url,
                });
            } catch (err) {
                navigator.clipboard.writeText(url);
                toast.success("Link copied to clipboard!");
            }
        } else {
            navigator.clipboard.writeText(url);
            toast.success("Link copied to clipboard!");
        }
    };

    const displayImages = catalog.images && catalog.images.length > 0 ? catalog.images : (catalog.image ? [catalog.image] : []);

    const footer = (
        <div className="flex gap-3 w-full">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 rounded-sm border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all shadow-sm"
            >
                Close
            </button>
            <button
                onClick={handleShare}
                className="flex-1 px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all flex items-center justify-center gap-2"
            >
                <Share size={18} />
                Share Link
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Catalog Details"
            subtitle="Premium Product Identity & Specifications"
            icon={<Package size={24} />}
            maxWidth="max-w-4xl"
            footer={footer}
        >
            <div className="flex flex-col space-y-6">
                {/* Header Summary Card */}
                <div className="bg-gradient-to-r from-orange-50 to-white p-6 rounded-xl border border-orange-100 flex flex-col md:flex-row items-start gap-6">
                    {/* Media Thumbnail */}
                    <div className="relative group shrink-0">
                        <div className="w-40 h-40 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-4 shadow-sm overflow-hidden relative">
                            {displayImages.length > 0 ? (
                                <img
                                    src={displayImages[currentImageIndex]}
                                    alt={catalog.name}
                                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.parentNode.innerHTML = '<div class="w-full h-full flex items-center justify-center text-[#FF7B1D]"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg></div>';
                                    }}
                                />
                            ) : (
                                <Package size={40} className="text-[#FF7B1D]" />
                            )}

                            {displayImages.length > 1 && (
                                <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={prevImage} className="p-1 bg-white/90 rounded-full shadow-sm text-gray-800">
                                        <ChevronLeft size={14} />
                                    </button>
                                    <button onClick={nextImage} className="p-1 bg-white/90 rounded-full shadow-sm text-gray-800">
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 space-y-3">
                        <h3 className="text-2xl font-semibold text-gray-900 leading-tight">
                            {catalog.name?.length > 80 ? `${catalog.name.substring(0, 80)}...` : catalog.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-gray-500 font-semibold text-xs flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-sm border border-gray-100">
                                <Hash size={12} className="text-[#FF7B1D]" />
                                <span className="text-gray-400 mr-1">ID:</span>
                                {catalog.catalog_id}
                            </span>
                            <span className="bg-orange-50 text-[#FF7B1D] text-xs font-semibold px-2 py-1 rounded-sm border border-orange-100 flex items-center gap-1">
                                <Tag size={12} />
                                <span className="text-orange-300 mr-1">Category:</span>
                                {catalog.category || "General"}
                            </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-semibold capitalize tracking-wide border flex items-center shadow-sm ${catalog.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                <CheckCircle size={12} className="mr-1.5" />
                                {catalog.status}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm text-[10px] font-semibold text-gray-500 capitalize tracking-wide">
                                <ShieldCheck size={12} className="text-blue-500" />
                                Verified Listing
                            </span>
                        </div>
                    </div>

                    <div className="text-left md:text-right bg-white p-5 rounded-xl border border-orange-100 shadow-sm min-w-[200px] w-full md:w-auto border-t-4 border-t-[#FF7B1D]">
                        <p className="text-sm font-semibold text-[#FF7B1D] capitalize tracking-wider mb-2">Price Range</p>
                        <div className="flex flex-wrap items-baseline md:justify-end gap-1 text-gray-900 overflow-hidden">
                            <span className="text-sm font-bold shrink-0">₹</span>
                            <p className="text-xl md:text-2xl font-semibold tabular-nums break-words whitespace-normal leading-tight">
                                {catalog.minPrice && catalog.maxPrice && catalog.minPrice !== catalog.maxPrice ? (
                                    <>
                                        {formatCurrencyShorthand(catalog.minPrice)} - {formatCurrencyShorthand(catalog.maxPrice)}
                                    </>
                                ) : (
                                    formatCurrencyShorthand(catalog.maxPrice || catalog.minPrice || 0)
                                )}
                            </p>
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Approximate Market Value</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group border-l-4 border-l-blue-500">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                <Clock size={20} />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 capitalize tracking-wider">Delivery Time</span>
                        </div>
                        <p className="text-base font-semibold text-gray-900 ml-1">
                            {catalog.deliveryTime || "TBD"}
                        </p>
                    </div>

                    <div className="p-5 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group border-l-4 border-l-green-500">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                                <Building2 size={20} />
                            </div>
                            <span className="text-sm font-semibold text-gray-600 capitalize tracking-wider">Ownership</span>
                        </div>
                        <p className="text-base font-semibold text-gray-900 ml-1 truncate" title={businessInfo?.company_name}>
                            {businessInfo?.company_name || businessInfo?.name || "Official Entity"}
                        </p>
                    </div>
                </div>

                {/* Details Area */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-12 space-y-6">
                        {/* Description Box */}
                        <div className="bg-gray-50/50 p-6 rounded-xl border border-gray-100">
                            <h4 className="flex items-center gap-2 text-sm font-semibold capitalize tracking-wider mb-4 text-[#FF7B1D]">
                                <FileText size={18} /> Description
                            </h4>
                            <div className={`transition-all duration-300 ${isDescriptionExpanded ? "max-h-[200px] overflow-y-auto pr-2 custom-scrollbar" : ""}`}>
                                <p className="text-base text-gray-600 leading-relaxed font-medium">
                                    {displayDescription || "Comprehensive product description pending update."}
                                    {isLongDescription && (
                                        <button
                                            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                                            className="ml-2 text-[#FF7B1D] font-bold hover:underline focus:outline-none inline-block align-baseline text-sm"
                                        >
                                            {isDescriptionExpanded ? "Read Less" : "Read More"}
                                        </button>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Features */}
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-semibold capitalize tracking-wider text-gray-800 mb-5 px-1 border-b pb-2 border-gray-100">
                                    <Tag size={18} className="text-[#FF7B1D]" /> Key Features
                                </h4>
                                <div className="space-y-3">
                                    {catalog.features?.length > 0 ? (
                                        catalog.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-50 shadow-sm hover:border-[#FF7B1D]/30 transition-all group">
                                                <div className="w-8 h-8 shrink-0 rounded-full bg-orange-50 flex items-center justify-center text-[#FF7B1D] group-hover:scale-110 transition-transform">
                                                    <CheckCircle size={16} />
                                                </div>
                                                <p className="text-sm font-semibold text-gray-700 leading-tight capitalize">{feature}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic text-xs px-1">No specific features listed</p>
                                    )}
                                </div>
                            </div>

                            {/* Specs */}
                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-semibold capitalize tracking-wider text-gray-800 mb-5 px-1 border-b pb-2 border-gray-100">
                                    <ShieldCheck size={18} className="text-[#FF7B1D]" /> Specifications
                                </h4>
                                <div className="space-y-3">
                                    {catalog.specifications && Object.keys(catalog.specifications).length > 0 ? (
                                        Object.entries(catalog.specifications).map(([key, value], idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-50 rounded-xl shadow-sm hover:border-[#FF7B1D]/30 transition-all group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-2 h-2 rounded-full bg-[#FF7B1D] group-hover:scale-125 transition-all"></div>
                                                    <span className="text-sm font-semibold text-gray-500 capitalize tracking-wide">{key}</span>
                                                </div>
                                                <span className="text-sm font-bold text-gray-900 capitalize">{String(value)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic text-xs px-1">No technical specs available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal >
    );
};

export default ViewCatalogModal;

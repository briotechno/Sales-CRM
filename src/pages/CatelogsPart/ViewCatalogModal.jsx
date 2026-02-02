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

    if (!catalog) return null;

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
                        <div className="flex items-center gap-2">
                            <span className="bg-orange-200 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-orange-300">
                                {catalog.category || "General Listing"}
                            </span>
                            <span className="text-gray-400 font-medium text-xs flex items-center gap-1">
                                <Hash size={12} />
                                {catalog.catalog_id}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 leading-tight">
                            {catalog.name?.length > 80 ? `${catalog.name.substring(0, 80)}...` : catalog.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center shadow-sm ${catalog.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                <CheckCircle size={12} className="mr-1.5" />
                                {catalog.status}
                            </span>
                            <span className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-sm text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <ShieldCheck size={12} className="text-blue-500" />
                                Verified Listing
                            </span>
                        </div>
                    </div>

                    <div className="text-left md:text-right bg-white p-4 rounded-xl border border-orange-100 shadow-sm min-w-[180px]">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Pricing Guide</p>
                        <p className="text-2xl font-black text-orange-600 tabular-nums">
                            <span className="text-base font-normal mr-1">₹</span>
                            {catalog.maxPrice?.toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                                <Clock size={20} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Lead Time</span>
                        </div>
                        <p className="text-sm font-black text-gray-800 ml-1">
                            {catalog.deliveryTime || "TBD"}
                        </p>
                    </div>

                    <div className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-green-50 text-green-600 rounded-lg group-hover:scale-110 transition-transform">
                                <Building2 size={20} />
                            </div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ownership</span>
                        </div>
                        <p className="text-sm font-black text-gray-800 ml-1 truncate" title={businessInfo?.company_name}>
                            {businessInfo?.company_name || businessInfo?.name || "Official Entity"}
                        </p>
                    </div>
                </div>

                {/* Details Area */}
                {/* Details Area - Alternative Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Side: Features & Specs */}
                    <div className="md:col-span-12 space-y-6">
                        {/* Description Box */}
                        <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                            <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-orange-600">
                                <FileText size={14} /> Description
                            </h4>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                {catalog.description?.length > 400
                                    ? `${catalog.description.substring(0, 400)}...`
                                    : catalog.description || "Comprehensive product description pending update."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Features */}
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">
                                    <Tag size={14} className="text-blue-500" /> Key Features
                                </h4>
                                <div className="space-y-2">
                                    {catalog.features?.length > 0 ? (
                                        catalog.features.slice(0, 6).map((feature, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 group hover:border-orange-200 transition-colors">
                                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                                                    <CheckCircle size={12} />
                                                </div>
                                                <p className="text-xs font-bold text-gray-700">{feature}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic text-[10px] px-1">No specific features listed</p>
                                    )}
                                </div>
                            </div>

                            {/* Specs */}
                            <div>
                                <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-1">
                                    <ShieldCheck size={14} className="text-purple-500" /> Specifications
                                </h4>
                                <div className="space-y-2">
                                    {catalog.specifications && Object.keys(catalog.specifications).length > 0 ? (
                                        Object.entries(catalog.specifications).slice(0, 6).map(([key, value], idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-200 transition-colors group text-black">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-125 transition-all"></div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</span>
                                                </div>
                                                <span className="text-xs font-black text-gray-800">{String(value)}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic text-[10px] px-1">No technical specs available</p>
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

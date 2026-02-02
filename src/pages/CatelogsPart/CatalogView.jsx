import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Package,
    DollarSign,
    CheckCircle,
    Share,
    Clock,
    ChevronLeft,
    ChevronRight,
    Target,
    Building2,
    Layout,
    Tag,
    Truck,
    Info,
    ArrowLeft,
    Box,
    FileText,
    ShieldCheck,
    Globe,
    Mail,
    ExternalLink,
    Hash,
    Layers,
    ShoppingCart,
    Share2,
    MapPin
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useGetCatalogByIdQuery } from "../../store/api/catalogApi";
import { useGetBusinessInfoQuery } from "../../store/api/businessApi";

// Navigation components
import Navbar from "../Public/Navbar";
import Footer from "../Public/Footer";

export default function CatalogView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: catalog, isLoading, error } = useGetCatalogByIdQuery(id);
    const { data: businessInfo } = useGetBusinessInfoQuery();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const DESCRIPTION_LIMIT = 400;

    const hasValue = (value) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && Object.keys(value).length === 0) return false;
        return true;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF7B1D]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Package size={24} className="text-[#FF7B1D]" />
                    </div>
                </div>
            </div>
        );
    }

    if (!catalog || error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
                <div className="bg-white p-12 rounded-xl shadow-2xl border border-gray-100 max-w-sm w-full">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Package size={40} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 mb-2">Non-Existent Listing</h2>
                    <p className="text-gray-500 mb-8 font-medium">The catalog you're looking for doesn't exist or has been archived.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-slate-900 text-white px-8 py-3 rounded-sm font-bold shadow-lg hover:bg-black transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Return to Dashboard
                    </button>
                </div>
            </div>
        );
    }

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
        if (navigator.share) {
            try {
                await navigator.share({
                    title: catalog.name,
                    text: catalog.description,
                    url: window.location.href,
                });
            } catch (err) {
                copyUrl();
            }
        } else {
            copyUrl();
        }
    };

    const copyUrl = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
    };

    const business = businessInfo || {};
    const logoUrl = business.logo_url
        ? `${import.meta.env.VITE_API_BASE_URL.replace("/api/", "")}${business.logo_url}`
        : business.logo;

    const displayImages = catalog.images && catalog.images.length > 0 ? catalog.images : (catalog.image ? [catalog.image] : []);

    return (
        <div className="min-h-screen bg-white font-primary antialiased text-gray-800">
            {/* Global Navbar */}
            <Navbar business={business} logoUrl={logoUrl} />

            <main className="bg-[#f8f9fa] pt-24 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
                <div className="max-w-[1400px] mx-auto space-y-6">

                    {/* Breadcrumbs / Back button */}
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-sm border border-gray-100 shadow-sm hover:border-[#FF7B1D] hover:text-[#FF7B1D] transition-all group font-bold text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Collection
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                            <span>Catalog</span>
                            <ChevronRight size={12} />
                            <span className="text-[#FF7B1D]">{catalog.name?.length > 30 ? `${catalog.name.substring(0, 30)}...` : catalog.name}</span>
                        </div>
                    </div>

                    {/* Main Hero Card - Matching CompanyProfile style */}
                    <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden p-6 md:p-8">
                        <div className="flex flex-col lg:flex-row gap-10">

                            {/* Product Media Gallery */}
                            <div className="lg:w-[40%]">
                                <div className="relative group">
                                    <div className="aspect-square bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center p-8 shadow-sm overflow-hidden relative">
                                        {displayImages.length > 0 ? (
                                            <img
                                                src={displayImages[currentImageIndex]}
                                                alt={catalog.name}
                                                className="w-full h-full object-contain transition-transform duration-700"
                                            />
                                        ) : (
                                            <Package size={80} className="text-gray-200" />
                                        )}

                                        {displayImages.length > 1 && (
                                            <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button onClick={prevImage} className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-[#FF7B1D] hover:text-white transform -translate-x-2 group-hover:translate-x-0 transition-all">
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button onClick={nextImage} className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-[#FF7B1D] hover:text-white transform translate-x-2 group-hover:translate-x-0 transition-all">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 z-10">
                                            <span className={`px-4 py-1.5 rounded-sm text-[10px] font-bold uppercase tracking-widest shadow-sm border ${catalog.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                {catalog.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    {displayImages.length > 1 && (
                                        <div className="mt-4 flex flex-wrap gap-3 justify-center">
                                            {displayImages.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`w-14 h-14 rounded-sm border-2 transition-all p-1 overflow-hidden bg-white ${currentImageIndex === idx ? "border-[#FF7B1D] shadow-sm" : "border-gray-100 hover:border-gray-200"}`}
                                                >
                                                    <img src={img} alt="" className="w-full h-full object-contain" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Identity & Details */}
                            <div className="lg:w-[60%] flex flex-col">
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-orange-50 text-[#FF7B1D] text-[10px] font-bold px-3 py-1 rounded-sm uppercase tracking-widest border border-orange-100">
                                                {catalog.category || "General Listing"}
                                            </span>
                                            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1">
                                                <Hash size={12} />
                                                {catalog.catalog_id}
                                            </span>
                                        </div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                                            {catalog.name?.length > 100 ? `${catalog.name.substring(0, 100)}...` : catalog.name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-sm border border-green-50">
                                                <ShieldCheck size={14} />
                                                Verified Quality
                                            </span>
                                            <span className="flex items-center gap-1.5 px-2 py-1 bg-blue-50 text-blue-700 rounded-sm border border-blue-50">
                                                <Box size={14} />
                                                In Stock
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-6 border-y border-gray-100">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pricing Guide</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-bold text-gray-900 tabular-nums">₹{catalog.maxPrice?.toLocaleString()}</span>
                                                <span className="text-xs font-bold text-gray-400">INR</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Lead Time</p>
                                            <div className="flex items-center gap-2 text-xl font-bold text-gray-700">
                                                <Clock size={16} className="text-[#FF7B1D]" />
                                                {catalog.deliveryTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <button
                                            onClick={handleShare}
                                            className="flex-1 min-w-[180px] bg-[#FF7B1D] text-white px-8 py-3.5 rounded-sm font-bold text-sm uppercase tracking-widest shadow-sm hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <Share2 size={18} />
                                            Share Details
                                        </button>
                                        <button className="flex-1 min-w-[180px] bg-gray-900 text-white px-8 py-3.5 rounded-sm font-bold text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95">
                                            <Mail size={18} />
                                            Enquiry Now
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-sm bg-gray-50 flex items-center justify-center border border-gray-100 p-2 overflow-hidden shadow-sm">
                                        {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain" alt="" /> : <Building2 size={24} className="text-[#FF7B1D]" />}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Distributed by</p>
                                        <p className="text-sm font-bold text-gray-800">{business.company_name || business.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                        {/* Description & Features */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Operational Insight (Description Block) */}
                            <div className="bg-white rounded-sm shadow-md p-8 border border-gray-100">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-5 mb-6">
                                    <div className="flex items-center gap-3">
                                        <FileText className="text-[#FF7B1D]" size={24} />
                                        <h3 className="text-xl font-bold text-gray-800">Operational Insight</h3>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Product Narrative</span>
                                </div>
                                <div className="relative">
                                    <p className={`text-gray-700 leading-relaxed text-base transition-all duration-300 break-words ${!showFullDescription && catalog.description?.length > DESCRIPTION_LIMIT ? 'line-clamp-4' : ''}`}>
                                        {showFullDescription
                                            ? catalog.description
                                            : (catalog.description?.length > DESCRIPTION_LIMIT
                                                ? `${catalog.description.substring(0, DESCRIPTION_LIMIT)}...`
                                                : catalog.description || "Detailed description pending architectural finalization."
                                            )
                                        }
                                    </p>
                                    {catalog.description?.length > DESCRIPTION_LIMIT && (
                                        <button
                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                            className="mt-4 text-[#FF7B1D] font-bold text-sm uppercase tracking-widest hover:text-orange-600 flex items-center gap-1 transition-all"
                                        >
                                            {showFullDescription ? 'Show Less' : 'Show More'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Features and Specifications */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100">
                                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#FF7B1D] mb-6 border-b border-gray-50 pb-4">
                                        <Tag size={16} /> Key Features
                                    </h4>
                                    <div className="space-y-3">
                                        {catalog.features?.length > 0 ? catalog.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-sm border border-gray-100 group hover:border-[#FF7B1D]/30 transition-all">
                                                <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center text-green-600 mt-0.5 shrink-0 border border-green-100">
                                                    <CheckCircle size={12} />
                                                </div>
                                                <p className="text-xs font-bold text-gray-700 leading-snug">{feature}</p>
                                            </div>
                                        )) : <p className="text-gray-400 italic text-xs text-center py-4">No features documented</p>}
                                    </div>
                                </div>

                                <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100">
                                    <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-6 border-b border-gray-50 pb-4">
                                        <ShieldCheck size={16} /> Technical Specifications
                                    </h4>
                                    <div className="space-y-2">
                                        {catalog.specifications && Object.keys(catalog.specifications).length > 0 ? Object.entries(catalog.specifications).map(([key, value], idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-sm hover:border-blue-200 transition-colors group">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{key}</span>
                                                </div>
                                                <span className="text-xs font-bold text-gray-800">{String(value)}</span>
                                            </div>
                                        )) : <p className="text-gray-400 italic text-xs text-center py-4">No specs documented</p>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-6">
                            {/* Business Contact Card */}
                            <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100 space-y-6">
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-50 pb-4 flex items-center gap-2">
                                    <Building2 size={14} className="text-[#FF7B1D]" />
                                    Business Information
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-orange-50 rounded-sm text-[#FF7B1D]">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                                            <p className="text-sm font-bold text-gray-800">{business.city || "TBD"}, {business.country || "TBD"}</p>
                                        </div>
                                    </div>
                                    {business.email && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-blue-50 rounded-sm text-blue-600">
                                                <Mail size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Email Node</p>
                                                <p className="text-sm font-bold text-gray-800 break-all">{business.email}</p>
                                            </div>
                                        </div>
                                    )}
                                    {business.website && (
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 bg-green-50 rounded-sm text-green-600">
                                                <Globe size={18} />
                                            </div>
                                            <div>
                                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Digital Presence</p>
                                                <p className="text-sm font-bold text-gray-800 break-all">{business.website}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <button className="w-full bg-[#FF7B1D] text-white py-3 rounded-sm text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
                                    <ExternalLink size={14} />
                                    View Company Profile
                                </button>
                            </div>

                            {/* Trust Badge Card - Dark mode like CompanyProfile */}
                            <div className="bg-gray-900 rounded-sm shadow-md p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7B1D]/10 rounded-full -m-10 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative space-y-6">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-bold text-[#FF7B1D] uppercase tracking-[0.3em]">Industrial Trust</p>
                                        <h4 className="text-xl font-bold">Secure Transactions</h4>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <ShieldCheck size={18} className="text-[#FF7B1D] shrink-0" />
                                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                                Verified supply chain data nodes for multi-region compliance.
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Globe size={18} className="text-blue-400 shrink-0" />
                                            <p className="text-[11px] text-gray-400 leading-relaxed">
                                                End-to-end logistics tracking and inventory synchronization.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Copyright - Simple and clear as requested */}
                    <div className="pt-12 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-900 italic">CATALOG_PRO</span>
                            <span className="h-4 w-px bg-gray-200"></span>
                            <span className="text-[10px] font-bold uppercase tracking-widest">© {new Date().getFullYear()} {business.company_name}</span>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 bg-gray-100 rounded-sm">V2.9.44</span>
                        </div>
                    </div>

                </div>
            </main>

            <Footer business={business} logoUrl={logoUrl} />
        </div>
    );
}

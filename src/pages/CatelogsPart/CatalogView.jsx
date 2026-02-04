import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Package,
    DollarSign,
    CheckCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    Building2,
    Tag,
    ArrowLeft,
    Box,
    FileText,
    ShieldCheck,
    Globe,
    Mail,
    ExternalLink,
    Hash,
    Layers,
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
                <div className="bg-white p-12 rounded-sm shadow-xl border border-gray-100 max-w-sm w-full">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <Package size={40} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 capitalize">Product enumeration not found</h2>
                    <p className="text-sm text-gray-500 mb-8 font-normal capitalize">The specific catalog entry is either restricted or decommissioned.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-[#FF7B1D] text-white px-8 py-3 rounded-sm font-semibold shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-2 capitalize tracking-wide text-sm"
                    >
                        <ArrowLeft size={18} />
                        Back to dashboard
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
        <div className="min-h-screen bg-white font-primary antialiased text-gray-800 mt-16">
            {/* Global Navbar */}
            <Navbar business={business} logoUrl={logoUrl} />

            <main className="bg-[#f8f9fa] py-4 px-4 sm:px-4 lg:px-4 min-h-screen">
                <div className="max-w-full mx-auto space-y-3">

                    {/* Breadcrumbs / Back button */}
                    <div className="flex items-center justify-between mb-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-sm border border-gray-100 shadow-sm hover:border-[#FF7B1D] hover:text-[#FF7B1D] transition-all group font-semibold text-xs capitalize tracking-wide"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to collection
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-gray-400 text-xs font-medium capitalize">
                            <span className="capitalize">Catalog</span>
                            <ChevronRight size={12} />
                            <span className="text-[#FF7B1D] capitalize">{catalog.name?.length > 30 ? `${catalog.name.substring(0, 30)}...` : catalog.name}</span>
                        </div>
                    </div>

                    {/* Main Hero Card */}
                    <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden p-6 md:p-10 transition-all hover:shadow-lg">
                        <div className="flex flex-col lg:flex-row gap-10 items-center">

                            {/* Product Media Gallery */}
                            <div className="lg:w-[45%]">
                                <div className="relative group">
                                    <div className="aspect-[4/3] bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center p-4 shadow-inner overflow-hidden relative transition-all group-hover:bg-white group-hover:border-orange-100">
                                        {displayImages.length > 0 ? (
                                            <img
                                                src={displayImages[currentImageIndex]}
                                                alt={catalog.name}
                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-4 text-gray-300">
                                                <Package size={80} strokeWidth={1} className="opacity-20" />
                                                <p className="text-xs font-medium capitalize text-gray-400">Image unverified</p>
                                            </div>
                                        )}

                                        {displayImages.length > 1 && (
                                            <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button onClick={prevImage} className="w-9 h-9 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-gray-800 hover:bg-[#FF7B1D] hover:text-white transition-all border border-gray-100">
                                                    <ChevronLeft size={18} />
                                                </button>
                                                <button onClick={nextImage} className="w-9 h-9 bg-white/90 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-gray-800 hover:bg-[#FF7B1D] hover:text-white transition-all border border-gray-100">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 z-10">
                                            <span className={`px-4 py-1.5 rounded-sm text-xs font-semibold capitalize shadow-sm border ${catalog.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-100'}`}>
                                                {catalog.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    {displayImages.length > 1 && (
                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
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
                            <div className="lg:w-[55%] flex flex-col justify-center">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-orange-50 text-[#FF7B1D] text-xs font-semibold px-3 py-1 rounded-sm capitalize border border-orange-100">
                                                {catalog.category || "General listing"}
                                            </span>
                                            <span className="text-gray-400 font-medium text-xs capitalize flex items-center gap-1 bg-gray-50 px-3 py-1 border border-gray-100 rounded-sm">
                                                <Hash size={12} className="text-gray-300" />
                                                {catalog.catalog_id}
                                            </span>
                                        </div>
                                        <h1 className={`font-bold text-gray-900 leading-tight capitalize ${catalog.name?.length > 60 ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'}`}>
                                            {catalog.name}
                                        </h1>
                                        <div className="flex flex-wrap items-center gap-3 pt-1">
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold capitalize rounded-sm border border-green-100">
                                                <CheckCircle size={14} />
                                                Verified quality
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold capitalize rounded-sm border border-blue-100">
                                                <Box size={14} />
                                                Premium stock
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 py-8 border-y border-gray-100">
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-[#FF7B1D] capitalize tracking-wide">
                                                Pricing guide
                                            </p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl md:text-3xl font-bold text-gray-900">₹{(catalog.maxPrice || 0).toLocaleString()}</span>
                                                <span className="text-xs font-semibold text-gray-500 capitalize">Inr</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-bold text-[#FF7B1D] capitalize tracking-wide">
                                                Lead time
                                            </p>
                                            <div className="flex items-center gap-3 text-xl font-bold text-gray-800">
                                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
                                                    <Clock size={16} className="text-[#FF7B1D]" />
                                                </div>
                                                <span className="capitalize">{catalog.deliveryTime || "Tbd"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 pt-2">
                                        <button
                                            onClick={handleShare}
                                            className="flex-1 min-w-[180px] bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-sm font-bold text-sm capitalize hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-3 shadow-sm"
                                        >
                                            <Share2 size={18} />
                                            Share details
                                        </button>
                                        <button className="flex-1 min-w-[180px] bg-[#FF7B1D] text-white px-6 py-4 rounded-sm font-bold text-sm capitalize hover:bg-orange-600 transition-all flex items-center justify-center gap-3 shadow-md">
                                            <Mail size={18} />
                                            Enquiry now
                                        </button>
                                    </div>

                                    <div className="pt-6 flex items-center gap-4 bg-gray-50/80 p-5 rounded-sm border border-gray-100">
                                        <div className="w-14 h-14 rounded-sm bg-white flex items-center justify-center border border-gray-200 p-2 overflow-hidden shadow-sm">
                                            {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain" alt="" /> : <Building2 size={28} className="text-[#FF7B1D]" />}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[11px] font-bold text-gray-400 capitalize mb-1 tracking-tight">Distributed & verified by</p>
                                            <p className="text-base font-medium text-gray-900 capitalize truncate">{business.company_name || business.name}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-green-500 border border-green-100 shadow-sm">
                                                <ShieldCheck size={22} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">

                        {/* Description & Features */}
                        <div className="lg:col-span-2 space-y-3">
                            {/* Operational Insight */}
                            <div className="bg-white rounded-sm shadow-md p-8 md:p-10 border border-gray-100 transition-all hover:border-orange-100">
                                <div className="flex items-center justify-between border-b border-gray-100 pb-5 mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-sm flex items-center justify-center text-[#FF7B1D] border border-orange-100">
                                            <FileText size={24} />
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-gray-900 capitalize tracking-tight">Operational insight</h3>
                                    </div>
                                    <span className="text-xs font-semibold text-gray-400 capitalize hidden sm:block">Product narrative</span>
                                </div>
                                <div className="relative">
                                    <p className={`text-gray-700 leading-relaxed text-base transition-all duration-300 break-words capitalize ${!showFullDescription && catalog.description?.length > DESCRIPTION_LIMIT ? 'line-clamp-6' : ''}`}>
                                        {showFullDescription
                                            ? catalog.description
                                            : (catalog.description?.length > DESCRIPTION_LIMIT
                                                ? `${catalog.description.substring(0, DESCRIPTION_LIMIT)}...`
                                                : catalog.description || "Detailed documentation pending architectural finalization."
                                            )
                                        }
                                    </p>
                                    {catalog.description?.length > DESCRIPTION_LIMIT && (
                                        <button
                                            onClick={() => setShowFullDescription(!showFullDescription)}
                                            className="mt-6 text-[#FF7B1D] font-bold text-sm capitalize hover:text-orange-600 flex items-center gap-1.5 transition-all"
                                        >
                                            {showFullDescription ? 'Collapse description' : 'Reveal full documentation'}
                                            <ChevronRight size={16} className={`transition-transform ${showFullDescription ? 'rotate-[-90deg]' : ''}`} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Features and Specifications */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-white rounded-sm shadow-md p-8 border border-gray-100 transition-all hover:border-orange-100">
                                    <h4 className="flex items-center gap-3 text-base md:text-lg font-bold capitalize text-gray-900 mb-6 border-b border-orange-50 pb-4">
                                        <Tag size={20} className="text-[#FF7B1D]" /> Performance features
                                    </h4>
                                    <div className="space-y-4">
                                        {catalog.features?.length > 0 ? catalog.features.map((feature, idx) => (
                                            <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-sm border border-gray-100 group hover:border-[#FF7B1D]/30 transition-all">
                                                <div className="w-6 h-6 rounded-sm bg-white flex items-center justify-center text-green-600 mt-0.5 shrink-0 border border-green-100 shadow-sm">
                                                    <CheckCircle size={14} />
                                                </div>
                                                <p className="text-sm font-normal text-gray-800 leading-relaxed capitalize">{feature}</p>
                                            </div>
                                        )) : (
                                            <div className="py-10 text-center text-gray-300 italic flex flex-col items-center gap-2">
                                                <Package size={32} className="opacity-20" />
                                                <p className="text-xs capitalize font-medium">No features documented</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-white rounded-sm shadow-md p-8 border border-gray-100 transition-all hover:border-blue-100">
                                    <h4 className="flex items-center gap-3 text-base md:text-lg font-bold capitalize text-gray-900 mb-6 border-b border-blue-50 pb-4">
                                        <ShieldCheck size={20} className="text-blue-600" /> Technical identity matrix
                                    </h4>
                                    <div className="space-y-3">
                                        {catalog.specifications && Object.keys(catalog.specifications).length > 0 ? Object.entries(catalog.specifications).map(([key, value], idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-sm hover:border-blue-200 transition-all group shadow-sm">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-2 h-2 rounded-full bg-blue-100 group-hover:bg-blue-500 transition-colors"></div>
                                                    <span className="text-xs font-semibold text-gray-500 capitalize truncate">{key}</span>
                                                </div>
                                                <span className="text-sm font-medium text-gray-900 capitalize ml-4 break-all">{String(value)}</span>
                                            </div>
                                        )) : (
                                            <div className="py-10 text-center text-gray-300 italic flex flex-col items-center gap-2">
                                                <Layers size={32} className="opacity-20" />
                                                <p className="text-xs capitalize font-medium">Specs pending review</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-3">
                            {/* Business Contact Card */}
                            <div className="bg-white rounded-sm shadow-md p-8 border border-gray-100 space-y-4 transition-all hover:border-orange-100">
                                <h4 className="text-base font-bold text-gray-900 capitalize tracking-wide mb-2 border-b border-gray-100 pb-4 flex items-center gap-3">
                                    <Building2 size={20} className="text-[#FF7B1D]" />
                                    Vendor verification
                                </h4>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-orange-50 rounded-sm text-[#FF7B1D] flex items-center justify-center border border-orange-100 shrink-0">
                                            <MapPin size={22} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-semibold text-gray-400 capitalize mb-1">Primary location</p>
                                            <p className="text-base font-medium text-gray-800 capitalize leading-tight">{business.city || "Registry pending"}, {business.country}</p>
                                        </div>
                                    </div>
                                    {business.email && (
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div className="w-12 h-12 bg-blue-50 rounded-sm text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                                                <Mail size={22} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-400 capitalize mb-1">Communication node</p>
                                                <p className="text-base font-medium text-gray-800 break-all leading-tight">{business.email}</p>
                                            </div>
                                        </div>
                                    )}
                                    {business.website && (
                                        <div className="flex items-start gap-4 min-w-0">
                                            <div className="w-12 h-12 bg-green-50 rounded-sm text-green-600 flex items-center justify-center border border-green-100 shrink-0">
                                                <Globe size={22} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-semibold text-gray-400 capitalize mb-1">Portal access</p>
                                                <p className="text-base font-medium text-gray-800 break-all truncate capitalize">{business.website}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="pt-2">
                                    <button className="w-full bg-gray-50 border border-gray-200 text-gray-700 py-3.5 rounded-sm text-sm font-semibold capitalize hover:bg-[#FF7B1D] hover:text-white hover:border-[#FF7B1D] transition-all flex items-center justify-center gap-2">
                                        <ExternalLink size={16} />
                                        Company overview
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badge Card */}
                            <div className="bg-[#111111] rounded-sm shadow-lg p-8 text-white relative overflow-hidden border border-gray-800 transition-all hover:border-gray-700">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF7B1D]/10 rounded-full -m-12"></div>
                                <div className="relative space-y-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-[#FF7B1D] capitalize mb-1">Industrial assurance</p>
                                        <h4 className="text-lg font-bold capitalize leading-tight">Secure transaction protocols</h4>
                                    </div>
                                    <div className="space-y-4 pt-2">
                                        <div className="flex gap-3">
                                            <ShieldCheck size={18} className="text-[#FF7B1D] shrink-0" />
                                            <p className="text-xs text-gray-400 leading-relaxed capitalize font-normal">
                                                Verified supply chain integrity audit for global compliance.
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Globe size={18} className="text-blue-400 shrink-0" />
                                            <p className="text-xs text-gray-400 leading-relaxed capitalize font-normal">
                                                Logistics synchronization with multi-regional tracking nodes.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Copyright */}
                    <div className="pt-10 pb-6 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-400">
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-gray-900 tracking-tighter capitalize">Catalog<span className="text-[#FF7B1D]">_</span>pro</span>
                            <span className="h-4 w-px bg-gray-200"></span>
                            <span className="text-xs font-medium capitalize text-gray-500">
                                &copy; {new Date().getFullYear()} <span className="text-gray-900 capitalize font-semibold">{business.company_name || "Enterprise"}</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-semibold capitalize px-3 py-1 bg-white border border-gray-100 rounded-sm shadow-sm text-gray-400">Revision v2.9.44</span>
                            <div className="flex gap-3">
                                <Share2 size={14} className="cursor-pointer hover:text-gray-900 transition-colors" />
                                <Globe size={14} className="cursor-pointer hover:text-gray-900 transition-colors" />
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <Footer business={business} logoUrl={logoUrl} />
        </div>
    );
}

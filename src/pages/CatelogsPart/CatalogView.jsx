import React, { useState } from "react";
import { useParams } from "react-router-dom";
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
    ExternalLink
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useGetCatalogByIdQuery } from "../../store/api/catalogApi";
import { useGetBusinessInfoQuery } from "../../store/api/businessApi";

// Navigation components
import Navbar from "../Public/Navbar";
import Footer from "../Public/Footer";

export default function CatalogView() {
    const { id } = useParams();
    const { data: catalog, isLoading, error } = useGetCatalogByIdQuery(id);
    const { data: businessInfo } = useGetBusinessInfoQuery();
    const [activeTab, setActiveTab] = useState("features");
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const hasValue = (value) => {
        if (value === null || value === undefined || value === "") return false;
        if (Array.isArray(value) && value.length === 0) return false;
        if (typeof value === "object" && Object.keys(value).length === 0) return false;
        return true;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f8f9fa] font-primary">
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f9fa] text-center p-4 font-primary">
                <div className="bg-white p-12 rounded-sm shadow-md border border-gray-100 max-w-sm w-full">
                    <Package className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 font-primary">Catalog Not Found</h2>
                    <p className="text-gray-500 mb-8 font-medium">The catalog you're looking for doesn't exist or has been moved.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="w-full bg-[#FF7B1D] text-white px-8 py-3 rounded-sm font-bold shadow-md hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
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

            <main className="bg-[#f8f9fa] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto font-primary">

                    {/* Header Card - Matches CompanyProfile Identity Card */}
                    <div className="bg-white rounded-sm shadow-md p-6 mb-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-12">

                            {/* Left: Product Media Gallery */}
                            <div className="flex-shrink-0">
                                <div className="relative group">
                                    <div className="w-56 h-56 sm:w-72 sm:h-72 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center p-6 shadow-sm overflow-hidden relative">
                                        {displayImages.length > 0 ? (
                                            <img
                                                src={displayImages[currentImageIndex]}
                                                alt={catalog.name}
                                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <Package size={80} className="text-[#FF7B1D]" />
                                        )}

                                        {displayImages.length > 1 && (
                                            <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={prevImage} className="w-9 h-9 bg-white/95 rounded-sm shadow-md flex items-center justify-center text-gray-800 hover:bg-white border border-gray-100 active:scale-95 transition-all">
                                                    <ChevronLeft size={18} />
                                                </button>
                                                <button onClick={nextImage} className="w-9 h-9 bg-white/95 rounded-sm shadow-md flex items-center justify-center text-gray-800 hover:bg-white border border-gray-100 active:scale-95 transition-all">
                                                    <ChevronRight size={18} />
                                                </button>
                                            </div>
                                        )}

                                        {hasValue(catalog.status) && (
                                            <div className="absolute top-4 right-4 animate-pulse-subtle">
                                                <span className="bg-[#FF7B1D] text-white text-[9px] font-black px-3 py-1 rounded-sm shadow-lg uppercase tracking-widest border border-orange-400">
                                                    {catalog.status}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Gallery Indicator Bar */}
                                    {displayImages.length > 1 && (
                                        <div className="mt-4 flex gap-1.5 justify-center">
                                            {displayImages.map((_, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`h-1 rounded-full transition-all duration-300 ${currentImageIndex === idx ? "bg-[#FF7B1D] w-8" : "bg-gray-200 w-3 hover:bg-gray-300"}`}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Identity & Essential Stats */}
                            <div className="flex-1 text-center md:text-left pt-2">
                                <div className="space-y-4 mb-8">
                                    {hasValue(catalog.category) && (
                                        <p className="text-[11px] font-black text-[#FF7B1D] uppercase tracking-[0.3em] mb-2 leading-none">
                                            {catalog.category}
                                        </p>
                                    )}

                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                        <h1 className="text-4xl font-bold text-gray-900 leading-tight tracking-tight">
                                            {catalog.name}
                                        </h1>
                                        <div className="inline-flex items-center self-center md:self-auto gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest rounded-sm border border-green-100">
                                            <ShieldCheck size={14} />
                                            Authentic Listing
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-10 py-6 border-y border-gray-50">
                                    {hasValue(catalog.maxPrice) && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Price Estimate</p>
                                            <div className="flex items-baseline gap-1.5">
                                                <span className="text-2xl font-black text-gray-900">₹{parseFloat(catalog.maxPrice).toLocaleString()}</span>
                                                <span className="text-[11px] font-bold text-gray-400">INR</span>
                                            </div>
                                        </div>
                                    )}
                                    {hasValue(catalog.deliveryTime) && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Lead Time</p>
                                            <p className="text-xl font-bold text-gray-900 uppercase tracking-tight">{catalog.deliveryTime}</p>
                                        </div>
                                    )}
                                    {hasValue(catalog.catalog_id) && (
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">Catalog ID</p>
                                            <p className="text-lg font-black text-gray-900 font-mono tracking-tighter">{catalog.catalog_id}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Core Actions */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <button
                                        onClick={handleShare}
                                        className="bg-[#FF7B1D] text-white px-10 py-4 rounded-sm font-black text-[13px] uppercase tracking-widest shadow-xl hover:bg-orange-600 transition-all flex items-center gap-2 active:scale-95 transform hover:-translate-y-0.5"
                                    >
                                        <Share size={18} />
                                        Spread Details
                                    </button>
                                    <button className="bg-white border-2 border-gray-100 text-gray-800 px-10 py-4 rounded-sm font-black text-[13px] uppercase tracking-widest hover:border-[#FF7B1D] hover:text-[#FF7B1D] transition-all flex items-center gap-2 active:scale-95 transform hover:-translate-y-0.5">
                                        <Mail size={18} />
                                        Inquiry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Main Description Area (L: 8/12) */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Description Box */}
                            {hasValue(catalog.description) && (
                                <div className="bg-white rounded-sm shadow-md p-10 border border-gray-100 group hover:border-orange-200 transition-all">
                                    <h3 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                                        <Info className="text-[#FF7B1D]" size={26} />
                                        Product Insight
                                    </h3>
                                    <div className="bg-gray-50/80 p-8 rounded-sm border border-gray-100 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FF7B1D]"></div>
                                        <p className="text-gray-700 leading-relaxed text-[16px] font-medium whitespace-pre-wrap">
                                            {catalog.description}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Features vs Specs Tabs */}
                            {(hasValue(catalog.features) || hasValue(catalog.specifications)) && (
                                <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                                    <div className="flex border-b border-gray-100">
                                        {hasValue(catalog.features) && (
                                            <button
                                                onClick={() => setActiveTab("features")}
                                                className={`flex-1 py-6 px-4 font-black text-[12px] uppercase tracking-[0.25em] transition-all relative ${activeTab === "features" ? "text-[#FF7B1D] bg-white border-b-4 border-[#FF7B1D]" : "text-gray-400 bg-gray-50/50 hover:bg-gray-50 hover:text-gray-600"
                                                    }`}
                                            >
                                                Highlights
                                            </button>
                                        )}
                                        {hasValue(catalog.specifications) && (
                                            <button
                                                onClick={() => setActiveTab("specifications")}
                                                className={`flex-1 py-6 px-4 font-black text-[12px] uppercase tracking-[0.25em] transition-all relative ${activeTab === "specifications" ? "text-[#FF7B1D] bg-white border-b-4 border-[#FF7B1D]" : "text-gray-400 bg-gray-50/50 hover:bg-gray-50 hover:text-gray-600"
                                                    }`}
                                            >
                                                Technicality
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-10">
                                        {activeTab === "features" && hasValue(catalog.features) && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {catalog.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-5 p-6 bg-white border border-gray-100 rounded-sm hover:border-[#FF7B1D] hover:shadow-xl transition-all group">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-sm flex items-center justify-center text-[#FF7B1D] border border-orange-100 group-hover:bg-[#FF7B1D] group-hover:text-white transition-all transform group-hover:rotate-12">
                                                            <CheckCircle size={16} />
                                                        </div>
                                                        <p className="text-[15px] font-bold text-gray-700 leading-snug pt-2">{feature}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {activeTab === "specifications" && hasValue(catalog.specifications) && (
                                            <div className="grid grid-cols-1 gap-4">
                                                {Object.entries(catalog.specifications).map(([key, value], idx) => (
                                                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-gray-50/50 rounded-sm border border-gray-100 hover:bg-white hover:border-orange-200 transition-all gap-3">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-2 h-2 bg-orange-400 rounded-full shadow-sm shadow-orange-200"></div>
                                                            <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{key}</span>
                                                        </div>
                                                        <span className="text-[15px] font-black text-gray-900 tracking-tight">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Sidebar Column (R: 4/12) */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* Business Profile Shortcut Card */}
                            <div className="bg-white rounded-sm shadow-md p-8 border border-gray-100 sticky top-28">
                                <h4 className="text-[11px] font-black text-gray-400 uppercase tracking-[0.3em] mb-8">Official Distributor</h4>
                                <div className="flex items-center gap-5 mb-10 pb-10 border-b border-gray-50 flex-col text-center">
                                    <div className="w-24 h-24 bg-gray-50 rounded-sm border border-gray-100 flex items-center justify-center p-4 shadow-sm shrink-0 overflow-hidden transform hover:scale-105 transition-transform">
                                        {logoUrl ? (
                                            <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                                        ) : (
                                            <Building2 size={40} className="text-[#FF7B1D]" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xl font-bold text-gray-900 truncate tracking-tight mb-2 uppercase">{business.company_name || business.name}</p>
                                        <div className="inline-flex items-center gap-2 text-[10px] font-bold text-green-600 uppercase tracking-[0.2em] bg-green-50 px-3 py-1.5 rounded-sm border border-green-100">
                                            <ShieldCheck size={14} /> Global Entity
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <a
                                        href={`/business/${business.user_id}`}
                                        className="w-full bg-[#FF7B1D] text-white py-5 rounded-sm font-black text-[12px] uppercase tracking-[0.25em] shadow-lg hover:bg-orange-600 transition-all flex items-center justify-center gap-3 active:scale-95"
                                    >
                                        Authority Credentials
                                    </a>
                                    <button className="w-full bg-white border-2 border-gray-50 text-gray-800 py-5 rounded-sm font-black text-[12px] uppercase tracking-[0.25em] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 active:scale-95">
                                        <Mail size={18} /> Direct Inquiry
                                    </button>
                                </div>
                            </div>

                            {/* Trust Badge Grid - Enhanced Typography */}
                            <div className="bg-gray-900 rounded-sm shadow-2xl p-10 text-white overflow-hidden relative border border-gray-800">
                                <div className="absolute top-0 right-0 -m-12 w-48 h-48 bg-orange-500/10 rounded-full blur-[80px]"></div>
                                <h4 className="text-[11px] font-black text-orange-400 uppercase tracking-[0.4em] mb-12 relative">Quality Assurance</h4>

                                <div className="space-y-12 relative">
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center text-orange-400 shrink-0 border border-white/10 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                                            <Target size={22} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-white">System Fidelity</p>
                                            <p className="text-[12px] text-gray-500 font-medium leading-relaxed group-hover:text-gray-300 transition-colors">Every specification detail is digitally verified against official industrial inventories.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 bg-white/5 rounded-sm flex items-center justify-center text-orange-400 shrink-0 border border-white/10 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500 transform group-hover:-rotate-6">
                                            <ShieldCheck size={22} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-[0.3em] mb-3 text-white">Verified Origin</p>
                                            <p className="text-[12px] text-gray-500 font-medium leading-relaxed group-hover:text-gray-300 transition-colors">Information retrieval is managed through locked, secure provider channels.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Enhanced Bottom Metadata Bar */}
                    <div className="mt-28 py-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10 opacity-40 hover:opacity-100 transition-all duration-500">
                        <div className="flex items-center gap-6">
                            <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-sm p-1.5 grayscale transition-all hover:grayscale-0">
                                {logoUrl ? <img src={logoUrl} className="w-full h-full object-contain" alt="" /> : <Building2 size={20} />}
                            </div>
                            <div className="space-y-1">
                                <p className="text-[12px] font-black text-gray-600 uppercase tracking-[0.25em]">
                                    © {new Date().getFullYear()} {business.company_name || business.name} Group
                                </p>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">Institutional Catalog Repository</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="flex gap-4">
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] bg-white border border-gray-100 px-4 py-2 rounded-sm shadow-sm">Verified V5.0</div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] bg-white border border-gray-100 px-4 py-2 rounded-sm shadow-sm">Global CDN Node</div>
                            </div>
                            <Globe size={20} className="text-gray-300 animate-pulse-subtle" />
                        </div>
                    </div>

                </div>
            </main>

            <Footer business={business} logoUrl={logoUrl} />
        </div>
    );
}

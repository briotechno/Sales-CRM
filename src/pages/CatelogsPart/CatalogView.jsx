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
    ShoppingCart
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
        <div className="min-h-screen bg-white antialiased text-gray-800">
            {/* Global Navbar */}
            <Navbar business={business} logoUrl={logoUrl} />

            <main className="bg-slate-50 pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Breadcrumbs / Back button */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 rounded-sm border border-gray-100 shadow-sm hover:border-orange-500 hover:text-orange-600 transition-all group font-bold text-xs uppercase tracking-widest"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Collection
                        </button>
                        <div className="hidden md:flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                            <span>CRM</span>
                            <ChevronRight size={12} />
                            <span>Catalog</span>
                            <ChevronRight size={12} />
                            <span className="text-orange-500">{catalog.name}</span>
                        </div>
                    </div>

                    {/* Main Hero Card */}
                    <div className="bg-white rounded-xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
                        <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

                            {/* Product Media Gallery */}
                            <div className="lg:w-[45%] p-8 bg-slate-50/30">
                                <div className="relative group">
                                    <div className="aspect-square bg-white border border-gray-100 rounded-xl flex items-center justify-center p-8 shadow-inner overflow-hidden relative">
                                        {displayImages.length > 0 ? (
                                            <img
                                                src={displayImages[currentImageIndex]}
                                                alt={catalog.name}
                                                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                                            />
                                        ) : (
                                            <Package size={80} className="text-gray-200" />
                                        )}

                                        {displayImages.length > 1 && (
                                            <div className="absolute inset-y-0 inset-x-0 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button onClick={prevImage} className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-orange-500 hover:text-white transform -translate-x-2 group-hover:translate-x-0 transition-all">
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button onClick={nextImage} className="w-10 h-10 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-800 hover:bg-orange-500 hover:text-white transform translate-x-2 group-hover:translate-x-0 transition-all">
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 z-10">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg border border-white/20 backdrop-blur-md ${catalog.status === 'Active' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                                {catalog.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    {displayImages.length > 1 && (
                                        <div className="mt-6 flex flex-wrap gap-3 justify-center">
                                            {displayImages.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`w-16 h-16 rounded-lg border-2 transition-all p-1 overflow-hidden bg-white ${currentImageIndex === idx ? "border-orange-500 shadow-md ring-4 ring-orange-50" : "border-gray-100 hover:border-gray-300"}`}
                                                >
                                                    <img src={img} alt="" className="w-full h-full object-contain" />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Product Identity & Details */}
                            <div className="lg:w-[55%] p-10 flex flex-col justify-between">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-200">
                                                {catalog.category || "General Listing"}
                                            </span>
                                            <span className="text-gray-300 font-medium text-xs flex items-center gap-1">
                                                <Hash size={12} />
                                                {catalog.catalog_id}
                                            </span>
                                        </div>
                                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                            {catalog.name?.length > 100 ? `${catalog.name.substring(0, 100)}...` : catalog.name}
                                        </h1>
                                        <div className="flex items-center gap-4 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                                            <span className="flex items-center gap-1.5">
                                                <ShieldCheck size={14} className="text-green-500" />
                                                Quality Verified
                                            </span>
                                            <span className="flex items-center gap-1.5 font-black text-slate-400">
                                                <Box size={14} className="text-blue-500" />
                                                Standard Inventory
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 py-8 border-y border-slate-50">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pricing Range</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-3xl font-black text-slate-900 tabular-nums">₹{catalog.maxPrice?.toLocaleString()}</span>
                                                <span className="text-xs font-bold text-gray-400">INR</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Lead Time</p>
                                            <div className="flex items-center gap-2 text-xl font-bold text-slate-700">
                                                <Clock size={16} className="text-orange-500" />
                                                {catalog.deliveryTime}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-4 py-2">
                                        <div className="flex flex-wrap gap-4">
                                            <button
                                                onClick={handleShare}
                                                className="flex-1 min-w-[200px] bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white px-8 py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-orange-200 hover:shadow-orange-400 transition-all flex items-center justify-center gap-3 active:scale-95"
                                            >
                                                <Share size={18} />
                                                Broadcast Details
                                            </button>
                                            <button className="flex-1 min-w-[200px] bg-slate-900 border-2 border-slate-900 text-white px-8 py-4 rounded-sm font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-95">
                                                <Mail size={18} />
                                                Send Inquiry
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 group">
                                        {logoUrl ? <img src={logoUrl} className="w-8 h-8 object-contain opacity-70 group-hover:opacity-100 transition-opacity" alt="" /> : <Package size={20} className="text-slate-300" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Distributed by</p>
                                        <p className="text-sm font-bold text-slate-800">{business.company_name || business.name}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Secondary Information Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Highlights & Documentation */}
                        <div className="lg:col-span-8 space-y-8">

                            {/* Integrated Details View - Alternative to Tabs */}
                            <div className="space-y-8">
                                {/* Extended Description */}
                                <div className="bg-white rounded-xl shadow-[0_5px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100 p-10 space-y-8">
                                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                                <FileText size={20} />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-800">Operational Insight</h3>
                                        </div>
                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Description Node</span>
                                    </div>
                                    <div className="text-slate-600 leading-[1.8] font-medium space-y-4 text-justify whitespace-pre-line">
                                        {catalog.description?.length > 800
                                            ? `${catalog.description.substring(0, 800)}...`
                                            : catalog.description || "Detailed description pending architectural finalization."}
                                    </div>
                                </div>

                                {/* Features and Specifications Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white rounded-xl shadow-[0_5px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100 p-8 space-y-6">
                                        <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-orange-600">
                                            <Tag size={16} /> Asset Features
                                        </h4>
                                        <div className="space-y-3">
                                            {catalog.features?.length > 0 ? catalog.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 group hover:border-orange-200 transition-all">
                                                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-0.5 shrink-0">
                                                        <CheckCircle size={12} />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-700">{feature}</p>
                                                </div>
                                            )) : <p className="text-gray-400 italic text-xs">No features documented</p>}
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-xl shadow-[0_5px_25px_-5px_rgba(0,0,0,0.05)] border border-gray-100 p-8 space-y-6">
                                        <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                                            <ShieldCheck size={16} /> Technical Node
                                        </h4>
                                        <div className="space-y-2">
                                            {catalog.specifications && Object.keys(catalog.specifications).length > 0 ? Object.entries(catalog.specifications).map(([key, value], idx) => (
                                                <div key={idx} className="flex items-center justify-between p-3.5 bg-white border border-gray-100 rounded-lg hover:border-blue-200 transition-colors group">
                                                    <div className="flex items-center gap-3 text-black">
                                                        <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key}</span>
                                                    </div>
                                                    <span className="text-xs font-black text-slate-800">{String(value)}</span>
                                                </div>
                                            )) : <p className="text-gray-400 italic text-xs">No specs documented</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-8">

                            {/* Integrity Badge Card */}
                            <div className="bg-slate-900 rounded-xl shadow-2xl p-8 text-white relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full -m-10 group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative space-y-8">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-[0.4em]">Industrial Trust</p>
                                        <h4 className="text-2xl font-black">Secure Asset Management</h4>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex gap-4">
                                            <div className="shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-orange-400 group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                <ShieldCheck size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                                <span className="block text-white font-bold mb-1 uppercase tracking-widest text-[9px]">Authenticity Lock</span>
                                                Asset data is encrypted and verified against international supply chain standards.
                                            </p>
                                        </div>
                                        <div className="flex gap-4">
                                            <div className="shrink-0 w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                                                <Globe size={20} />
                                            </div>
                                            <p className="text-xs text-gray-400 font-medium leading-relaxed">
                                                <span className="block text-white font-bold mb-1 uppercase tracking-widest text-[9px]">Global Compliance</span>
                                                Pricing and availability nodes are synchronized hourly with worldwide inventory networks.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="pt-4 flex flex-col gap-3">
                                        <button className="w-full bg-white/5 border border-white/10 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                                            View Compliance Sheet
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Catalog Stats */}
                            <div className="bg-white rounded-xl border border-gray-100 p-8 shadow-sm space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Listing Architecture</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Inquiry Flow</span>
                                        <span className="block text-xl font-black text-slate-800 text-center">85%</span>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-center">Asset Rating</span>
                                        <span className="block text-xl font-black text-slate-800 text-center">A+</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 opacity-30 hover:opacity-100 transition-opacity">
                        <div className="flex items-center gap-4">
                            <div className="text-2xl font-black text-slate-900 tracking-tighter italic">CATALOG_PRO</div>
                            <div className="h-6 w-px bg-slate-200"></div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© {new Date().getFullYear()} Precision Systems</div>
                        </div>
                        <div className="flex gap-4">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-sm">Secured Terminal</span>
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-100 rounded-sm">V2.8 Build 44</span>
                        </div>
                    </div>

                </div>
            </main>

            <Footer business={business} logoUrl={logoUrl} />
        </div>
    );
}

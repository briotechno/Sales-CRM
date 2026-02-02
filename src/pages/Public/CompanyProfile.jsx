import React from "react";
import { useParams } from "react-router-dom";
import { useGetPublicBusinessInfoQuery } from "../../store/api/businessApi";
import { useGetPublicCatalogsQuery } from "../../store/api/catalogApi";
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Calendar,
    FileText,
    Award,
    CheckCircle,
    Share2,
    Linkedin,
    Facebook,
    Instagram,
    Twitter,
    Target,
    DollarSign,
    Package,
    ExternalLink
} from "lucide-react";

// Import components
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import Footer from "./Footer";

const CompanyProfile = () => {
    const { id } = useParams();
    const { data: business, isLoading, error } = useGetPublicBusinessInfoQuery(id);
    const { data: catalogsData } = useGetPublicCatalogsQuery(
        { userId: business?.user_id },
        { skip: !business?.user_id }
    );
    const catalogs = catalogsData?.catalogs || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#FF7B1D]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 size={24} className="text-[#FF7B1D]" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4 font-sans">
                <div className="bg-white p-8 rounded-sm mb-6 shadow-sm border border-gray-100">
                    <Building2 size={64} className="text-red-500 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
                <p className="text-gray-600 max-w-sm mb-8">The business profile you're looking for doesn't exist or has been removed.</p>
                <a href="/" className="bg-[#FF7B1D] text-white px-8 py-3 rounded-sm font-semibold shadow-md hover:bg-orange-600 transition-all">
                    Return Home
                </a>
            </div>
        );
    }

    const logoUrl = business.logo_url
        ? `${import.meta.env.VITE_API_BASE_URL.replace("/api/", "")}${business.logo_url}`
        : null;

    const getSocialIcon = (platform) => {
        switch (platform.toLowerCase()) {
            case "facebook": return <Facebook size={24} />;
            case "linkedin": return <Linkedin size={24} />;
            case "instagram": return <Instagram size={24} />;
            case "twitter":
            case "x": return <Twitter size={24} />;
            case "whatsapp": return (
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            );
            default: return <Globe size={24} />;
        }
    };

    const getSocialBgColor = (platform) => {
        switch (platform.toLowerCase()) {
            case "whatsapp": return "hover:bg-green-500 hover:text-white text-green-600 bg-green-50 border-green-100";
            case "facebook": return "hover:bg-blue-600 hover:text-white text-blue-700 bg-blue-50 border-blue-100";
            case "linkedin": return "hover:bg-blue-700 hover:text-white text-blue-800 bg-blue-50 border-blue-100";
            case "instagram": return "hover:bg-pink-600 hover:text-white text-pink-600 bg-pink-50 border-pink-100";
            case "youtube": return "hover:bg-red-600 hover:text-white text-red-600 bg-red-50 border-red-100";
            case "twitter":
            case "x": return "hover:bg-black hover:text-white text-gray-800 bg-gray-50 border-gray-200";
            default: return "hover:bg-[#FF7B1D] hover:text-white text-[#FF7B1D] bg-orange-50 border-orange-100";
        }
    };

    return (
        <div className="min-h-screen bg-white font-primary antialiased text-gray-800 mt-16">
            <Navbar business={business} logoUrl={logoUrl} />
            {/* Content Container */}
            <div className="bg-[#f8f9fa] py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">
                    {/* Header Card (Setup View Style) */}
                    <div className="bg-white rounded-sm shadow-md p-6 mb-6 border border-gray-100">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-32 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center p-4 shadow-sm overflow-hidden">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt={business.company_name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 size={64} className="text-[#FF7B1D]" />
                                    )}
                                </div>
                            </div>

                            {/* Info & Badges */}
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex flex-wrap flex-col md:flex-row md:items-center gap-3 mb-3">
                                    <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                                        {business.company_name}
                                    </h1>
                                    <div className="inline-flex items-center self-center md:self-auto gap-1.5 px-3 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-green-100">
                                        <CheckCircle size={14} />
                                        Verified Business
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-2 mb-6 text-sm text-gray-600 font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <Building2 size={16} className="text-[#FF7B1D]" />
                                        {business.industry || "Information Technology"}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={16} className="text-[#FF7B1D]" />
                                        {business.city}, {business.country}
                                    </div>
                                    {business.founded_year && (
                                        <div className="flex items-center gap-1.5">
                                            <Calendar size={16} className="text-[#FF7B1D]" />
                                            Since {business.founded_year}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                    {business.email && (
                                        <a href={`mailto:${business.email}`} className="bg-[#FF7B1D] text-white px-6 py-2.5 rounded-sm font-bold text-sm shadow-sm hover:bg-orange-600 transition-all flex items-center gap-2">
                                            <Mail size={16} />
                                            Contact Now
                                        </a>
                                    )}
                                    {business.website && (
                                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-sm font-bold text-sm hover:border-[#FF7B1D] hover:text-[#FF7B1D] transition-all flex items-center gap-2">
                                            <Globe size={16} />
                                            Visit Website
                                        </a>
                                    )}
                                    <button className="bg-gray-50 border border-gray-200 text-gray-600 px-6 py-2.5 rounded-sm font-bold text-sm hover:bg-gray-100 transition-all flex items-center gap-2">
                                        <Share2 size={16} />
                                        Share Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Info (2/3) */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Information */}
                            <div className="bg-white rounded-sm shadow-md p-8 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Building2 className="text-[#FF7B1D]" size={24} />
                                    Basic Information
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Company Name</label>
                                        <p className="text-gray-900 font-medium text-base">{business.company_name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Legal Name</label>
                                        <p className="text-gray-900 font-medium text-base">{business.legal_name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Industry</label>
                                        <div className="flex items-center gap-2">
                                            <Globe className="text-[#FF7B1D]" size={16} />
                                            <p className="text-gray-900 font-medium text-base">{business.industry || "Information Technology"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Business Type</label>
                                        <div className="flex items-center gap-2">
                                            <Award className="text-[#FF7B1D]" size={16} />
                                            <p className="text-gray-900 font-medium text-base">{business.business_type || "Private Limited Company"}</p>
                                        </div>
                                    </div>
                                    {business.registration_number && (
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Company Description</label>
                                            <p className="text-gray-700 leading-relaxed text-sm bg-gray-50/50 p-4 rounded-sm border border-gray-100">
                                                {business.company_description}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Products & Services */}
                            <div className="bg-white rounded-sm shadow-md p-8 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Package className="text-[#FF7B1D]" size={24} />
                                        Our Products & Services
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                        {catalogs?.length || 0} ITEMS AVAILABLE
                                    </span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {catalogs?.map((catalog) => (
                                        <div key={catalog.id} className="group bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-xl transition-all duration-300">
                                            <div className="aspect-video relative overflow-hidden bg-gray-50">
                                                <img
                                                    src={catalog.image}
                                                    alt={catalog.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-2 right-2">
                                                    <span className="bg-white/95 backdrop-blur-sm text-[#FF7B1D] text-[10px] font-black px-2 py-1 rounded-sm shadow-sm border border-orange-50 uppercase tracking-widest">
                                                        {catalog.category}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="p-5">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
                                                    {catalog.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed h-10">
                                                    {catalog.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Price Range</p>
                                                        <p className="text-lg font-bold text-gray-900">₹{catalog.maxPrice?.toLocaleString()}</p>
                                                    </div>
                                                    <a
                                                        href={`/catalog/view/${catalog.catalog_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 rounded-sm bg-orange-50 text-[#FF7B1D] flex items-center justify-center hover:bg-[#FF7B1D] hover:text-white transition-all border border-orange-100"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(!catalogs || catalogs.length === 0) && (
                                        <div className="col-span-full py-16 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-sm">
                                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500 font-bold text-sm uppercase tracking-widest">No service catalogs published yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Legal & Registration */}
                            <div className="bg-white rounded-sm shadow-md p-8 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FileText className="text-[#FF7B1D]" size={24} />
                                    Legal & Registration Details
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Founded Year</label>
                                        <div className="flex items-center gap-2 text-gray-900 font-medium text-base">
                                            <Calendar className="text-[#FF7B1D]" size={16} />
                                            {business.founded_year || "N/A"}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">Registration Number</label>
                                        <p className="text-gray-900 font-medium text-base font-mono bg-gray-50 px-3 py-1 border border-gray-100 inline-block rounded-sm">
                                            {business.registration_number || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">GST Number</label>
                                        <p className="text-gray-900 font-medium text-base font-mono bg-gray-50 px-3 py-1 border border-gray-100 inline-block rounded-sm">
                                            {business.gst_number || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">PAN Number</label>
                                        <p className="text-gray-900 font-medium text-base font-mono bg-gray-50 px-3 py-1 border border-gray-100 inline-block rounded-sm">
                                            {business.pan_number || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Vision & Mission */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-sm shadow-md p-8 border border-orange-200">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Target className="text-[#FF7B1D]" size={24} />
                                    Vision & Mission
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-sm font-bold text-[#FF7B1D] mb-3 flex items-center gap-2 uppercase tracking-widest">
                                            <Target size={18} />
                                            Our Vision
                                        </label>
                                        <p className="text-gray-800 italic leading-relaxed text-sm bg-white/60 p-5 rounded-sm border border-white/50 shadow-sm font-medium break-words">
                                            "{business.vision || "To be a globally recognized leader in our industry, driven by innovation, quality, and a commitment to excellence."}"
                                        </p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold text-[#FF7B1D] mb-3 flex items-center gap-2 uppercase tracking-widest">
                                            <Award size={18} />
                                            Our Mission
                                        </label>
                                        <p className="text-gray-800 italic leading-relaxed text-sm bg-white/60 p-5 rounded-sm border border-white/50 shadow-sm font-medium break-words">
                                            "{business.mission || "To provide exceptional value to our customers through dedicated service and superior product delivery."}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Sidebar (1/3) */}
                        <div className="space-y-6">
                            {/* Verification Badge */}
                            <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-5 flex items-center gap-2">
                                    <CheckCircle className="text-green-500" size={20} />
                                    Trust & Verification
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3.5 bg-green-50 rounded-sm border border-green-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm border border-green-50">
                                                <Mail size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">Email Address</span>
                                        </div>
                                        <CheckCircle className="text-green-600" size={18} />
                                    </div>
                                    <div className="flex items-center justify-between p-3.5 bg-green-50 rounded-sm border border-green-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm border border-green-50">
                                                <Phone size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">Phone Identity</span>
                                        </div>
                                        <CheckCircle className="text-green-600" size={18} />
                                    </div>
                                    <div className="flex items-center justify-between p-3.5 bg-green-50 rounded-sm border border-green-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm border border-green-50">
                                                <Building2 size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">GST Registration</span>
                                        </div>
                                        <CheckCircle className="text-green-600" size={18} />
                                    </div>
                                </div>
                            </div>

                            {/* Contact Sidebar */}
                            <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <Phone className="text-[#FF7B1D]" size={20} />
                                    Contact Information
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-sm bg-orange-50 flex items-center justify-center text-[#FF7B1D] shrink-0 border border-orange-100">
                                            <Mail size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                            <p className="text-gray-900 font-semibold text-sm break-all">{business.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-sm bg-orange-50 flex items-center justify-center text-[#FF7B1D] shrink-0 border border-orange-100">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mobile Hotline</p>
                                            <p className="text-gray-900 font-semibold text-sm">{business.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-sm bg-orange-50 flex items-center justify-center text-[#FF7B1D] shrink-0 border border-orange-100">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Headquarters</p>
                                            <p className="text-gray-900 font-semibold text-sm leading-relaxed">
                                                {business.street_address ? (
                                                    <>
                                                        {business.street_address},<br />
                                                        {business.city}, {business.state} {business.pincode}<br />
                                                        <span className="text-[#FF7B1D] font-bold">{business.country}</span>
                                                    </>
                                                ) : "Not Disclosed"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Banking (Public View) */}
                            <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100">
                                <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <DollarSign className="text-[#FF7B1D]" size={20} />
                                    Banking Information
                                </h2>
                                <div className="space-y-4">
                                    <div className="bg-gray-50 border border-gray-100 p-4 rounded-sm">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bank Name</p>
                                        <p className="text-gray-900 font-bold text-sm mb-1">{business.bank_name || "N/A"}</p>
                                        <p className="text-[10px] font-bold text-[#FF7B1D] bg-white px-2 py-0.5 border border-orange-100 inline-block rounded-sm uppercase">{business.branch_name || "Main Branch"}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-sm">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">IFSC Code</p>
                                            <p className="text-gray-900 font-bold text-xs tracking-tight">{business.ifsc_code || "N/A"}</p>
                                        </div>
                                        <div className="bg-gray-50 border border-gray-100 p-3 rounded-sm">
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account No.</p>
                                            <p className="text-gray-900 font-bold text-xs tracking-widest">
                                                {business.account_number ? `...${business.account_number.slice(-4)}` : "N/A"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Presence */}
                            {business.social_links?.length > 0 && (
                                <div className="bg-white rounded-sm shadow-md p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                                        <Share2 className="text-[#FF7B1D]" size={20} />
                                        Connect With Us
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {business.social_links.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-11 h-11 rounded-sm border flex items-center justify-center transition-all duration-300 hover:shadow-lg shadow-sm ${getSocialBgColor(link.platform)}`}
                                                title={link.platform}
                                            >
                                                {getSocialIcon(link.platform)}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer business={business} logoUrl={logoUrl} />
        </div>
    );
};

export default CompanyProfile;

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
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50">
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#FF7B1D]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Building2 size={24} className="text-[#FF7B1D] animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !business) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 text-center p-4">
                <div className="bg-white p-8 rounded-2xl mb-6 shadow-2xl">
                    <Building2 size={64} className="text-red-500 mx-auto" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
                <p className="text-gray-600 max-w-sm mb-8">The business profile you're looking for doesn't exist or has been removed.</p>
                <a href="/" className="bg-[#FF7B1D] text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:bg-orange-600 transition-all">
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
            default: return "hover:bg-orange-600 hover:text-white text-orange-600 bg-orange-50 border-orange-100";
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            <Navbar business={business} logoUrl={logoUrl} />
            <HeroSection business={business} logoUrl={logoUrl} />

            {/* Dashboard Reference Sections */}
            <div className="bg-gray-50/50 py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column - Main Info (2/3) */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Basic Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <Building2 className="text-[#FF7B1D]" size={28} />
                                    Business Overview
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Company Name</p>
                                        <p className="text-gray-800 font-medium text-sm">{business.company_name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Legal Name</p>
                                        <p className="text-gray-800 font-medium text-sm">{business.legal_name || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Industry</p>
                                        <div className="flex items-center gap-2">
                                            <Globe className="text-[#FF7B1D]" size={16} />
                                            <p className="text-gray-800 font-medium text-sm">{business.industry || "Information Technology"}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Business Type</p>
                                        <div className="flex items-center gap-2">
                                            <Award className="text-[#FF7B1D]" size={16} />
                                            <p className="text-gray-800 font-medium text-sm">{business.business_type || "Private Limited"}</p>
                                        </div>
                                    </div>
                                    {business.registration_number && (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Registration No.</p>
                                            <p className="text-gray-800 font-medium text-sm font-mono">{business.registration_number}</p>
                                        </div>
                                    )}
                                    {business.founded_year && (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Founded Year</p>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="text-[#FF7B1D]" size={16} />
                                                <p className="text-gray-800 font-medium text-sm">{business.founded_year}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* About Company */}
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                    <FileText className="text-[#FF7B1D]" size={28} />
                                    About {business.company_name}
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-lg italic bg-gray-50 p-6 rounded-xl border-l-4 border-orange-400">
                                    "{business.company_description || "We are a technology-driven company committed to excellence and innovation in our field."}"
                                </p>
                            </div>

                            {/* Products & Services */}
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Package className="text-[#FF7B1D]" size={28} />
                                        Our Products & Services
                                    </div>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                        {catalogs?.length || 0} Items
                                    </span>
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {catalogs?.map((catalog) => (
                                        <div key={catalog.id} className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-orange-200 transition-all duration-300">
                                            {/* Image */}
                                            <div className="aspect-video relative overflow-hidden bg-gray-100">
                                                <img
                                                    src={catalog.image}
                                                    alt={catalog.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <span className="bg-white/90 backdrop-blur-sm text-[#FF7B1D] text-[10px] font-black px-3 py-1.5 rounded-full shadow-sm border border-orange-50 uppercase tracking-wider">
                                                        {catalog.category}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-[#FF7B1D] transition-colors">
                                                    {catalog.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-4 leading-relaxed min-h-[40px]">
                                                    {catalog.description}
                                                </p>

                                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                    <div>
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Starting From</p>
                                                        <p className="text-lg font-black text-gray-900">₹{catalog.minPrice?.toLocaleString()}</p>
                                                    </div>
                                                    <a
                                                        href={`/catalog/view/${catalog.catalog_id}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-10 h-10 rounded-xl bg-orange-50 text-[#FF7B1D] flex items-center justify-center hover:bg-[#FF7B1D] hover:text-white transition-all shadow-sm"
                                                    >
                                                        <ExternalLink size={18} />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(!catalogs || catalogs.length === 0) && (
                                        <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <Package size={48} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-500 font-bold text-sm">No services listed yet.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Legal & Registration */}
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <FileText className="text-[#FF7B1D]" size={28} />
                                    Legal & Registration
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Registration Number</p>
                                        <p className="text-gray-800 font-medium text-sm bg-gray-50 px-4 py-2 rounded-sm border border-gray-100 inline-block font-mono">
                                            {business.registration_number || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">GST Number</p>
                                        <p className="text-gray-800 font-medium text-sm bg-gray-50 px-4 py-2 rounded-sm border border-gray-100 inline-block font-mono">
                                            {business.gst_number || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">PAN Number</p>
                                        <p className="text-gray-800 font-medium text-sm bg-gray-50 px-4 py-2 rounded-sm border border-gray-100 inline-block font-mono">
                                            {business.pan_number || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Founded Year</p>
                                        <div className="flex items-center gap-2 text-gray-800 font-medium text-sm">
                                            <Calendar className="text-[#FF7B1D]" size={16} />
                                            {business.founded_year || "N/A"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Banking Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <DollarSign className="text-[#FF7B1D]" size={28} />
                                    Financial Handshake
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">Bank Name</p>
                                        <p className="text-gray-800 font-medium text-sm">{business.bank_name || "N/A"}</p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">{business.branch_name || "Main Branch"}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-2">IFSC CODE</p>
                                        <p className="text-gray-800 font-medium text-sm font-mono tracking-tighter">{business.ifsc_code || "N/A"}</p>
                                    </div>
                                    <div className="sm:col-span-2 bg-gray-50 border border-gray-100 p-5 rounded-sm flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-1">Account Number</p>
                                            <p className="text-gray-800 font-medium text-sm font-mono tracking-widest">
                                                {business.account_number ? `XXXX-XXXX-${business.account_number.slice(-4)}` : "N/A"}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block">
                                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-gray-400 shadow-sm border border-gray-50">
                                                <Target size={20} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Vision & Mission */}
                            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl shadow-sm p-8 border border-orange-200">
                                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                                    <Target className="text-[#FF7B1D]" size={28} />
                                    Vision & Mission
                                </h2>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Target size={18} className="text-orange-500" />
                                            Vision
                                        </p>
                                        <p className="text-gray-800 italic leading-relaxed text-sm break-words bg-white/50 p-4 rounded-xl border border-orange-50">
                                            "{business.vision || "To be the leading global provider of innovative solutions that empower businesses to thrive in a digital world."}"
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Award size={18} className="text-orange-500" />
                                            Mission
                                        </p>
                                        <p className="text-gray-800 italic leading-relaxed text-sm break-words bg-white/50 p-4 rounded-xl border border-orange-50">
                                            "{business.mission || "To deliver high-quality products and services that create sustainable value for our clients and the communities we serve."}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Contact & Status (1/3) */}
                        <div className="space-y-8">
                            {/* Verification Status */}
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8 overflow-hidden">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CheckCircle className="text-green-500" size={22} />
                                    Verification Tracker
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm">
                                                <Mail size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">Email Verified</span>
                                        </div>
                                        <CheckCircle className="text-green-600 group-hover:scale-110 transition-transform" size={18} />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm">
                                                <Phone size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">Phone Verified</span>
                                        </div>
                                        <CheckCircle className="text-green-600 group-hover:scale-110 transition-transform" size={18} />
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-green-600 shadow-sm">
                                                <FileText size={14} />
                                            </div>
                                            <span className="text-sm font-bold text-gray-700">GST Verified</span>
                                        </div>
                                        <CheckCircle className="text-green-600 group-hover:scale-110 transition-transform" size={18} />
                                    </div>
                                    <div className="pt-2">
                                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-3">
                                            <Award className="text-orange-600" size={18} />
                                            <span className="text-xs font-bold text-orange-900 uppercase">Trusted Platinum Partner</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Details */}
                            <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Phone className="text-[#FF7B1D]" size={22} />
                                    Contact Details
                                </h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF7B1D] shrink-0 border border-orange-100">
                                            <Mail size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-1">Email Address</p>
                                            <p className="text-gray-800 font-medium text-sm break-all">{business.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF7B1D] shrink-0 border border-orange-100">
                                            <Phone size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-1">Phone Number</p>
                                            <p className="text-gray-800 font-medium text-sm">{business.phone || "N/A"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF7B1D] shrink-0 border border-orange-100">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700 mb-1">Headquarters</p>
                                            <p className="text-gray-800 font-medium text-sm leading-snug">
                                                {business.street_address ? (
                                                    <>
                                                        {business.street_address},<br />
                                                        {business.city}, {business.state} {business.pincode}<br />
                                                        {business.country}
                                                    </>
                                                ) : "Not Disclosed"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Presence */}
                            {business.social_links?.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Share2 className="text-[#FF7B1D]" size={22} />
                                        Connect With Us
                                    </h3>
                                    <div className="flex flex-wrap gap-4">
                                        {business.social_links.map((link, idx) => (
                                            <a
                                                key={idx}
                                                href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm ${getSocialBgColor(link.platform)}`}
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


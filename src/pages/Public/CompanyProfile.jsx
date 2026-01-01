import React from "react";
import { useParams } from "react-router-dom";
import { useGetPublicBusinessInfoQuery } from "../../store/api/businessApi";
import { Building2 } from "lucide-react";

// Import components
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import VisionMissionSection from "./VisionMissionSection";
import CompanyInfoSection from "./CompanyInfoSection";
import ContactSection from "./ContactSection";
import Footer from "./Footer";

const CompanyProfile = () => {
    const { id } = useParams();
    const { data: business, isLoading, error } = useGetPublicBusinessInfoQuery(id);

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

    return (
        <div className="min-h-screen bg-white font-sans antialiased">
            <Navbar business={business} logoUrl={logoUrl} />
            <HeroSection business={business} logoUrl={logoUrl} />
            <VisionMissionSection business={business} />
            <CompanyInfoSection business={business} />
            <ContactSection business={business} />
            <Footer business={business} logoUrl={logoUrl} />
        </div>
    );
};

export default CompanyProfile;

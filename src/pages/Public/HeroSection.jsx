import React from "react";
import {
    Building2,
    Globe2,
    Calendar,
    Briefcase,
    Mail,
    ExternalLink,
    ShieldCheck,
    CheckCircle2,
    Award,
    Target,
} from "lucide-react";

const HeroSection = ({ business, logoUrl }) => {
    return (
        <section id="about" className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50/30 relative overflow-hidden min-h-screen flex items-center">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                <div className="absolute top-1/4 -left-48 w-96 h-96 bg-orange-200 rounded-full opacity-40 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-orange-300 rounded-full opacity-40 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'linear-gradient(#FF7B1D 1px, transparent 1px), linear-gradient(90deg, #FF7B1D 1px, transparent 1px)',
                        backgroundSize: '50px 50px'
                    }}></div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div className="text-gray-900 space-y-6 sm:space-y-8">
                        {/* Logo Badge */}
                        <div className="inline-flex items-center gap-3 bg-white border border-orange-200 px-4 py-2 rounded-full shadow-md">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-lg flex items-center justify-center">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={business.company_name} className="w-full h-full object-contain rounded-lg p-0.5" />
                                ) : (
                                    <Building2 size={16} className="text-white" />
                                )}
                            </div>
                            <span className="text-sm font-semibold text-gray-700">Verified Business</span>
                        </div>

                        {/* Company Name */}
                        <div>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight text-gray-900">
                                {business.company_name}
                            </h1>
                            <div className="h-1.5 w-20 sm:w-24 bg-gradient-to-r from-[#FF7B1D] to-orange-600 rounded-full"></div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-3">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <Globe2 size={16} className="text-[#FF7B1D]" />
                                {business.industry}
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <Calendar size={16} className="text-[#FF7B1D]" />
                                Est. {business.founded_year}
                            </span>
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <Briefcase size={16} className="text-[#FF7B1D]" />
                                {business.business_type}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                            {business.company_description || "A leading organization committed to excellence, innovation, and delivering exceptional value to our clients and partners worldwide."}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-4">
                            <a href={`mailto:${business.email}`} className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all shadow-lg">
                                <Mail size={20} />
                                Get in Touch
                            </a>
                            <a href={business.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:border-[#FF7B1D] hover:text-[#FF7B1D] transition-all shadow-sm">
                                <ExternalLink size={20} />
                                Visit Website
                            </a>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="relative lg:h-[600px] h-[350px] sm:h-[450px] group mt-8 lg:mt-0">
                        {/* Main Image Container */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                                alt="Business"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent"></div>
                        </div>

                        {/* Floating Card */}
                        <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 bg-white/95 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-2xl">
                            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                    <ShieldCheck size={20} className="text-white sm:w-6 sm:h-6" />
                                </div>
                                <div>
                                    <p className="text-gray-900 font-bold text-base sm:text-lg">Certified & Trusted</p>
                                    <p className="text-gray-600 text-xs sm:text-sm">Reg. #{business.registration_number}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                                <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-2 sm:p-3 text-center">
                                    <CheckCircle2 size={18} className="text-[#FF7B1D] mx-auto mb-1 sm:w-5 sm:h-5" />
                                    <p className="text-[10px] sm:text-xs text-gray-700 font-semibold">Verified</p>
                                </div>
                                <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-2 sm:p-3 text-center">
                                    <Award size={18} className="text-[#FF7B1D] mx-auto mb-1 sm:w-5 sm:h-5" />
                                    <p className="text-[10px] sm:text-xs text-gray-700 font-semibold">Certified</p>
                                </div>
                                <div className="flex-1 bg-orange-50 border border-orange-100 rounded-lg p-2 sm:p-3 text-center">
                                    <Target size={18} className="text-[#FF7B1D] mx-auto mb-1 sm:w-5 sm:h-5" />
                                    <p className="text-[10px] sm:text-xs text-gray-700 font-semibold">Trusted</p>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-200 rounded-full opacity-50 blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-300 rounded-full opacity-50 blur-2xl"></div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator - Hidden on mobile */}
            <div className="hidden sm:block absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

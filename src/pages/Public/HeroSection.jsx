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
        <section id="about" className="relative min-h-[70vh] flex items-center justify-center pt-28 pb-12 px-4 overflow-hidden bg-white">
            {/* Background Aesthetics - Simplified */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[#f8f9fa] opacity-40"></div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-50/30 to-transparent"></div>

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: 'linear-gradient(#FF7B1D 1px, transparent 1px), linear-gradient(90deg, #FF7B1D 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:text-left text-center">

                    {/* Left Side: Logo & Essential Badges */}
                    <div className="flex-shrink-0">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-orange-100 to-orange-50 rounded-sm blur-sm opacity-50"></div>
                            <div className="relative w-40 h-40 bg-white rounded-sm shadow-xl flex items-center justify-center p-5 border border-gray-100 overflow-hidden">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={business.company_name} className="w-full h-full object-contain" />
                                ) : (
                                    <Building2 size={64} className="text-[#FF7B1D]" />
                                )}
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col items-center lg:items-start gap-3">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-widest rounded-sm border border-green-100">
                                <ShieldCheck size={14} />
                                Verified Business
                            </div>
                            {business.founded_year && (
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 text-[#FF7B1D] text-[10px] font-bold uppercase tracking-widest rounded-sm border border-orange-100">
                                    <Calendar size={14} />
                                    Since {business.founded_year}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Content & Headline */}
                    <div className="flex-1 space-y-6 max-w-3xl">
                        <div className="space-y-4">
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                                {business.industry && (
                                    <span className="text-[10px] font-bold text-[#FF7B1D] uppercase tracking-[0.2em] bg-orange-50 px-2 py-0.5 rounded-sm">
                                        {business.industry} / {business.business_type || "Commercial"}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                                {business.company_name}
                            </h1>

                            {business.company_description && (
                                <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                                    {business.company_description}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            {business.email && (
                                <a href={`mailto:${business.email}`} className="px-10 py-4 bg-[#FF7B1D] text-white rounded-sm font-bold text-base hover:bg-orange-600 hover:shadow-lg transition-all flex items-center gap-2 active:scale-95 group">
                                    <Mail size={18} />
                                    Contact Business
                                </a>
                            )}
                            {business.website && (
                                <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-white border border-gray-200 text-gray-800 rounded-sm font-bold text-base hover:border-[#FF7B1D] hover:text-[#FF7B1D] hover:shadow-md transition-all flex items-center gap-2 active:scale-95">
                                    <Globe2 size={18} />
                                    Visit Website
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;

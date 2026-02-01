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
        <section id="about" className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-0 px-4 overflow-hidden bg-white">
            {/* Background Aesthetics */}
            <div className="absolute inset-0 z-0">
                {/* Large Soft Glows */}
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-100/40 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-50/40 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: 'linear-gradient(#FF7B1D 1px, transparent 1px), linear-gradient(90deg, #FF7B1D 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}></div>
            </div>

            <div className="max-w-5xl mx-auto relative z-10 text-center">
                {/* Profile Badge & Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative group mb-8">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-[32px] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative w-28 h-28 bg-white rounded-[28px] shadow-2xl flex items-center justify-center p-3 border border-orange-50">
                            {logoUrl ? (
                                <img src={logoUrl} alt={business.company_name} className="w-full h-full object-contain" />
                            ) : (
                                <Building2 size={48} className="text-[#FF7B1D]" />
                            )}
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-orange-50/80 backdrop-blur-sm border border-orange-100 rounded-full text-[#FF7B1D] text-[11px] font-black uppercase tracking-[0.2em] shadow-sm">
                        <ShieldCheck size={14} />
                        Verified Business Account
                    </div>
                </div>

                {/* Main Content */}
                <div className="space-y-6 mb-12">
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-[900] text-gray-900 tracking-tight leading-[1.05]">
                        {business.company_name}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-3">
                        {business.industry && (
                            <span className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-2 shadow-sm">
                                <Globe2 size={16} className="text-[#FF7B1D]" />
                                {business.industry}
                            </span>
                        )}
                        {business.founded_year && (
                            <span className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-2 shadow-sm">
                                <Calendar size={16} className="text-[#FF7B1D]" />
                                Established In {business.founded_year}
                            </span>
                        )}
                        {business.business_type && (
                            <span className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold text-gray-600 flex items-center gap-2 shadow-sm">
                                <Briefcase size={16} className="text-[#FF7B1D]" />
                                {business.business_type}
                            </span>
                        )}
                    </div>

                    {business.company_description && (
                        <p className="text-xl md:text-2xl text-gray-500 leading-relaxed max-w-3xl mx-auto font-medium py-2">
                            {business.company_description}
                        </p>
                    )}
                </div>

                {/* Primary Actions */}
                <div className="flex flex-wrap justify-center gap-5 mb-24">
                    {business.email && (
                        <a href={`mailto:${business.email}`} className="px-12 py-5 bg-[#FF7B1D] text-white rounded-2xl font-black text-lg hover:bg-orange-600 hover:shadow-[0_20px_40px_-15px_rgba(255,123,29,0.3)] transition-all flex items-center gap-3 active:scale-95 group">
                            <Mail size={22} className="group-hover:translate-x-1 transition-transform" />
                            Direct Contact
                        </a>
                    )}
                    {business.website && (
                        <a href={business.website.startsWith('http') ? business.website : `https://${business.website}`} target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-black text-lg hover:border-[#FF7B1D] hover:text-[#FF7B1D] hover:shadow-xl transition-all flex items-center gap-3 active:scale-95">
                            <ExternalLink size={22} />
                            Launch Website
                        </a>
                    )}
                </div>

                {/* Trust Verification Bar */}

            </div>


        </section>
    );
};

export default HeroSection;

import React, { useState } from "react";
import { Mail, Building2, Menu, X } from "lucide-react";

const Navbar = ({ business, logoUrl }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-full mx-auto">
                    <div className="flex justify-between items-center h-16 lg:h-18">
                        {/* Logo & Brand */}
                        <div className="flex items-center gap-3 lg:gap-4">
                            <div className="w-10 h-10 lg:w-11 lg:h-11 bg-white border border-gray-100 rounded-sm flex items-center justify-center shadow-sm overflow-hidden hover:border-orange-500 transition-colors">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={business.company_name} className="w-full h-full object-contain p-1.5" />
                                ) : (
                                    <span className="text-base lg:text-lg font-black bg-gradient-to-br from-[#FF7B1D] to-orange-600 bg-clip-text text-transparent">
                                        {business.company_name?.substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="font-bold text-base lg:text-lg text-gray-900 block leading-tight tracking-tight">
                                    {business.company_name}
                                </span>
                                <span className="text-[10px] font-bold text-[#FF7B1D] uppercase tracking-widest hidden sm:block opacity-80">{business.industry}</span>
                            </div>
                        </div>

                        {/* Header Action Button */}
                        <div className="flex items-center gap-3">
                            {business.email && (
                                <a
                                    href={`mailto:${business.email}`}
                                    className="bg-[#FF7B1D] text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-sm text-[12px] lg:text-sm font-bold hover:bg-orange-600 shadow-sm transition-all flex items-center gap-2 group whitespace-nowrap"
                                >
                                    <Mail size={16} className="group-hover:scale-110 transition-transform" />
                                    <span className="">Get in Touch</span>
                                </a>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import React, { useState } from "react";
import { Mail, Building2, Menu, X } from "lucide-react";

const Navbar = ({ business, logoUrl }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="max-w-[1400px] mx-auto">
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

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex items-center gap-8">
                            {business.email && (
                                <a href={`mailto:${business.email}`} className="bg-[#FF7B1D] text-white px-6 py-2.5 rounded-sm text-sm font-bold hover:bg-orange-600 shadow-sm transition-all flex items-center gap-2">
                                    <Mail size={16} />
                                    Get in Touch
                                </a>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-2 rounded-sm hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? (
                                <X size={24} className="text-gray-900" />
                            ) : (
                                <Menu size={24} className="text-gray-900" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden py-4 border-t border-gray-100 animate-fadeIn text-center">
                            <div className="flex flex-col space-y-4">
                                <a
                                    href="#about"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm font-semibold text-gray-700 hover:text-[#FF7B1D] transition-colors py-2"
                                >
                                    About
                                </a>
                                {(business.vision || business.mission) && (
                                    <a
                                        href="#vision"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-sm font-semibold text-gray-700 hover:text-[#FF7B1D] transition-colors py-2"
                                    >
                                        Vision
                                    </a>
                                )}
                                {(business.email || business.phone) && (
                                    <a
                                        href="#contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-sm font-semibold text-gray-700 hover:text-[#FF7B1D] transition-colors py-2"
                                    >
                                        Contact
                                    </a>
                                )}
                                {business.email && (
                                    <a
                                        href={`mailto:${business.email}`}
                                        className="bg-[#FF7B1D] text-white px-6 py-3 rounded-sm text-sm font-bold hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Mail size={18} />
                                        Get in Touch
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

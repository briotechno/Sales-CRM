import React, { useState } from "react";
import { Mail, Building2, Menu, X } from "lucide-react";

const Navbar = ({ business, logoUrl }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">
                    {/* Logo & Brand */}
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl flex items-center justify-center shadow-lg overflow-hidden hover:scale-105 transition-transform">
                            {logoUrl ? (
                                <img src={logoUrl} alt={business.company_name} className="w-full h-full object-contain p-1" />
                            ) : (
                                <span className="text-base lg:text-lg font-black bg-gradient-to-br from-[#FF7B1D] to-orange-600 bg-clip-text text-transparent">
                                    {business.company_name?.substring(0, 2).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <span className="font-bold text-base lg:text-xl text-gray-900 block leading-tight">
                                {business.company_name}
                            </span>
                            <span className="text-xs text-gray-500 font-medium hidden sm:block">{business.industry}</span>
                        </div>
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-8">
                        {/* <a href="#about" className="text-sm font-semibold text-gray-700 hover:text-[#FF7B1D] transition-colors relative group">
                            About
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF7B1D] group-hover:w-full transition-all"></span>
                        </a>
                        {(business.vision || business.mission) && (
                            <a href="#vision" className="text-sm font-semibold text-gray-700 hover:text-[#FF7B1D] transition-colors relative group">
                                Vision
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF7B1D] group-hover:w-full transition-all"></span>
                            </a>
                        )} */}
                        {/* {(business.email || business.phone) && (
                            <a href="#contact" className="text-sm font-semibold text-gray-700 hover:text-[#FF7B1D] transition-colors relative group">
                                Contact
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FF7B1D] group-hover:w-full transition-all"></span>
                            </a>
                        )} */}
                        {business.email && (
                            <a href={`mailto:${business.email}`} className="bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                                <Mail size={16} />
                                Get in Touch
                            </a>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
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
                    <div className="lg:hidden py-4 border-t border-gray-200 animate-fadeIn text-center">
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
                                    className="bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                                >
                                    <Mail size={16} />
                                    Get in Touch
                                </a>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;


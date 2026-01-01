import React from "react";
import { MapPin, Mail, Phone, Linkedin, Facebook, Twitter, Instagram, ChevronRight, Building2 } from "lucide-react";

const Footer = ({ business, logoUrl }) => {
    return (
        <footer className="bg-white border-t-2 border-gray-100 text-gray-900 relative overflow-hidden">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, #FF7B1D 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid md:grid-cols-3 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl flex items-center justify-center overflow-hidden shadow-lg">
                                {logoUrl ? (
                                    <img src={logoUrl} alt={business.company_name} className="w-full h-full object-contain p-1" />
                                ) : (
                                    <span className="text-lg font-black bg-gradient-to-br from-[#FF7B1D] to-orange-600 bg-clip-text text-transparent">
                                        {business.company_name?.substring(0, 2).toUpperCase()}
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="font-bold text-2xl text-gray-900 block leading-tight">
                                    {business.company_name}
                                </span>
                                <span className="text-sm text-gray-500">{business.industry}</span>
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {business.company_description?.substring(0, 120) || "Building excellence through innovation and dedication."}...
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-gray-900 font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <a href="#about" className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm flex items-center gap-2">
                                    <ChevronRight size={16} />
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a href="#vision" className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm flex items-center gap-2">
                                    <ChevronRight size={16} />
                                    Vision & Mission
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm flex items-center gap-2">
                                    <ChevronRight size={16} />
                                    Contact
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm flex items-center gap-2">
                                    <ChevronRight size={16} />
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-gray-900 font-bold text-lg mb-6">Contact Info</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#FF7B1D] shrink-0 mt-0.5" />
                                <span className="text-gray-600 text-sm">
                                    {business.city}, {business.state}
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail size={18} className="text-[#FF7B1D] shrink-0 mt-0.5" />
                                <a href={`mailto:${business.email}`} className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm">
                                    {business.email}
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Phone size={18} className="text-[#FF7B1D] shrink-0 mt-0.5" />
                                <a href={`tel:${business.phone}`} className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm">
                                    {business.phone}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} {business.company_name}. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { icon: Linkedin, href: '#' },
                                { icon: Facebook, href: '#' },
                                { icon: Twitter, href: '#' },
                                { icon: Instagram, href: '#' },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center text-[#FF7B1D] hover:bg-[#FF7B1D] hover:text-white transition-all hover:scale-110 shadow-sm"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

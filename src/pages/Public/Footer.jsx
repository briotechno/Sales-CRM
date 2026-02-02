import React from "react";
import { MapPin, Mail, Phone, Linkedin, Facebook, Twitter, Instagram, ChevronRight, Building2, Globe } from "lucide-react";

const Footer = ({ business, logoUrl }) => {
    const allSocialLinks = [];
    if (Array.isArray(business.social_links)) {
        business.social_links.forEach(l => {
            if (l.url) allSocialLinks.push({ platform: l.platform, url: l.url });
        });
    }
    const platformsInDynamic = new Set(allSocialLinks.map(l => l.platform.toLowerCase()));
    if (business.linkedin_link && !platformsInDynamic.has('linkedin')) allSocialLinks.push({ platform: 'LinkedIn', url: business.linkedin_link });
    if (business.facebook_link && !platformsInDynamic.has('facebook')) allSocialLinks.push({ platform: 'Facebook', url: business.facebook_link });
    if (business.instagram_link && !platformsInDynamic.has('instagram')) allSocialLinks.push({ platform: 'Instagram', url: business.instagram_link });
    if (business.youtube_link && !platformsInDynamic.has('youtube')) allSocialLinks.push({ platform: 'YouTube', url: business.youtube_link });
    if (business.twitter_link && !platformsInDynamic.has('twitter') && !platformsInDynamic.has('x')) allSocialLinks.push({ platform: 'Twitter', url: business.twitter_link });
    if (business.whatsapp_link && !platformsInDynamic.has('whatsapp')) allSocialLinks.push({ platform: 'WhatsApp', url: business.whatsapp_link });

    const hasContent = business.company_name || business.email || business.phone || (allSocialLinks.length > 0);
    if (!hasContent) return null;

    return (
        <footer className="bg-[#111111] text-white relative overflow-hidden">
            {/* Minimal Dark Background Accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 transition-all">
                <div className="grid md:grid-cols-2 gap-12 mb-6">
                    {/* Brand Section */}
                    {business.company_name && (
                        <div className="space-y-4 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center overflow-hidden shadow-2xl backdrop-blur-sm group-hover:border-orange-500/50 transition-all">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt={business.company_name} className="w-full h-full object-contain p-1.5" />
                                    ) : (
                                        <Building2 className="text-[#FF7B1D]" size={24} />
                                    )}
                                </div>
                                <div>
                                    <span className="font-bold text-xl text-white block leading-tight tracking-tight">
                                        {business.company_name}
                                    </span>
                                    {business.industry && <span className="text-[10px] font-bold text-[#FF7B1D] uppercase tracking-[0.2em] opacity-80">{business.industry}</span>}
                                </div>
                            </div>
                            {business.company_description && (
                                <p className="text-gray-400 text-xs leading-relaxed max-w-md italic opacity-90 mx-auto md:mx-0">
                                    {business.company_description.length > 100 ? `${business.company_description.substring(0, 100)}...` : business.company_description}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Contact Info - Simplified and Right Aligned on MD */}
                    {(business.email || business.phone || business.city) && (
                        <div className="md:text-right flex flex-col md:items-end justify-center">
                            <ul className="space-y-3">
                                {(business.city || business.state) && (
                                    <li className="flex items-center justify-center md:justify-end gap-3 group">
                                        <span className="text-gray-400 text-xs group-hover:text-white transition-colors">
                                            {business.city}{business.city && business.state && ', '} {business.state}
                                        </span>
                                        <MapPin size={14} className="text-[#FF7B1D] shrink-0 opacity-70 group-hover:opacity-100" />
                                    </li>
                                )}
                                {business.email && (
                                    <li className="flex items-center justify-center md:justify-end gap-3 group">
                                        <a href={`mailto:${business.email}`} className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                                            {business.email}
                                        </a>
                                        <Mail size={14} className="text-[#FF7B1D] shrink-0 opacity-70 group-hover:opacity-100" />
                                    </li>
                                )}
                                {business.phone && (
                                    <li className="flex items-center justify-center md:justify-end gap-3 group">
                                        <a href={`tel:${business.phone}`} className="text-gray-400 hover:text-white transition-colors text-xs font-medium">
                                            {business.phone}
                                        </a>
                                        <Phone size={14} className="text-[#FF7B1D] shrink-0 opacity-70 group-hover:opacity-100" />
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Bottom Bar - Centered & Compact */}
                <div className="pt-6 border-t border-white/5 flex justify-center items-center">
                    <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} {business.company_name || 'Business'}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

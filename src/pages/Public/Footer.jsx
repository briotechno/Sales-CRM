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
                    {business.company_name && (
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
                                    {business.industry && <span className="text-sm text-gray-500">{business.industry}</span>}
                                </div>
                            </div>
                            {business.company_description && (
                                <p className="text-gray-600 text-sm leading-relaxed break-words whitespace-pre-wrap">
                                    {business.company_description.length > 150 ? `${business.company_description.substring(0, 150)}...` : business.company_description}
                                </p>
                            )}
                        </div>
                    )}

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
                            {(business.vision || business.mission) && (
                                <li>
                                    <a href="#vision" className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm flex items-center gap-2">
                                        <ChevronRight size={16} />
                                        Vision & Mission
                                    </a>
                                </li>
                            )}
                            {(business.email || business.phone) && (
                                <li>
                                    <a href="#contact" className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm flex items-center gap-2">
                                        <ChevronRight size={16} />
                                        Contact
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    {(business.email || business.phone || business.city) && (
                        <div>
                            <h3 className="text-gray-900 font-bold text-lg mb-6">Contact Info</h3>
                            <ul className="space-y-4">
                                {(business.city || business.state) && (
                                    <li className="flex items-start gap-3">
                                        <MapPin size={18} className="text-[#FF7B1D] shrink-0 mt-0.5" />
                                        <span className="text-gray-600 text-sm">
                                            {business.city}{business.city && business.state && ', '} {business.state}
                                        </span>
                                    </li>
                                )}
                                {business.email && (
                                    <li className="flex items-start gap-3">
                                        <Mail size={18} className="text-[#FF7B1D] shrink-0 mt-0.5" />
                                        <a href={`mailto:${business.email}`} className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm break-all">
                                            {business.email}
                                        </a>
                                    </li>
                                )}
                                {business.phone && (
                                    <li className="flex items-start gap-3">
                                        <Phone size={18} className="text-[#FF7B1D] shrink-0 mt-0.5" />
                                        <a href={`tel:${business.phone}`} className="text-gray-600 hover:text-[#FF7B1D] transition-colors text-sm">
                                            {business.phone}
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} {business.company_name || 'Business'}. All rights reserved.
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                            {allSocialLinks.map((link, idx) => {
                                const platform = link.platform.toLowerCase();
                                let Icon = Globe;
                                if (platform === 'linkedin') Icon = Linkedin;
                                else if (platform === 'facebook') Icon = Facebook;
                                else if (platform === 'twitter' || platform === 'x') Icon = Twitter;
                                else if (platform === 'instagram') Icon = Instagram;

                                const url = (platform === 'whatsapp' && !link.url.startsWith('http'))
                                    ? `https://wa.me/${link.url}`
                                    : link.url;

                                return (
                                    <a
                                        key={idx}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center text-[#FF7B1D] hover:bg-[#FF7B1D] hover:text-white transition-all hover:scale-110 shadow-sm"
                                        title={link.platform}
                                    >
                                        {platform === 'youtube' ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                            </svg>
                                        ) : platform === 'whatsapp' ? (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        ) : (
                                            <Icon size={18} />
                                        )}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

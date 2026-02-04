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

            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 transition-all text-center">
                <div className="mb-4 flex justify-center">
                    <a href="#" className="text-[#FF7B1D] hover:text-white text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">Careers</a>
                </div>

                <div className="w-8 h-[1px] bg-white/10 mx-auto mb-4"></div>

                {/* Bottom Bar - Centered & Compact */}
                <p className="text-white text-[10px] font-semibold uppercase tracking-[0.2em]">
                    &copy; {new Date().getFullYear()} {business.company_name || 'Business'}. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;

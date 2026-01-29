import React from "react";
import { Mail, MapPin, Phone, Linkedin, Facebook, Twitter, Instagram, Globe, Users } from "lucide-react";

const ContactSection = ({ business }) => {
    const hasAddress = business.street_address || business.city || business.state || business.country;
    const hasEmail = business.email;
    const hasPhone = business.phone;

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

    const hasSocial = allSocialLinks.length > 0;

    if (!hasAddress && !hasEmail && !hasPhone && !hasSocial) return null;

    return (
        <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-orange-50/30 to-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-300 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full text-[#FF7B1D] text-sm font-bold uppercase tracking-wider mb-6 shadow-sm">
                        <Mail size={16} />
                        Contact Us
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Get in Touch</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Ready to start a conversation? We're here to help and answer any questions you might have.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Cards */}
                    <div className="space-y-6">
                        {/* Address Card */}
                        {hasAddress && (
                            <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all group">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                        <MapPin size={28} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Our Office</h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {business.street_address}{business.street_address && ','} {business.city}<br />
                                            {business.state}{business.state && ','} {business.country} {business.pincode && '-'} {business.pincode}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Email Card */}
                        {hasEmail && (
                            <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all group">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                        <Mail size={28} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
                                        <a href={`mailto:${business.email}`} className="text-[#FF7B1D] hover:text-orange-600 transition-colors text-lg font-semibold break-all">
                                            {business.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Phone Card */}
                        {(hasPhone || business.alternate_phone) && (
                            <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all group">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                        <Phone size={28} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
                                        {hasPhone && (
                                            <a href={`tel:${business.phone}`} className="text-[#FF7B1D] hover:text-orange-600 transition-colors text-lg font-semibold block mb-1">
                                                {business.phone}
                                            </a>
                                        )}
                                        {business.alternate_phone && (
                                            <a href={`tel:${business.alternate_phone}`} className="text-[#FF7B1D] hover:text-orange-600 transition-colors text-lg font-semibold block">
                                                {business.alternate_phone} (Alt)
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Contact Person Card */}
                        {(business.contact_person || business.designation) && (
                            <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all group">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                        <Users size={28} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">Authorized Contact</h3>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {business.contact_person}
                                        </p>
                                        <p className="text-gray-600">
                                            {business.designation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {hasSocial && (
                            <div className="bg-white border border-gray-200 p-8 rounded-2xl">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
                                <div className="flex flex-wrap gap-4">
                                    {allSocialLinks.map((link, idx) => {
                                        const platform = link.platform.toLowerCase();
                                        let Icon = Globe; // Default icon
                                        if (platform === 'linkedin') Icon = Linkedin;
                                        else if (platform === 'facebook') Icon = Facebook;
                                        else if (platform === 'twitter' || platform === 'x') Icon = Twitter;
                                        else if (platform === 'instagram') Icon = Instagram;

                                        const url = (platform === 'whatsapp' && !link.url.startsWith('http'))
                                            ? `https://wa.me/${link.url}`
                                            : link.url;

                                        let iconColorClass = "text-[#FF7B1D] hover:bg-[#FF7B1D]";
                                        if (platform === 'whatsapp') iconColorClass = "text-green-500 hover:bg-green-500";
                                        if (platform === 'youtube') iconColorClass = "text-red-600 hover:bg-red-600";

                                        return (
                                            <a
                                                key={idx}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-14 h-14 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center ${iconColorClass} hover:text-white transition-all hover:scale-110 shadow-sm`}
                                                title={link.platform}
                                            >
                                                {platform === 'youtube' ? (
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                                    </svg>
                                                ) : platform === 'whatsapp' ? (
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                                    </svg>
                                                ) : (
                                                    <Icon size={24} />
                                                )}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Image Section - Always show professional image */}
                    <div className="relative h-full min-h-[500px] lg:min-h-[600px] rounded-[2.5rem] overflow-hidden group shadow-2xl border-8 border-white">
                        <div className="w-full h-full relative">
                            <img
                                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
                                alt="Our Headquarters"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent"></div>
                        </div>

                        {/* Floating Info Card */}
                        <div className="absolute bottom-8 left-8 right-8">
                            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-[2rem] border border-white/20 shadow-2xl transform transition-all duration-500 group-hover:-translate-y-2">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center">
                                        <MapPin className="text-[#FF7B1D]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-gray-900 text-2xl font-bold leading-tight">Visit Our Office</h3>
                                        <p className="text-[#FF7B1D] text-sm font-semibold uppercase tracking-wider">Headquarters</p>
                                    </div>
                                </div>

                                <p className="text-gray-600 mb-6 leading-relaxed">
                                    {hasAddress ? (
                                        <>
                                            {business.street_address}, {business.city}<br />
                                            {business.state}, {business.country} {business.pincode}
                                        </>
                                    ) : (
                                        "Experience our workspace and meet our creative team in person. We're always open for a coffee and a chat about your vision."
                                    )}
                                </p>

                                <a
                                    href={business.google_maps_link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${business.street_address} ${business.city} ${business.state}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white py-4 rounded-2xl font-bold hover:shadow-[0_10px_20px_-10px_rgba(255,123,29,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <MapPin size={20} />
                                    Get Directions
                                </a>
                            </div>
                        </div>

                        {/* Decoration */}
                        <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Globe className="text-white animate-spin-slow" size={32} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;

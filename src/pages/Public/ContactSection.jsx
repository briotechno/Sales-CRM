import React from "react";
import { Mail, MapPin, Phone, Linkedin, Facebook, Twitter, Instagram } from "lucide-react";

const ContactSection = ({ business }) => {
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
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all group">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                    <MapPin size={28} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Visit Our Office</h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {business.street_address}, {business.city}<br />
                                        {business.state}, {business.country} - {business.pincode}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Email Card */}
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all group">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                    <Mail size={28} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Email Us</h3>
                                    <a href={`mailto:${business.email}`} className="text-[#FF7B1D] hover:text-orange-600 transition-colors text-lg font-semibold">
                                        {business.email}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Phone Card */}
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl hover:shadow-xl transition-all group">
                            <div className="flex items-start gap-6">
                                <div className="w-16 h-16 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform shadow-lg">
                                    <Phone size={28} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">Call Us</h3>
                                    <a href={`tel:${business.phone}`} className="text-[#FF7B1D] hover:text-orange-600 transition-colors text-lg font-semibold">
                                        {business.phone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="bg-white border border-gray-200 p-8 rounded-2xl">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Follow Us</h3>
                            <div className="flex gap-4">
                                {[
                                    { icon: Linkedin, href: '#', label: 'LinkedIn' },
                                    { icon: Facebook, href: '#', label: 'Facebook' },
                                    { icon: Twitter, href: '#', label: 'Twitter' },
                                    { icon: Instagram, href: '#', label: 'Instagram' },
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.href}
                                        className="w-14 h-14 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center text-[#FF7B1D] hover:bg-[#FF7B1D] hover:text-white transition-all hover:scale-110 shadow-sm"
                                        title={social.label}
                                    >
                                        <social.icon size={24} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image/Map */}
                    <div className="relative h-full min-h-[600px] rounded-3xl overflow-hidden group shadow-2xl border-4 border-white">
                        <img
                            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200"
                            alt="Office Location"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/30 to-transparent"></div>
                        <div className="absolute bottom-10 left-10 right-10">
                            <div className="bg-white/95 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 shadow-2xl">
                                <h3 className="text-gray-900 text-3xl font-bold mb-4">Visit Our Headquarters</h3>
                                <p className="text-gray-600 mb-6">Experience our workspace and meet our team in person.</p>
                                <button className="w-full bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center gap-2">
                                    <MapPin size={20} />
                                    Get Directions
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;

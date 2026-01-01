import React from "react";
import { Globe, ShieldCheck, Briefcase, Globe2 } from "lucide-react";

const CompanyInfoSection = ({ business }) => {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-orange-50/50 to-white relative overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle, #FF7B1D 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 rounded-full text-[#FF7B1D] text-sm font-bold uppercase tracking-wider mb-6 shadow-sm">
                        <ShieldCheck size={16} />
                        Verified Business
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Company Information</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Official credentials and registration details verified for your trust and confidence.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: Globe, label: 'Legal Name', value: business.legal_name, color: 'blue' },
                        { icon: ShieldCheck, label: 'Registration Number', value: business.registration_number, color: 'green' },
                        { icon: Briefcase, label: 'Business Type', value: business.business_type, color: 'purple' },
                        { icon: Globe2, label: 'Website', value: business.website, isLink: true, color: 'orange' },
                    ].map((item, index) => (
                        <div key={index} className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF7B1D] to-orange-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                            <div className="relative bg-white p-8 rounded-2xl shadow-md border border-orange-100 h-full hover:shadow-2xl transition-all">
                                <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon size={28} className="text-[#FF7B1D]" />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{item.label}</p>
                                {item.isLink && item.value ? (
                                    <a href={item.value.startsWith('http') ? item.value : `https://${item.value}`} target="_blank" rel="noopener noreferrer" className="text-base font-bold text-[#FF7B1D] hover:underline break-all block">
                                        {item.value}
                                    </a>
                                ) : (
                                    <p className="text-base font-bold text-gray-900 break-words">{item.value || 'N/A'}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default CompanyInfoSection;

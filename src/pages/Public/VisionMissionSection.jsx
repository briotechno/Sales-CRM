import React from "react";
import { Target, Award } from "lucide-react";

const VisionMissionSection = ({ business }) => {
    if (!business.vision && !business.mission) return null;

    return (
        <section id="vision" className="py-24 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-50 rounded-full blur-3xl opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-40"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full text-[#FF7B1D] text-sm font-bold uppercase tracking-wider mb-6">
                        <Target size={16} />
                        Our Purpose
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">Vision & Mission</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Driven by vision, guided by mission, and committed to making a lasting impact in everything we do.
                    </p>
                </div>

                <div className={`grid lg:grid-cols-${(business.vision && business.mission) ? '2' : '1'} gap-8 max-w-${(business.vision && business.mission) ? 'none' : '3xl'} mx-auto`}>
                    {/* Vision Card */}
                    {business.vision && (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF7B1D] to-orange-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                            <div className="relative bg-white p-12 rounded-3xl shadow-xl border border-gray-100 h-full">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                                        <Target size={36} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Our Vision</h3>
                                        <div className="h-1 w-16 bg-gradient-to-r from-[#FF7B1D] to-orange-600 rounded-full"></div>
                                    </div>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
                                    {business.vision}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Mission Card */}
                    {business.mission && (
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#FF7B1D] to-orange-600 rounded-3xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                            <div className="relative bg-white p-12 rounded-3xl shadow-xl border border-gray-100 h-full">
                                <div className="flex items-start gap-6 mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#FF7B1D] to-orange-600 rounded-2xl flex items-center justify-center shrink-0 shadow-lg">
                                        <Award size={36} className="text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold text-gray-900 mb-2">Our Mission</h3>
                                        <div className="h-1 w-16 bg-gradient-to-r from-[#FF7B1D] to-orange-600 rounded-full"></div>
                                    </div>
                                </div>
                                <p className="text-lg text-gray-700 leading-relaxed break-words whitespace-pre-wrap">
                                    {business.mission}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default VisionMissionSection;

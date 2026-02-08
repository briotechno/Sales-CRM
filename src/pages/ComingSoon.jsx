import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const ComingSoon = ({ title }) => {
    const navigate = useNavigate();

    return (
        <DashboardLayout>
            <div className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6 bg-gray-50 font-primary">
                <div className="text-center max-w-md w-full bg-white p-10 rounded-sm shadow-xl border border-gray-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">

                    <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-orange-50/50">
                        <Construction size={48} className="text-[#FF7B1D] animate-pulse" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-3 capitalize tracking-tight">
                        {title || "Coming Soon"}
                    </h1>

                    <div className="w-16 h-1.5 bg-gradient-to-r from-[#FF7B1D] to-orange-400 rounded-full mb-6"></div>

                    <p className="text-gray-500 text-base mb-8 leading-relaxed font-medium">
                        We are currently developing this integration to enhance your experience. <br />
                        Please check back soon!
                    </p>

                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#FF7B1D] to-orange-600 text-white rounded-sm font-bold text-sm hover:shadow-lg hover:shadow-orange-200 hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Go Back
                    </button>

                </div>

                <p className="mt-8 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Sales & Leads Management System
                </p>
            </div>
        </DashboardLayout>
    );
};

export default ComingSoon;

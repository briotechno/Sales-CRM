import React from 'react';
import { Users, Search, Inbox, ClipboardList } from 'lucide-react';

const EmptyState = ({
    title = "No Leads Found",
    message = "It looks like there are no leads in this category yet.",
    type = "leads" // leads, search, general
}) => {
    const getIcon = () => {
        switch (type) {
            case 'leads':
                return <Users size={40} className="text-orange-500" />;
            case 'search':
                return <Search size={40} className="text-orange-500" />;
            case 'tasks':
                return <ClipboardList size={40} className="text-orange-500" />;
            default:
                return <Inbox size={40} className="text-orange-500" />;
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-xl border-2 border-dashed border-gray-100 shadow-sm animate-fadeIn">
            <div className="relative mb-6">
                {/* Animated Background Rings */}
                <div className="absolute inset-0 scale-150 opacity-20">
                    <div className="absolute inset-0 border-2 border-orange-200 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-2 border-orange-100 rounded-full animate-pulse delay-75" />
                </div>

                {/* Icon Container */}
                <div className="relative w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center shadow-inner border border-orange-100 group">
                    <div className="transform transition-transform group-hover:scale-110 duration-300">
                        {getIcon()}
                    </div>
                </div>
            </div>

            <div className="text-center max-w-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-2 font-primary tracking-tight">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    {message}
                </p>
            </div>

            {/* Decorative Elements */}
            <div className="mt-8 flex gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-200 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-orange-300 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce delay-200" />
            </div>
        </div>
    );
};

export default EmptyState;

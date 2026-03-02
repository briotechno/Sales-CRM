import React from 'react';
import { Users, Search, Inbox, ClipboardList } from 'lucide-react';

const EmptyState = ({
    title = "No Leads Found",
    message = "It looks like there are no leads in this category yet.",
    type = "leads", // leads, search, general
    variant = "full" // full, compact
}) => {
    const isCompact = variant === "compact";

    const getIcon = () => {
        const size = isCompact ? 24 : 40;
        switch (type) {
            case 'leads':
                return <Users size={size} className="text-orange-500" />;
            case 'search':
                return <Search size={size} className="text-orange-500" />;
            case 'tasks':
                return <ClipboardList size={size} className="text-orange-500" />;
            default:
                return <Inbox size={size} className="text-orange-500" />;
        }
    };

    return (
        <div className={`flex flex-col items-center justify-center ${isCompact ? 'py-8 px-2' : 'py-16 px-4'} bg-white rounded-xl border-2 border-dashed border-gray-100 shadow-sm animate-fadeIn`}>
            <div className={`relative ${isCompact ? 'mb-4' : 'mb-6'}`}>
                {/* Animated Background Rings */}
                <div className={`absolute inset-0 ${isCompact ? 'scale-125' : 'scale-150'} opacity-20`}>
                    <div className="absolute inset-0 border-2 border-orange-200 rounded-full animate-ping" />
                    <div className="absolute inset-0 border-2 border-orange-100 rounded-full animate-pulse delay-75" />
                </div>

                {/* Icon Container */}
                <div className={`relative ${isCompact ? 'w-12 h-12' : 'w-20 h-20'} bg-orange-50 rounded-full flex items-center justify-center shadow-inner border border-orange-100 group`}>
                    <div className="transform transition-transform group-hover:scale-110 duration-300">
                        {getIcon()}
                    </div>
                </div>
            </div>

            <div className="text-center max-w-sm px-2">
                <h3 className={`${isCompact ? 'text-sm' : 'text-xl'} font-bold text-gray-800 mb-1 font-primary tracking-tight`}>
                    {title}
                </h3>
                <p className={`${isCompact ? 'text-[11px]' : 'text-sm'} text-gray-500 leading-relaxed font-medium`}>
                    {message}
                </p>
            </div>

            {/* Decorative Elements */}
            {!isCompact && (
                <div className="mt-8 flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-200 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-orange-300 animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-orange-400 animate-bounce delay-200" />
                </div>
            )}
        </div>
    );
};

export default EmptyState;

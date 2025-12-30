import React, { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Reusable Modal Component
 * 
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Function to call when closing the modal
 * @param {string} title - Modal title (optional)
 * @param {string} subtitle - Modal subtitle (optional)
 * @param {React.ReactNode} icon - Icon to display in header (optional)
 * @param {React.ReactNode} children - Modal body content
 * @param {React.ReactNode} footer - Modal footer content (optional)
 * @param {string} maxWidth - Tailwind max-width class (default: 'max-w-2xl')
 * @param {boolean} showCloseButton - Whether to show the X close button (default: true)
 * @param {string} headerVariant - 'orange' (default) or 'simple'
 */
const Modal = ({
    isOpen,
    onClose,
    title,
    subtitle,
    icon,
    children,
    footer,
    maxWidth = "max-w-2xl",
    showCloseButton = true,
    headerVariant = "orange"
}) => {
    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn p-4">
            <div
                className={`bg-white rounded-sm shadow-2xl w-full ${maxWidth} relative transform transition-all animate-slideUp overflow-hidden`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {headerVariant === "orange" ? (
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {icon && (
                                    <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                        {icon}
                                    </div>
                                )}
                                <div>
                                    {title && <h2 className="text-2xl font-bold">{title}</h2>}
                                    {subtitle && (
                                        <p className="text-sm text-white text-opacity-90 mt-1">
                                            {subtitle}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {showCloseButton && (
                                <button
                                    onClick={onClose}
                                    className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
                                >
                                    <X size={22} />
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    showCloseButton && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-all p-1 z-10"
                        >
                            <X size={20} />
                        </button>
                    )
                )}

                {/* Body */}
                <div className={`p-6 ${headerVariant === 'simple' && !title ? 'pt-8' : ''}`}>
                    {headerVariant === 'simple' && title && (
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                    )}
                    {headerVariant === 'simple' && subtitle && (
                        <p className="text-gray-600 mb-6">{subtitle}</p>
                    )}
                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
                        {children}
                    </div>
                </div>

                {/* Footer */}
                {footer && (
                    <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3">
                        {footer}
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { transform: translateY(20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }

                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }

                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
                
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #ddd;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ccc;
                }
            `}</style>
        </div>
    );
};

export default Modal;

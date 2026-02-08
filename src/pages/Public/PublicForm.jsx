import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Check, AlertCircle, Loader2 } from "lucide-react";

const PublicForm = () => {
    const { slug } = useParams();
    const [formConfig, setFormConfig] = useState(null);
    const [formData, setFormData] = useState({});
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchForm = async () => {
            try {
                // We need a public endpoint to get form config
                const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}integrations/forms/public/${slug}`);
                setFormConfig(res.data);
                // Initialize form data
                const initialData = {};
                const fields = typeof res.data.fields === 'string' ? JSON.parse(res.data.fields) : res.data.fields;
                fields.forEach(f => initialData[f.name] = "");
                setFormData(initialData);
            } catch (err) {
                setStatus("error");
                setMessage("Form not found or unavailable.");
            }
        };
        fetchForm();
    }, [slug]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("loading");
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}integrations/forms/submit/${slug}`, formData);
            setStatus("success");
            const settings = typeof formConfig.settings === 'string' ? JSON.parse(formConfig.settings) : formConfig.settings;
            setMessage(settings.success_message || "Thank you! Your submission has been received.");
            if (settings.redirect_url) {
                setTimeout(() => window.location.href = settings.redirect_url, 3000);
            }
        } catch (err) {
            setStatus("error");
            setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    if (status === "success") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-primary">
                <div className="bg-white p-8 rounded-sm shadow-lg text-center max-w-md w-full border border-gray-200 animate-in fade-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">Success!</h2>
                    <p className="text-gray-600 font-medium text-sm leading-relaxed">{message}</p>
                </div>
            </div>
        );
    }

    if (!formConfig && status !== "error") {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 font-primary">
                <div className="w-12 h-12 border-4 border-orange-200 border-t-[#FF7B1D] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-bold text-sm tracking-wide animate-pulse">Loading form...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-primary">
                <div className="bg-white p-8 rounded-sm shadow-lg text-center max-w-md w-full border border-gray-200">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                        <AlertCircle size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">Error</h2>
                    <p className="text-gray-600 font-medium text-sm">{message}</p>
                </div>
            </div>
        );
    }

    const fields = typeof formConfig.fields === 'string' ? JSON.parse(formConfig.fields) : formConfig.fields;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-primary">
            <div className="bg-white w-full max-w-lg rounded-sm shadow-xl overflow-hidden border border-gray-200">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white text-center">
                    <h1 className="text-xl font-bold capitalize tracking-wide mb-1">{formConfig.form_name}</h1>
                    <p className="text-orange-50 text-xs font-medium">Please fill out the form below</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                    <div className="space-y-5 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                        {fields.map((field, idx) => (
                            <div key={idx} className="space-y-1.5 group">
                                <label className="text-sm font-bold text-gray-800 capitalize flex items-center gap-1">
                                    {field.label} {field.required && <span className="text-red-500 text-xs">*</span>}
                                </label>
                                {field.type === 'textarea' ? (
                                    <textarea
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 rounded-sm outline-none text-sm font-medium transition-all placeholder:text-gray-400 placeholder:font-normal resize-none"
                                        rows={4}
                                        value={formData[field.name] || ''}
                                        onChange={(e) => {
                                            const newFormData = { ...formData, [field.name]: e.target.value };
                                            setFormData(newFormData);
                                        }}
                                        required={field.required}
                                        placeholder={`Enter your ${field.label.toLowerCase()}...`}
                                    />
                                ) : (
                                    <input
                                        type={field.type}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 rounded-sm outline-none text-sm font-medium transition-all placeholder:text-gray-400 placeholder:font-normal"
                                        value={formData[field.name] || ''}
                                        onChange={(e) => {
                                            const newFormData = { ...formData, [field.name]: e.target.value };
                                            setFormData(newFormData);
                                        }}
                                        required={field.required}
                                        placeholder={`Enter your ${field.label.toLowerCase()}`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 mt-2 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-sm font-bold text-sm shadow-lg hover:from-orange-600 hover:to-orange-700 hover:shadow-xl transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 uppercase tracking-widest"
                        >
                            {status === "loading" ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} /> Submitting...
                                </>
                            ) : "Submit Form"}
                        </button>

                        <p className="text-center text-[10px] text-gray-400 font-medium pt-4 flex items-center justify-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                            Secured by Sales CRM
                        </p>
                    </div>
                </form>
            </div>
            <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
        </div>
    );
};

export default PublicForm;

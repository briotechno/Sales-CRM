import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import {
    Briefcase,
    MapPin,
    Clock,
    Send,
    Upload,
    CheckCircle,
    Mail,
    Phone,
    User,
    AlertCircle,
    Building2,
    FileText,
    Users
} from "lucide-react";
import {
    useGetPublicJobDetailsQuery,
    useSubmitApplicationMutation
} from "../../store/api/applicantApi";
import toast from 'react-hot-toast';

const PublicJobForm = () => {
    const { link } = useParams();
    const { data: job, isLoading, isError } = useGetPublicJobDetailsQuery(link);
    const [submitApplication, { isLoading: isSubmitting }] = useSubmitApplicationMutation();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        resume: null
    });

    const [dynamicData, setDynamicData] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleDynamicChange = (e) => {
        const { name, value } = e.target;
        setDynamicData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
        if (errors.resume) setErrors(prev => ({ ...prev, resume: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        if (!formData.resume) newErrors.resume = "Resume is required";

        const customFields = (job?.application_fields
            ? (typeof job.application_fields === 'string' ? JSON.parse(job.application_fields) : job.application_fields)
            : []).filter(f => !['name', 'email', 'phone'].includes(f.name));

        customFields.forEach(field => {
            if (field.required && !dynamicData[field.name]) {
                newErrors[field.name] = `${field.label} is required`;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fill in all required fields");
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('phone', formData.phone);
        data.append('resume', formData.resume);
        data.append('application_data', JSON.stringify(dynamicData));

        try {
            await submitApplication({ link, formData: data }).unwrap();
            setSubmitted(true);
            toast.success("Application submitted successfully!");
        } catch (error) {
            toast.error(error?.data?.message || "Failed to submit application");
        }
    };

    if (isLoading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
    );

    if (isError || !job) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-sm shadow-xl max-w-md w-full text-center border border-gray-200">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2 font-primary">Job Post Not Found</h1>
                <p className="text-gray-600 font-primary">The application link might be broken or the job posting has been closed.</p>
            </div>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-sm shadow-2xl max-w-lg w-full text-center border border-orange-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-black text-gray-900 mb-4 font-primary">Application Received!</h1>
                <p className="text-lg text-gray-600 mb-8 font-primary">
                    Thank you for applying for the <strong>{job.title}</strong> position. Our HR team will review your application and get back to you soon.
                </p>
                <div className="bg-orange-50 p-4 rounded-sm text-orange-700 text-sm font-bold font-primary">
                    A confirmation email has been sent to your inbox.
                </div>
            </div>
        </div>
    );

    const configFields = (job.application_fields
        ? (typeof job.application_fields === 'string' ? JSON.parse(job.application_fields) : job.application_fields)
        : []).filter(field => !['name', 'email', 'phone'].includes(field.name));

    const logoUrl = job?.logo_url
        ? `${import.meta.env.VITE_API_BASE_URL.replace("/api/", "")}${job.logo_url}`
        : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-0 to-gray-100 flex flex-col pb-10 ml-4 mr-4">
            {/* Business Branding Header - Inspired by CompanyProfile.jsx */}
            <div className="bg-white border-b mb-3">
                <div className="max-w-8xl mx-auto px-6 py-3">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            {/* Logo */}
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center p-2 shadow-sm overflow-hidden">
                                    {logoUrl ? (
                                        <img src={logoUrl} alt={job.company_name} className="w-full h-full object-contain" />
                                    ) : (
                                        <Building2 size={32} className="text-[#FF7B1D]" />
                                    )}
                                </div>
                            </div>

                            {/* Company Name & Industry */}
                            <div className="text-center md:text-left">
                                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                                    {job.company_name || "Company Name"}
                                </h1>
                                <p className="text-xs font-bold text-[#FF7B1D] uppercase tracking-widest mt-1">
                                    {job.industry || "Manufacturing"}
                                </p>
                            </div>
                        </div>

                        {/* Right Side Action */}
                        <div className="flex items-center gap-3">
                            {job.business_email && (
                                <a
                                    href={`mailto:${job.business_email}`}
                                    className="bg-[#FF7B1D] text-white px-6 py-2.5 rounded-sm font-bold text-sm shadow-sm hover:bg-orange-600 transition-all flex items-center gap-2"
                                >
                                    <Mail size={16} />
                                    Get in Touch
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb Header - Keep but clean up */}
            <div className="bg-white border-b mb-6 rounded-t-sm">
                <div className="max-w-8xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 flex items-center gap-2">
                                <FiHome className="text-gray-700 text-sm" />
                                <span className="text-gray-400">Careers /</span>{" "}
                                <span className="text-[#FF7B1D] font-medium italic">
                                    {job.title}
                                </span>
                            </p>
                        </div>
                        <div className="hidden md:flex items-center gap-3">
                            <span className="text-[11px] font-bold text-[#FF7B1D] uppercase tracking-[0.2em] font-primary bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                {job.positions} Open Positions
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-8xl mx-auto px-0 py-0 mt-2 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    {/* Left Column - Job Info */}
                    <div className="lg:col-span-1 sticky top-6 self-start">
                        <style>{`
                            .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                            .custom-scrollbar::-webkit-scrollbar-track { background: #fdfdfd; }
                            .custom-scrollbar::-webkit-scrollbar-thumb { background: #ffd9c1; border-radius: 10px; border: 1px solid #fff3eb; }
                            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #FF7B1D; }
                        `}</style>
                        {/* Basic Job Details */}
                        <div className="bg-white rounded-sm shadow-md border border-gray-100 max-h-[750px] overflow-y-auto custom-scrollbar">
                            <div className="p-6">
                                <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 font-primary">
                                    <Building2 className="text-orange-500" size={24} />
                                    Job Overview
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100">
                                        <div className="bg-blue-100 p-2 rounded-sm">
                                            <Briefcase size={20} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Department</p>
                                            <p className="text-sm font-bold text-gray-800">{job.department}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100">
                                        <div className="bg-green-100 p-2 rounded-sm">
                                            <MapPin size={20} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Location</p>
                                            <p className="text-sm font-bold text-gray-800">{job.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-sm border border-gray-100">
                                        <div className="bg-purple-100 p-2 rounded-sm">
                                            <Clock size={20} className="text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Job Type</p>
                                            <p className="text-sm font-bold text-gray-800">{job.type}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <AlertCircle size={14} className="text-orange-500" /> About the role
                                    </h3>
                                    <p className="text-sm text-gray-600 leading-relaxed font-primary">
                                        {job.description}
                                    </p>
                                </div>

                                {job.responsibilities && (typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities).length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] mb-4">Key Responsibilities</h3>
                                        <ul className="space-y-3">
                                            {(typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities).map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-primary">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 shadow-sm" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {job.requirements && (typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements).length > 0 && (
                                    <div className="mt-8 pt-8 border-t border-gray-100">
                                        <h3 className="text-xs font-black text-gray-800 uppercase tracking-[0.2em] mb-4">Job Requirements</h3>
                                        <ul className="space-y-3">
                                            {(typeof job.requirements === 'string' ? JSON.parse(job.requirements) : job.requirements).map((item, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-gray-600 font-primary">
                                                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 shadow-sm" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Application Form */}
                    <div className="lg:col-span-2 sticky top-6 self-start">
                        <div className="bg-white rounded-sm shadow-md border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 font-primary tracking-tight">
                                    <FileText className="text-orange-500" size={24} />
                                    Application Form
                                </h2>
                                <span className="text-[11px] font-bold text-[#FF7B1D] tracking-[0.15em] uppercase font-primary opacity-80">Direct Hiring Portal</span>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-300 text-sm font-medium text-gray-800 ${errors.name ? 'border-red-300' : ''}`}
                                            placeholder="e.g. Johnathan Doe"
                                        />
                                        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-300 text-sm font-medium text-gray-800 ${errors.email ? 'border-red-300' : ''}`}
                                            placeholder="e.g. john@company.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-300 text-sm font-medium text-gray-800"
                                            placeholder="e.g. +91 9876543210"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Resume / CV (PDF) <span className="text-red-500">*</span>
                                        </label>
                                        <div className={`relative w-full h-[41px] px-4 bg-white border border-dashed rounded-sm border-gray-300 flex items-center gap-3 cursor-pointer hover:border-orange-400 transition-all ${errors.resume ? 'border-red-300' : ''}`}>
                                            <Upload size={18} className="text-gray-400" />
                                            <span className="text-xs font-bold text-gray-500 truncate max-w-[200px]">
                                                {formData.resume ? formData.resume.name : "Click to select PDF"}
                                            </span>
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handleFileChange}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        {errors.resume && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{errors.resume}</p>}
                                    </div>
                                </div>

                                {/* Configurable Fields */}
                                {configFields.length > 0 && (
                                    <div className="pt-8 border-t border-gray-100">
                                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 font-primary tracking-tight">
                                            <Users className="text-orange-500" size={24} />
                                            Additional Info
                                        </h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {configFields.map((field) => (
                                                <div key={field.name} className="space-y-2">
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                                    </label>
                                                    {field.type === 'textarea' ? (
                                                        <textarea
                                                            name={field.name}
                                                            value={dynamicData[field.name] || ""}
                                                            onChange={handleDynamicChange}
                                                            className={`w-full px-4 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-300 text-sm font-medium text-gray-800 min-h-[120px] ${errors[field.name] ? 'border-red-300' : ''}`}
                                                            placeholder={`Your answer for ${field.label}...`}
                                                        />
                                                    ) : (
                                                        <input
                                                            type={field.type || 'text'}
                                                            name={field.name}
                                                            value={dynamicData[field.name] || ""}
                                                            onChange={handleDynamicChange}
                                                            className={`w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all placeholder:text-gray-300 text-sm font-medium text-gray-800 ${errors[field.name] ? 'border-red-300' : ''}`}
                                                            placeholder={`Enter ${field.label}...`}
                                                        />
                                                    )}
                                                    {errors[field.name] && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase tracking-widest">{errors[field.name]}</p>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 font-semibold disabled:opacity-50"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send size={20} /> Submit Application
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* <p className="text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.4em] mt-12 mb-8">
                    &copy; {new Date().getFullYear()} {job.department} Division. Powered by corporate recruitment system.
                </p> */}
            </div>
        </div>
    );
};

export default PublicJobForm;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
    AlertCircle
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

        // Validate configurable fields
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
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Job Post Not Found</h1>
                <p className="text-gray-600">The application link might be broken or the job posting has been closed.</p>
            </div>
        </div>
    );

    if (submitted) return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
            <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-orange-100">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Application Received!</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Thank you for applying for the <strong>{job.title}</strong> position. Our HR team will review your application and get back to you soon.
                </p>
                <div className="bg-orange-50 p-4 rounded-xl text-orange-700 text-sm font-medium">
                    A confirmation email has been sent to your inbox.
                </div>
            </div>
        </div>
    );

    const configFields = (job.application_fields
        ? (typeof job.application_fields === 'string' ? JSON.parse(job.application_fields) : job.application_fields)
        : []).filter(field => !['name', 'email', 'phone'].includes(field.name));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
            <div className="max-w-4xl w-full">
                {/* Job Header Card */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8 border border-gray-100">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-8 text-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {job.type}
                                </span>
                                <h1 className="text-4xl font-black mt-3 leading-tight uppercase tracking-tight">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-6 mt-4 opacity-90">
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={18} />
                                        <span className="font-bold">{job.department}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={18} />
                                        <span className="font-bold">{job.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} />
                                        <span className="font-bold">Full Time</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Role Description</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {job.description}
                        </p>

                        {job.responsibilities && (typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities).length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-bold text-gray-900 mb-3">Key Responsibilities:</h3>
                                <ul className="space-y-2">
                                    {(typeof job.responsibilities === 'string' ? JSON.parse(job.responsibilities) : job.responsibilities).map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-gray-600">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Application Form Card */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-black text-gray-900 uppercase">Submit Application</h2>
                        <p className="text-gray-500 mt-2">Personalize your application to stand out.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Standard Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <User size={16} className="text-orange-500" /> Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all outline-none ${errors.name ? 'border-red-300 focus:ring-red-100' : 'border-transparent focus:border-orange-500 focus:ring-orange-100'}`}
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="text-red-500 text-xs font-bold mt-1">{errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Mail size={16} className="text-orange-500" /> Email Address *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all outline-none ${errors.email ? 'border-red-300 focus:ring-red-100' : 'border-transparent focus:border-orange-500 focus:ring-orange-100'}`}
                                    placeholder="john@example.com"
                                />
                                {errors.email && <p className="text-red-500 text-xs font-bold mt-1">{errors.email}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Phone size={16} className="text-orange-500" /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                                    placeholder="+1 234 567 890"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Upload size={16} className="text-orange-500" /> Upload Resume (PDF) *
                                </label>
                                <div className={`relative w-full px-5 py-4 bg-gray-50 border-2 border-dashed rounded-2xl flex items-center justify-center gap-3 cursor-pointer hover:bg-gray-100 transition-all ${errors.resume ? 'border-red-300' : 'border-gray-200 hover:border-orange-300'}`}>
                                    <Upload size={20} className="text-gray-400" />
                                    <span className="text-gray-600 font-medium">
                                        {formData.resume ? formData.resume.name : "Click to upload resume"}
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                {errors.resume && <p className="text-red-500 text-xs font-bold mt-1">{errors.resume}</p>}
                            </div>
                        </div>

                        {/* Configurable Fields */}
                        {configFields.length > 0 && (
                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-xl font-bold text-gray-900 mb-6">Additional Questions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {configFields.map((field) => (
                                        <div key={field.name} className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 capitalize">
                                                {field.label} {field.required && '*'}
                                            </label>
                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    name={field.name}
                                                    value={dynamicData[field.name] || ""}
                                                    onChange={handleDynamicChange}
                                                    className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all outline-none min-h-[120px] ${errors[field.name] ? 'border-red-300 focus:ring-red-100' : 'border-transparent focus:border-orange-500 focus:ring-orange-100'}`}
                                                    placeholder={`Your answer for ${field.label}...`}
                                                />
                                            ) : (
                                                <input
                                                    type={field.type || 'text'}
                                                    name={field.name}
                                                    value={dynamicData[field.name] || ""}
                                                    onChange={handleDynamicChange}
                                                    className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl focus:ring-4 transition-all outline-none ${errors[field.name] ? 'border-red-300 focus:ring-red-100' : 'border-transparent focus:border-orange-500 focus:ring-orange-100'}`}
                                                    placeholder={`Enter ${field.label}...`}
                                                />
                                            )}
                                            {errors[field.name] && <p className="text-red-500 text-xs font-bold mt-1">{errors[field.name]}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-xl shadow-orange-200 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send size={24} /> Submit My Application
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-gray-400 text-sm mt-8">
                    &copy; {new Date().getFullYear()} {job.department} Careers. Powered by Recruitment Manager.
                </p>
            </div>
        </div>
    );
};

export default PublicJobForm;

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../../components/DashboardLayout";
import { useGetUserProfileQuery, useUpdateUserProfileMutation } from "../../store/api/userApi";
import {
    User, Mail, Phone, MapPin, Calendar, CreditCard, Users,
    GraduationCap, Briefcase, ChevronDown, Edit, MessageSquare,
    CheckCircle, Loader2, Save, Shield, Heart, Globe
} from "lucide-react";
import toast from "react-hot-toast";

const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value || 'N/A'}</p>
    </div>
);

export default function MyProfile() {
    const { user } = useSelector((state) => state.auth);
    const { data: profileData, isLoading, refetch } = useGetUserProfileQuery();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();

    const [expandedSections, setExpandedSections] = useState({
        about: true,
        bank: true,
        family: false,
        education: true,
        experience: true,
    });

    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (profileData) {
            setFormData(profileData);
        }
    }, [profileData]);

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await updateProfile(formData).unwrap();
            toast.success("Profile updated successfully");
            setEditMode(false);
            refetch();
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
                </div>
            </DashboardLayout>
        );
    }

    // --- ADMIN VIEW ---
    if (user?.role !== 'Employee') {
        return (
            <DashboardLayout>
                <div className="min-h-screen ml-6 p-6">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-4 text-white">
                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                    {profileData?.firstName?.[0]}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">{profileData?.firstName} {profileData?.lastName}</h1>
                                    <p className="opacity-90">{profileData?.role}</p>
                                </div>
                            </div>
                            {!editMode ? (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                                >
                                    <Edit size={16} /> Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditMode(false)}
                                        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-md transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        className="bg-white text-orange-600 px-4 py-2 rounded-md flex items-center gap-2 font-bold transition"
                                    >
                                        <Save size={16} /> Save
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full p-2 border rounded-md ${editMode ? 'border-orange-300 ring-2 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full p-2 border rounded-md ${editMode ? 'border-orange-300 ring-2 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode} // Usually email shouldn't be editable easily
                                        className={`w-full p-2 border rounded-md ${editMode ? 'border-orange-300 ring-2 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        value={formData.mobileNumber || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full p-2 border rounded-md ${editMode ? 'border-orange-300 ring-2 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <textarea
                                        name="address"
                                        value={formData.address || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        rows={3}
                                        className={`w-full p-2 border rounded-md ${editMode ? 'border-orange-300 ring-2 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>

                                <h3 className="md:col-span-2 text-lg font-bold text-gray-800 mt-4 border-b pb-2">Business Information</h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                    <input
                                        type="text"
                                        name="businessName"
                                        value={formData.businessName || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full p-2 border rounded-md ${editMode ? 'border-orange-300 ring-2 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                    <input
                                        type="text"
                                        name="gst"
                                        value={formData.gst || ''}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full p-2 border rounded-md ${editMode ? 'border-orange-300 ring-2 ring-orange-100' : 'bg-gray-50 border-gray-200'}`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    // --- EMPLOYEE VIEW ---
    // Reuse structure from EmployeeProfile.jsx but populated with profileData (which is employee object)
    const employee = profileData;

    return (
        <DashboardLayout>
            <div className="min-h-screen ml-6">
                <div className="">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Profile Card */}
                        <div className="lg:col-span-1 rounded-sm shadow-lg">
                            <div className="bg-white overflow-hidden">
                                {/* Header with Gradient */}
                                <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-32 relative">
                                    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                        <div className="w-24 h-24 bg-white rounded-full p-1 shadow-xl">
                                            {employee?.profile_picture_url ? (
                                                <img
                                                    src={employee.profile_picture_url}
                                                    alt="Profile"
                                                    className="w-full h-full rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-3xl">
                                                    {employee?.employee_name?.substring(0, 1)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Info */}
                                <div className="pt-16 pb-6 px-6 text-center border-b">
                                    <h2 className="text-2xl font-bold text-slate-800 flex items-center justify-center gap-2 uppercase">
                                        {employee?.employee_name}
                                        {employee?.status === 'Active' && (
                                            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-orange-600 font-bold mt-1 uppercase tracking-wider">
                                        {employee?.designation_name}
                                    </p>
                                    <p className="text-slate-500 text-sm mt-1">
                                        {employee?.department_name}
                                    </p>
                                </div>

                                {/* Quick Info */}
                                <div className="px-6 py-4 space-y-3 border-b">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" /> Employee ID
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {employee?.employee_id}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Users className="w-4 h-4" /> Department
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {employee?.department_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Date Of Join
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {employee?.joining_date ? new Date(employee.joining_date).toLocaleDateString() : 'N/A'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Basic Information */}
                            <div className="bg-white mt-6 px-6 pb-6 pt-6 rounded-sm shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800">
                                        Basic Information
                                    </h3>
                                    {/* <Edit className="w-4 h-4 text-slate-400 cursor-pointer hover:text-orange-500" /> */}
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-slate-400" /> Phone
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {employee?.mobile_number}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-slate-400" /> Email
                                        </span>
                                        <span className="font-bold text-blue-600">
                                            {employee?.email}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <User className="w-4 h-4 text-slate-400" /> Gender
                                        </span>
                                        <span className="font-bold text-slate-800">{employee?.gender}</span>
                                    </div>
                                    <div className="flex items-start justify-between py-2">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-slate-400" /> Address
                                        </span>
                                        <span className="font-bold text-slate-800 text-right max-w-[150px]">
                                            {employee?.permanent_address}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Personal Information */}
                            <div className="bg-white mt-6 px-6 pb-6 pt-6 rounded-sm shadow">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-slate-800">
                                        Personal Information
                                    </h3>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-slate-400" /> Aadhar No
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {employee?.aadhar_number}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-slate-400" /> PAN No
                                        </span>
                                        <span className="font-bold text-slate-800">
                                            {employee?.pan_number}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Heart className="w-4 h-4 text-slate-400" /> Marital status
                                        </span>
                                        <span className="font-bold text-slate-800">{employee?.marital_status}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Briefcase className="w-4 h-4 text-slate-400" /> Blood Group
                                        </span>
                                        <span className="font-bold text-slate-800">{employee?.blood_group}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Details */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About Employee */}
                            <div className="bg-white rounded-sm shadow overflow-hidden">
                                <div
                                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b"
                                    onClick={() => toggleSection("about")}
                                >
                                    <h3 className="font-bold text-slate-800 text-lg">
                                        About Employee
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.about ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </div>
                                {expandedSections.about && (
                                    <div className="px-6 py-5 text-slate-600 leading-relaxed bg-slate-0">
                                        As an award winning designer, I deliver exceptional quality
                                        work and bring value to your brand! With 10 years of
                                        experience and 350+ projects completed worldwide with
                                        satisfied customers, I developed the 360° brand approach,
                                        which helped me to create numerous brands that are relevant,
                                        meaningful and loved.
                                    </div>
                                )}
                            </div>

                            {/* Bank Information */}
                            <div className="bg-white rounded-sm shadow border border-gray-100 overflow-hidden">
                                <div
                                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
                                    onClick={() => toggleSection("bank")}
                                >
                                    <h3 className="font-bold text-slate-800 text-lg">
                                        Bank Information
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.bank ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </div>
                                {expandedSections.bank && (
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/30">
                                        <DetailItem label="Account Holder" value={employee?.account_holder_name} />
                                        <DetailItem label="Account Number" value={employee?.account_number} />
                                        <DetailItem label="IFSC Code" value={employee?.ifsc_code} />
                                        <DetailItem label="Branch Name" value={employee?.branch_name} />
                                    </div>
                                )}
                            </div>

                            {/* Family Information */}
                            <div className="bg-white rounded-sm shadow border border-gray-100 overflow-hidden">
                                <div
                                    className="flex items-center justify-between p-6 cursor-pointer hover:bg-slate-50 transition-colors border-b border-gray-100"
                                    onClick={() => toggleSection("family")}
                                >
                                    <h3 className="font-bold text-slate-800 text-lg">
                                        Identity Documents
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <ChevronDown
                                            className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.family ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                </div>
                                {expandedSections.family && (
                                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/30">
                                        <div className="space-y-2 text-center">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aadhar Front</p>
                                            <div className="h-40 bg-white border border-gray-200 rounded-sm overflow-hidden p-2">
                                                {employee?.aadhar_front_url ? <img src={employee.aadhar_front_url} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 italic">No Image</div>}
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-center">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Aadhar Back</p>
                                            <div className="h-40 bg-white border border-gray-200 rounded-sm overflow-hidden p-2">
                                                {employee?.aadhar_back_url ? <img src={employee.aadhar_back_url} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 italic">No Image</div>}
                                            </div>
                                        </div>
                                        <div className="space-y-2 text-center">
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">PAN Card</p>
                                            <div className="h-40 bg-white border border-gray-200 rounded-sm overflow-hidden p-2">
                                                {employee?.pan_card_url ? <img src={employee.pan_card_url} className="w-full h-full object-contain" /> : <div className="w-full h-full flex items-center justify-center text-gray-300 italic">No Image</div>}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

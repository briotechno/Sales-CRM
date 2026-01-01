import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Building2,
  Save,
  Edit2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Users,
  Calendar,
  DollarSign,
  FileText,
  Award,
  Target,
  TrendingUp,
  CheckCircle,
  Upload,
  X,
  Share2,
} from "lucide-react";
import { useGetBusinessInfoQuery, useUpdateBusinessInfoMutation } from "../../store/api/businessApi";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import ShareModal from "../../components/BusinessInfo/ShareModal";

export default function BusinessInfoPage() {
  const { data: businessInfo, isLoading: isFetching } = useGetBusinessInfoQuery();
  const [updateBusinessInfo, { isLoading: isUpdating }] = useUpdateBusinessInfoMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    legal_name: "",
    industry: "Information Technology",
    business_type: "Private Limited Company",
    founded_year: "",
    registration_number: "",
    gst_number: "",
    pan_number: "",
    website: "",
    email: "",
    phone: "",
    street_address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    company_description: "",
    vision: "",
    mission: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
    branch_name: "",
    whatsapp_link: "",
    facebook_link: "",
    linkedin_link: "",
    instagram_link: "",
    youtube_link: "",
    logo: null,
  });

  // Sync with fetched data
  useEffect(() => {
    if (businessInfo) {
      setFormData({
        ...businessInfo,
        logo: null, // Don't overwrite with string URL, wait for file upload
      });
    }
  }, [businessInfo]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await updateBusinessInfo(formData).unwrap();
      toast.success("Business information updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update business information");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
    }
  };

  if (isFetching) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  // const profileLink = `${window.location.origin}/business/${formData.companyName
  //   .toLowerCase()
  //   .replace(/\s+/g, "-")}`;

  const shareOnWhatsApp = () => {
    if (formData.whatsapp_link) {
      window.open(formData.whatsapp_link.startsWith('http') ? formData.whatsapp_link : `https://wa.me/${formData.whatsapp_link}`, "_blank");
    }
  };

  const shareOnFacebook = () => {
    if (formData.facebook_link) window.open(formData.facebook_link, "_blank");
  };

  const shareOnInstagram = () => {
    if (formData.instagram_link) window.open(formData.instagram_link, "_blank");
  };

  const shareOnLinkedIn = () => {
    if (formData.linkedin_link) window.open(formData.linkedin_link, "_blank");
  };

  const shareOnYouTube = () => {
    if (formData.youtube_link) window.open(formData.youtube_link, "_blank");
  };

  const stats = [
    { label: "Years in Business", value: businessInfo?.founded_year ? `${new Date().getFullYear() - businessInfo.founded_year}+` : "0", icon: Calendar, color: "blue" },
    { label: "Total Employees", value: "180", icon: Users, color: "green" },
    { label: "Active Clients", value: "250+", icon: Target, color: "purple" },
    {
      label: "Annual Revenue",
      value: "₹50 Crores",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600 border-blue-500",
      green: "bg-green-100 text-green-600 border-green-500",
      purple: "bg-purple-100 text-purple-600 border-purple-500",
      orange: "bg-orange-100 text-orange-600 border-orange-500",
    };
    return colors[color];
  };

  return (
    <DashboardLayout>
      <div className="p-0 bg-gradient-to-br from-gray-0 to-gray-100 ml-6 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b ">
          <div className="max-w-8xl mx-auto ml-2 px-0 py-4">
            <div className="flex items-center justify-between">
              {/* Left Side */}
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Business Information
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> Settings /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Information
                  </span>
                </p>
              </div>

              {/* Right Side – Added Share Button */}
              <div className="flex items-center mr- gap-3">
                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-5 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </button>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
                  >
                    <Edit2 size={20} />
                    Edit Information
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg flex items-center gap-2 font-semibold disabled:opacity-50"
                    >
                      <Save size={20} />
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto px-0 py-0 mt-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-sm p-8 shadow-md border-l-4 hover:shadow-lg transition-shadow ${getColorClasses(stat.color).split(" ")[2]
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        {stat.label}
                      </p>
                      <h3 className="text-3xl font-bold text-gray-800 mt-2">
                        {stat.value}
                      </h3>
                    </div>
                    <div
                      className={`p-3 rounded-sm ${getColorClasses(stat.color)
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}`}
                    >
                      <Icon size={24} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Company Logo Section */}
          <div className="bg-white rounded-sm shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Building2 className="text-orange-500" size={24} />
              Company Logo & Branding
            </h2>
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-gray-100 border border-gray-200 rounded-sm flex items-center justify-center overflow-hidden">
                {formData.logo_url || formData.logo ? (
                  <img
                    src={formData.logo ? URL.createObjectURL(formData.logo) : `${import.meta.env.VITE_API_BASE_URL.replace('/api/', '')}${formData.logo_url}`}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <span className="text-gray-400 font-bold text-4xl">
                    {formData.company_name?.substring(0, 2).toUpperCase() || "NA"}
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-orange-300 text-orange-600 rounded-sm hover:bg-orange-50 font-semibold pointer-events-none">
                    <Upload size={20} />
                    {formData.logo ? "Change Logo" : "Upload Logo"}
                  </button>
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Recommended size: 512x512 pixels
                </p>
                <p className="text-sm text-gray-600">
                  Accepted formats: JPG, PNG, SVG
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-white rounded-sm shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Building2 className="text-orange-500" size={24} />
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="company_name"
                          value={formData.company_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">
                          {formData.company_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Legal Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="legal_name"
                          value={formData.legal_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium">
                          {formData.legal_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Industry
                      </label>
                      {isEditing ? (
                        <select
                          name="industry"
                          value={formData.industry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option>Information Technology</option>
                          <option>Manufacturing</option>
                          <option>Consulting</option>
                          <option>Finance</option>
                          <option>Healthcare</option>
                          <option>Education</option>
                          <option>Retail</option>
                        </select>
                      ) : (
                        <p className="text-gray-800 font-medium">
                          {formData.industry}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Type
                      </label>
                      {isEditing ? (
                        <select
                          name="business_type"
                          value={formData.business_type}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option>Private Limited Company</option>
                          <option>Public Limited Company</option>
                          <option>Partnership</option>
                          <option>Sole Proprietorship</option>
                          <option>LLP</option>
                        </select>
                      ) : (
                        <p className="text-gray-800 font-medium">
                          {formData.business_type}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Description
                    </label>
                    {isEditing ? (
                      <textarea
                        name="company_description"
                        value={formData.company_description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    ) : (
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {formData.company_description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Legal & Registration */}
              <div className="bg-white rounded-sm shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="text-orange-500" size={24} />
                  Legal & Registration Details
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Founded Year
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="founded_year"
                          value={formData.founded_year}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.founded_year}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Registration Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="registration_number"
                          value={formData.registration_number}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.registration_number}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        GST Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="gst_number"
                          value={formData.gst_number}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.gst_number}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PAN Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pan_number"
                          value={formData.pan_number}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.pan_number}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="bg-white rounded-sm shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <DollarSign className="text-orange-500" size={24} />
                  Banking Information
                </h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Bank Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="bank_name"
                          value={formData.bank_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.bank_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Branch Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="branch_name"
                          value={formData.branch_name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.branch_name}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Account Number
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="account_number"
                          value={formData.account_number}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.account_number}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        IFSC Code
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="ifsc_code"
                          value={formData.ifsc_code}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.ifsc_code}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SOCIAL ICONS — HIDE WHEN EDITING */}
              {!isEditing && (
                <div className="flex flex-wrap justify-start gap-5 p-0 w-full">
                  {/* WhatsApp */}
                  <button
                    onClick={shareOnWhatsApp}
                    className="w-20 h-20 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500 text-white rounded-2xl shadow-xl hover:shadow-2xl  transform transition-all duration-300 active:scale-95 flex items-center justify-center group hover:from-orange-500 hover:via-orange-600 hover:to-red-600"
                  >
                    <svg
                      className="w-12 h-12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={shareOnFacebook}
                    className="w-20 h-20 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 active:scale-95 flex items-center justify-center group hover:from-orange-600 hover:via-orange-700 hover:to-amber-700"
                  >
                    <svg
                      className="w-11 h-11"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </button>

                  {/* LinkedIn */}
                  <button
                    onClick={shareOnLinkedIn}
                    className="w-20 h-20 bg-gradient-to-br from-orange-600 via-red-500 to-pink-500 text-white rounded-2xl shadow-xl hover:shadow-2xl  transform transition-all duration-300 active:scale-95 flex items-center justify-center group hover:from-orange-700 hover:via-red-600 hover:to-pink-600"
                  >
                    <svg
                      className="w-11 h-11"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </button>

                  {/* Instagram */}
                  <button
                    onClick={shareOnInstagram}
                    className="w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 text-white rounded-2xl shadow-xl hover:shadow-2xl  transform transition-all duration-300 active:scale-95 flex items-center justify-center group hover:from-amber-600 hover:via-orange-600 hover:to-red-700"
                  >
                    <svg
                      className="w-11 h-11"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                    </svg>
                  </button>

                  {/* YouTube */}
                  <button
                    onClick={shareOnYouTube}
                    className="w-20 h-20 bg-gradient-to-br from-red-500 via-orange-600 to-yellow-500 text-white rounded-2xl shadow-xl hover:shadow-2xl  transform transition-all duration-300 active:scale-95 flex items-center justify-center group hover:from-red-600 hover:via-orange-700 hover:to-yellow-600"
                  >
                    <svg
                      className="w-12 h-12"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </button>
                </div>
              )}
              {/* END ICON HIDE */}

              {/* EDIT FIELDS */}
              <div className="bg-white rounded-sm shadow-md p-6">
                {isEditing && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                    {/* WhatsApp */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        WhatsApp (Number or Link)
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.whatsapp_link}
                        onChange={(e) =>
                          setFormData({ ...formData, whatsapp_link: e.target.value })
                        }
                        placeholder="e.g. 919876543210 or https://wa.me/..."
                      />
                    </div>

                    {/* Facebook */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Facebook URL
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.facebook_link}
                        onChange={(e) =>
                          setFormData({ ...formData, facebook_link: e.target.value })
                        }
                        placeholder="https://facebook.com/..."
                      />
                    </div>

                    {/* Instagram */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Instagram URL
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.instagram_link}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            instagram_link: e.target.value,
                          })
                        }
                        placeholder="https://instagram.com/..."
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        LinkedIn URL
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.linkedin_link}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedin_link: e.target.value })
                        }
                        placeholder="https://linkedin.com/..."
                      />
                    </div>

                    {/* YouTube */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        YouTube URL
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.youtube_link}
                        onChange={(e) =>
                          setFormData({ ...formData, youtube_link: e.target.value })
                        }
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Contact & Vision */}
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white rounded-sm shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Phone className="text-orange-500" size={24} />
                  Contact Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="d-block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Globe size={16} className="text-orange-500" />
                      Website
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {formData.website}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="d-block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Mail size={16} className="text-orange-500" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {formData.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="d-block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone size={16} className="text-orange-500" />
                      Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {formData.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white rounded-sm shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="text-orange-500" size={24} />
                  Office Address
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="street_address"
                        value={formData.street_address}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium text-sm">
                        {formData.street_address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.state}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Pincode
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.pincode}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.country}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision & Mission */}
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-sm shadow-md p-6 border border-orange-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Award className="text-orange-500" size={24} />
                  Vision & Mission
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vision
                    </label>
                    {isEditing ? (
                      <textarea
                        name="vision"
                        value={formData.vision}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    ) : (
                      <p className="text-gray-800 italic leading-relaxed text-sm">
                        "{formData.vision}"
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Mission
                    </label>
                    {isEditing ? (
                      <textarea
                        name="mission"
                        value={formData.mission}
                        onChange={handleInputChange}
                        rows="2"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    ) : (
                      <p className="text-gray-800 italic leading-relaxed text-sm">
                        "{formData.mission}"
                      </p>
                    )}
                  </div>
                </div>
              </div>



              {/* Verification Status */}
              <div className="bg-white rounded-sm shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Verification Status
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                    <span className="text-sm font-medium text-gray-700">
                      Email Verified
                    </span>
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                    <span className="text-sm font-medium text-gray-700">
                      Phone Verified
                    </span>
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-sm border border-green-200">
                    <span className="text-sm font-medium text-gray-700">
                      GST Verified
                    </span>
                    <CheckCircle className="text-green-600" size={20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        companyName={formData.company_name}
        businessId={businessInfo?.id}
      />
    </DashboardLayout>
  );
}

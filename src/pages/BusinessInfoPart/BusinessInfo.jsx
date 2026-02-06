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
  Target,
  TrendingUp,
  CheckCircle,
  Upload,
  X,
  Share2,
  Plus,
  Facebook,
  Linkedin,
  Instagram,
  FileText,
  Award,
  Handshake,
} from "lucide-react";
import { useGetBusinessInfoQuery, useUpdateBusinessInfoMutation } from "../../store/api/businessApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useGetClientsQuery } from "../../store/api/clientApi";
import { useGetQuotationsQuery } from "../../store/api/quotationApi";
import { useGetLeadsQuery } from "../../store/api/leadApi";
import { toast } from "react-hot-toast";
import { useEffect } from "react";
import ShareModal from "../../components/BusinessInfo/ShareModal";
import NumberCard from "../../components/NumberCard";

export default function BusinessInfoPage() {
  const { data: businessInfo, isLoading: isFetching } = useGetBusinessInfoQuery();
  const [updateBusinessInfo, { isLoading: isUpdating }] = useUpdateBusinessInfoMutation();

  // Fetch dynamic data for metrics
  const { data: employeesData } = useGetEmployeesQuery({ page: 1, limit: 1000, status: 'All' });
  const { data: clientsData } = useGetClientsQuery({});
  const { data: quotationsData } = useGetQuotationsQuery({ page: 1, limit: 1000, status: 'All' });
  const { data: leadsData } = useGetLeadsQuery({ page: 1, limit: 1000, status: 'All' });

  const [isEditing, setIsEditing] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ vision: false, mission: false });
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
    twitter_link: "",
    contact_person: "",
    designation: "",
    alternate_phone: "",
    google_maps_link: "",
    logo: null,
    social_links: [],
  });

  // Sync with fetched data
  useEffect(() => {
    if (businessInfo) {
      setFormData(prev => {
        const newData = { ...prev };
        Object.keys(businessInfo).forEach(key => {
          if (businessInfo[key] !== null && businessInfo[key] !== undefined && businessInfo[key] !== "") {
            newData[key] = businessInfo[key];
          }
        });

        // Handle social_links specifically if it's already an object/array from API
        if (businessInfo.social_links) {
          newData.social_links = Array.isArray(businessInfo.social_links)
            ? businessInfo.social_links
            : [];
        } else {
          // Backward compatibility: if social_links is empty, try to populate from individual fields
          const legacyLinks = [];
          if (businessInfo.whatsapp_link) legacyLinks.push({ platform: 'WhatsApp', url: businessInfo.whatsapp_link });
          if (businessInfo.facebook_link) legacyLinks.push({ platform: 'Facebook', url: businessInfo.facebook_link });
          if (businessInfo.linkedin_link) legacyLinks.push({ platform: 'LinkedIn', url: businessInfo.linkedin_link });
          if (businessInfo.instagram_link) legacyLinks.push({ platform: 'Instagram', url: businessInfo.instagram_link });
          if (businessInfo.youtube_link) legacyLinks.push({ platform: 'YouTube', url: businessInfo.youtube_link });
          if (businessInfo.twitter_link) legacyLinks.push({ platform: 'Twitter', url: businessInfo.twitter_link });
          newData.social_links = legacyLinks;
        }

        return { ...newData, logo: null };
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
    // Prepare trimmed data safely
    const trimmedSocialLinks = (formData.social_links || []).map(link => ({
      ...link,
      url: (link.url || "").trim()
    }));

    // Basic validation for social links
    if (trimmedSocialLinks.length > 0) {
      for (const link of trimmedSocialLinks) {
        const platformName = link.platform || "Platform";
        const url = link.url;

        if (!url) {
          toast.error(`Please provide a URL or username for ${platformName}`);
          return;
        }

        const platform = platformName.toLowerCase();

        if (platform === 'whatsapp') {
          // WhatsApp: Must be a number (8-15 digits) or a valid wa.me link
          const isPhone = /^\+?[\d\s-]{8,15}$/.test(url.replace(/\s/g, ''));
          const isUrl = url.toLowerCase().includes('wa.me') || url.toLowerCase().includes('whatsapp.com');
          if (!isPhone && !isUrl) {
            toast.error(`Invalid format for WhatsApp. Please enter a phone number or a wa.me link.`);
            return;
          }
        } else if (platform === 'website') {
          // Website: Must contain a dot and look like a URL
          if (!url.includes('.') || (!url.toLowerCase().startsWith('http') && !url.toLowerCase().startsWith('www'))) {
            toast.error("Please enter a valid Website URL (e.g. https://www.example.com)");
            return;
          }
        } else if (platform !== 'other') {
          // General platforms (Facebook, Instagram, LinkedIn, etc.)
          const isUrl = url.toLowerCase().startsWith('http');
          const platformKey = platform.replace(/\s+/g, '');

          if (isUrl) {
            // If it's a full URL, it MUST match the platform
            if (!url.toLowerCase().includes(platformKey)) {
              toast.error(`This doesn't look like a valid ${platformName} link. Please check the URL.`);
              return;
            }
          } else {
            // If it's a username, it shouldn't contain spaces and should have some length
            if (url.includes(' ') || url.length < 2) {
              toast.error(`Please enter a valid ${platformName} username or full profile link.`);
              return;
            }

            // For YouTube/LinkedIn etc., if they just put "sssss", we might want to warn or error
            // but many users use just handles. However, if it's clearly garbage:
            if (/^[a-zA-Z0-9_.-]+$/.test(url)) {
              // This is a valid handle format
            } else {
              toast.error(`Invalid characters in ${platformName} username.`);
              return;
            }
          }
        }
      }
    }

    const dataToSave = {
      ...formData,
      social_links: trimmedSocialLinks
    };

    try {
      await updateBusinessInfo(dataToSave).unwrap();
      toast.success("Business information updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update business information");
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1MB Size Validation
      if (file.size > 1024 * 1024) {
        toast.error("File size must be less than 1MB");
        return;
      }

      // PNG, JPG, SVG Type Validation
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"];
      const allowedExtensions = [".png", ".jpg", ".jpeg", ".svg"];
      const fileExtension = file.name.slice(((file.name.lastIndexOf(".") - 1) >>> 0) + 2).toLowerCase();

      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes("." + fileExtension)) {
        toast.error("Only PNG, JPG, and SVG formats are allowed");
        return;
      }

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

  const shareOnTwitter = () => {
    if (formData.twitter_link) window.open(formData.twitter_link, "_blank");
  };

  // Calculate dynamic metrics
  const totalEmployees = employeesData?.pagination?.total || 0;
  const activeClients = clientsData?.data?.filter(client => client.status === 'active').length || 0;
  const totalLeads = leadsData?.pagination?.total || 0;
  const yearsInBusiness = businessInfo?.founded_year ? new Date().getFullYear() - businessInfo.founded_year : 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header - Synchronized with AllToDo Structure */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Logo */}
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-sm flex items-center justify-center p-2 shadow-sm overflow-hidden text-center">
                    {businessInfo?.logo_url ? (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/', '')}${businessInfo.logo_url}`}
                        alt={businessInfo.company_name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Building2 size={32} className="text-[#FF7B1D]" />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {businessInfo?.company_name || "Company Name"}
                  </h1>
                  <p className="text-xs font-bold text-[#FF7B1D] uppercase tracking-widest mt-1">
                    {businessInfo?.industry || "Manufacturing"}
                  </p>
                </div>
              </div>

              {/* Top Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (!businessInfo?.id) {
                      toast.error("Please save your business information first to enable sharing.");
                      return;
                    }
                    setIsShareModalOpen(true);
                  }}
                  className="px-5 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 font-semibold text-gray-700 flex items-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </button>

                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
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

        <div className="max-w-8xl mx-auto px-4 pb-4 pt-2 mt-0 font-primary w-full flex-1">
          {/* Stats Cards - Dynamic with NumberCard Component */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
            <NumberCard
              title="Years in Business"
              number={yearsInBusiness > 0 ? `${yearsInBusiness}+` : "0"}
              icon={<Calendar className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Total Employees"
              number={totalEmployees}
              icon={<Users className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Active Clients"
              number={activeClients}
              icon={<Target className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
            <NumberCard
              title="Total Leads"
              number={totalLeads}
              icon={<Handshake className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
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
                    accept=".png,.jpg,.jpeg,.svg"
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
                          placeholder="e.g. Acme Corporation"
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
                          placeholder="e.g. Acme Corp Pvt Ltd"
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
                          <option value="">Choose Industry...</option>
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
                          <option value="">Choose Business Type...</option>
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
                        placeholder="Tell us about your company..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    ) : (
                      <p className="text-gray-700 leading-relaxed text-sm">
                        {formData.company_description.slice(0, 800)}
                        {formData.company_description.length > 800 && "..."}
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
                          placeholder="e.g. 2020"
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
                          placeholder="e.g. U12345MH2020PTC123456"
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
                          placeholder="e.g. 27AAAAA0000A1Z5"
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
                          placeholder="e.g. ABCDE1234F"
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
                          placeholder="e.g. HDFC Bank"
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
                          placeholder="e.g. Mumbai Main Branch"
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
                          placeholder="e.g. 50100012345678"
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
                          placeholder="e.g. HDFC0000001"
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
                        placeholder="Your company's long-term vision..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    ) : (
                      <p className="text-gray-800 italic leading-relaxed text-sm break-words">
                        "
                        {formData.vision?.length > 400 && !expandedSections.vision
                          ? `${formData.vision.slice(0, 400)}...`
                          : formData.vision}
                        "
                        {formData.vision?.length > 400 && (
                          <button
                            onClick={() => setExpandedSections(prev => ({ ...prev, vision: !prev.vision }))}
                            className="text-orange-600 font-bold ml-2 hover:underline focus:outline-none"
                          >
                            {expandedSections.vision ? "Read Less" : "Read More"}
                          </button>
                        )}
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
                        placeholder="Your company's immediate mission..."
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      ></textarea>
                    ) : (
                      <p className="text-gray-800 italic leading-relaxed text-sm break-words">
                        "
                        {formData.mission?.length > 400 && !expandedSections.mission
                          ? `${formData.mission.slice(0, 400)}...`
                          : formData.mission}
                        "
                        {formData.mission?.length > 400 && (
                          <button
                            onClick={() => setExpandedSections(prev => ({ ...prev, mission: !prev.mission }))}
                            className="text-orange-600 font-bold ml-2 hover:underline focus:outline-none"
                          >
                            {expandedSections.mission ? "Read Less" : "Read More"}
                          </button>
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Social Presence View Mode - Dynamic (Now below Banking Information) */}
              {!isEditing && (
                <div className="bg-white rounded-sm shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Share2 className="text-orange-500" size={24} />
                    Social Presence
                  </h2>
                  {formData.social_links?.length > 0 ? (
                    <div className="flex flex-wrap gap-4">
                      {formData.social_links.map((link, index) => {
                        const getIcon = (platform) => {
                          switch (platform.toLowerCase()) {
                            case "whatsapp":
                              return (
                                <svg
                                  className="w-6 h-6"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                              );
                            case "facebook":
                              return <Facebook size={24} />;
                            case "linkedin":
                              return <Linkedin size={24} />;
                            case "instagram":
                              return <Instagram size={24} />;
                            case "youtube":
                              return (
                                <svg
                                  className="w-6 h-6"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                              );
                            case "twitter":
                            case "x":
                              return (
                                <svg
                                  className="w-6 h-6"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                >
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" />
                                </svg>
                              );
                            default:
                              return <Globe size={24} />;
                          }
                        };

                        const getBgColor = (platform) => {
                          switch (platform.toLowerCase()) {
                            case "whatsapp":
                              return "hover:bg-green-500 hover:text-white text-green-600 bg-green-50 border-green-100";
                            case "facebook":
                              return "hover:bg-blue-600 hover:text-white text-blue-700 bg-blue-50 border-blue-100";
                            case "linkedin":
                              return "hover:bg-blue-700 hover:text-white text-blue-800 bg-blue-50 border-blue-100";
                            case "instagram":
                              return "hover:bg-pink-600 hover:text-white text-pink-600 bg-pink-50 border-pink-100";
                            case "youtube":
                              return "hover:bg-red-600 hover:text-white text-red-600 bg-red-50 border-red-100";
                            case "twitter":
                            case "x":
                              return "hover:bg-black hover:text-white text-gray-800 bg-gray-50 border-gray-200";
                            default:
                              return "hover:bg-orange-600 hover:text-white text-orange-600 bg-orange-50 border-orange-100";
                          }
                        };

                        return (
                          <a
                            key={index}
                            href={
                              link.url.startsWith("http") ||
                                link.platform.toLowerCase() !== "whatsapp"
                                ? link.url
                                : `https://wa.me/${link.url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-sm ${getBgColor(
                              link.platform
                            )}`}
                            title={`${link.platform}: ${link.url}`}
                          >
                            {getIcon(link.platform)}
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed border-gray-100 rounded-sm bg-gray-50/50 group hover:border-orange-100 transition-colors">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform duration-500">
                        <Share2
                          className="text-gray-300 group-hover:text-orange-300 transition-colors"
                          size={32}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-gray-700 mb-1">
                        Expand Your Reach
                      </h3>
                      <p className="text-gray-500 text-sm text-center mb-6 max-w-sm">
                        Connect your social media profiles and websites to build
                        trust and strengthen your online presence.
                      </p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all font-bold shadow-md hover:shadow-lg active:scale-95"
                      >
                        <Plus size={20} />
                        Add Social Presence
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* EDIT FIELDS */}
              {isEditing && (
                <div className="bg-white rounded-sm shadow-md p-6">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      <Share2 className="text-orange-500" size={20} />
                      Dynamic Social Links
                    </h3>

                    <div className="space-y-4">
                      {formData.social_links.map((link, index) => (
                        <div key={index} className="flex gap-3 items-end bg-gray-50 p-4 rounded-sm border border-gray-100 relative group">
                          <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                              Platform
                            </label>
                            <select
                              className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                              value={link.platform}
                              onChange={(e) => {
                                const newLinks = [...formData.social_links];
                                newLinks[index] = { ...newLinks[index], platform: e.target.value };
                                setFormData({ ...formData, social_links: newLinks });
                              }}
                            >
                              <option>WhatsApp</option>
                              <option>Facebook</option>
                              <option>LinkedIn</option>
                              <option>Instagram</option>
                              <option>YouTube</option>
                              <option>Twitter</option>
                              <option>Threads</option>
                              <option>TikTok</option>
                              <option>Website</option>
                              <option>Other</option>
                            </select>
                          </div>
                          <div className="flex-[2]">
                            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">
                              URL or Username
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                              value={link.url}
                              onChange={(e) => {
                                const newLinks = [...formData.social_links];
                                newLinks[index] = { ...newLinks[index], url: e.target.value };
                                setFormData({ ...formData, social_links: newLinks });
                              }}
                              placeholder={link.platform === 'WhatsApp' ? 'e.g. 919876543210' : 'https://...'}
                            />
                          </div>
                          <button
                            onClick={() => {
                              const newLinks = formData.social_links.filter((_, i) => i !== index);
                              setFormData({ ...formData, social_links: newLinks });
                            }}
                            className="p-2.5 text-red-500 hover:bg-red-50 rounded-sm transition-colors border border-transparent hover:border-red-100"
                            title="Remove Link"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setFormData({
                          ...formData,
                          social_links: [...formData.social_links, { platform: 'LinkedIn', url: '' }]
                        });
                      }}
                      className="w-full py-3 border-2 border-dashed border-gray-200 text-gray-500 rounded-sm hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <Share2 size={20} />
                      Add Social Link
                    </button>
                  </div>
                </div>
              )}
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
                        placeholder="e.g. https://www.acme.com"
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
                        placeholder="e.g. info@acme.com"
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
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {formData.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="d-block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Phone size={16} className="text-orange-500" />
                      Alternate Phone
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="alternate_phone"
                        value={formData.alternate_phone}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 98765 43211"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {formData.alternate_phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="d-block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Users size={16} className="text-orange-500" />
                      Contact Person
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contact_person"
                        value={formData.contact_person}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {formData.contact_person}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="d-block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Award size={16} className="text-orange-500" />
                      Designation
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="e.g. Managing Director"
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    ) : (
                      <p className="text-gray-800 font-medium">
                        {formData.designation}
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
                        placeholder="e.g. 123 Business Hub, MG Road"
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
                          placeholder="e.g. Mumbai"
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
                          placeholder="e.g. Maharashtra"
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
                          placeholder="e.g. 400001"
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
                          placeholder="e.g. India"
                          className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : (
                        <p className="text-gray-800 font-medium text-sm">
                          {formData.country}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Google Maps Link
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="google_maps_link"
                        value={formData.google_maps_link}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="https://goo.gl/maps/..."
                      />
                    ) : (
                      <a
                        href={formData.google_maps_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:underline text-sm font-medium flex items-center gap-1"
                      >
                        <Globe size={14} />
                        View on Google Maps
                      </a>
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

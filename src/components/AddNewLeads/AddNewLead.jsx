import React, { useState } from "react";
import {
  X,
  User,
  Building2,
  FileText,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Tag,
} from "lucide-react";
// Ahi karvanu
const inputStyles =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300";

export default function AddNewLead({ isOpen, onClose }) {
  const [leadType, setLeadType] = useState("person");
  const [visibility, setVisibility] = useState("public");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    leadName: "",
    source: "",
    status: "",
    tags: "",
    visibility: "public",
    fullName: "",
    gender: "",
    dob: "",
    mobileNumber: "",
    altMobileNumber: "",
    emailId: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    interestedIn: "",
    budget: "",
    organizationName: "",
    industryType: "",
    website: "",
    companyEmail: "",
    companyPhone: "",
    gstPanNumber: "",
    orgAddress: "",
    orgCity: "",
    orgState: "",
    orgPincode: "",
    primaryContactName: "",
    primaryDob: "",
    designation: "",
    primaryMobile: "",
    primaryEmail: "",
    orgInterestedIn: "",
    estimatedDealValue: "",
    leadsOwner: "",
  });

  const leadOwners = [
    { id: 1, name: "Anish Kumar", role: "Team Lead" },
    { id: 2, name: "Priya Sharma", role: "Sales Manager" },
    { id: 3, name: "Rahul Verma", role: "Senior Executive" },
    { id: 4, name: "Sneha Patel", role: "Manager" },
    { id: 5, name: "Vikram Singh", role: "Team Lead" },
    { id: 6, name: "Neha Gupta", role: "Assistant Manager" },
    { id: 7, name: "Amit Mishra", role: "Director" },
    { id: 8, name: "Kavita Reddy", role: "Regional Head" },
  ];

  const handleSubmit = () => {
    console.log("Lead Submitted:", { leadType, ...formData });
    alert("Lead added successfully!");
    onClose();
  };

  if (!isOpen) return null;
  const handleTagsChange = (value) => {
    // Convert comma-separated text → clean array
    const tagsArray = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Store both raw string + processed array
    setFormData({
      ...formData,
      tags: value,
      tagsArray: tagsArray,
    });
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-sm shadow-sm w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600  text-white rounded-t-sm px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <User size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Lead</h2>
                <p className="text-sm text-white text-opacity-90 mt-1">
                  Create new lead for your organization
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-orange-700 p-1 rounded-sm transition-colors"
            >
              <X size={22} className="text-white" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 max-h-[70vh]">
          {/* Lead Name */}
          <div className="group">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText size={16} className="text-[#FF7B1D]" />
              Lead Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Lead Name"
              className={inputStyles}
              value={formData.leadName}
              onChange={(e) =>
                setFormData({ ...formData, leadName: e.target.value })
              }
              required
            />
          </div>

          {/* Lead Type */}
          <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-100">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Briefcase size={16} className="text-[#FF7B1D]" />
              Lead Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="person"
                  checked={leadType === "person"}
                  onChange={(e) => setLeadType(e.target.value)}
                  className="w-5 h-5 text-[#FF7B1D] "
                />
                <span className="ml-3 text-sm font-semibold text-gray-800 group-hover:text-[#FF7B1D] transition-colors">
                  Person
                </span>
              </label>
              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="organization"
                  checked={leadType === "organization"}
                  onChange={(e) => setLeadType(e.target.value)}
                  className="w-5 h-5 text-[#FF7B1D] "
                />
                <span className="ml-3 text-sm font-semibold text-gray-800 group-hover:text-[#FF7B1D] transition-colors">
                  Organization
                </span>
              </label>
            </div>
          </div>

          {/* Person Details */}
          {leadType === "person" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[#FF7B1D]">
                <User size={20} className="text-[#FF7B1D]" />
                <h3 className="text-lg font-bold text-gray-900">
                  Person Details
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User size={14} className="text-[#FF7B1D]" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className={inputStyles}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User size={14} className="text-[#FF7B1D]" />
                    Gender
                  </label>
                  <div className="relative">
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className={
                        inputStyles + " appearance-none cursor-pointer"
                      }
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={14} className="text-[#FF7B1D]" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={inputStyles}
                    value={formData.dob}
                    onChange={(e) =>
                      setFormData({ ...formData, dob: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={14} className="text-[#FF7B1D]" />
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    className={inputStyles}
                    value={formData.mobileNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, mobileNumber: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={14} className="text-[#FF7B1D]" />
                    Alt Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter alternate mobile"
                    className={inputStyles}
                    value={formData.altMobileNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        altMobileNumber: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={14} className="text-[#FF7B1D]" />
                    Email ID
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className={inputStyles}
                    value={formData.emailId}
                    onChange={(e) =>
                      setFormData({ ...formData, emailId: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    Location / Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className={inputStyles}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    className={inputStyles}
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    className={inputStyles}
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    className={inputStyles}
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={14} className="text-[#FF7B1D]" />
                    Interested In
                  </label>

                  <select
                    className={inputStyles}
                    value={formData.interestedIn}
                    onChange={(e) =>
                      setFormData({ ...formData, interestedIn: e.target.value })
                    }
                  >
                    <option value="">Select an option</option>
                    <option value="Product Demo">Product Demo</option>
                    <option value="Pricing Info">Pricing Info</option>
                    <option value="Support">Support</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <IndianRupee size={14} className="text-[#FF7B1D]" />
                    Budget / Expected Value
                  </label>
                  <input
                    type="text"
                    placeholder="Enter budget"
                    className={inputStyles}
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Organization Details */}
          {leadType === "organization" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b-2 border-[#FF7B1D]">
                <Building2 size={20} className="text-[#FF7B1D]" />
                <h3 className="text-lg font-bold text-gray-900">
                  Organization Details
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Building2 size={14} className="text-[#FF7B1D]" />
                    Organization Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter organization name"
                    className={inputStyles}
                    value={formData.organizationName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        organizationName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Briefcase size={14} className="text-[#FF7B1D]" />
                    Industry Type
                  </label>

                  <select
                    className={inputStyles}
                    value={formData.industryType}
                    onChange={(e) =>
                      setFormData({ ...formData, industryType: e.target.value })
                    }
                  >
                    <option value="">Select industry</option>
                    <option value="Information Technology">
                      Information Technology
                    </option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Retail">Retail</option>
                    <option value="Education">Education</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Construction">Construction</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={14} className="text-[#FF7B1D]" />
                    Website
                  </label>
                  <input
                    type="text"
                    placeholder="Enter website URL"
                    className={inputStyles}
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={14} className="text-[#FF7B1D]" />
                    Company Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter company email"
                    className={inputStyles}
                    value={formData.companyEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, companyEmail: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={14} className="text-[#FF7B1D]" />
                    Company Phone
                  </label>
                  <input
                    type="text"
                    placeholder="Enter company phone"
                    className={inputStyles}
                    value={formData.companyPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, companyPhone: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={14} className="text-[#FF7B1D]" />
                    GST / PAN Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter GST/PAN number"
                    className={inputStyles}
                    value={formData.gstPanNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, gstPanNumber: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className={inputStyles}
                    value={formData.orgAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, orgAddress: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    className={inputStyles}
                    value={formData.orgCity}
                    onChange={(e) =>
                      setFormData({ ...formData, orgCity: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="Enter state"
                    className={inputStyles}
                    value={formData.orgState}
                    onChange={(e) =>
                      setFormData({ ...formData, orgState: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    Pincode
                  </label>
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    className={inputStyles}
                    value={formData.orgPincode}
                    onChange={(e) =>
                      setFormData({ ...formData, orgPincode: e.target.value })
                    }
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2 mt-4 mb-2">
                  <User size={18} className="text-[#FF7B1D]" />
                  <h4 className="font-bold text-gray-800 text-base">
                    Primary Contact Person
                  </h4>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User size={14} className="text-[#FF7B1D]" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    className={inputStyles}
                    value={formData.primaryContactName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryContactName: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={14} className="text-[#FF7B1D]" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={inputStyles}
                    value={formData.primaryDob}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryDob: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Briefcase size={14} className="text-[#FF7B1D]" />
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="Enter designation"
                    className={inputStyles}
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={14} className="text-[#FF7B1D]" />
                    Mobile Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter mobile number"
                    className={inputStyles}
                    value={formData.primaryMobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        primaryMobile: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={14} className="text-[#FF7B1D]" />
                    Email ID
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className={inputStyles}
                    value={formData.primaryEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, primaryEmail: e.target.value })
                    }
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={14} className="text-[#FF7B1D]" />
                    Interested In
                  </label>

                  <select
                    className={inputStyles}
                    value={formData.interestedIn}
                    onChange={(e) =>
                      setFormData({ ...formData, interestedIn: e.target.value })
                    }
                  >
                    <option value="">Select an option</option>
                    <option value="Product Demo">Product Demo</option>
                    <option value="Pricing Info">Pricing Info</option>
                    <option value="Support">Support</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <IndianRupee size={14} className="text-[#FF7B1D]" />
                    Estimated Deal Value
                  </label>
                  <input
                    type="text"
                    placeholder="Enter estimated value"
                    className={inputStyles}
                    value={formData.estimatedDealValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedDealValue: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Lead Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b-2 border-[#FF7B1D]">
              <FileText size={20} className="text-[#FF7B1D]" />
              <h3 className="text-lg font-bold text-gray-900">Lead Info</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {/* Leads Owner */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User size={14} className="text-[#FF7B1D]" />
                  Leads Owner <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.leadsOwner}
                    onChange={(e) =>
                      setFormData({ ...formData, leadsOwner: e.target.value })
                    }
                    className={inputStyles + " appearance-none cursor-pointer"}
                  >
                    <option value="">Select Lead Owner</option>
                    {leadOwners.map((owner) => (
                      <option key={owner.id} value={owner.id}>
                        {owner.name} - {owner.role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={14} className="text-[#FF7B1D]" />
                  Source
                </label>

                <select
                  className={inputStyles}
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                >
                  <option value="">Select lead source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Email Campaign">Email Campaign</option>

                  <option value="Partner">Partner</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Tags */}
              <div className="group col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Tag size={14} className="text-[#FF7B1D]" />
                  Tags{" "}
                  <span className="text-xs text-gray-400 ml-2">
                    (Press Enter to add)
                  </span>
                </label>

                <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-lg focus-within:border-[#FF7B1D] bg-white">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] text-white text-sm font-medium rounded-full"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:bg-white hover:bg-opacity-20 rounded-full p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}

                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={
                      tags.length === 0
                        ? "Type and press Enter to add tags..."
                        : "Add more..."
                    }
                    className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
                  />
                </div>
              </div>

              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase size={14} className="text-[#FF7B1D]" />
                  Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className={inputStyles + " appearance-none cursor-pointer"}
                  >
                    <option value="">Select Status</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="closed">Closed</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="col-span-2 bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex gap-6 items-center">
                  <span className="text-sm font-semibold text-gray-800">
                    Visibility:
                  </span>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      value="public"
                      checked={visibility === "public"}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-4 h-4 text-[#FF7B1D] "
                    />
                    <span className="ml-2 text-sm font-medium text-gray-800 group-hover:text-[#FF7B1D] transition-colors">
                      Public
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      value="private"
                      checked={visibility === "private"}
                      onChange={(e) => setVisibility(e.target.value)}
                      className="w-4 h-4 text-orange-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-800">
                      Private
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50 shadow-inner">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 rounded-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-700 hover:to-orange-700 rounded-sm shadow-md hover:shadow-lg transition-all"
            >
              Add Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

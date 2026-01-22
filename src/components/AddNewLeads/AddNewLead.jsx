import React, { useState, useEffect } from "react";
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
  Layers,
  Workflow
} from "lucide-react";
import { useCreateLeadMutation, useUpdateLeadMutation } from "../../store/api/leadApi";
import { useGetPipelinesQuery } from "../../store/api/pipelineApi";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { toast } from "react-hot-toast";

const inputStyles =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300";

export default function AddNewLead({ isOpen, onClose, leadToEdit = null }) {
  const [createLead, { isLoading: isCreating }] = useCreateLeadMutation();
  const [updateLead, { isLoading: isUpdating }] = useUpdateLeadMutation();
  const { data: pipelines } = useGetPipelinesQuery();
  const { data: employeesData } = useGetEmployeesQuery({ limit: 100 });

  const employees = employeesData?.employees || [];



  const [leadType, setLeadType] = useState("Person");
  const [visibility, setVisibility] = useState("Public");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    name: "", // Lead Name
    lead_source: "",
    status: "Active", // Default status
    visibility: "Public",

    // Person Details
    full_name: "",
    gender: "",
    dob: null,
    mobile_number: "",
    alt_mobile_number: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    // Org Details
    organization_name: "",
    industry_type: "",
    website: "",
    company_email: "",
    company_phone: "",
    gst_pan_number: "",
    org_address: "",
    org_city: "",
    org_state: "",
    org_pincode: "",
    primary_contact_name: "",
    primary_dob: null,
    designation: "",
    primary_mobile: "",
    primary_email: "",

    // Common
    interested_in: "",
    value: "", // Budget/Expected Value
    owner: "", // Leads Owner (User ID)
    pipeline_id: "",
    stage_id: "",
    description: ""
  });

  // Derive stages from selected pipeline
  const selectedPipeline = pipelines?.find(p => p.id == formData.pipeline_id);
  const filteredStages = selectedPipeline?.stages || [];

  // Load data if editing
  useEffect(() => {
    if (leadToEdit) {
      setLeadType(leadToEdit.type || "Person");
      setVisibility(leadToEdit.visibility || "Public");
      setTags(leadToEdit.tag ? leadToEdit.tag.split(',').map(t => t.trim()) : []);

      setFormData({
        name: leadToEdit.name || "",
        lead_source: leadToEdit.lead_source || "",
        status: leadToEdit.status || "Active",
        visibility: leadToEdit.visibility || "Public",
        full_name: leadToEdit.full_name || "",
        gender: leadToEdit.gender || "",
        dob: leadToEdit.dob ? leadToEdit.dob.split('T')[0] : null,
        mobile_number: leadToEdit.mobile_number || "",
        alt_mobile_number: leadToEdit.alt_mobile_number || "",
        email: leadToEdit.email || "",
        address: leadToEdit.address || "",
        city: leadToEdit.city || "",
        state: leadToEdit.state || "",
        pincode: leadToEdit.pincode || "",

        organization_name: leadToEdit.organization_name || "",
        industry_type: leadToEdit.industry_type || "",
        website: leadToEdit.website || "",
        company_email: leadToEdit.company_email || "",
        company_phone: leadToEdit.company_phone || "",
        gst_pan_number: leadToEdit.gst_pan_number || "",
        org_address: leadToEdit.org_address || "",
        org_city: leadToEdit.org_city || "",
        org_state: leadToEdit.org_state || "",
        org_pincode: leadToEdit.org_pincode || "",
        primary_contact_name: leadToEdit.primary_contact_name || "",
        primary_dob: leadToEdit.primary_dob ? leadToEdit.primary_dob.split('T')[0] : "",
        designation: leadToEdit.designation || "",
        primary_mobile: leadToEdit.primary_mobile || "",
        primary_email: leadToEdit.primary_email || "",

        interested_in: leadToEdit.interested_in || "",
        value: leadToEdit.value || "",
        owner: leadToEdit.owner || "",
        pipeline_id: leadToEdit.pipeline_id || "",
        stage_id: leadToEdit.stage_id || "",
        description: leadToEdit.description || ""
      });
    }
  }, [leadToEdit]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name) return toast.error("Lead Name is required");
    if (leadType === 'Person' && !formData.mobile_number) return toast.error("Mobile Number is required for Person");
    if (!formData.pipeline_id) return toast.error("Pipeline is required");
    if (!formData.stage_id) return toast.error("Stage is required");

    const payload = {
      ...formData,
      type: leadType,
      tag: tags.join(','), // Assuming backend expects comma separated string
      visibility,
      value: Number(formData.value) || 0
    };

    try {
      if (leadToEdit) {
        await updateLead({ id: leadToEdit.id, data: payload }).unwrap();
        toast.success("Lead updated successfully!");
      } else {
        await createLead(payload).unwrap();
        toast.success("Lead added successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Failed to save lead:", error);
      // Don't show toast for limit errors, global modal handles that
      if (!error?.data?.limitReached && error.status !== 402) {
        toast.error(error?.data?.message || "Failed to save lead");
      }
    }
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



  if (!isOpen) return null;

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
                <h2 className="text-2xl font-bold">{leadToEdit ? "Edit Lead" : "Add New Lead"}</h2>
                <p className="text-sm text-white text-opacity-90 mt-1">
                  {leadToEdit ? "Update lead details" : "Create new lead for your organization"}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead Name */}
            <div className="group col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={16} className="text-[#FF7B1D]" />
                Lead Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter Lead Name"
                className={inputStyles}
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Pipeline */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Workflow size={16} className="text-[#FF7B1D]" />
                Pipeline <span className="text-red-500">*</span>
              </label>
              <select
                name="pipeline_id"
                value={formData.pipeline_id}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">Select Pipeline</option>
                {pipelines?.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Stage */}
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Layers size={16} className="text-[#FF7B1D]" />
                Stage <span className="text-red-500">*</span>
              </label>
              <select
                name="stage_id"
                value={formData.stage_id}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">Select Stage</option>
                {filteredStages.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
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
                  value="Person"
                  checked={leadType === "Person"}
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
                  value="Organization"
                  checked={leadType === "Organization"}
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
          {leadType === "Person" && (
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
                    name="full_name"
                    placeholder="Enter full name"
                    className={inputStyles}
                    value={formData.full_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <User size={14} className="text-[#FF7B1D]" />
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={inputStyles + " appearance-none cursor-pointer"}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={14} className="text-[#FF7B1D]" />
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="mobile_number"
                    placeholder="Enter mobile number"
                    className={inputStyles}
                    value={formData.mobile_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone size={14} className="text-[#FF7B1D]" />
                    Alt Mobile Number
                  </label>
                  <input
                    type="text"
                    name="alt_mobile_number"
                    placeholder="Enter alternate mobile"
                    className={inputStyles}
                    value={formData.alt_mobile_number}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Mail size={14} className="text-[#FF7B1D]" />
                    Email ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email address"
                    className={inputStyles}
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    Location / Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="Enter address"
                    className={inputStyles}
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="Enter city"
                    className={inputStyles}
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    placeholder="Enter state"
                    className={inputStyles}
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <MapPin size={14} className="text-[#FF7B1D]" />
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    placeholder="Enter pincode"
                    className={inputStyles}
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <FileText size={14} className="text-[#FF7B1D]" />
                    Interested In
                  </label>

                  <select
                    name="interested_in"
                    className={inputStyles}
                    value={formData.interested_in}
                    onChange={handleChange}
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
                    type="number"
                    name="value"
                    placeholder="Enter budget"
                    className={inputStyles}
                    value={formData.value}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Organization Details */}
          {leadType === "Organization" && (
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
                    name="organization_name"
                    placeholder="Enter organization name"
                    className={inputStyles}
                    value={formData.organization_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Briefcase size={14} className="text-[#FF7B1D]" />
                    Industry Type
                  </label>

                  <select
                    name="industry_type"
                    className={inputStyles}
                    value={formData.industry_type}
                    onChange={handleChange}
                  >
                    <option value="">Select industry</option>
                    <option value="Information Technology">IT</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Manufacturing">Manufacturing</option>
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
                    name="website"
                    placeholder="Enter website URL"
                    className={inputStyles}
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
                {/* Add other Org fields similarly if needed, keeping it concise for now */}
              </div>
            </div>
          )}

          {/* Additional Lead Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <User size={14} className="text-[#FF7B1D]" />
                Lead Owner
              </label>
              <select
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">Select Owner</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.user_id || emp.id}>{emp.first_name} {emp.last_name}</option>
                ))}
              </select>
            </div>
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={14} className="text-[#FF7B1D]" />
                Lead Source
              </label>
              <select
                name="lead_source"
                value={formData.lead_source}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="">Select Source</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Social Media">Social Media</option>
                <option value="Email Campaign">Email Campaign</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="group col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FileText size={14} className="text-[#FF7B1D]" />
                Description
              </label>
              <textarea
                name="description"
                rows="3"
                placeholder="Enter description"
                className={inputStyles}
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Tags */}
          <div className="group">
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

          {/* Status & Visibility */}
          <div className="grid grid-cols-2 gap-4">
            <div className="group">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Briefcase size={14} className="text-[#FF7B1D]" />
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-800">Visibility:</span>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="Public"
                  checked={visibility === "Public"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-[#FF7B1D]"
                />
                <span className="ml-2 text-sm text-gray-700">Public</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="visibility"
                  value="Private"
                  checked={visibility === "Private"}
                  onChange={(e) => setVisibility(e.target.value)}
                  className="w-4 h-4 text-[#FF7B1D]"
                />
                <span className="ml-2 text-sm text-gray-700">Private</span>
              </label>
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
              disabled={isCreating || isUpdating}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-700 hover:to-orange-700 rounded-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isCreating || isUpdating ? "Saving..." : leadToEdit ? "Update Lead" : "Add Lead"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

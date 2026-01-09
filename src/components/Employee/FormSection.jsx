import React, { useState } from "react";
import {
  User,
  Briefcase,
  Phone,
  FileText,
  CreditCard,
  Key,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";
import { Country, State, City } from "country-state-city";

const languagesList = [
  "English",
  "Hindi",
  "Mandarin Chinese",
  "Spanish",
  "French",
  "Standard Arabic",
  "Bengali",
  "Russian",
  "Portuguese",
  "Urdu",
  "Indonesian",
  "German",
  "Japanese",
  "Marathi",
  "Telugu",
  "Turkish",
  "Tamil",
  "Vietnamese",
  "Italian",
  "Thai",
  "Gujarati",
  "Kannada",
  "Persian",
  "Polish",
  "Pashto",
  "Dutch",
  "Greek",
  "Amharic",
  "Yoruba",
  "Oromo",
  "Malayalam",
  "Igbo",
  "Sindhi",
  "Nepali",
  "Sinhala",
  "Somali",
  "Khmer",
  "Turkmen",
  "Assamese",
  "Madurese",
  "Hausa",
  "Punjabi",
  "Javanese",
  "Wu Chinese",
  "Korean",
].sort();

const CollapsibleSection = ({ id, title, icon: Icon, children, isCollapsed, onToggle }) => {
  return (
    <div className="border-2 border-gray-200 rounded-sm bg-white shadow-sm overflow-hidden mb-6">
      <div
        className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Icon size={20} className="text-[#FF7B1D]" />
          <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        </div>
        {isCollapsed ? (
          <ChevronDown size={20} className="text-gray-500" />
        ) : (
          <ChevronUp size={20} className="text-gray-500" />
        )}
      </div>
      {!isCollapsed && (
        <div className="p-6 pt-0 border-t-2 border-gray-100 animate-fadeIn overflow-x-auto">
          {children}
        </div>
      )}
    </div>
  );
};

const FormSection = ({ formData, handleChange, handleChanges, setFormData, mode = "full" }) => {
  const [collapsedSections, setCollapsedSections] = useState({
    personal: false,
    job: true,
    contact: true,
    documents: true,
    bank: true,
    login: true,
    permissions: true,
  });

  const [isSameAddress, setIsSameAddress] = useState(false);

  const handlePermanentAddressChange = (e) => {
    const { name, value } = e.target;

    // Call the parent handleChange first
    handleChange(e);

    // If same as permanent is checked, update correspondence address dynamically
    if (isSameAddress) {
      setFormData(prev => {
        const updated = { ...prev, [name]: value };
        const addressParts = [
          updated.permanentAddressLine1,
          updated.permanentAddressLine2,
          updated.permanentAddressLine3,
          updated.permanentCity,
          updated.permanentState,
          updated.permanentCountry,
          updated.permanentPincode
        ].filter(Boolean);

        return {
          ...updated,
          correspondenceAddress: addressParts.join(", ")
        };
      });
    }
  };

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setIsSameAddress(checked);

    if (checked) {
      const addressParts = [
        formData.permanentAddressLine1,
        formData.permanentAddressLine2,
        formData.permanentAddressLine3,
        formData.permanentCity,
        formData.permanentState,
        formData.permanentCountry,
        formData.permanentPincode
      ].filter(Boolean);

      setFormData(prev => ({
        ...prev,
        correspondenceAddress: addressParts.join(", ")
      }));
    }
  };

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const { data: deptData, isLoading: departmentsLoading } = useGetDepartmentsQuery({ limit: 100 });
  const { data: dsgData, isLoading: designationsLoading } = useGetDesignationsQuery({ limit: 100 });

  const departments = deptData?.departments || [];
  const designations = dsgData?.designations || [];

  const inputStyles =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300";

  const selectStyles =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300 appearance-none cursor-pointer";

  const readOnlyStyles =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-sm bg-gray-50 text-sm text-gray-900 font-semibold";

  const fileStyles =
    "w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-700 bg-white hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer";

  const labelStyles =
    "flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2";

  const modules = [
    "Dashboard",
    "CRM Dashboard",
    "HRM Dashboard",
    "Leads Management",
    "Champions Management",
    "Pipeline Management",
    "Client Management",
    "Employee Management",
    "Department Management",
    "Designation Management",
    "Attendance Management",
    "Leave Management",
    "Salary Management",
    "Company Policy",
    "HR Policy",
    "Job Management",
    "Team Management",
    "Quotation",
    "Invoice",
    "Expense Management",
    "Notes",
    "ToDo",
    "Announcement",
    "Notification",
    "Messenger",
    "Catelogs",
    "Business Info",
    "Subscription",
    "FAQ",
    "Terms & Conditions Management",
  ];

  const actions = ["Create", "Read", "Update", "Delete"];

  const handlePermissionChange = (module, action, checked) => {
    const updatedPermissions = { ...formData.permissions };
    if (!updatedPermissions[module]) {
      updatedPermissions[module] = {
        create: false,
        read: false,
        update: false,
        delete: false,
      };
    }
    updatedPermissions[module][action.toLowerCase()] = checked;
    setFormData((prev) => ({ ...prev, permissions: updatedPermissions }));
  };

  const handleSelectAllModule = (module, checked) => {
    const updatedPermissions = { ...formData.permissions };
    updatedPermissions[module] = {
      create: checked,
      read: checked,
      update: checked,
      delete: checked,
    };
    setFormData((prev) => ({ ...prev, permissions: updatedPermissions }));
  };

  const isModuleAllChecked = (module) => {
    const p = formData.permissions?.[module];
    return p && p.create && p.read && p.update && p.delete;
  };

  return (
    <>
      <CollapsibleSection
        id="personal"
        title="Personal Details"
        icon={User}
        isCollapsed={collapsedSections.personal}
        onToggle={() => toggleSection("personal")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className={labelStyles}>Employee ID</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employeeId}
              readOnly
              className={readOnlyStyles + " text-[#FF7B1D]"}
            />
          </div>
          <div>
            <label className={labelStyles}>
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Enter first name"
              value={formData.firstName || ""}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Enter last name"
              value={formData.lastName || ""}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div className="space-y-2">
            <label className={labelStyles}>
              Profile Picture
            </label>

            <div className="flex items-center gap-4">
              <input
                type="file"
                name="profilePic"
                accept="image/*"
                onChange={handleChange}
                className={fileStyles}
              />
              {formData.profilePicPreview && (
                <img
                  src={formData.profilePicPreview}
                  alt="Profile Preview"
                  className="w-18 h-16 object-cover rounded-md border border-gray-200"
                />
              )}
            </div>
          </div>

          <div>
            <label className={labelStyles}>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Age (Auto-calculated)</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              placeholder="Age"
              readOnly
              className={readOnlyStyles}
            />
          </div>

          {mode !== "basic" && (
            <>
              <div>
                <label className={labelStyles}>Gender</label>
                <div className="relative">
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={selectStyles}
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelStyles}>Father's Name</label>
                <input
                  type="text"
                  name="fatherName"
                  placeholder="Enter father's name"
                  value={formData.fatherName}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  placeholder="Enter mother's name"
                  value={formData.motherName}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Marital Status</label>
                <div className="relative">
                  <select
                    name="maritalStatus"
                    value={formData.maritalStatus}
                    onChange={handleChange}
                    className={selectStyles}
                  >
                    <option value="">Select Status</option>
                    <option value="Yes">Married</option>
                    <option value="No">Unmarried</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="job"
        title="Job Details"
        icon={Briefcase}
        isCollapsed={collapsedSections.job}
        onToggle={() => toggleSection("job")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className={labelStyles}>Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>
              Department <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={selectStyles}
              >
                <option value="">Select Department</option>
                {departmentsLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.department_name}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
          <div>
            <label className={labelStyles}>
              Designation <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className={selectStyles}
              >
                <option value="">Select Designation</option>
                {designationsLoading ? (
                  <option disabled>Loading...</option>
                ) : (
                  designations.map((dsg) => (
                    <option key={dsg.id} value={dsg.id}>
                      {dsg.designation_name}
                    </option>
                  ))
                )}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
          <div>
            <label className={labelStyles}>Employee Type</label>
            <div className="relative">
              <select
                name="employeeType"
                value={formData.employeeType}
                onChange={handleChange}
                className={selectStyles}
              >
                <option>Full-Time Employee</option>
                <option>Part-Time Employee</option>
                <option>Contract Employee</option>
                <option>Temporary Employee</option>
                <option>Intern / Trainee</option>
                <option>Freelancer / Consultant</option>
                <option>Probationary Employee</option>
                <option>Casual Employee</option>
                <option>Remote Employee</option>
                <option>Seasonal Employee</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
          <div>
            <label className={labelStyles}>Work Type</label>
            <div className="relative">
              <select
                name="workType"
                value={formData.workType}
                onChange={handleChange}
                className={selectStyles}
              >
                <option>On-Site</option>
                <option>WFH(Remote)</option>
                <option>Hybrid</option>
                <option>Freelance</option>
                <option>Field Work</option>
                <option>Flexible Hours</option>
                <option>Project-Based</option>
                <option>On-Call</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        id="contact"
        title="Contact Information"
        icon={Phone}
        isCollapsed={collapsedSections.contact}
        onToggle={() => toggleSection("contact")}
      >
        <div className="space-y-8">
          {/* Basic Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelStyles}>Personal Mobile <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="mobile"
                placeholder="Enter personal mobile"
                value={formData.mobile}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className={labelStyles}>Work Mobile</label>
              <input
                type="tel"
                name="altMobile"
                placeholder="Enter work mobile"
                value={formData.altMobile}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className={labelStyles}>Personal Email <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                placeholder="Enter personal email"
                value={formData.email}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className={labelStyles}>Work Email</label>
              <input
                type="email"
                name="workEmail"
                placeholder="Enter work email"
                value={formData.workEmail || ""}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>

          {/* Social & Professional */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border-t border-gray-100 pt-6">
            <div>
              <label className={labelStyles}>LinkedIn Profile</label>
              <input
                type="url"
                name="linkedinUrl"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedinUrl || ""}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className={labelStyles}>Skype / Slack ID</label>
              <input
                type="text"
                name="skypeId"
                placeholder="Enter ID"
                value={formData.skypeId || ""}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className={labelStyles}>Emergency Contact (Name/Relation)</label>
              <input
                type="text"
                name="emergencyPerson"
                placeholder="Name - Relation"
                value={formData.emergencyPerson}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className={labelStyles}>Emergency Contact Number</label>
              <input
                type="tel"
                name="emergencyNumber"
                placeholder="Enter emergency number"
                value={formData.emergencyNumber}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t border-gray-100 pt-6">
            {/* Permanent Address Column */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                Permanent Address
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelStyles}>Address Line 1</label>
                  <input
                    type="text"
                    name="permanentAddressLine1"
                    placeholder="House No, Building, Street"
                    value={formData.permanentAddressLine1 || ""}
                    onChange={handlePermanentAddressChange}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Address Line 2</label>
                  <input
                    type="text"
                    name="permanentAddressLine2"
                    placeholder="Locality, Landmark"
                    value={formData.permanentAddressLine2 || ""}
                    onChange={handlePermanentAddressChange}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Address Line 3</label>
                  <input
                    type="text"
                    name="permanentAddressLine3"
                    placeholder="Area, Sector"
                    value={formData.permanentAddressLine3 || ""}
                    onChange={handlePermanentAddressChange}
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className={labelStyles}>Country</label>
                  <div className="relative">
                    <select
                      name="permanentCountry"
                      value={formData.permanentCountry || ""}
                      onChange={handlePermanentAddressChange}
                      className={selectStyles}
                    >
                      <option value="">Select Country</option>
                      {Country.getAllCountries().map((country) => (
                        <option key={country.isoCode} value={country.isoCode}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>State</label>
                  <div className="relative">
                    <select
                      name="permanentState"
                      value={formData.permanentState || ""}
                      onChange={handlePermanentAddressChange}
                      className={selectStyles}
                    >
                      <option value="">Select State</option>
                      {State.getStatesOfCountry(formData.permanentCountry)?.map((state) => (
                        <option key={state.isoCode} value={state.isoCode}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>City</label>
                  <div className="relative">
                    <select
                      name="permanentCity"
                      value={formData.permanentCity || ""}
                      onChange={handlePermanentAddressChange}
                      className={selectStyles}
                    >
                      <option value="">Select City</option>
                      {City.getCitiesOfState(formData.permanentCountry, formData.permanentState)?.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={18} className="text-gray-400" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className={labelStyles}>Pincode</label>
                  <input
                    type="text"
                    name="permanentPincode"
                    placeholder="6-digit code"
                    value={formData.permanentPincode || ""}
                    onChange={handlePermanentAddressChange}
                    className={inputStyles}
                  />
                </div>
              </div>
            </div>

            {/* Correspondence Address Column */}
            <div className="space-y-4 pt-8 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-100 lg:pl-8">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Correspondence Address
                </h4>
                <label className="flex items-center gap-2 cursor-pointer select-none group">
                  <input
                    type="checkbox"
                    checked={isSameAddress}
                    onChange={handleCheckboxChange}
                    className="w-4 h-4 text-[#FF7B1D] border-gray-300 rounded focus:ring-[#FF7B1D]"
                  />
                  <span className="text-xs font-bold text-gray-500 group-hover:text-[#FF7B1D] transition-colors">
                    Same as Permanent
                  </span>
                </label>
              </div>

              {isSameAddress ? (
                <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 text-gray-500 text-sm italic">
                  Address is being synchronized with Permanent Address.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className={labelStyles}>Address Line 1</label>
                    <input
                      type="text"
                      name="correspondenceAddress" // Using old field for primary line compatibility
                      placeholder="House No, Building, Street"
                      value={formData.correspondenceAddress || ""}
                      onChange={handleChange}
                      className={inputStyles}
                    />
                  </div>
                  {/* Additional detailed fields could be added here if needed, 
                      but keeping it simple for now as requested. */}
                  <div className="md:col-span-2">
                    <label className={labelStyles}>City / Town</label>
                    <input
                      type="text"
                      name="correspondenceCity"
                      placeholder="Enter city"
                      value={formData.correspondenceCity || ""}
                      onChange={handleChange}
                      className={inputStyles}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {mode !== "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 border-t border-gray-100 pt-6">
              <div>
                <label className={labelStyles}>Blood Group</label>
                <div className="relative">
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className={selectStyles}
                  >
                    <option value="">Select Blood Group</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={18} className="text-gray-400" />
                  </div>
                </div>
              </div>
              <div>
                <label className={labelStyles}>Languages Spoken</label>
                <div className="space-y-4">
                  <div className="relative">
                    <select
                      onChange={(e) => {
                        const selectedLanguage = e.target.value;
                        if (
                          selectedLanguage &&
                          !(formData.languages || []).includes(selectedLanguage)
                        ) {
                          setFormData((prev) => ({
                            ...prev,
                            languages: [...(prev.languages || []), selectedLanguage],
                          }));
                        }
                        e.target.value = ""; // Reset dropdown
                      }}
                      className={selectStyles}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        Select Language
                      </option>
                      {languagesList.map((lang) => (
                        <option
                          key={lang}
                          value={lang}
                          disabled={(formData.languages || []).includes(lang)}
                        >
                          {lang}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <ChevronDown size={18} className="text-gray-400" />
                    </div>
                  </div>

                  {Array.isArray(formData.languages) && formData.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                      {(Array.isArray(formData.languages) ? formData.languages : []).map((lang) => (
                        <div
                          key={lang}
                          className="bg-white border border-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-sm"
                        >
                          <span>{lang}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                languages: (prev.languages || []).filter((l) => l !== lang),
                              }));
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors focus:outline-none"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </CollapsibleSection>

      {mode !== "basic" && (
        <>
          <CollapsibleSection
            id="documents"
            title="Document Details"
            icon={FileText}
            isCollapsed={collapsedSections.documents}
            onToggle={() => toggleSection("documents")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className={labelStyles}>Aadhar Number</label>
                <input
                  type="text"
                  name="aadharNumber"
                  placeholder="Enter 12-digit Aadhar number"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  placeholder="Enter PAN number"
                  value={formData.panNumber}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Upload Aadhar Card (Front)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    name="aadharFront"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    className={fileStyles}
                  />
                  {formData.aadharFrontPreview && (
                    <img
                      src={formData.aadharFrontPreview}
                      alt="Profile"
                      className="w-18 h-16 object-cover rounded-sm border"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className={labelStyles}>Upload Aadhar Card (Back)</label>
                <div className="flex items-center gap-4">

                  <input
                    type="file"
                    name="aadharBack"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    className={fileStyles}
                  />
                  {formData.aadharBackPreview && (
                    <img
                      src={formData.aadharBackPreview}
                      alt="Profile"
                      className="w-18 h-16 object-cover rounded-sm border"
                    />
                  )}
                </div>
              </div>
              <div>
                <label className={labelStyles}>Upload PAN Card</label>
                <div className="flex items-center gap-4">

                  <input
                    type="file"
                    name="panCard"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    className={fileStyles}
                  />
                  {formData.panCardPreview && (
                    <img
                      src={formData.panCardPreview}
                      alt="Profile"
                      className="w-18 h-16 object-cover rounded-sm border"
                    />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection
            id="bank"
            title="Bank Account Details"
            icon={CreditCard}
            isCollapsed={collapsedSections.bank}
            onToggle={() => toggleSection("bank")}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className={labelStyles}>IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  placeholder="Enter IFSC code"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Account Holder Name</label>
                <input
                  type="text"
                  name="accountHolderName"
                  placeholder="Enter account holder name"
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Branch Name</label>
                <input
                  type="text"
                  name="branchName"
                  placeholder="Enter branch name"
                  value={formData.branchName}
                  onChange={handleChange}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className={labelStyles}>Upload Cancelled Cheque</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    name="cancelCheque"
                    accept="image/*,.pdf"
                    onChange={handleChange}
                    className={fileStyles}
                  />
                  {formData.cancelChequePreview && (
                    <img
                      src={formData.cancelChequePreview}
                      alt="Profile"
                      className="w-18 h-16 object-cover rounded-sm border"
                    />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </>
      )}

      <CollapsibleSection
        id="login"
        title="Login Credentials"
        icon={Key}
        isCollapsed={collapsedSections.login}
        onToggle={() => toggleSection("login")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className={labelStyles}>
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Email ID</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email for login"
              value={formData.email}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* <CollapsibleSection
        id="permissions"
        title="Permissions Control"
        icon={ShieldCheck}
        isCollapsed={collapsedSections.permissions}
        onToggle={() => toggleSection("permissions")}
      >
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase font-bold text-xs">
            <tr>
              <th className="px-4 py-3 border-b">Module Name</th>
              <th className="px-4 py-3 border-b text-center">Select All</th>
              {actions.map((action) => (
                <th key={action} className="px-4 py-3 border-b text-center">
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {modules.map((module) => (
              <tr
                key={module}
                className="hover:bg-gray-50 transition-colors group"
              >
                <td className="px-4 py-3 font-semibold text-gray-800 group-hover:text-[#FF7B1D]">
                  {module}
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isModuleAllChecked(module) || false}
                    onChange={(e) =>
                      handleSelectAllModule(module, e.target.checked)
                    }
                    className="h-4 w-4 text-[#FF7B1D] border-gray-300 rounded focus:ring-[#FF7B1D] cursor-pointer"
                  />
                </td>
                {actions.map((action) => (
                  <td key={action} className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={
                        formData.permissions?.[module]?.[action.toLowerCase()] ||
                        false
                      }
                      onChange={(e) =>
                        handlePermissionChange(
                          module,
                          action,
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-[#FF7B1D] border-gray-300 rounded focus:ring-[#FF7B1D] cursor-pointer"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CollapsibleSection> */}
    </>
  );
};

export default FormSection;

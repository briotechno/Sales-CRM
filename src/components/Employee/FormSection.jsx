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
} from "lucide-react";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

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

const FormSection = ({ formData, handleChanges, setFormData }) => {
  const [errors, setErrors] = useState({});

  const [collapsedSections, setCollapsedSections] = useState({
    personal: false,
    job: true,
    contact: true,
    documents: true,
    bank: true,
    login: true,
    permissions: true,
  });

  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "dob") {
      const age = calculateAge(value);

      setFormData((prev) => ({
        ...prev,
        dob: value,
        age: age >= 18 ? age : "0",
      }));

      if (age < 18) {
        setErrors((prev) => ({
          ...prev,
          dob: "Employee must be at least 18 years old",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.dob;
          return newErrors;
        });
      }
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
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
          <div>
            <label className={labelStyles}>Profile Picture</label>
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
                alt="Profile"
                className="w-24 h-24 object-cover rounded-sm border mt-2"
              />
            )}
          </div>
          <div>
            <label className={labelStyles}>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className={`${inputStyles} ${errors?.dob ? "border-red-500 focus:ring-red-500" : ""
                }`}
            />
            {errors?.dob && (
              <p className="text-xs text-red-500 mt-1">{errors.dob}</p>
            )}
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
                <option>Permanent</option>
                <option>Contract</option>
                <option>Intern</option>
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
                <option>WFO</option>
                <option>WFH</option>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className={labelStyles}>
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Alternate Mobile Number</label>
            <input
              type="tel"
              name="altMobile"
              placeholder="Enter alternate number"
              value={formData.altMobile}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Permanent Address</label>
            <input
              type="text"
              name="permanentAddress"
              placeholder="Enter permanent address"
              value={formData.permanentAddress}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Correspondence Address</label>
            <input
              type="text"
              name="correspondenceAddress"
              placeholder="Enter correspondence address"
              value={formData.correspondenceAddress}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
          <div>
            <label className={labelStyles}>Emergency Contact Person</label>
            <input
              type="text"
              name="emergencyPerson"
              placeholder="Enter contact person name"
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
            <label className={labelStyles}>Languages</label>
            <div className="border-2 border-gray-200 rounded-sm p-3 bg-white hover:border-gray-300 transition-orange-600">
              <div className="grid grid-cols-2 gap-3">
                {["English", "Hindi", "Spanish", "French", "German"].map(
                  (lang) => (
                    <label
                      key={lang}
                      className="flex items-center space-x-2 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        name="languages"
                        value={lang}
                        checked={formData.languages.includes(lang)}
                        onChange={handleChanges}
                        className="h-4 w-4 text-[#FF7B1D] border-gray-300 rounded  cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-gray-900">
                        {lang}
                      </span>
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </CollapsibleSection>

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
                className="w-24 h-24 object-cover rounded-sm border mt-2"
              />
            )}
          </div>
          <div>
            <label className={labelStyles}>Upload Aadhar Card (Back)</label>
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
                className="w-24 h-24 object-cover rounded-sm border mt-2"
              />
            )}
          </div>
          <div>
            <label className={labelStyles}>Upload PAN Card</label>
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
                className="w-24 h-24 object-cover rounded-sm border mt-2"
              />
            )}
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
                className="w-24 h-24 object-cover rounded-sm border mt-2"
              />
            )}
          </div>
        </div>
      </CollapsibleSection>

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

      <CollapsibleSection
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
      </CollapsibleSection>
    </>
  );
};

export default FormSection;

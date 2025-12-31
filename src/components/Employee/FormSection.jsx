import React from "react";
import {
  User,
  Briefcase,
  Phone,
  FileText,
  CreditCard,
  Key,
  ShieldCheck,
} from "lucide-react";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { useGetDesignationsQuery } from "../../store/api/designationApi";

const FormSection = ({ formData, handleChange, handleChanges }) => {
  const { data: deptData, isLoading: departmentsLoading } = useGetDepartmentsQuery({ limit: 100 });
  const { data: dsgData, isLoading: designationsLoading } = useGetDesignationsQuery({ limit: 100 });

  const departments = deptData?.departments || [];
  const designations = dsgData?.designations || [];
  // Consistent input styles matching AddTermModal
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

  return (
    <>
      {/* Personal Details */}
      <div className="border-2 border-gray-200 rounded-sm p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-gray-100">
          <User size={20} className="text-[#FF7B1D]" />
          <h3 className="text-lg font-bold text-gray-800">Personal Details</h3>
        </div>
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
              Employee Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="employeeName"
              placeholder="Enter full name"
              value={formData.employeeName}
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
                  className="w-24 h-24 object-cover rounded-sm border"
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
        </div>
      </div>

      {/* Job Details */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-gray-100">
          <Briefcase size={20} className="text-[#FF7B1D]" />
          <h3 className="text-lg font-bold text-gray-800">Job Details</h3>
        </div>
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
        </div>
      </div>

      {/* Contact Info */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-gray-100">
          <Phone size={20} className="text-[#FF7B1D]" />
          <h3 className="text-lg font-bold text-gray-800">
            Contact Information
          </h3>
        </div>
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
      </div>

      {/* Document Details */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-gray-100">
          <FileText size={20} className="text-[#FF7B1D]" />
          <h3 className="text-lg font-bold text-gray-800">Document Details</h3>
        </div>
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
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-gray-100">
          <CreditCard size={20} className="text-[#FF7B1D]" />
          <h3 className="text-lg font-bold text-gray-800">
            Bank Account Details
          </h3>
        </div>
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
          </div>
        </div>
      </div>

      {/* Login Credentials */}
      <div className="border-2 border-gray-200 rounded-lg p-6 bg-white shadow-sm">
        <div className="flex items-center gap-2 mb-5 pb-3 border-b-2 border-gray-100">
          <Key size={20} className="text-[#FF7B1D]" />
          <h3 className="text-lg font-bold text-gray-800">Login Credentials</h3>
        </div>
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
      </div>
    </>
  );
};

export default FormSection;

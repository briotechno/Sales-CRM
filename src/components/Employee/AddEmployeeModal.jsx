import React, { useState, useEffect } from "react";
import { X, UserPlus, Save, Loader2 } from "lucide-react";
import FormSection from "./FormSection";
import { useCreateEmployeeMutation } from "../../store/api/employeeApi";
import { toast } from "react-hot-toast";

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    employeeName: "",
    profilePic: null,
    dob: "",
    age: "",
    gender: "",
    fatherName: "",
    motherName: "",
    maritalStatus: "",
    joiningDate: "",
    department: "",
    designation: "",
    employeeType: "Permanent",
    workType: "WFO",
    mobile: "",
    altMobile: "",
    email: "",
    permanentAddress: "",
    permanentAddressLine1: "",
    permanentAddressLine2: "",
    permanentAddressLine3: "",
    permanentCity: "",
    permanentState: "",
    permanentCountry: "",
    permanentPincode: "",
    correspondenceAddress: "",
    emergencyPerson: "",
    emergencyNumber: "",
    bloodGroup: "",
    languages: [],
    aadharNumber: "",
    panNumber: "",
    aadharFront: null,
    aadharBack: null,
    panCard: null,
    ifscCode: "",
    accountNumber: "",
    accountHolderName: "",
    branchName: "",
    cancelCheque: null,
    username: "",
    password: "",
    status: "Active",
    permissions: {}
  });

  const [createEmployee, { isLoading }] = useCreateEmployeeMutation();

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({
        ...prev,
        [name]: file,
        [`${name}Preview`]: file ? URL.createObjectURL(file) : null
      }));
    } else {
      if (name === "dob") {
        const age = calculateAge(value);
        if (value && age < 18) {
          toast.dismiss();
          toast.error("Employee must be at least 18 years old");
          setFormData(prev => ({ ...prev, dob: "", age: "" }));
          return;
        }
        setFormData(prev => ({ ...prev, dob: value, age: age }));
        return;
      }

      setFormData((prev) => {
        const updated = { ...prev, [name]: value };
        // Auto-update employeeName
        if (name === "firstName" || name === "lastName") {
          const fName = name === "firstName" ? value : (prev.firstName || "");
          const lName = name === "lastName" ? value : (prev.lastName || "");
          updated.employeeName = `${fName} ${lName}`.trim();
        }
        return updated;
      });
    }
  };

  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "languages") {
      setFormData((prev) => {
        const updatedLanguages = checked
          ? [...prev.languages, value]
          : prev.languages.filter((lang) => lang !== value);
        return { ...prev, languages: updatedLanguages };
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);
    // Basic validation
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.mobile.trim()) {
      toast.error("First Name, Last Name, Email and Mobile are required");
      return;
    }

    const data = new FormData();

    // Ensure employeeName is correctly synced one last time
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    formData.employeeName = fullName;

    // Mapping frontend field names to backend expected names
    const mapping = {
      employeeName: 'employee_name',
      profilePic: 'profile_picture',
      dob: 'date_of_birth',
      age: 'age',
      gender: 'gender',
      fatherName: 'father_name',
      motherName: 'mother_name',
      maritalStatus: 'marital_status',
      joiningDate: 'joining_date',
      department: 'department_id',
      designation: 'designation_id',
      employeeType: 'employee_type',
      workType: 'work_type',
      mobile: 'mobile_number',
      altMobile: 'alternate_mobile_number',
      email: 'email',
      permanentAddress: 'permanent_address',
      correspondenceAddress: 'correspondence_address',
      emergencyPerson: 'emergency_contact_person',
      emergencyNumber: 'emergency_contact_number',
      bloodGroup: 'blood_group',
      languages: 'languages',
      aadharNumber: 'aadhar_number',
      panNumber: 'pan_number',
      aadharFront: 'aadhar_front',
      aadharBack: 'aadhar_back',
      panCard: 'pan_card',
      ifscCode: 'ifsc_code',
      accountNumber: 'account_number',
      accountHolderName: 'account_holder_name',
      branchName: 'branch_name',
      cancelCheque: 'cancelled_cheque',
      username: 'username',
      password: 'password',
      status: 'status'
    };

    Object.keys(formData).forEach(key => {
      const backendKey = mapping[key] || key;
      if (formData[key] instanceof File) {
        data.append(backendKey, formData[key]);
      } else if (Array.isArray(formData[key])) {
        data.append(backendKey, JSON.stringify(formData[key]));
      } else if (key === 'permissions') {
        data.append(backendKey, JSON.stringify(formData[key]));
      } else if (formData[key] !== null && formData[key] !== undefined) {
        data.append(backendKey, formData[key]);
      }
    });

    try {
      await createEmployee(data).unwrap();
      toast.success("Employee added successfully!");
      onClose();
    } catch (err) {
      toast.error(err.data?.message || "Failed to add employee");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col relative transform transition-all animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                <UserPlus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Employee</h2>
                <p className="text-sm text-white text-opacity-90">Manage your workforce efficiently</p>
              </div>
            </div>
            <button onClick={onClose} className="hover:bg-orange-700 p-1 rounded-sm transition-all">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          <FormSection
            formData={formData}
            handleChange={handleChange}
            handleChanges={handleChanges}
            setFormData={setFormData}
          />
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoading}
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-2 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold hover:shadow-lg transform transition-all disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Save Employee
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;

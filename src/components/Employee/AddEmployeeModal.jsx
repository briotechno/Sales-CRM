import React, { useState, useEffect } from "react";
import { X, UserPlus, Briefcase } from "lucide-react";
import FormSection from "../../components/Employee/FormSection";

const AddEmployeePopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    employeeId: "",
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
  });

  useEffect(() => {
    if (isOpen) {
      const generateEmployeeId = () => {
        const prefix = "EMP";
        const randomNum = Math.floor(10000 + Math.random() * 90000);
        return `${prefix}${randomNum}`;
      };
      setFormData((prev) => ({ ...prev, employeeId: generateEmployeeId() }));
    }
  }, [isOpen]);

  const calculateAge = (dob) => {
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
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "select-multiple") {
      const options = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setFormData({ ...formData, [name]: options });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "dob") {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, age }));
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

  const handleSubmit = () => {
    console.log(formData);
    alert("Employee data saved successfully!");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn overflow-y-auto p-4">
      <div className="bg-white rounded-sm shadow-2xl w-full max-w-4xl my-8 relative transform transition-all animate-slideUp">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <UserPlus size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add New Employee</h2>
                <p className="text-sm text-white text-opacity-90 mt-1">
                  Fill out the details below to add a new employee
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

        {/* Form Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          <FormSection
            formData={formData}
            handleChange={handleChange}
            handleChanges={handleChanges}
          />
        </div>

        {/* Footer with Actions */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold hover:shadow-lg transform transition-all"
          >
            Save Employee
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AddEmployeePopup;

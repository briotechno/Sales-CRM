import React, { useState, useEffect } from "react";
import { X, Pencil, Save, Loader2 } from "lucide-react";
import FormSection from "./FormSection";
import { useUpdateEmployeeMutation } from "../../store/api/employeeApi";
import { toast } from "react-hot-toast";

const EditEmployeeModal = ({ isOpen, onClose, employee }) => {
    const [formData, setFormData] = useState({
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
        status: "Active"
    });

    const [updateEmployee, { isLoading }] = useUpdateEmployeeMutation();

    useEffect(() => {
        if (employee) {
            setFormData({
                employeeName: employee.employee_name || "",
                profilePic: null, // Don't pre-fill files
                dob: employee.date_of_birth ? employee.date_of_birth.substring(0, 10) : "",
                age: employee.age || "",
                gender: employee.gender || "",
                fatherName: employee.father_name || "",
                motherName: employee.mother_name || "",
                maritalStatus: employee.marital_status || "",
                joiningDate: employee.joining_date ? employee.joining_date.substring(0, 10) : "",
                department: employee.department_id || "",
                designation: employee.designation_id || "",
                employeeType: employee.employee_type || "Permanent",
                workType: employee.work_type || "WFO",
                mobile: employee.mobile_number || "",
                altMobile: employee.alternate_mobile_number || "",
                email: employee.email || "",
                permanentAddress: employee.permanent_address || "",
                correspondenceAddress: employee.correspondence_address || "",
                emergencyPerson: employee.emergency_contact_person || "",
                emergencyNumber: employee.emergency_contact_number || "",
                bloodGroup: employee.blood_group || "",
                languages: Array.isArray(employee.languages) ? employee.languages : (typeof employee.languages === 'string' ? JSON.parse(employee.languages || '[]') : []),
                aadharNumber: employee.aadhar_number || "",
                panNumber: employee.pan_number || "",
                aadharFront: null,
                aadharBack: null,
                panCard: null,
                ifscCode: employee.ifsc_code || "",
                accountNumber: employee.account_number || "",
                accountHolderName: employee.account_holder_name || "",
                branchName: employee.branch_name || "",
                cancelCheque: null,
                username: employee.username || "",
                password: "", // Keep password empty for security
                status: employee.status || "Active"
            });
        }
    }, [employee]);

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
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData((prev) => {
                const updated = { ...prev, [name]: value };
                if (name === "dob") {
                    updated.age = calculateAge(value);
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

        if (!formData.employeeName || !formData.email || !formData.mobile) {
            toast.error("Please fill in required fields");
            return;
        }

        const data = new FormData();
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
            } else if (backendKey === 'password' && !formData[key]) {
                // Skip empty password in edit
            } else if (Array.isArray(formData[key])) {
                data.append(backendKey, JSON.stringify(formData[key]));
            } else if (formData[key] !== null && formData[key] !== undefined) {
                data.append(backendKey, formData[key]);
            }
        });

        try {
            await updateEmployee({ id: employee.id, formData: data }).unwrap();
            toast.success("Employee updated successfully!");
            onClose();
        } catch (err) {
            toast.error(err.data?.message || "Failed to update employee");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-sm shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col relative transform transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 shrink-0 rounded-t-sm">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                                <Pencil size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">Edit Employee</h2>
                                <p className="text-sm text-white text-opacity-90">Update employee status and details</p>
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
                    />
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0 rounded-b-sm">
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
                        Update Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditEmployeeModal;

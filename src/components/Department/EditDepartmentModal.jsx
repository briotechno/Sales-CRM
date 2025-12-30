import React, { useState, useEffect } from "react";
import { Building2, Save } from "lucide-react";
import { useUpdateDepartmentMutation } from "../../store/api/departmentApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const EditDepartmentModal = ({ isOpen, onClose, department }) => {
    const [departmentName, setDepartmentName] = useState("");
    const [departmentDescription, setDepartmentDescription] = useState("");
    const [status, setStatus] = useState("Active");
    const [departmentIcon, setDepartmentIcon] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);

    const [updateDepartment, { isLoading }] = useUpdateDepartmentMutation();

    useEffect(() => {
        if (department) {
            setDepartmentName(department.department_name || "");
            setDepartmentDescription(department.description || "");
            setStatus(department.status || "Active");
            setIconPreview(department.icon_url || null);
        }
    }, [department]);

    const handleIconChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDepartmentIcon(file);
            setIconPreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        if (!departmentName.trim()) {
            toast.error("Department Name is required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("department_name", departmentName);
            formData.append("description", departmentDescription);
            formData.append("status", status);
            if (departmentIcon) {
                formData.append("icon", departmentIcon);
            }

            await updateDepartment({ id: department.id, data: formData }).unwrap();
            toast.success("Department updated successfully");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update department");
        }
    };

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-sm border-2 border-gray-300 font-semibold hover:bg-gray-100 transition-all text-black"
            >
                Cancel
            </button>
            <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center gap-2 disabled:opacity-50"
            >
                <Save size={18} />
                {isLoading ? "Saving..." : "Save Changes"}
            </button>
        </>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Department"
            subtitle="Update department details"
            icon={<Building2 size={24} />}
            footer={footer}
        >
            <div className="space-y-5 text-black">
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        Department Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] focus:ring-2 outline-none text-sm"
                    />
                </div>

                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        Department Description
                    </label>
                    <textarea
                        value={departmentDescription}
                        onChange={(e) => setDepartmentDescription(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm"
                    />
                </div>

                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        Department Icon
                    </label>
                    <div className="flex items-start gap-4">
                        <input type="file" accept="image/*" onChange={handleIconChange} className="flex-1 text-sm border-2 border-gray-200 rounded-lg p-2" />
                        {iconPreview && (
                            <div className="w-20 h-20 rounded-lg border overflow-hidden">
                                <img src={iconPreview} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditDepartmentModal;

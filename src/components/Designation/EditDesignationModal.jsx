import React, { useState, useEffect } from "react";
import { Briefcase, User, Image, FileText, Save } from "lucide-react";
import { useUpdateDesignationMutation } from "../../store/api/designationApi";
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import { toast } from "react-hot-toast";
import Modal from "../common/Modal";

const EditDesignationModal = ({ isOpen, onClose, designation, refetchDashboard }) => {
    const [designationName, setDesignationName] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("Active");
    const [designationImage, setDesignationImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const { data: departmentsData } = useGetDepartmentsQuery({ limit: 100 });
    const [updateDesignation, { isLoading }] = useUpdateDesignationMutation();

    useEffect(() => {
        if (designation) {
            setDesignationName(designation.designation_name || "");
            setDepartmentId(designation.department_id || "");
            setDescription(designation.description || "");
            setStatus(designation.status || "Active");
            setImagePreview(designation.image_url || null);
        }
    }, [designation]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setDesignationImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        if (!designationName.trim() || !departmentId) {
            toast.error("Designation Name and Department are required");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("designation_name", designationName);
            formData.append("department_id", departmentId);
            formData.append("description", description);
            formData.append("status", status);
            if (designationImage) {
                formData.append("image", designationImage);
            }

            await updateDesignation({ id: designation.id, data: formData }).unwrap();

            if (refetchDashboard) {
                refetchDashboard();
            }

            toast.success("Designation updated successfully");
            onClose();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to update designation");
        }
    };

    const footer = (
        <>
            <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-sm border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-100 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={handleUpdate}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold flex items-center gap-2 hover:shadow-lg transform transition-all disabled:opacity-50"
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
            title="Edit Designation"
            subtitle="Update role details"
            icon={<User size={24} />}
            footer={footer}
        >
            <div className="space-y-5 text-black">
                {/* Select Department */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Briefcase size={16} className="text-[#FF7B1D]" />
                        Select Department <span className="text-red-500">*</span>
                    </label>
                    <select
                        value={departmentId}
                        onChange={(e) => setDepartmentId(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm bg-white"
                    >
                        <option value="">-- Choose Department --</option>
                        {departmentsData?.departments?.map((dept) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.department_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Designation Name */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <User size={16} className="text-[#FF7B1D]" />
                        Designation Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        value={designationName}
                        onChange={(e) => setDesignationName(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm"
                    />
                </div>

                {/* Status */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm bg-white"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                {/* Designation Image */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <Image size={16} className="text-[#FF7B1D]" />
                        Designation Image
                    </label>
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-lg cursor-pointer focus:border-[#FF7B1D] outline-none bg-white"
                            />
                        </div>
                        {imagePreview && (
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-lg border overflow-hidden bg-gray-50">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div className="group">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                        <FileText size={16} className="text-[#FF7B1D]" />
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#FF7B1D] outline-none text-sm bg-white"
                    />
                </div>
            </div>
        </Modal>
    );
};

export default EditDesignationModal;

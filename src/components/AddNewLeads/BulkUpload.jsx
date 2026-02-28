import React, { useState } from "react";
import {
  X,
  Upload,
  Download,
  FileText,
  User,
  Building2,
  Briefcase,
  CloudUpload,
  CheckCircle2,
  Tag,
  Info,
} from "lucide-react";

import { useSelector } from "react-redux";
import { useGetEmployeesQuery } from "../../store/api/employeeApi";
import { useBulkCreateLeadsMutation } from "../../store/api/leadApi";
import * as XLSX from "xlsx";
import toast from "react-hot-toast";

const inputStyles =
  "w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300";

export default function BulkUploadLeads({ onClose }) {
  const { user } = useSelector((state) => state.auth);
  const { data: employeesData } = useGetEmployeesQuery({ limit: 100 });
  const [bulkCreateLeads, { isLoading: isUploading }] = useBulkCreateLeadsMutation();
  const employees = employeesData?.employees || [];

  const [leadType, setLeadType] = useState("Individual");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [formData, setFormData] = useState({
    owner: user?.id || user?.user_id || "",
    lead_source: "Bulk Upload",
  });
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragActive, setDragActive] = useState(false);

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

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      setFileName(droppedFile.name);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (jsonData.length === 0) {
          toast.error("No data found in the file");
          return;
        }

        // Map jsonData to our lead model structure
        const leadsToUpload = jsonData.map((row) => ({
          type: leadType,
          name: row.Name || row.full_name || row["Full Name"],
          email: row.Email || row.email,
          mobile_number: row.Phone || row.mobile_number || row["Phone Number"],
          organization_name: row.Company || row.organization_name || row["Company Name"],
          address: row.Address || row.address,
          city: row.City || row.city,
          state: row.State || row.state,
          country: row.Country || row.country,
          pincode: row.Zipcode || row.pincode || row["Zip Code"],
          owner: formData.owner,
          lead_source: formData.lead_source,
          tag: tags.join(", "),
        }));

        const response = await bulkCreateLeads(leadsToUpload).unwrap();

        if (response.status) {
          toast.success(response.message || "Leads uploaded successfully!");
          if (onClose) onClose();
        }
      } catch (error) {
        console.error("Bulk upload failed:", error);
        toast.error(error?.data?.message || "Failed to upload leads. Please check the file format.");
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-sm shadow-sm w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-t-sm px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <CloudUpload size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Bulk Upload Leads</h2>
                <p className="text-sm text-white text-opacity-90 mt-1">
                  Import multiple leads at once
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

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 max-h-[70vh]">
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
                  value="Individual"
                  checked={leadType === "Individual"}
                  onChange={(e) => setLeadType(e.target.value)}
                  className="w-5 h-5 text-[#FF7B1D]"
                />
                <span className="ml-3 text-sm font-semibold text-gray-800 group-hover:text-[#FF7B1D] flex items-center gap-2">
                  <User size={16} /> Individual
                </span>
              </label>

              <label className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value="Organization"
                  checked={leadType === "Organization"}
                  onChange={(e) => setLeadType(e.target.value)}
                  className="w-5 h-5 text-[#FF7B1D]"
                />
                <span className="ml-3 text-sm font-semibold text-gray-800 group-hover:text-[#FF7B1D] flex items-center gap-2">
                  <Building2 size={16} /> Organization
                </span>
              </label>
            </div>
          </div>

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
                  Lead Owner
                </label>
                <div className="relative">
                  <input
                    type="text"
                    readOnly
                    value={
                      employees.find(emp => (emp.user_id || emp.id) == (user?.id || user?.user_id))?.employee_name ||
                      user?.employee_name || user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "") || "Self"
                    }
                    className={inputStyles + " bg-gray-50 cursor-not-allowed border-gray-100"}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                </div>
              </div>

              {/* Source */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText size={14} className="text-[#FF7B1D]" />
                  Lead Source
                </label>
                <div className="relative">
                  <select
                    value={formData.lead_source}
                    onChange={(e) =>
                      setFormData({ ...formData, lead_source: e.target.value })
                    }
                    className={inputStyles + " appearance-none cursor-pointer"}
                  >
                    <option value="">Select lead source</option>
                    <option value="Indiamart">Indiamart</option>
                    <option value="Direct">Direct</option>
                    <option value="Meta">Meta</option>
                    <option value="Justdial">Justdial</option>
                    <option value="Website">Website</option>
                  </select>
                </div>
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


            </div>
          </div>

          {/* Download Sample Section */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-sm p-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg mt-1">
                <Info size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-blue-600" />
                  How to Upload Leads
                </h4>
                <ol className="text-sm text-gray-700 space-y-2 mb-4 ml-1">
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 min-w-[20px]">
                      1.
                    </span>
                    <span>
                      Download the sample file template by clicking the button
                      below
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 min-w-[20px]">
                      2.
                    </span>
                    <span>
                      Fill in your lead data (Name, Email, Phone, Company,
                      Address, etc.)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 min-w-[20px]">
                      3.
                    </span>
                    <span>Save the file in CSV or Excel format (XLSX/XLS)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-blue-600 min-w-[20px]">
                      4.
                    </span>
                    <span>
                      Upload the completed file using the upload section below
                    </span>
                  </li>
                </ol>
                <button
                  onClick={() => {
                    // Create sample CSV content
                    const sampleData =
                      "Name,Email,Phone,Company,Address,City,State,Country,Zipcode\nJohn Doe,john@example.com,+91-9876543210,ABC Corp,123 Main St,Mumbai,Maharashtra,India,400001\nJane Smith,jane@example.com,+91-9876543211,XYZ Ltd,456 Park Ave,Delhi,Delhi,India,110001";

                    // Create blob and download
                    const blob = new Blob([sampleData], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "leads_sample_template.csv";
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                  className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 font-semibold text-sm px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <Download size={16} />
                  Download Sample Template
                </button>
              </div>
            </div>
          </div>

          {/* Upload Box */}
          <div
            className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all ${dragActive
              ? "border-[#FF7B1D] bg-orange-50"
              : fileName
                ? "border-green-400 bg-green-50"
                : "border-gray-300 hover:border-[#FF7B1D] hover:bg-orange-50"
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
            />

            <div className="flex flex-col items-center gap-3">
              <div
                className={`p-4 rounded-full ${fileName ? "bg-green-100" : "bg-orange-100"
                  }`}
              >
                {fileName ? (
                  <CheckCircle2 size={32} className="text-green-500" />
                ) : (
                  <Upload size={32} className="text-[#FF7B1D]" />
                )}
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {fileName || "Upload Attachment"}
                </p>

                {fileName ? (
                  <p className="text-sm text-green-600 mt-1">
                    File ready for upload
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-500 mt-1">
                      Drag & drop your file or click to browse
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      Supported formats: CSV, XLSX, XLS
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-100 rounded-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={isUploading}
            onClick={handleSubmit}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-700 hover:to-orange-700 rounded-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? "Uploading..." : "Upload Leads"}
          </button>
        </div>
      </div>
    </div>
  );
}

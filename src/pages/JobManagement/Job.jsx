import { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import JobViewModal from "../../pages/JobManagement/ViewPage";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  CheckCircle,
  ChevronDown,
  Copy,
  Edit,
  Eye,
  Filter,
  Link as LinkIcon,
  Plus,
  Trash2,
  Users,
  X,
  Search,
  Calendar
} from "lucide-react";
import { FiHome } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import NumberCard from "../../components/NumberCard";
import {
  useGetJobsQuery,
  useGetJobStatsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation
} from "../../store/api/jobApi";
import toast from 'react-hot-toast';
import { useGetDepartmentsQuery } from "../../store/api/departmentApi";
import usePermission from "../../hooks/usePermission";
import Modal from "../../components/common/Modal";

const DeleteJobModal = ({ isOpen, onClose, onConfirm, isLoading, title }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      headerVariant="simple"
      maxWidth="max-w-md"
      footer={
        <div className="flex gap-4 w-full">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Trash2 size={20} />
            )}
            {isLoading ? "Deleting..." : "Delete Now"}
          </button>
        </div>
      }
    >
      <div className="flex flex-col items-center text-center p-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <AlertTriangle size={48} className="text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-2 leading-relaxed">
          Are you sure you want to delete job Management{" "}
          <span className="font-bold text-gray-800">"{title}"</span>?
        </p>

        <p className="text-sm text-red-500 italic mb-6">
          This action cannot be undone. All associated data will be permanently removed.
        </p>

      </div>
    </Modal>
  );
};

// Main Component
export default function JobManagement() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingJobId, setEditingJobId] = useState(null);
  const itemsPerPage = 8;

  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [roundInput, setRoundInput] = useState("");
  const [fieldInput, setFieldInput] = useState({ label: "", type: "text", required: false });

  const { create, read, update, delete: remove } = usePermission("Job Management");

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "Full-time",
    positions: 1,
    description: "",
    responsibilities: [],
    requirements: [],
    interview_rounds: ["Screening", "Technical", "HR", "Final"],
    application_fields: [
      { name: "name", label: "Full Name", type: "text", required: true },
      { name: "email", label: "Email Address", type: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", required: false }
    ]
  });

  const {
    data: jobsData,
    isLoading,
    isError
  } = useGetJobsQuery({
    page: currentPage,
    limit: itemsPerPage,
    status: selectedFilter
  }, { refetchOnMountOrArgChange: true });

  const { data: statsData } = useGetJobStatsQuery(undefined, { refetchOnMountOrArgChange: true });
  const { data: departmentsData } = useGetDepartmentsQuery({ page: 1, limit: 100 });

  const [createJob] = useCreateJobMutation();
  const [updateJob] = useUpdateJobMutation();
  const [deleteJob] = useDeleteJobMutation();

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "Full-time",
      positions: 1,
      description: "",
      responsibilities: [],
      requirements: [],
      interview_rounds: ["Screening", "Technical", "HR", "Final"],
      application_fields: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "email", label: "Email Address", type: "email", required: true },
        { name: "phone", label: "Phone Number", type: "tel", required: false }
      ]
    });
    setEditingJobId(null);
    setResponsibilityInput("");
    setRequirementInput("");
  };

  const handleEditJob = (job) => {
    setFormData({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      positions: job.positions,
      description: job.description,
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      interview_rounds: job.interview_rounds || ["Screening", "Technical", "HR", "Final"],
      application_fields: job.application_fields || [],
      status: job.status
    });
    setEditingJobId(job.id);
    setShowAddModal(true);
  };

  const handleDelete = (job) => {
    setJobToDelete(job);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (jobToDelete?.id) {
      try {
        await deleteJob(jobToDelete.id).unwrap();
        toast.success("Job posting deleted successfully");
        setShowDeleteModal(false);
        setJobToDelete(null);
      } catch (error) {
        toast.error("Failed to delete job posting");
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (page) => setCurrentPage(page);

  const handlePrev = () =>
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

  const handleNext = () =>
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addResponsibility = () => {
    if (responsibilityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, responsibilityInput.trim()]
      }));
      setResponsibilityInput("");
    }
  };

  const removeResponsibility = (index) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const addRequirement = () => {
    if (requirementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, requirementInput.trim()]
      }));
      setRequirementInput("");
    }
  };

  const removeRequirement = (index) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addRound = () => {
    if (roundInput.trim()) {
      setFormData(prev => ({
        ...prev,
        interview_rounds: [...prev.interview_rounds, roundInput.trim()]
      }));
      setRoundInput("");
    }
  };

  const removeRound = (index) => {
    setFormData(prev => ({
      ...prev,
      interview_rounds: prev.interview_rounds.filter((_, i) => i !== index)
    }));
  };

  const addField = () => {
    if (fieldInput.label.trim()) {
      const name = fieldInput.label.toLowerCase().replace(/\s+/g, '_');
      setFormData(prev => ({
        ...prev,
        application_fields: [...prev.application_fields, { ...fieldInput, name }]
      }));
      setFieldInput({ label: "", type: "text", required: false });
    }
  };

  const removeField = (index) => {
    setFormData(prev => ({
      ...prev,
      application_fields: prev.application_fields.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.location || !formData.description || !formData.department) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const payload = {
        ...formData,
        positions: parseInt(formData.positions)
      };

      if (editingJobId) {
        await updateJob({ id: editingJobId, ...payload }).unwrap();
        toast.success("Job posting updated successfully");
      } else {
        await createJob(payload).unwrap();
        toast.success("Job posting created successfully");
      }

      setShowAddModal(false);
      resetForm();
    } catch (error) {
      toast.error(editingJobId ? "Failed to update job" : "Failed to create job");
    }
  };

  const clearAllFilters = () => {
    setSelectedFilter("All");
    setCurrentPage(1);
  };

  const hasActiveFilters = selectedFilter !== "All";
  const filterOptions = ["All", "Active", "On Hold", "Closed"];
  const totalPages = jobsData?.pagination?.totalPages || 1;
  const totalJobs = jobsData?.pagination?.total || 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">Job Management</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">Recruitment Module</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Unified Filter */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => {
                      if (hasActiveFilters) {
                        clearAllFilters();
                      } else {
                        setIsFilterOpen(!isFilterOpen);
                      }
                    }}
                    className={`px-3 py-3 rounded-sm border transition shadow-sm ${isFilterOpen || hasActiveFilters
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                      }`}
                  >
                    {hasActiveFilters ? <X size={18} /> : <Filter size={18} />}
                  </button>

                  {isFilterOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn overflow-hidden">
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">status</span>
                      </div>
                      <div className="py-1">
                        {filterOptions.map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setSelectedFilter(status);
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedFilter === status
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                  disabled={!create}
                  className={`flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Plus size={20} />
                  Add New Job
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <NumberCard
              title={"Total Jobs"}
              number={statsData?.total_jobs || 0}
              icon={<Briefcase className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"} />
            <NumberCard
              title={"Active Jobs"}
              number={statsData?.active_jobs || 0}
              icon={<Activity className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"} />
            <NumberCard
              title={"Total Applicants"}
              number={statsData?.total_applicants || 0}
              icon={<Users className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"} />
            <NumberCard
              title={"Open Positions"}
              number={statsData?.total_positions || 0}
              icon={<Plus className="text-purple-600" size={24} />}
              iconBgColor={"bg-purple-100"}
              lineBorderClass={"border-purple-500"} />
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-6 font-semibold text-left border-b border-orange-400">Job Title</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Department</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400">Location</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Type</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Positions</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Applicants</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400">Status</th>
                  <th className="py-3 px-4 font-semibold text-right border-b border-orange-400">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse bg-white border-b">
                      <td className="py-4 px-6"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                      <td className="py-4 px-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                      <td className="py-4 px-4 text-center"><div className="h-6 bg-gray-100 rounded w-20 mx-auto"></div></td>
                      <td className="py-4 px-4 text-center"><div className="h-6 bg-gray-100 rounded w-10 mx-auto"></div></td>
                      <td className="py-4 px-4 text-center"><div className="h-4 bg-gray-100 rounded w-12 mx-auto"></div></td>
                      <td className="py-4 px-4 text-center"><div className="h-4 bg-gray-100 rounded w-20 mx-auto"></div></td>
                      <td className="py-4 px-4 text-right"><div className="h-8 bg-gray-100 rounded w-24 ml-auto"></div></td>
                    </tr>
                  ))
                ) : jobsData?.jobs?.length > 0 ? (
                  jobsData.jobs.map((job) => (
                    <tr key={job.id} className="border-b hover:bg-gray-50 transition-all">
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 border border-orange-200 shadow-sm">
                            <Briefcase size={14} />
                          </div>
                          <span className="font-bold text-gray-800 uppercase tracking-tight">{job.title}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 font-medium">{job.department}</td>
                      <td className="py-3 px-4 text-gray-600 font-medium">{job.location}</td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-sm border border-blue-100 uppercase tracking-wider">
                          {job.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-sm text-sm border border-orange-100">{job.positions}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-gray-700">
                        {job.applicants}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-sm border uppercase tracking-widest transition-all ${job.status === "Active"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : job.status === "On Hold"
                            ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                            : "bg-red-50 text-red-700 border-red-200"
                          }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              const link = `${window.location.origin}/apply/${job.application_link}`;
                              navigator.clipboard.writeText(link);
                              toast.success("Link copied!");
                            }}
                            className="p-1.5 hover:bg-orange-100 rounded-sm text-orange-600 transition-all"
                            title="Copy Link"
                          >
                            <LinkIcon size={18} />
                          </button>
                          {read && (
                            <button
                              onClick={() => handleViewJob(job)}
                              className="p-1.5 hover:bg-orange-100 rounded-sm text-blue-500 transition-all"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          {update && (
                            <button
                              onClick={() => handleEditJob(job)}
                              className="p-1.5 hover:bg-orange-100 rounded-sm text-green-600 transition-all"
                            >
                              <Edit size={18} />
                            </button>
                          )}
                          {remove && (
                            <button
                              onClick={() => handleDelete(job)}
                              className="p-1.5 hover:bg-orange-100 rounded-sm text-red-500 transition-all"
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-20 text-center">
                      <Briefcase size={48} className="text-gray-200 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No jobs found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalJobs > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200 shadow-sm">
              <p className="text-sm font-semibold text-gray-700">
                Showing <span className="text-orange-600 font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-orange-600 font-bold">{Math.min(currentPage * itemsPerPage, totalJobs)}</span> of <span className="text-orange-600 font-bold">{totalJobs}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                    }`}
                >
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let p = i + 1;
                    if (totalPages > 5 && currentPage > 3) p = currentPage - 2 + i;
                    if (p > totalPages) return null;
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={`w-10 h-10 rounded-sm font-bold transition border ${currentPage === p
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-orange-500 shadow-md"
                          : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 shadow-sm"
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
                    : "bg-[#22C55E] text-white hover:opacity-90 shadow-md active:scale-95"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Add/Edit Job Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex justify-between items-center sticky top-0 z-10">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  {editingJobId ? <Edit size={24} /> : <Plus size={24} />}
                  {editingJobId ? "Edit Job Posting" : "Add New Job Posting"}
                </h2>
                <button onClick={() => setShowAddModal(false)} className="text-white hover:bg-white/20 p-2 rounded-sm transition-colors">
                  <X size={24} />
                </button>
              </div>
              <div className="p-8 space-y-6">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 outline-none transition-all text-sm font-bold bg-gray-50 focus:bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      Department *
                    </label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 outline-none transition-all text-sm font-bold bg-gray-50">
                      <option value="">Select Department</option>
                      {departmentsData?.departments?.map((dept) => (
                        <option key={dept.id} value={dept.department_name}>
                          {dept.department_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Remote, New York"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 outline-none transition-all text-sm font-bold bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      Job Type *
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 outline-none transition-all text-sm font-bold bg-gray-50">
                      <option>Full-Time Employee</option>
                      <option>Part-Time Employee</option>
                      <option>Contract Employee</option>
                      <option>Temporary Employee</option>
                      <option>Intern / Trainee</option>
                      {/* ... other options */}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      Positions *
                    </label>
                    <input
                      type="number"
                      name="positions"
                      value={formData.positions}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 outline-none transition-all text-sm font-bold bg-gray-50"
                    />
                  </div>
                </div>

                {editingJobId && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 outline-none transition-all text-sm font-bold bg-gray-50">
                      <option value="Active">Active</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-200 rounded-sm focus:border-orange-500 outline-none transition-all text-sm font-medium bg-gray-50"
                  ></textarea>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-sm hover:bg-gray-50 transition-all uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-2 px-10 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-sm hover:shadow-lg transition-all uppercase tracking-widest text-xs"
                  >
                    {editingJobId ? "Update Job" : "Post Job"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && (
          <JobViewModal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            job={selectedJob}
          />
        )}

        {/* Delete Modal */}
        <DeleteJobModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title={jobToDelete?.title}
        />
      </div>
    </DashboardLayout>
  );
}

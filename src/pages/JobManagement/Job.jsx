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
  FileText,
  MapPin,
  AlignLeft,
  Calendar,
  Layers,


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
  const [isNavOpen, setIsNavOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navRef = useRef(null);
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingJobId, setEditingJobId] = useState(null);
  const itemsPerPage = 8;

  // Input states for dynamic arrays
  const [responsibilityInput, setResponsibilityInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [roundInput, setRoundInput] = useState("");
  const [fieldInput, setFieldInput] = useState({ label: "", type: "text", required: false });

  const { create, read, update, delete: remove } = usePermission("Job Management");

  // Add Job Form State
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

  // Queries and Mutations
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
  const [deleteJob, { isLoading: deleteLoading }] = useDeleteJobMutation();

  // Handlers
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
    setJobToDelete(job); // store full job object
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


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsNavOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNext = () => {
    if (currentPage < (jobsData?.pagination?.totalPages || 1)) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Dynamic Array Handlers
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
      toast.error("Please fill in all required fields (Title, Department, Location, Description)");
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
      console.error(error);
      toast.error(editingJobId ? "Failed to update job posting" : "Failed to create job posting");
    }
  };

  const filterOptions = ["All", "Active", "On Hold", "Closed"];
  const totalPages = jobsData?.pagination?.totalPages || 1;
  const totalJobs = jobsData?.pagination?.total || 0;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-0 p-0 ml-4 mr-4">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-sm p-3 mb-2 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 whitespace-nowrap">
                  Job Management
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700 text-sm" />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Job Management
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Filter Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-2 rounded-sm border transition shadow-sm ${isFilterOpen || selectedFilter !== "All"
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white border-[#FF7B1D]"
                      : "bg-white text-black border-gray-300 hover:bg-gray-100"
                      }`}
                    title={selectedFilter === "All" ? "Filter" : `Filter: ${selectedFilter}`}
                  >
                    <Filter size={20} />
                  </button>

                  {isFilterOpen && (
                    <div className="absolute left-0 mt-2 w-40 bg-white border border-gray-200 rounded-sm shadow-xl z-50 animate-fadeIn">
                      <div className="py-1">
                        {filterOptions.map((filter) => (
                          <button
                            key={filter}
                            onClick={() => {
                              setSelectedFilter(filter);
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${selectedFilter === filter
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Add New Job Button */}
                <button
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                  disabled={!create}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm font-semibold transition ml-2 ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 hover:opacity-90"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Plus size={18} />
                  Add New Job
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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

          {/* Jobs Table */}
          <div className="bg-white rounded-sm shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="bg-gradient-to-r from-orange-500 to-orange-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-40">
                      Job Title
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-32">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-32">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-24">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-24">
                      Positions
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-28">
                      Applicants
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-32">
                      Posted Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-white whitespace-nowrap w-24">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-bold text-white whitespace-nowrap w-28">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    // Skeleton Loading
                    Array.from({ length: 5 }).map((_, index) => (
                      <tr key={index} className="bg-white animate-pulse">
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-10"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded w-20"></div></td>
                        <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-24 mx-auto"></div></td>
                      </tr>
                    ))
                  ) : isError ? (
                    <tr><td colSpan="9" className="text-center py-8 text-red-500">Error loading data</td></tr>
                  ) : jobsData?.jobs?.length === 0 ? (
                    <tr><td colSpan="9" className="text-center py-8 text-gray-500">No jobs found</td></tr>
                  ) : (
                    jobsData?.jobs.map((job, index) => (
                      <tr
                        key={job.id}
                        className={`hover:bg-orange-50 transition-colors whitespace-nowrap ${index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-2 rounded-sm">
                              <Briefcase className="text-white" size={18} />
                            </div>
                            <span className="font-semibold text-gray-800 whitespace-nowrap">
                              {job.title}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-700 font-medium whitespace-nowrap">
                          {job.department}
                        </td>

                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {job.location}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-sm">
                            {job.type}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-orange-100 text-orange-700 font-bold px-3 py-1 rounded-sm text-sm">
                            {job.positions}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Users size={16} className="text-orange-500" />
                            <span className="font-bold text-gray-800">
                              {job.applicants}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                          {new Date(job.posted_date).toLocaleDateString()}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-sm ${job.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : job.status === "On Hold"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {job.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => {
                                const link = `${window.location.origin}/apply/${job.application_link}`;
                                navigator.clipboard.writeText(link);
                                toast.success("Application link copied!");
                              }}
                              className="p-2 hover:bg-orange-100 rounded-sm transition-all"
                              title="Copy Application Link"
                            >
                              <LinkIcon size={18} className="text-orange-600" />
                            </button>
                            {read && (
                              <button
                                onClick={() => handleViewJob(job)}
                                className="p-2 hover:bg-blue-100 rounded-sm transition-all"
                                title="View Job Details"
                              >
                                <Eye size={18} className="text-blue-600" />
                              </button>
                            )}
                            {update && (
                              <button
                                onClick={() => handleEditJob(job)}
                                className="p-2 hover:bg-green-100 rounded-sm transition-all">
                                <Edit size={18} className="text-green-600" />
                              </button>
                            )}
                            {remove && (
                              <button
                                onClick={() => handleDelete(job)}
                                className="p-2 hover:bg-red-100 rounded-sm transition-all">
                                <Trash2 size={18} className="text-red-600" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, totalJobs)}</span> of <span className="font-bold">{totalJobs}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p = i + 1;
                if (totalPages > 5 && currentPage > 3) p = currentPage - 2 + i;
                if (p > totalPages) return null;
                return (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p)}
                    className={`w-9 h-9 border rounded-sm text-sm font-bold flex items-center justify-center transition-colors ${currentPage === p
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {p}
                  </button>
                );
              })}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>

          {/* Add/Edit Job Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white bg-opacity-20 p-2 rounded-sm">
                      {editingJobId ? <Edit className="text-white" size={24} /> : <Plus className="text-white" size={24} />}
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingJobId ? "Edit Job Posting" : "Add New Job Posting"}
                    </h2>
                  </div>
                  <button onClick={() => setShowAddModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-sm transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <div className="p-8 space-y-6 bg-white">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                      <FileText size={16} className="text-[#FF7B1D]" /> Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Briefcase size={16} className="text-[#FF7B1D]" /> Department *
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white">
                        <option value="">Select Department</option>
                        {departmentsData?.departments?.map((dept) => (
                          <option key={dept.id} value={dept.department_name}>
                            {dept.department_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <MapPin size={16} className="text-[#FF7B1D]" /> Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Remote, New York"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Briefcase size={16} className="text-[#FF7B1D]" /> Job Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white">
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
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <Users size={16} className="text-[#FF7B1D]" /> Number of Positions *
                      </label>
                      <input
                        type="number"
                        name="positions"
                        value={formData.positions}
                        onChange={handleInputChange}
                        placeholder="1"
                        min="1"
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Status selection only when editing */}
                  {editingJobId && (
                    <div>
                      <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                        <CheckCircle size={16} className="text-[#FF7B1D]" /> Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white">
                        <option value="Active">Active</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                      <AlignLeft size={16} className="text-[#FF7B1D]" /> Job Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Describe the role, responsibilities, and requirements..."
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-sm placeholder-gray-400"
                    ></textarea>
                  </div>

                  {/* Key Responsibilities - Dynamic List */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                      <FileText size={16} className="text-[#FF7B1D]" /> Key Responsibilities
                    </label>
                    <div className="space-y-3">
                      {formData.responsibilities.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-sm border border-gray-200">
                          <span className="flex-1 text-sm text-gray-700">{item}</span>
                          <button
                            onClick={() => removeResponsibility(index)}
                            className="text-red-500 hover:text-red-700 p-1">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={responsibilityInput}
                          onChange={(e) => setResponsibilityInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addResponsibility()}
                          placeholder="Add a responsibility..."
                          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400"
                        />
                        <button
                          onClick={addResponsibility}
                          className="bg-orange-500 text-white p-2 rounded-sm hover:bg-orange-600 transition-colors">
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Requirements - Dynamic List */}
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                      <CheckCircle size={16} className="text-[#FF7B1D]" /> Requirements
                    </label>
                    <div className="space-y-3">
                      {formData.requirements.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded-sm border border-gray-200">
                          <span className="flex-1 text-sm text-gray-700">{item}</span>
                          <button
                            onClick={() => removeRequirement(index)}
                            className="text-red-500 hover:text-red-700 p-1">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={requirementInput}
                          onChange={(e) => setRequirementInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                          placeholder="Add a requirement..."
                          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400"
                        />
                        <button
                          onClick={addRequirement}
                          className="bg-orange-500 text-white p-2 rounded-sm hover:bg-orange-600 transition-colors">
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                  </div>


                  {/* Interview Rounds - Dynamic List */}
                  <div className="pt-6 border-t border-gray-100">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <Layers size={16} className="text-[#FF7B1D]" /> Interview Rounds (Pre-Defined Sequence)
                    </label>
                    <div className="space-y-3">
                      {formData.interview_rounds.map((round, index) => (
                        <div key={index} className="flex items-center gap-2 bg-orange-50 p-3 rounded-sm border border-orange-100">
                          <span className="flex items-center justify-center w-6 h-6 bg-orange-500 text-white text-xs font-bold rounded-full">{index + 1}</span>
                          <span className="flex-1 text-sm font-bold text-gray-700 uppercase tracking-wider">{round}</span>
                          <button
                            onClick={() => removeRound(index)}
                            className="text-red-500 hover:text-red-700 p-1">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={roundInput}
                          onChange={(e) => setRoundInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addRound()}
                          placeholder="Add a round (e.g., Technical Assessment)..."
                          className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400"
                        />
                        <button
                          onClick={addRound}
                          className="bg-orange-500 text-white px-4 py-2.5 rounded-sm font-bold hover:bg-orange-600 transition-colors flex items-center gap-2 capitalize text-xs tracking-wider">
                          <Plus size={16} /> Add Round
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Application Form Fields - Dynamic List */}
                  <div className="pt-6 border-t border-gray-100">
                    <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FileText size={16} className="text-[#FF7B1D]" /> Custom Application Form Fields
                    </label>
                    <div className="space-y-4">
                      {formData.application_fields.map((field, index) => (
                        <div key={index} className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
                          <div className="flex-1 min-w-[150px]">
                            <p className="text-xs font-bold text-gray-400 uppercase">Label</p>
                            <p className="text-sm font-bold text-gray-800">{field.label}</p>
                          </div>
                          <div className="w-24">
                            <p className="text-xs font-bold text-gray-400 uppercase">Type</p>
                            <p className="text-sm font-medium text-gray-600">{field.type}</p>
                          </div>
                          <div className="w-20">
                            <p className="text-xs font-bold text-gray-400 uppercase">Required</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${field.required ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'}`}>
                              {field.required ? 'YES' : 'NO'}
                            </span>
                          </div>
                          <button
                            onClick={() => removeField(index)}
                            className="text-red-500 hover:text-red-700 p-2 bg-white rounded-sm shadow-sm border border-gray-100">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                      {/* Add Field Inputs */}
                      <div className="bg-orange-50/50 p-6 rounded-sm border-2 border-dashed border-orange-200 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="text-xs font-bold text-orange-600 uppercase mb-1 block">Field Label</label>
                            <input
                              type="text"
                              value={fieldInput.label}
                              onChange={(e) => setFieldInput({ ...fieldInput, label: e.target.value })}
                              placeholder="e.g., Portfolio Link"
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm placeholder-gray-400 bg-white"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-orange-600 uppercase mb-1 block">Field Type</label>
                            <select
                              value={fieldInput.type}
                              onChange={(e) => setFieldInput({ ...fieldInput, type: e.target.value })}
                              className="w-full px-4 py-2.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm bg-white"
                            >
                              <option value="text">Text Input</option>
                              <option value="textarea">Multi-line Text</option>
                              <option value="number">Number</option>
                              <option value="date">Date Picker</option>
                            </select>
                          </div>
                          <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer p-2.5">
                              <input
                                type="checkbox"
                                checked={fieldInput.required}
                                onChange={(e) => setFieldInput({ ...fieldInput, required: e.target.checked })}
                                className="w-4 h-4 accent-orange-500 rounded-sm"
                              />
                              <span className="text-sm font-bold text-gray-700">Mandatory</span>
                            </label>
                          </div>
                        </div>
                        <button
                          onClick={addField}
                          className="w-full bg-white border-2 border-orange-500 text-orange-600 px-4 py-2.5 rounded-sm font-black capitalize tracking-widest text-xs hover:bg-orange-500 hover:text-white transition-all">
                          Add Custom Field
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-sm transition-all font-semibold shadow-lg">
                    {editingJobId ? "Update Job Posting" : "Publish Job Posting"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* View Job Modal */}
          {showViewModal && (
            <JobViewModal
              job={selectedJob}
              onClose={() => setShowViewModal(false)}
              onEdit={() => {
                setShowViewModal(false);
                handleEditJob(selectedJob);
              }}
            />
          )}

        </div>
      </div>

      {/* Delete Modal */}
      <DeleteJobModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        isLoading={deleteLoading}
        title={jobToDelete?.title || ""}
      />

    </DashboardLayout>
  );
}
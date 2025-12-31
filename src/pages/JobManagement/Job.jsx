import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import JobViewModal from "../../pages/JobManagement/ViewPage"; // Import the JobViewModal component
import {
  Briefcase,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  FileText,
  Activity,
} from "lucide-react";
import { FiHome } from "react-icons/fi";
import NumberCard from "../../components/NumberCard";

// StatCard Component
const StatCard = ({ label, value, icon: Icon, gradient }) => {
  return (
    <div className="bg-white rounded-sm shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm mb-2 font-medium">{label}</p>
            <p className="text-4xl font-bold text-gray-800">{value}</p>
          </div>
          <div
            className={`bg-gradient-to-br ${gradient} p-4 rounded-sm shadow-lg`}
          >
            <Icon className="text-white" size={28} />
          </div>
        </div>
      </div>
      <div className={`h-1 bg-gradient-to-r ${gradient}`}></div>
    </div>
  );
};

// Main Component
export default function JobManagement() {
  // All useState hooks must be inside the component function
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [jobs] = useState([
    {
      id: 1,
      title: "Senior Software Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      positions: 3,
      applicants: 45,
      status: "Active",
      postedDate: "2025-11-15",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "New York",
      type: "Full-time",
      positions: 1,
      applicants: 28,
      status: "Active",
      postedDate: "2025-11-20",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "San Francisco",
      type: "Contract",
      positions: 2,
      applicants: 62,
      status: "Active",
      postedDate: "2025-11-10",
    },
    {
      id: 4,
      title: "Sales Executive",
      department: "Sales",
      location: "Los Angeles",
      type: "Full-time",
      positions: 5,
      applicants: 89,
      status: "On Hold",
      postedDate: "2025-11-05",
    },
    {
      id: 5,
      title: "HR Coordinator",
      department: "Human Resources",
      location: "Chicago",
      type: "Part-time",
      positions: 1,
      applicants: 34,
      status: "Closed",
      postedDate: "2025-10-28",
    },
    {
      id: 6,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      positions: 2,
      applicants: 56,
      status: "Active",
      postedDate: "2025-11-18",
    },
    {
      id: 7,
      title: "Data Analyst",
      department: "Analytics",
      location: "Boston",
      type: "Full-time",
      positions: 2,
      applicants: 41,
      status: "Active",
      postedDate: "2025-11-22",
    },
    {
      id: 8,
      title: "Customer Success Manager",
      department: "Customer Support",
      location: "Remote",
      type: "Full-time",
      positions: 3,
      applicants: 67,
      status: "On Hold",
      postedDate: "2025-11-08",
    },
  ]);

  // Handler function for viewing job details
  const handleViewJob = (job) => {
    setSelectedJob(job);
    setShowViewModal(true);
  };

  // Filter jobs based on selected filter
  const filteredJobs =
    selectedFilter === "All"
      ? jobs
      : jobs.filter((job) => job.status === selectedFilter);

  const filterOptions = ["All", "Active", "On Hold", "Closed"];

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentJobs = filteredJobs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-0 p-0 ml-6">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-sm p-3 mb-4 border-b">
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
                {/* Filter Buttons */}
                <div className="flex items-center gap-2 bg-white p-2 rounded-sm shadow-md">
                  <Filter size={20} className="text-orange-500 ml-2" />
                  {filterOptions.map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setSelectedFilter(filter)}
                      className={`px-4 py-2 rounded-sm font-semibold transition-all ${selectedFilter === filter
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>

                {/* Add New Job Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold hover:from-orange-600 hover:to-orange-700 hover:opacity-90 transition ml-2"
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
              number={jobs.length}
              icon={<Briefcase className="text-blue-600" size={24} />}
              iconBgColor={"bg-blue-100"}
              lineBorderClass={"border-blue-500"} />
            <NumberCard
              title={"Active Jobs"}
              number={jobs.filter((j) => j.status === "Active").length}
              icon={<Activity className="text-green-600" size={24} />}
              iconBgColor={"bg-green-100"}
              lineBorderClass={"border-green-500"} />
            <NumberCard
              title={"Total Applicants"}
              number={jobs.reduce((sum, j) => sum + j.applicants, 0)}
              icon={<Users className="text-orange-600" size={24} />}
              iconBgColor={"bg-orange-100"}
              lineBorderClass={"border-orange-500"} />
            <NumberCard
              title={"Open Positions"}
              number={jobs.reduce((sum, j) => sum + j.applicants, 0)}
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
                  {currentJobs.map((job, index) => (
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
                        {job.postedDate}
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
                            onClick={() => handleViewJob(job)}
                            className="p-2 hover:bg-blue-100 rounded-sm transition-all"
                            title="View Job Details"
                          >
                            <Eye size={18} className="text-blue-600" />
                          </button>
                          <button className="p-2 hover:bg-orange-100 rounded-sm transition-all">
                            <Edit size={18} className="text-orange-600" />
                          </button>
                          <button className="p-2 hover:bg-red-100 rounded-sm transition-all">
                            <Trash2 size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Empty State */}
          {filteredJobs.length === 0 && (
            <div className="bg-white rounded-sm shadow-md p-12 text-center">
              <Briefcase size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-600 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-500">
                Try changing your filter or add a new job posting.
              </p>
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-end items-center gap-3 mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === 1
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#FF7B1D] hover:opacity-90"
                }`}
            >
              Back
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-sm text-black font-semibold border transition ${currentPage === i + 1
                    ? "bg-gray-200 border-gray-400"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-sm text-white font-semibold transition ${currentPage === totalPages
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#22C55E] hover:opacity-90"
                }`}
            >
              Next
            </button>
          </div>

          {/* Add Job Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-sm shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                  <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Plus size={28} />
                    Add New Job Posting
                  </h2>
                </div>
                <div className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Senior Software Engineer"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Department *
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300">
                        <option>Engineering</option>
                        <option>Sales</option>
                        <option>Design</option>
                        <option>Product</option>
                        <option>Marketing</option>
                        <option>Human Resources</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Location *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Remote, New York"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Job Type *
                      </label>
                      <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 bg-white hover:border-gray-300">
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Number of Positions *
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        min="1"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Job Description *
                    </label>
                    <textarea
                      rows="5"
                      placeholder="Describe the role, responsibilities, and requirements..."
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-sm focus:border-[#FF7B1D] focus:ring-2 focus:ring-[#FF7B1D] focus:ring-opacity-20 outline-none transition-all text-sm text-gray-900 placeholder-gray-400 bg-white hover:border-gray-300"
                    ></textarea>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-sm hover:bg-gray-100 transition-all font-semibold"
                  >
                    Cancel
                  </button>
                  <button className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-sm transition-all font-semibold shadow-lg">
                    Create Job Posting
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
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

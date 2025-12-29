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
} from "lucide-react";

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

  // Statistics data
  const stats = [
    {
      label: "Total Jobs",
      value: jobs.length,
      icon: Briefcase,
      gradient: "from-orange-400 to-orange-600",
    },
    {
      label: "Active Jobs",
      value: jobs.filter((j) => j.status === "Active").length,
      icon: Briefcase,
      gradient: "from-green-400 to-green-600",
    },
    {
      label: "Total Applicants",
      value: jobs.reduce((sum, j) => sum + j.applicants, 0),
      icon: Users,
      gradient: "from-blue-400 to-blue-600",
    },
    {
      label: "Open Positions",
      value: jobs.reduce((sum, j) => sum + j.positions, 0),
      icon: Plus,
      gradient: "from-purple-400 to-purple-600",
    },
  ];

  const filterOptions = ["All", "Active", "On Hold", "Closed"];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-0 via-white to-orange-0 p-0 ml-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent flex items-center gap-3 mb-2">
                  <div className="bg-gradient-to-br from-orange-400 to-orange-600 p-3 rounded-sm shadow-lg">
                    <Briefcase className="text-white" size={32} />
                  </div>
                  Job Management
                </h1>
                <p className="text-gray-600 text-lg ml-14">
                  Manage and track all job postings efficiently
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
                      className={`px-4 py-2 rounded-sm font-semibold transition-all ${
                        selectedFilter === filter
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
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-sm flex items-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus size={22} />
                  <span className="font-semibold">Add New Job</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
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
                  {filteredJobs.map((job, index) => (
                    <tr
                      key={job.id}
                      className={`hover:bg-orange-50 transition-colors whitespace-nowrap ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
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
                          className={`px-3 py-1 text-sm font-semibold rounded-sm ${
                            job.status === "Active"
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

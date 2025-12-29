import React, { useState } from "react";
import { FiHome } from "react-icons/fi";
import DashboardLayout from "../../components/DashboardLayout";
import AddTermModal from "../../components/TermCondition/AddTermModal";
import {
  Pencil,
  Trash2,
  Eye,
  Filter,
  FileText,
  Calendar,
  Search,
} from "lucide-react";
import NumberCard from "../../components/NumberCard";

const TermsAndCondition = () => {
  // Sample data with full details
  const [termsList, setTermsList] = useState([
    {
      id: 1,
      department: "HR",
      designation: "Manager",
      title: "Remote Work Policy",
      description:
        "Guidelines for employees working remotely including work hours, communication protocols, equipment provision, and performance expectations. All remote employees must maintain regular communication with their team and adhere to security protocols.",
      createdDate: "2024-01-15",
      updatedDate: "2024-10-20",
    },
    {
      id: 2,
      department: "IT",
      designation: "Engineer",
      title: "Data Security & Confidentiality",
      description:
        "Comprehensive data protection policy covering password management, secure coding practices, data encryption standards, and breach reporting procedures. Employees must complete annual security training.",
      createdDate: "2024-02-10",
      updatedDate: "2024-09-15",
    },
    {
      id: 3,
      department: "Sales",
      designation: "Executive",
      title: "Client Communication Standards",
      description:
        "Professional communication guidelines for client interactions including response time expectations, email etiquette, meeting protocols, and escalation procedures for complex issues.",
      createdDate: "2024-03-05",
      updatedDate: "2024-11-01",
    },
    {
      id: 4,
      department: "Finance",
      designation: "Manager",
      title: "Expense Reimbursement Policy",
      description:
        "Detailed process for submitting expense claims including eligible expenses, required documentation, approval workflows, and reimbursement timelines. All receipts must be submitted within 30 days.",
      createdDate: "2024-01-20",
      updatedDate: "2024-08-12",
    },
    {
      id: 5,
      department: "Operations",
      designation: "Associate",
      title: "Health & Safety Guidelines",
      description:
        "Workplace safety protocols including emergency procedures, accident reporting, ergonomic standards, and regular safety audits. Compliance is mandatory for all staff members.",
      createdDate: "2024-04-01",
      updatedDate: "2024-10-25",
    },
  ]);

  const [filterDept, setFilterDept] = useState("");
  const [filterDesig, setFilterDesig] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingTerm, setViewingTerm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState({
    department: "",
    designation: "",
    title: "",
    description: "",
  });

  const handleAddTerm = () => {
    if (
      !formData.title.trim() ||
      !formData.description.trim() ||
      !formData.department ||
      !formData.designation
    ) {
      alert("All fields are required.");
      return;
    }

    const newTerm = {
      id: termsList.length + 1,
      department: formData.department,
      designation: formData.designation,
      title: formData.title,
      description: formData.description,
      createdDate: new Date().toISOString().split("T")[0],
      updatedDate: new Date().toISOString().split("T")[0],
    };

    setTermsList([...termsList, newTerm]);
    setFormData({
      department: "",
      designation: "",
      title: "",
      description: "",
    });
    setIsModalOpen(false);
  };

  const handleDeleteTerm = (id) => {
    if (window.confirm("Are you sure you want to delete this policy?")) {
      setTermsList(termsList.filter((term) => term.id !== id));
    }
  };

  const filteredTerms = termsList.filter((term) => {
    const matchesDept = filterDept ? term.department === filterDept : true;
    const matchesDesig = filterDesig ? term.designation === filterDesig : true;
    const matchesSearch = searchTerm
      ? term.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        term.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesDept && matchesDesig && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="ml-6 min-h-screen">
        {/* Header Section */}
        <div className="bg-white rounded-sm  p-3 mb-4 border-b">
          <div className="flex justify-between items-center">
            {/* Left Title + Breadcrumb */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Term & Conditions
              </h1>

              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <FiHome className="text-gray-700 text-sm" />
                <span className="text-gray-400">HRM /</span>
                <span className="text-[#FF7B1D] font-medium">
                  Term & Condition
                </span>
              </p>
            </div>

            {/* RIGHT SIDE BUTTONS */}
            <div className="flex items-center gap-3">
              {/* More Filters Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-white text-black border-2 rounded-sm text-sm font-semibold hover:bg-gray-100 transition-all"
                >
                  <Filter size={16} className="text-black" />
                  More Filters
                </button>

                {/* Dropdown Filters */}
                {showFilters && (
                  <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg w-64 p-4 animate-fadeIn">
                    {/* Department */}
                    <div className="mb-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Department
                      </label>
                      <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] outline-none"
                      >
                        <option value="">All Departments</option>
                        <option value="HR">Human Resources</option>
                        <option value="IT">IT Support</option>
                        <option value="Sales">Sales</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>

                    {/* Designation */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Designation
                      </label>
                      <select
                        value={filterDesig}
                        onChange={(e) => setFilterDesig(e.target.value)}
                        className="w-full border-2 border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#FF7B1D] focus:border-[#FF7B1D] outline-none"
                      >
                        <option value="">All Designations</option>
                        <option value="Manager">Manager</option>
                        <option value="Executive">Executive</option>
                        <option value="Engineer">Engineer</option>
                        <option value="Associate">Associate</option>
                        <option value="Director">Director</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Terms Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="mr-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-sm font-semibold hover:shadow-xl hover:from-orange-600 hover:to-orange-700 transition-all flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Add Terms & Conditions
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <NumberCard
            title={"Total Policies"}
            number={termsList.length}
            icon={<FileText className="text-blue-600" size={24} />}
            iconBgColor={"bg-blue-100"}
            lineBorderClass={"border-blue-500"}
          />

          <div className="bg-white rounded-sm shadow-sm p-5 border-t-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Active Filters
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {(filterDept ? 1 : 0) +
                    (filterDesig ? 1 : 0) +
                    (searchTerm ? 1 : 0)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Filter className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-5 border-t-4 border-[#FF7B1D]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  Filtered Results
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {filteredTerms.length}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Calendar className="text-[#FF7B1D]" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-sm shadow-sm p-5 border-t-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Departments</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">
                  {new Set(termsList.map((t) => t.department)).size}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Terms Table */}
        <div className="bg-white rounded-am shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-4 px-6 font-semibold text-left">S.N</th>
                  <th className="py-4 px-6 font-semibold text-left">
                    Department
                  </th>
                  <th className="py-4 px-6 font-semibold text-left">
                    Designation
                  </th>
                  <th className="py-4 px-6 font-semibold text-left">Title</th>
                  <th className="py-4 px-6 font-semibold text-left">
                    Description
                  </th>
                  <th className="py-4 px-6 font-semibold text-left">Created</th>
                  <th className="py-4 px-6 font-semibold text-left">Updated</th>
                  <th className="py-4 px-6 font-semibold text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTerms.length > 0 ? (
                  filteredTerms.map((term, index) => (
                    <tr
                      key={term.id}
                      className="border-b border-gray-100 hover:bg-gradient-to-r hover:from-orange-50 hover:to-transparent transition-all"
                    >
                      <td className="py-4 px-6 font-medium text-gray-700">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {term.department}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                          {term.designation}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-gray-800 font-medium max-w-xs">
                        {term.title}
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm max-w-md">
                        <div className="line-clamp-2">{term.description}</div>
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm whitespace-nowrap">
                        {term.createdDate}
                      </td>
                      <td className="py-4 px-6 text-gray-600 text-sm whitespace-nowrap">
                        {term.updatedDate}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setViewingTerm(term)}
                            className=" p-2 rounded-sm"
                            title="View Details"
                          >
                            <Eye
                              size={18}
                              className="text-blue-500 hover:bg-blue-50 rounded-sm transition-colors "
                            />
                          </button>
                          <button
                            className=" bg-opacity-10 p-2 rounded-sm"
                            title="Edit"
                          >
                            <Pencil
                              size={18}
                              className="text-[#FF7B1D]  transition-transform"
                            />
                          </button>
                          <button
                            onClick={() => handleDeleteTerm(term.id)}
                            className=" p-2 rounded-sm "
                            title="Delete"
                          >
                            <Trash2
                              size={18}
                              className="text-red-500  transition-transform"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="bg-gray-100 p-4 rounded-full">
                          <FileText size={48} className="text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium text-lg">
                          No terms & conditions found
                        </p>
                        <p className="text-gray-400 text-sm">
                          {searchTerm || filterDept || filterDesig
                            ? "Try adjusting your filters"
                            : 'Click "Add Terms & Conditions" to create your first policy'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AddTermModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddTerm}
      />

      {/* View Details Modal */}
      {viewingTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-[#FF7B1D] to-[#FF9A4D] text-white p-6 sticky top-0">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {viewingTerm.title}
                  </h2>
                  <div className="flex gap-3">
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {viewingTerm.department}
                    </span>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">
                      {viewingTerm.designation}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setViewingTerm(null)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  DESCRIPTION
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {viewingTerm.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Created Date
                  </p>
                  <p className="text-gray-800 font-medium">
                    {viewingTerm.createdDate}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-500">
                    Last Updated
                  </p>
                  <p className="text-gray-800 font-medium">
                    {viewingTerm.updatedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default TermsAndCondition;

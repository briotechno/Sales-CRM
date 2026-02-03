import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { FiHome } from "react-icons/fi";
import {
  Plus,
  Edit,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Package
} from "lucide-react";
import {
  LeaveFormModal,
} from "../../pages/LeaveManagement/LeaveModals";
import {
  useGetLeaveTypesQuery,
  useCreateLeaveTypeMutation,
  useUpdateLeaveTypeMutation,
  useDeleteLeaveTypeMutation
} from "../../store/api/leaveApi";
import toast from 'react-hot-toast';
import Modal from "../../components/common/Modal";

const DeleteHolidayModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  holidayName,
}) => {
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
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <AlertCircle size={48} className="text-red-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Confirm Delete
        </h2>

        <p className="text-gray-600 mb-2 leading-relaxed">
          Are you sure you want to delete leave type{" "}
          <span className="font-bold text-gray-800">"{holidayName}"</span>?
        </p>

        <p className="text-sm text-red-500 italic">
          This action cannot be undone. All associated data will be permanently removed.
        </p>

      </div>
    </Modal>
  );
};

export default function ManageLeave() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState({
    leave_type: "",
    description: "",
    renewal_type: "Monthly",
    leave_allocation: 0,
    max_consecutive_days: 0,
    eligibility_days: 0,
    paid: "Yes",
    status: "Active",
  });

  const [filters, setFilters] = useState({
    status: "All",
    paid: "All",
  });

  // Handle outside click for filter dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const clearAllFilters = () => {
    setFilters({ status: "All", paid: "All" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const hasActiveFilters = filters.status !== "All" || filters.paid !== "All" || searchTerm !== "";

  // Queries
  const {
    data: leaveData,
    isLoading,
    isError,
    refetch
  } = useGetLeaveTypesQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    status: filters.status === "All" ? "" : filters.status
  }, { refetchOnMountOrArgChange: true });

  const [createLeaveType] = useCreateLeaveTypeMutation();
  const [updateLeaveType] = useUpdateLeaveTypeMutation();
  const [deleteLeaveType, { isLoading: isDeleting }] =
    useDeleteLeaveTypeMutation();

  const handleAddNew = () => {
    setEditingLeave(null);
    setFormData({
      leave_type: "",
      description: "",
      renewal_type: "Monthly",
      leave_allocation: 0,
      max_consecutive_days: 0,
      eligibility_days: 0,
      paid: "Yes",
      status: "Active",
    });
    setShowModal(true);
  };

  const handleEdit = (leave) => {
    setEditingLeave(leave);
    setFormData(leave);
    setShowModal(true);
  };

  const handleDeleteClick = (leave) => {
    setSelectedLeave(leave);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLeave) return;

    try {
      await deleteLeaveType(selectedLeave.id).unwrap();
      toast.success("Leave type deleted successfully");
      setShowDeleteModal(false);
      setSelectedLeave(null);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to delete leave type");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLeave) {
        await updateLeaveType({ id: editingLeave.id, ...formData }).unwrap();
        toast.success('Leave type updated successfully');
      } else {
        await createLeaveType(formData).unwrap();
        toast.success('Leave type created successfully');
      }
      setShowModal(false);
      refetch();
    } catch (error) {
      toast.error(error?.data?.message || 'Failed to save leave type');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        ['leave_allocation', 'max_consecutive_days', 'eligibility_days'].includes(name)
          ? Number(value) : value,
    }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  }

  const totalTypes = leaveData?.pagination?.total || 0;
  const totalPages = leaveData?.pagination?.totalPages || 1;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Manage Leave Types</h1>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-2 font-medium">
                  <FiHome className="text-gray-400" size={14} />
                  <span>HRM</span> /{" "}
                  <span className="text-[#FF7B1D]">
                    Manage all Leave
                  </span>
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
                        <span className="text-sm font-bold text-gray-700 tracking-wide">Statuses</span>
                      </div>
                      <div className="py-1">
                        {["All", "Active", "Inactive"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setFilters({ ...filters, status });
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${filters.status === status
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      <div className="p-3 border-t border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">Payment Status</span>
                      </div>
                      <div className="py-1">
                        {["All", "Yes", "No"].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              setFilters({ ...filters, paid: option });
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${filters.paid === option
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {option === "All" ? "All" : option === "Yes" ? "Paid" : "Unpaid"}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus size={20} /> Add Leave Type
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-2 mt-0">
          {/* Table Card */}
          <div className="overflow-x-auto  border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Leave Type</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[35%]">Description</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400 w-[12%]">Allocation</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400 w-[12%]">Period</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400 w-[8%]">Paid</th>
                  <th className="py-3 px-4 font-semibold text-center border-b border-orange-400 w-[10%]">Status</th>
                  <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 w-[8%]">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-6 bg-gray-200 rounded-full animate-pulse w-16 mx-auto"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-4 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-5 bg-gray-200 rounded-full animate-pulse w-12 mx-auto"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-5 bg-gray-200 rounded-full animate-pulse w-16 mx-auto"></div></td>
                      <td className="px-6 py-4 text-center"><div className="h-8 bg-gray-200 rounded animate-pulse w-20 mx-auto"></div></td>
                    </tr>
                  ))
                ) : isError ? (
                  <tr><td colSpan="7" className="text-center py-8 text-red-500">Error loading data</td></tr>
                ) : leaveData?.leave_types?.length === 0 ? (
                  <tr><td colSpan="7" className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-3">
                      <Package size={48} className="text-gray-200" />
                      <p>No leave types found</p>
                    </div>
                  </td></tr>
                ) : (
                  leaveData?.leave_types.map((leave) => (
                    <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <span className="font-bold text-gray-800">{leave.leave_type}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-gray-500 text-sm line-clamp-1" title={leave.description}>{leave.description}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-sm bg-[#E6F4FE] text-[#0070FF] font-bold text-[11px]">
                          {leave.leave_allocation} days
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="text-sm text-gray-700">{leave.renewal_type}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-sm text-[11px] font-bold uppercase ${leave.paid === "Yes" ? "bg-[#E6F9F1] text-[#00B050]" : "bg-[#FEEBF0] text-[#FF5A5F]"}`}>
                          {leave.paid === "Yes" ? "YES" : "NO"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-3 py-1 rounded-sm text-[11px] font-bold uppercase ${leave.status === "Active" ? "bg-[#E6F9F1] text-[#00B050]" : "bg-[#F1F3F5] text-[#495057]"}`}>
                          {leave.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2 px-2">
                          <button
                            onClick={() => handleEdit(leave)}
                            className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(leave)}
                            className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 🔹 Pagination Section */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
            <p className="text-sm font-semibold text-gray-700">
              Showing <span className="text-orange-600">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, totalTypes)}</span> of <span className="text-orange-600">{totalTypes}</span> results
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-sm font-bold transition ${currentPage === i + 1
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"
                  }`}
              >
                Next
              </button>
            </div>
          </div>

          {/* Modals */}
          <LeaveFormModal
            showModal={showModal}
            setShowModal={setShowModal}
            editingLeave={editingLeave}
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
          />

          <DeleteHolidayModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedLeave(null);
            }}
            onConfirm={handleConfirmDelete}
            isLoading={isDeleting}
            holidayName={selectedLeave?.leave_type}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { FiHome } from "react-icons/fi";
import {
  Plus,
  Edit2,
  Trash2,
  FileText,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import {
  LeaveFormModal,
  FilterModal,
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
          Are you sure you want to delete holiday{" "}
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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [editingLeave, setEditingLeave] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

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
    status: filters.status
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

  // Stats Logic - For accurate stats we need API support or we just show count of Current Page if we don't fetch all.
  // We'll trust the "Total" from backend pagination for the main count.
  // For Active/Paid breakdown, it depends on what the backend gives or if we trust the UI to just summarize current page.
  // To avoid confusion, I'll just show "Total" correctly and maybe hide others or show "-" until backend provides `/stats` endpoint.
  // Actually, I can rely on the data on screen if I paginate, but it's partial.
  // I will just use `leaveData?.pagination?.total` for Total.
  // I'll leave the others hardcoded "N/A" or try to be smart about it later.
  // Or I can execute a parallel query with `limit=1` and `status=Active` just to get counts. No that's overkill.
  // I'll simply show "Total Leave Types" which is accurate. Remove others for now or keep them static?
  // I'll keep them as "-" to indicate not loaded, or remove the detailed cards.
  // Let's remove detailed cards or calculate from current page (misleading).
  // I will remove the misleading cards and just keep Total and maybe "Active on this page".
  // Actually, user wants "Pagination and Filters".
  // I will keep only Total card and maybe 1-2 generic ones.

  const totalTypes = leaveData?.pagination?.total || 0;
  const totalPages = leaveData?.pagination?.totalPages || 1;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Manage Leave</h1>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <FiHome className="text-gray-400" size={14} /> HRM / <span className="text-orange-500 font-medium">Manage all Leave</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowFilterModal(true)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-sm flex items-center gap-2 transition text-sm font-semibold shadow-sm active:scale-95 text-gray-700"
                >
                  <Filter size={18} /> FILTER
                </button>

                <button
                  onClick={handleAddNew}
                  className="flex items-center gap-2 px-4 py-2 rounded-sm font-bold transition shadow-md text-sm active:scale-95 bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                >
                  <Plus size={18} /> ADD LEAVE TYPE
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0">


          {/* Table Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold tracking-wider">Leave Type</th>
                    <th className="px-6 py-4 text-left font-semibold tracking-wider">Description</th>
                    <th className="px-6 py-4 text-center font-semibold tracking-wider">Allocation</th>
                    <th className="px-6 py-4 text-center font-semibold tracking-wider">Period</th>
                    <th className="px-6 py-4 text-center font-semibold tracking-wider">Paid</th>
                    <th className="px-6 py-4 text-center font-semibold tracking-wider">Status</th>
                    <th className="px-6 py-4 text-center font-semibold tracking-wider">Action</th>
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
                    <tr><td colSpan="7" className="text-center py-8 text-gray-500">No leave types found</td></tr>
                  ) : (
                    leaveData?.leave_types.map((leave) => (
                      <tr key={leave.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-900">{leave.leave_type}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-500 text-sm line-clamp-1" title={leave.description}>{leave.description}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium text-xs">
                            {leave.leave_allocation} days
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="text-sm text-gray-700">{leave.renewal_type}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${leave.paid === "Yes" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {leave.paid}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${leave.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>
                            {leave.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(leave)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(leave)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                            >
                              <Trash2 size={16} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Showing <span className="font-bold">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, leaveData?.pagination?.total || 0)}</span> of <span className="font-bold">{leaveData?.pagination?.total || 0}</span> results
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                        ? 'bg-orange-500 text-white border-orange-500'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white hover:bg-gray-50 transition-colors"
                >
                  Next
                </button>
              </div>
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

          <FilterModal
            showFilterModal={showFilterModal}
            setShowFilterModal={setShowFilterModal}
            filters={filters}
            setFilters={setFilters}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

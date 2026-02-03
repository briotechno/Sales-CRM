import React, { useState, useEffect, useRef } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  Eye,
  Filter,
  Home,
  DollarSign,
  Handshake,
  Target,
  X,
  Plus as PlusIcon,
  ChevronDown,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { FiHome } from "react-icons/fi";
import NumberCard from "../../components/NumberCard";
import {
  useGetTeamsQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation
} from "../../store/api/teamApi";
import AddTeamModal from "../../components/Team/AddTeamModal";
import EditTeamModal from "../../components/Team/EditTeamModal";
import ViewTeamModal from "../../components/Team/ViewTeamModal";
import DeleteTeamModal from "../../components/Team/DeleteTeamModal";
import { toast } from "react-hot-toast";
import usePermission from "../../hooks/usePermission";

export default function TeamManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef(null);

  const itemsPerPage = 10;

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const { create, read, update, delete: remove } = usePermission("Team Management");

  // Filter Logic (Frontend side since backend only supports search)
  const getDateRange = () => {
    const today = new Date();
    const formatDate = (date) => date.toISOString().split('T')[0];

    let dateFrom = "";
    let dateTo = "";

    if (dateFilter === "Today") {
      dateFrom = formatDate(today);
      dateTo = formatDate(today);
    } else if (dateFilter === "Yesterday") {
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      dateFrom = formatDate(yesterday);
      dateTo = formatDate(yesterday);
    } else if (dateFilter === "Last 7 Days") {
      const last7 = new Date(today);
      last7.setDate(today.getDate() - 7);
      dateFrom = formatDate(last7);
      dateTo = formatDate(today);
    } else if (dateFilter === "This Month") {
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFrom = formatDate(firstDay);
      dateTo = formatDate(today);
    } else if (dateFilter === "Custom") {
      dateFrom = customStart;
      dateTo = customEnd;
    }
    return { dateFrom, dateTo };
  };

  const { dateFrom, dateTo } = getDateRange();

  const { data, isLoading, isError, error, refetch } = useGetTeamsQuery({
    page: currentPage,
    limit: itemsPerPage,
    // Note: status and date filters are handled on frontend if backend doesn't support them
    // but we pass them anyway in case backend is updated or supports them
    status: statusFilter !== "All" ? statusFilter : undefined,
    dateFrom,
    dateTo,
  });

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const teamsData = data?.teams || [];

  // Frontend Filtering
  const filteredTeams = teamsData.filter(team => {
    let statusMatch = true;
    if (statusFilter !== "All") {
      statusMatch = team.status === statusFilter;
    }

    let dateMatch = true;
    if (dateFilter !== "All" && (dateFrom || dateTo)) {
      const teamDate = team.created_at ? new Date(team.created_at).toISOString().split('T')[0] : "";
      if (dateFrom && dateTo) {
        dateMatch = teamDate >= dateFrom && teamDate <= dateTo;
      } else if (dateFrom) {
        dateMatch = teamDate >= dateFrom;
      } else if (dateTo) {
        dateMatch = teamDate <= dateTo;
      }
    }

    return statusMatch && dateMatch;
  });

  const totalItems = data?.pagination?.total || 0;
  const totalPages = data?.pagination?.totalPages || 1;

  const handleAddTeam = async (formData) => {
    try {
      await createTeam(formData).unwrap();
      toast.success("Team created successfully");
      setShowAddModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create team");
    }
  };

  const handleUpdateTeam = async (formData) => {
    try {
      await updateTeam(formData).unwrap();
      toast.success("Team updated successfully");
      setShowEditModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update team");
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(selectedTeam.id).unwrap();
      toast.success("Team deleted successfully");
      setShowDeleteModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete team");
    }
  };

  const clearAllFilters = () => {
    setStatusFilter("All");
    setDateFilter("All");
    setCustomStart("");
    setCustomEnd("");
    setCurrentPage(1);
    setIsFilterOpen(false);
  };

  const hasActiveFilters = statusFilter !== "All" || dateFilter !== "All";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        {/* Header Section */}
        <div className="bg-white sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transition-all duration-300">Team Management</h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <FiHome className="text-gray-700" size={14} />
                  <span className="text-gray-400"></span> HRM /{" "}
                  <span className="text-[#FF7B1D] font-medium">
                    All Teams
                  </span>
                </p>
              </div>

              {/* Buttons */}
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
                      {/* Status Section */}
                      <div className="p-3 border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">status</span>
                      </div>
                      <div className="py-1">
                        {["All", "Active", "Inactive"].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              setStatusFilter(status);
                              setIsFilterOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`block w-full text-left px-4 py-2 text-sm transition-colors ${statusFilter === status
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                              }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>

                      {/* Date Range Section */}
                      <div className="p-3 border-t border-b border-gray-100 bg-gray-50">
                        <span className="text-sm font-bold text-gray-700 tracking-wide">dateCreated</span>
                      </div>
                      <div className="py-1">
                        {["All", "Today", "Yesterday", "Last 7 Days", "This Month", "Custom"].map((option) => (
                          <div key={option}>
                            <button
                              onClick={() => {
                                setDateFilter(option);
                                if (option !== "Custom") {
                                  setIsFilterOpen(false);
                                  setCurrentPage(1);
                                }
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm transition-colors ${dateFilter === option
                                ? "bg-orange-50 text-orange-600 font-bold"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            >
                              {option}
                            </button>
                            {option === "Custom" && dateFilter === "Custom" && (
                              <div className="px-4 py-3 space-y-2 border-t border-gray-50 bg-gray-50/50">
                                <input
                                  type="date"
                                  value={customStart}
                                  onChange={(e) => setCustomStart(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                                <input
                                  type="date"
                                  value={customEnd}
                                  onChange={(e) => setCustomEnd(e.target.value)}
                                  className="w-full px-2 py-2 border border-gray-300 rounded-sm text-xs focus:ring-1 focus:ring-orange-500 outline-none"
                                />
                                <button
                                  onClick={() => { setIsFilterOpen(false); setCurrentPage(1); }}
                                  className="w-full bg-[#FF7B1D] text-white text-[10px] font-bold py-2 rounded-sm uppercase"
                                >
                                  Apply
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={!create}
                  className={`flex items-center gap-2 px-6 py-3 rounded-sm font-semibold transition shadow-lg hover:shadow-xl ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <PlusIcon size={20} />
                  Add Team
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 pt-0 mt-2">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
            <NumberCard
              title="Total Team"
              number={totalItems || "0"}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Avg Members"
              number={teamsData.length > 0 ? (teamsData.reduce((acc, t) => acc + (t.total_members || 0), 0) / teamsData.length).toFixed(1) : "0"}
              icon={<DollarSign className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Active Teams"
              number={teamsData.filter(t => t.status === 'Active').length || "0"}
              icon={<Handshake className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Inactive Teams"
              number={teamsData.filter(t => t.status === 'Inactive').length || "0"}
              icon={<Target className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto mt-4 border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[5%]">S.N</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Team ID</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[25%]">Team Name</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Total Members</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Date Created</th>
                  <th className="py-3 px-4 font-semibold text-left border-b border-orange-400 w-[15%]">Status</th>
                  <th className="py-3 px-4 font-semibold text-right border-b border-orange-400 w-[10%]">Action</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-20 text-center">
                      <div className="flex justify-center flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                        <p className="text-gray-500 font-semibold animate-pulse">Loading teams...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredTeams.length > 0 ? (
                  filteredTeams.map((team, index) => (
                    <tr
                      key={team.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-left">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-4 font-medium text-orange-600 text-left">{team.team_id}</td>
                      <td className="py-3 px-4 font-semibold text-gray-800 text-left">
                        {team.team_name}
                      </td>
                      <td className="py-3 px-4 text-left">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-sm bg-orange-100 flex items-center justify-center text-orange-600 shadow-sm border border-orange-200">
                            <Users size={14} />
                          </div>
                          <span className="font-bold text-gray-700">{team.total_members || 0}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 text-sm text-left">
                        {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-left">
                        <span
                          className={`px-3 py-1 rounded-sm text-[10px] font-bold border uppercase tracking-wider ${team.status === "Active"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                            }`}
                        >
                          {team.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-2">
                          {read && (
                            <button
                              onClick={() => { setSelectedTeam(team); setShowViewModal(true); }}
                              className="p-1 hover:bg-orange-100 rounded-sm text-blue-500 hover:text-blue-700 transition-all font-medium"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          {update && (
                            <button
                              onClick={() => { setSelectedTeam(team); setShowEditModal(true); }}
                              className="p-1 hover:bg-orange-100 rounded-sm text-green-500 hover:text-green-700 transition-all font-medium"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                          )}
                          {remove && (
                            <button
                              onClick={() => { setSelectedTeam(team); setShowDeleteModal(true); }}
                              className="p-1 hover:bg-orange-100 rounded-sm text-red-500 hover:text-red-700 transition-all font-medium border border-transparent shadow-sm"
                              title="Delete"
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
                    <td
                      colSpan="7"
                      className="py-12 text-gray-500 font-medium text-sm text-center"
                    >
                      <div className="flex flex-col items-center gap-3">
                        <Users size={48} className="text-gray-200" />
                        <p>No teams found matches your criteria.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4 bg-gray-50 p-4 rounded-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-700">
                Showing <span className="text-orange-600">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="text-orange-600">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="text-orange-600">{totalItems}</span> Teams
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
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
                      onClick={() => setCurrentPage(i + 1)}
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
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-sm font-bold transition flex items-center gap-1 ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#22C55E] text-white hover:opacity-90 shadow-md"
                    }`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddTeamModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddTeam}
        isLoading={isCreating}
      />

      <EditTeamModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        teamId={selectedTeam?.id}
        onSubmit={handleUpdateTeam}
        isLoading={isUpdating}
      />

      <ViewTeamModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        teamId={selectedTeam?.id}
      />

      <DeleteTeamModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedTeam(null);
        }}
        teamId={selectedTeam?.id}
        teamName={selectedTeam?.team_name}
      />
    </DashboardLayout>
  );
}

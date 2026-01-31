import React, { useState } from "react";
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
} from "lucide-react";
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
  // 1. States for filtering and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  // 2. States for Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const { create, read, update, delete: remove } = usePermission("Team Management");

  // 3. API Queries and Mutations
  const { data, isLoading, isError, error, refetch } = useGetTeamsQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();
  const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

  const teams = data?.teams || [];
  const totalItems = data?.pagination?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 4. Handlers
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

  const handleToggleStatus = async (team) => {
    try {
      const newStatus = team.status === "Active" ? "Inactive" : "Active";
      await updateTeam({ id: team.id, status: newStatus }).unwrap();
      toast.success(`Team status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  // Custom scrollbar styles
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, #f97316, #ea580c);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, #ea580c, #c2410c);
    }
  `;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-white">
        <style>{scrollbarStyles}</style>
        {/* Header Section */}
        <div className="bg-white border-b sticky top-0 z-30">
          <div className="max-w-8xl mx-auto px-4 py-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Team Management</h1>
                <p className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <Home className="text-gray-400" size={14} /> HRM / <span className="text-orange-500 font-medium">All Team</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search teams..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-4 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-orange-500 text-sm w-64 shadow-sm"
                  />
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={!create}
                  className={`flex items-center justify-center gap-2 px-6 py-2 rounded-sm font-bold transition shadow-md text-sm active:scale-95 ${create
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                >
                  <Plus size={18} />
                  CREATE TEAM
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto p-4 mt-0">

          {/* Statement Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <NumberCard
              title="Total Team"
              number={totalItems || "0"}
              icon={<Users className="text-blue-600" size={24} />}
              iconBgColor="bg-blue-100"
              lineBorderClass="border-blue-500"
            />
            <NumberCard
              title="Avg Members"
              number={teams.length > 0 ? (teams.reduce((acc, t) => acc + (t.total_members || 0), 0) / teams.length).toFixed(1) : "0"}
              icon={<DollarSign className="text-green-600" size={24} />}
              iconBgColor="bg-green-100"
              lineBorderClass="border-green-500"
            />
            <NumberCard
              title="Active Teams"
              number={teams.filter(t => t.status === 'Active').length || "0"}
              icon={<Handshake className="text-orange-600" size={24} />}
              iconBgColor="bg-orange-100"
              lineBorderClass="border-orange-500"
            />
            <NumberCard
              title="Inactive Teams"
              number={teams.filter(t => t.status === 'Inactive').length || "0"}
              icon={<Target className="text-purple-600" size={24} />}
              iconBgColor="bg-purple-100"
              lineBorderClass="border-purple-500"
            />
          </div>

          {/* 🧾 Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-sm shadow-sm">
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm">
                  <th className="py-3 px-4 font-semibold">S.N</th>
                  <th className="py-3 px-4 font-semibold">Team ID</th>
                  <th className="py-3 px-4 font-semibold">Team Name</th>
                  <th className="py-3 px-4 font-semibold">Total Members</th>
                  <th className="py-3 px-4 font-semibold">Date Created</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-gray-500 font-medium">
                      Loading...
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan="7" className="py-10 text-red-500 font-medium">
                      Error loading teams.
                    </td>
                  </tr>
                ) : teams.length > 0 ? (
                  teams.map((team, index) => (
                    <tr
                      key={team.id}
                      className="border-t hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="py-3 px-4 text-orange-600 font-medium">
                        {team.team_id}
                      </td>
                      <td className="py-3 px-4 text-gray-800 font-medium">
                        {team.team_name}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-8 h-8 rounded-sm bg-orange-100 flex items-center justify-center text-orange-600">
                            <Users size={16} />
                          </div>
                          <span className="font-bold text-gray-700">{team.total_members || 0}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {team.created_at ? new Date(team.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${team.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                        >
                          {team.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center gap-2">
                          {read && (
                            <button
                              onClick={() => { setSelectedTeam(team); setShowViewModal(true); }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition-colors"
                              title="View Team"
                            >
                              <Eye size={18} />
                            </button>
                          )}
                          {update && (
                            <button
                              onClick={() => { setSelectedTeam(team); setShowEditModal(true); }}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-sm transition-colors"
                              title="Edit Team"
                            >
                              <Edit2 size={18} />
                            </button>
                          )}
                          {remove && (
                            <button
                              onClick={() => { setSelectedTeam(team); setShowDeleteModal(true); }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
                              title="Delete Team"
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
                    <td colSpan="7" className="py-10 text-gray-500 font-medium">
                      No teams found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🔹 Pagination */}
          <div className="flex justify-between items-center mt-6 bg-gray-50 p-4 rounded-sm border">
            <p className="text-sm text-gray-600">
              Showing <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-bold">{totalItems}</span> teams
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 border rounded-sm text-sm font-bold ${currentPage === i + 1
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-sm text-sm font-bold disabled:opacity-50 bg-white"
              >
                Next
              </button>
            </div>
          </div>
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

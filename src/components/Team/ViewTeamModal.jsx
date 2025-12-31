import React from "react";
import { Users, X } from "lucide-react";
import { useGetTeamByIdQuery } from "../../store/api/teamApi";

const ViewTeamModal = ({ isOpen, onClose, teamId }) => {
    const { data: team, isLoading } = useGetTeamByIdQuery(teamId, {
        skip: !isOpen || !teamId,
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar rounded-sm">
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users size={24} />
                        {isLoading ? "Loading..." : `Team Details: ${team?.team_id}`}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 transition-all"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                    {isLoading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : team ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Team Name</p>
                                    <p className="text-lg font-bold text-gray-800">{team.team_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Status</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${team.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {team.status}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                                <p className="text-gray-700 whitespace-pre-line">{team.description || "No description provided."}</p>
                            </div>

                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    Team Members ({team.members?.length || 0})
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {team.members && team.members.length > 0 ? (
                                        team.members.map((member) => (
                                            <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-sm">
                                                <div className="h-10 w-10 flex items-center justify-center bg-orange-100 text-orange-600 rounded-full font-bold overflow-hidden">
                                                    {member.profile_picture ? (
                                                        <img src={`http://localhost:5000${member.profile_picture}`} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        member.employee_name?.charAt(0)
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-800 truncate">{member.employee_name}</p>
                                                    <p className="text-xs text-gray-500 truncate">{member.designation_name || "Employee"}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 col-span-2 text-center py-4 bg-gray-50 rounded-sm italic">
                                            No members assigned to this team.
                                        </p>
                                    )}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-red-500 py-10">Failed to load team details</div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="p-6 bg-gray-50 border-t flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-8 py-2.5 bg-white border-2 border-gray-200 font-bold text-gray-700 hover:bg-gray-100 transition-all rounded-sm shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewTeamModal;

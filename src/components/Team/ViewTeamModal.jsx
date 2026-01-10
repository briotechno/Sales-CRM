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
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">
                                    Team Organizational Hierarchy
                                </p>

                                <div className="space-y-8">
                                    {Object.entries(
                                        (team.members || []).reduce((acc, member) => {
                                            const dept = member.department_name || "General";
                                            if (!acc[dept]) acc[dept] = {};
                                            const desig = member.designation_name || "Member";
                                            if (!acc[dept][desig]) acc[dept][desig] = [];
                                            acc[dept][desig].push(member);
                                            return acc;
                                        }, {})
                                    ).map(([deptName, designations]) => (
                                        <div key={deptName} className="relative pl-6 border-l-2 border-orange-100 py-2">
                                            {/* Department Header */}
                                            <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-orange-500 border-4 border-white shadow-sm"></div>
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="bg-orange-600 text-white px-4 py-1.5 rounded-sm text-xs font-black uppercase tracking-widest shadow-md">
                                                    {deptName}
                                                </div>
                                                <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-200 to-transparent"></div>
                                            </div>

                                            {/* Designations Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                {Object.entries(designations).map(([desigName, membersUnderDesig]) => (
                                                    <div key={desigName} className="space-y-3">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-tight">{desigName}</span>
                                                        </div>

                                                        {/* Members under this designation */}
                                                        <div className="space-y-3 ml-2">
                                                            {membersUnderDesig.map((member) => (
                                                                <div key={member.id} className="group flex items-center gap-4 p-3 bg-white border-2 border-slate-100 rounded-xl hover:border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shadow-sm">
                                                                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 rounded-xl font-bold overflow-hidden shadow-sm border border-orange-200">
                                                                        {member.profile_picture ? (
                                                                            <img
                                                                                src={`${import.meta.env.VITE_API_BASE_URL.replace('/api/', '')}${member.profile_picture}`}
                                                                                alt=""
                                                                                className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                                                            />
                                                                        ) : (
                                                                            <span className="text-lg">{member.employee_name?.charAt(0)}</span>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-black text-gray-800 line-clamp-1">{member.employee_name}</p>
                                                                        <div className="flex items-center gap-2 mt-0.5">
                                                                            <span className="text-[10px] text-orange-500 font-bold uppercase tracking-tight">
                                                                                {member.employee_id}
                                                                            </span>
                                                                            <span className="text-[10px] text-gray-400">•</span>
                                                                            <span className="text-[10px] text-slate-400 font-medium tracking-tight">VERIFIED</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}

                                    {(!team.members || team.members.length === 0) && (
                                        <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                            <Users size={48} className="mx-auto text-slate-300 mb-3" />
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Structure Defined</p>
                                        </div>
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

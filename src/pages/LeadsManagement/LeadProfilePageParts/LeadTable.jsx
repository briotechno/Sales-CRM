import React from "react";
import {
  Edit2,
  ChevronDown,
  Download,
  Trash2,
  MessageCircle,
  Phone,
  FileText,
  Users,
  Calendar,
  File,
  Image,
  FileSpreadsheet,
  Mail,
  Zap,
  Clock,
  Video,
  Plus,
  Bell,
  MoreVertical
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  useGetLeadActivitiesQuery,
  useGetLeadNotesQuery,
  useGetLeadCallsQuery,
  useGetLeadFilesQuery,
  useGetLeadMeetingsQuery,
  useGetLeadByIdQuery,
  useUpdateLeadMeetingMutation,
  useUpdateLeadMutation
} from "../../../store/api/leadApi";

const ExpandableText = ({ text, limit = 150 }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  if (!text) return null;
  if (text.length <= limit) return <span className="whitespace-pre-wrap">{text}</span>;

  return (
    <span className="whitespace-pre-wrap relative inline-block w-full">
      {isExpanded ? text : `${text.substring(0, limit)}...`}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="ml-1 text-orange-600 hover:text-orange-700 font-bold transition-all hover:underline"
      >
        {isExpanded ? "Show Less" : "Read More"}
      </button>
    </span>
  );
};

export default function LeadTabs({
  activeTab,
  selectedSort,
  setSelectedSort,
  showSortDropdown,
  setShowSortDropdown,
  onAddClick,
  onEditClick = () => { },
  onDeleteClick = () => { },
  onDownloadClick = () => { },
  leadId,
}) {
  const sortOptions = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 3 Months",
    "All Time",
  ];

  const { data: fetchedNotes, isLoading: notesLoading } = useGetLeadNotesQuery(leadId, { skip: !leadId });
  const { data: fetchedCalls, isLoading: callsLoading } = useGetLeadCallsQuery(leadId, { skip: !leadId });
  const { data: fetchedFiles, isLoading: filesLoading } = useGetLeadFilesQuery(leadId, { skip: !leadId });
  const { data: fetchedActivities, isLoading: activitiesLoading } = useGetLeadActivitiesQuery(leadId, { skip: !leadId });
  const { data: fetchedMeetings, isLoading: meetingsLoading } = useGetLeadMeetingsQuery(leadId, { skip: !leadId });
  const { data: leadData } = useGetLeadByIdQuery(leadId, { skip: !leadId });

  const [updateMeeting] = useUpdateLeadMeetingMutation();
  const [updateLead] = useUpdateLeadMutation();

  const notes = (fetchedNotes || []).map((note, idx) => {
    let parsedFiles = [];
    if (note.files) {
      try {
        parsedFiles = typeof note.files === 'string' ? JSON.parse(note.files) : note.files;
        if (!Array.isArray(parsedFiles)) parsedFiles = [];
      } catch (e) {
        parsedFiles = [];
      }
    }

    return {
      id: note.id || idx,
      author: (note.created_by || "Unknown User").toLowerCase(),
      profilePicture: note.profile_picture,
      date: note.created_at ? new Date(note.created_at).toLocaleString() : "Just now",
      title: (note.title || "Note").toLowerCase(),
      description: note.description || "",
      files: parsedFiles.map(f => ({ name: f.name || "File", size: f.size || "0 KB", type: f.type || "file", path: f.path })),
      originalData: note
    };
  });

  const calls = (fetchedCalls || []).map((call, idx) => ({
    id: call.id || idx,
    author: (call.created_by || "Unknown User").toLowerCase(),
    profilePicture: call.profile_picture,
    date: call.created_at ? new Date(call.created_at).toLocaleString() : "Just now",
    status: call.status || "Completed",
    content: call.note || "No notes",
    originalData: call
  }));

  const files = (fetchedFiles || []).map((file, idx) => ({
    id: file.id || idx,
    title: (file.title || file.name || "Document").toLowerCase(),
    description: file.description || "Uploaded file",
    owner: (file.uploaded_by || "Unknown User").toLowerCase(),
    profilePicture: file.profile_picture,
    status: "Uploaded",
    originalData: file,
  }));

  const meetings = (fetchedMeetings || []).map((meeting, idx) => {
    let parsedAttendees = [];
    if (meeting.attendees) {
      try {
        parsedAttendees = Array.isArray(meeting.attendees) ? meeting.attendees : JSON.parse(meeting.attendees);
        if (!Array.isArray(parsedAttendees)) parsedAttendees = [];
      } catch (e) {
        parsedAttendees = [];
      }
    }

    return {
      id: meeting.id || idx,
      title: (meeting.title || "Meeting").toLowerCase(),
      description: meeting.description || "",
      host: (meeting.created_by || "Unknown User").toLowerCase(),
      profilePicture: meeting.profile_picture,
      date: meeting.meeting_date ? new Date(meeting.meeting_date).toLocaleDateString() : "TBD",
      time: meeting.meeting_time || "TBD",
      attendees: parsedAttendees,
      priority: meeting.priority || "Medium",
      originalData: meeting
    };
  });

  const activities = React.useMemo(() => {
    if (!fetchedActivities || fetchedActivities.length === 0) return [];

    // Group activities by date
    const grouped = fetchedActivities.reduce((acc, act) => {
      const date = act.created_at ? new Date(act.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent";
      if (!acc[date]) acc[date] = [];

      let icon = MessageCircle;
      let color = "bg-blue-400";
      let titlePrefix = "Activity";

      if (act.type === "call") {
        icon = Phone;
        color = "bg-green-500";
        titlePrefix = "Call Log";
      } else if (act.type === "note") {
        icon = MessageCircle;
        color = "bg-indigo-500";
        titlePrefix = "Note Created";
      } else if (act.type === "file") {
        icon = FileText;
        color = "bg-orange-500";
        titlePrefix = "File Uploaded";
      } else if (act.type === "meeting") {
        icon = Users;
        color = "bg-purple-500";
        titlePrefix = "Meeting Scheduled";
      }

      acc[date].push({
        icon,
        color,
        title: (`${titlePrefix}: ${act.title || ""}`).toLowerCase(),
        subtitle: (act.user_name || "").toLowerCase(),
        profilePicture: act.profile_picture,
        description: act.description || "",
        time: act.created_at ? new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
      });
      return acc;
    }, {});

    return Object.entries(grouped).map(([date, items]) => ({ date, items }));
  }, [fetchedActivities]);

  const upcomingActivities = React.useMemo(() => {
    const list = [];
    const now = new Date();

    // 1. Future Meetings
    if (fetchedMeetings) {
      fetchedMeetings.forEach(m => {
        const mDate = new Date(`${m.meeting_date}T${m.meeting_time || '00:00:00'}`);
        if (mDate > now) {
          list.push({
            type: 'meeting',
            id: m.id,
            title: m.title,
            description: m.description,
            date: m.meeting_date,
            time: m.meeting_time ? new Date(`2000-01-01T${m.meeting_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : 'TBD',
            priority: m.priority || 'Medium',
            assigned_to: m.created_by,
            profilePicture: m.profile_picture,
            originalData: m
          });
        }
      });
    }

    // 2. Future Follow-up
    if (leadData?.next_call_at) {
      const fDate = new Date(leadData.next_call_at);
      if (fDate > now) {
        list.push({
          type: 'follow_up',
          id: leadData.id,
          title: "Follow-up Call",
          description: leadData.call_remarks || `Scheduled follow-up call with client regarding the previous discussion.`,
          date: fDate.toLocaleDateString(),
          time: fDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
          priority: leadData.priority || 'Medium',
          assigned_to: leadData.employee_name || "Agent",
          profilePicture: leadData.profile_image
        });
      }
    }

    return list.sort((a, b) => new Date(`${a.date}T${a.time || '00:00:00'}`) - new Date(`${b.date}T${b.time || '00:00:00'}`));
  }, [fetchedMeetings, leadData]);

  const handlePriorityChange = async (upcoming, newPriority) => {
    try {
      if (upcoming.type === 'meeting') {
        const data = upcoming.originalData;
        await updateMeeting({
          leadId: leadId,
          meetingId: upcoming.id,
          data: {
            ...data,
            priority: newPriority,
            date: data.meeting_date,
            time: data.meeting_time
          }
        }).unwrap();
      } else if (upcoming.type === 'follow_up') {
        await updateLead({
          id: upcoming.id,
          data: { priority: newPriority }
        }).unwrap();
      }
    } catch (err) {
      console.error("Failed to update priority:", err);
    }
  };

  const renderTabContent = () => {
    const normalizedTab = activeTab.toLowerCase().endsWith('s') ? activeTab.toLowerCase() : activeTab.toLowerCase() + 's';
    const finalTab = activeTab === 'activities' ? 'activities' :
      (activeTab === 'whatsapp' ? 'whatsapp' :
        (activeTab === 'email' ? 'email' : normalizedTab));

    const TabHeader = ({ title, showAdd = false, addLabel = "", addType = "", showSort = true }) => (
      <div className="flex items-center justify-between py-4 px-6 bg-white border-b border-gray-100 rounded-t-sm">
        <h2 className="text-[15px] font-bold text-gray-800 font-primary capitalize tracking-tight flex items-center gap-2">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          {showSort && (
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-sm text-[12px] font-bold text-gray-600 hover:bg-gray-50 transition-all font-primary shadow-sm"
              >
                Sort By : {selectedSort}
                <ChevronDown size={14} className="text-gray-400" />
              </button>
              {showSortDropdown && (
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-sm shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-200">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSelectedSort(opt);
                        setShowSortDropdown(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[12px] font-bold text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {showAdd && (
            <button
              onClick={() => onAddClick(addType)}
              className="flex items-center gap-1.5 text-orange-600 hover:text-orange-700 transition-all font-bold text-[13px] font-primary active:scale-95"
            >
              <div className="w-5 h-5 rounded-full border-2 border-orange-500 flex items-center justify-center">
                <Plus size={12} className="stroke-[3px]" />
              </div>
              {addLabel}
            </button>
          )}
        </div>
      </div>
    );

    switch (finalTab) {
      case "activities":
        return (
          <div className="flex-1 bg-[#F9FBFC] overflow-auto animate-fadeIn min-h-[500px]">
            <TabHeader title="Activities" showSort={true} />
            <div className="p-6 space-y-8">
              {/* Upcoming Activity Section */}
              {upcomingActivities.length > 0 && (
                <div className="space-y-4 mb-10">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-[#F5ECF8] text-[#9333EA] rounded-sm text-sm font-bold font-primary shadow-sm inline-flex items-center gap-2 border border-[#E9D5FF] tracking-wide">
                      <Calendar size={13} className="text-[#A855F7]" /> Upcoming Activity
                    </span>
                  </div>

                  <div className="space-y-5">
                    {upcomingActivities.map((upcoming, uIdx) => (
                      <div key={uIdx} className="bg-white rounded-lg border border-gray-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:border-orange-200 transition-all overflow-hidden font-primary group/card">
                        <div className="p-6 flex gap-5 items-start">
                          <div className={`w-14 h-14 ${upcoming.type === 'meeting' ? 'bg-[#9333EA]' : 'bg-orange-500'} rounded-full flex items-center justify-center flex-shrink-0 shadow-xl transition-transform group-hover/card:scale-105`}>
                            {upcoming.type === 'meeting' ? <Users size={24} className="text-white fill-white/20" /> : <Phone size={24} className="text-white fill-white/20" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-extrabold text-[#1E293B] text-[17px] leading-tight mb-1.5">
                              {upcoming.title}
                            </h4>
                            <p className="text-[14px] text-[#64748B] font-medium leading-relaxed mb-4 max-w-2xl">
                              {upcoming.description || "No description provided for this scheduled activity."}
                            </p>
                            <div className="flex items-center gap-2 text-[13px] font-bold text-slate-400">
                              <span className="text-orange-500/80 font-black">Scheduled on</span>
                              <span className="text-slate-600 bg-slate-100/50 px-2 py-0.5 rounded-sm">{upcoming.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity List */}
              {activitiesLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-400 font-bold font-primary text-sm tracking-wide">Tracking activities...</p>
                </div>
              ) : activities.length === 0 ? (
                !activitiesLoading && upcomingActivities.length === 0 && (
                  <div className="text-center py-24 bg-white rounded-sm border-2 border-dashed border-gray-100 mx-6">
                    <Zap size={48} className="mx-auto text-gray-200 mb-4" />
                    <p className="text-gray-400 font-bold font-primary capitalize tracking-wide text-sm">No activity history yet</p>
                  </div>
                )
              ) : (
                activities.map((section, idx) => (
                  <div key={idx} className="relative">
                    <div className="mb-6">
                      <span className="px-3 py-1 bg-[#F5ECF8] text-[#9333EA] rounded-sm text-[11px] font-bold font-primary shadow-sm inline-flex items-center gap-2 border border-[#E9D5FF]">
                        <Calendar size={12} /> {section.date}
                      </span>
                    </div>

                    <div className="space-y-6">
                      {section.items.map((activity, actIdx) => (
                        <div key={actIdx} className="bg-white rounded-sm border border-gray-100 p-5 hover:border-orange-200 transition-all hover:shadow-sm group flex gap-4 items-start">
                          <div className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
                            <activity.icon size={18} className="text-white fill-white/20" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800 font-primary text-[14px] leading-tight mb-0.5 capitalize">
                              {activity.title}
                            </h4>
                            <p className="text-[12px] font-bold text-gray-400 font-primary">{activity.time}</p>
                            {activity.description && (
                              <div className="text-[13px] text-gray-500 font-medium font-primary mt-2 leading-relaxed bg-gray-50/50 p-3 rounded-sm border border-gray-50">
                                <ExpandableText text={activity.description} limit={120} />
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="flex-1 bg-[#F9FBFC] overflow-auto animate-fadeIn min-h-[500px]">
            <TabHeader title="Notes" showAdd={true} addLabel="Add Note" addType="note" />
            <div className="p-6 space-y-6">
              {notesLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : notes.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-sm border-2 border-dashed border-gray-100 mx-6">
                  <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold font-primary text-sm">Your notebook is empty</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-white rounded-sm border border-gray-100 p-6 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={note.author} profilePicture={note.profilePicture} size="w-10 h-10" />
                        <div>
                          <p className="text-[14px] font-bold text-gray-800 font-primary capitalize">{note.author}</p>
                          <p className="text-[12px] text-gray-400 font-bold font-primary">{note.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEditClick('note', note.originalData)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-sm transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => onDeleteClick('note', note.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-bold text-gray-800 font-primary text-[15px] capitalize leading-tight">
                        {note.title}
                      </h4>
                      <div className="text-[14px] text-gray-500 font-medium font-primary leading-relaxed">
                        <ExpandableText text={note.description} limit={250} />
                      </div>

                      {note.files && note.files.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-4 border-t border-gray-50">
                          {note.files.map((file, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-3 p-3 bg-white rounded-sm border border-gray-100 hover:border-orange-200 transition-all shadow-sm group/file">
                              <div className="w-10 h-10 bg-green-500 rounded-sm flex items-center justify-center flex-shrink-0">
                                {file.name.toLowerCase().endsWith('.xls') || file.name.toLowerCase().endsWith('.xlsx') ? (
                                  <FileSpreadsheet size={20} className="text-white" />
                                ) : (
                                  <Image size={20} className="text-white" />
                                )}
                              </div>
                              <div className="flex-1 overflow-hidden">
                                <p className="text-[13px] font-bold text-gray-800 font-primary truncate" title={file.name}>{file.name}</p>
                                <p className="text-[11px] text-gray-400 font-bold font-primary uppercase tracking-wider">{file.size}</p>
                              </div>
                              <button
                                onClick={() => onDownloadClick(file.path, file.name)}
                                className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-end pt-4">
                        <button className="text-[13px] font-bold text-orange-600 hover:text-orange-700 font-primary flex items-center gap-1">
                          <Plus size={14} className="stroke-[3px]" /> Add Comment
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "calls":
        return (
          <div className="flex-1 bg-[#F9FBFC] overflow-auto animate-fadeIn min-h-[500px]">
            <TabHeader title="Calls" showAdd={true} addLabel="Add New" addType="call" showSort={false} />
            <div className="p-6 space-y-4">
              {callsLoading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                </div>
              ) : calls.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-sm border-2 border-dashed border-gray-100 mx-6">
                  <Phone size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold font-primary text-sm">No calls recorded yet</p>
                </div>
              ) : (
                calls.map((call) => (
                  <div key={call.id} className="bg-white rounded-sm border border-gray-100 p-6 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-4 items-center">
                        <UserAvatar name={call.author} profilePicture={call.profilePicture} size="w-10 h-10" />
                        <div>
                          <p className="text-[14px] font-bold text-gray-800 font-primary">
                            <span className="capitalize">{call.author}</span>
                            <span className="text-gray-400 font-medium"> logged a call on </span>
                            <span className="text-gray-600">{call.date}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="relative group/status cursor-pointer">
                          <div className={`px-4 py-1.5 rounded-sm text-[11px] font-bold font-primary flex items-center gap-1.5 ${call.status === 'Busy' ? 'bg-[#FFEBEE] text-[#D32F2F]' :
                            call.status === 'No Answer' ? 'bg-[#F3E5F5] text-[#7B1FA2]' :
                              'bg-green-50 text-green-600'
                            }`}>
                            {call.status}
                            <ChevronDown size={12} />
                          </div>
                        </div>
                        <button onClick={() => onDeleteClick('call', call.id)} className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-[14px] text-gray-500 font-medium font-primary leading-relaxed pl-14">
                      <ExpandableText text={call.content} limit={250} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "files":
        return (
          <div className="flex-1 bg-[#F9FBFC] overflow-auto animate-fadeIn min-h-[500px]">
            <TabHeader title="Files" showSort={false} />
            <div className="p-6 space-y-4">
              {/* Manage Documents Hero Card */}
              <div className="bg-white rounded-sm border border-gray-100 p-6 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="text-[16px] font-bold text-gray-800 font-primary mb-1">Manage Documents</h3>
                  <p className="text-[13px] text-gray-400 font-medium font-primary">Send customizable quotes, proposals and contracts to close deals faster.</p>
                </div>
                <button
                  onClick={() => onAddClick('file')}
                  className="bg-orange-500 text-white px-6 py-2.5 rounded-sm hover:bg-orange-600 transition-all font-bold text-[13px] font-primary shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  Create Document
                </button>
              </div>

              {filesLoading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-sm border-2 border-dashed border-gray-100 mx-6">
                  <File size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold font-primary text-sm">No files uploaded yet</p>
                </div>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="bg-white rounded-sm border border-gray-100 p-6 hover:shadow-sm transition-all group relative">
                    <div className="flex items-start gap-4">
                      <UserAvatar name={file.owner} profilePicture={file.profilePicture} size="w-12 h-12" />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-gray-800 font-primary text-[15px] capitalize tracking-tight group-hover:text-orange-600 transition-colors">
                              {file.title}
                            </h4>
                            <div className="text-[13px] text-gray-400 font-medium font-primary mt-0.5">
                              <ExpandableText text={file.description} limit={120} />
                            </div>
                            <div className="flex items-center gap-2 mt-4">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-primary">Owner</span>
                              <span className="text-[13px] font-bold text-gray-700 font-primary capitalize">{file.owner}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                              <button onClick={() => {
                                let path = file.originalData?.file_path || file.originalData?.path;
                                onDownloadClick(path, file.title);
                              }} className="p-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                                <Download size={16} />
                              </button>
                              <button onClick={() => onEditClick('file', file.originalData)} className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors">
                                <Edit2 size={16} />
                              </button>
                              <button onClick={() => onDeleteClick('file', file.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            </div>
                            <div className="flex gap-2 items-center">
                              <span className="px-3 py-1 bg-[#FCE4EC] text-[#E91E63] rounded-sm text-[10px] font-bold font-primary uppercase tracking-tight">Proposal</span>
                              <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] rounded-sm text-[10px] font-bold font-primary inline-flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-[#2E7D32] rounded-full"></div> Sent
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "meetings":
        return (
          <div className="flex-1 bg-[#F9FBFC] overflow-auto animate-fadeIn min-h-[500px]">
            <TabHeader title="Scheduled Meetings" showAdd={true} addLabel="New Meeting" addType="meeting" showSort={false} />
            <div className="p-6 space-y-4">
              {meetingsLoading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                </div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-sm border-2 border-dashed border-gray-100 mx-6">
                  <Video size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold font-primary text-sm">No upcoming meetings</p>
                </div>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white rounded-sm border border-gray-100 p-6 hover:shadow-sm transition-all group">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg text-white">
                        <Users size={24} className="fill-white/20" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <span className={`px-3 py-1 rounded-sm text-[10px] font-black font-primary uppercase tracking-widest ${meeting.priority === 'High' ? 'bg-red-50 text-red-600' :
                              meeting.priority === 'Medium' ? 'bg-orange-50 text-orange-600' :
                                'bg-green-50 text-green-600'
                              }`}>
                              {meeting.priority} Priority
                            </span>
                            <span className="flex items-center gap-1.5 text-[12px] font-bold text-gray-400 font-primary">
                              <Calendar size={12} /> {meeting.date}
                            </span>
                            <span className="flex items-center gap-1.5 text-[12px] font-bold text-gray-400 font-primary">
                              <Clock size={12} /> {meeting.time}
                            </span>
                          </div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEditClick('meeting', meeting.originalData)} className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-sm">
                              <Edit2 size={16} />
                            </button>
                            <button onClick={() => onDeleteClick('meeting', meeting.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-sm">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <h3 className="text-[16px] font-bold text-gray-800 mb-2 font-primary group-hover:text-purple-600 transition-colors">
                          Meeting With <span className="capitalize">{meeting.title}</span>
                        </h3>
                        <div className="text-[14px] text-gray-500 font-medium font-primary leading-relaxed mb-6">
                          <ExpandableText text={meeting.description} limit={250} />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-primary">Hosted By</span>
                              <div className="flex items-center gap-2">
                                <UserAvatar name={meeting.host} profilePicture={meeting.profilePicture} size="w-7 h-7" />
                                <span className="text-[13px] font-bold text-gray-700 font-primary capitalize">{meeting.host}</span>
                              </div>
                            </div>
                            {meeting.attendees?.length > 0 && (
                              <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-primary">Participants</span>
                                <div className="flex items-center -space-x-2">
                                  {meeting.attendees.map((at, i) => (
                                    <UserAvatar key={i} name={typeof at === 'string' ? at : at.name} size="w-7 h-7 border-2 border-white" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "email":
        return (
          <div className="flex-1 bg-[#F9FBFC] overflow-auto animate-fadeIn min-h-[500px]">
            <TabHeader title="Email" showSort={false} />
            <div className="p-6">
              <div className="bg-white rounded-sm border border-gray-100 p-8 flex justify-between items-center shadow-sm">
                <div>
                  <h3 className="text-[18px] font-bold text-gray-800 font-primary mb-2">Manage Emails</h3>
                  <p className="text-[14px] text-gray-400 font-medium font-primary">You can send and reply to emails directly via this section.</p>
                </div>
                <button className="bg-orange-500 text-white px-8 py-3 rounded-sm hover:bg-orange-600 transition-all font-bold text-[14px] font-primary shadow-lg shadow-orange-500/20 active:scale-95">
                  Connect Account
                </button>
              </div>
            </div>
          </div>
        );

      case "whatsapp":
        return (
          <div className="flex-1 bg-[#F9FBFC] overflow-auto animate-fadeIn min-h-[500px]">
            <TabHeader title="WhatsApp Messenger" showSort={false} />
            <div className="p-6">
              <div className="bg-white rounded-sm border border-gray-100 p-12 flex flex-col items-center text-center shadow-sm">
                <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[#25D366]/20">
                  <FaWhatsapp size={40} className="text-white" />
                </div>
                <h3 className="text-[20px] font-bold text-gray-800 font-primary mb-3">WhatsApp Integration</h3>
                <p className="text-[15px] text-gray-400 font-medium font-primary max-w-md mx-auto mb-8">Connect your WhatsApp Business account to send messages, templates, and track conversations directly within the lead profile.</p>
                <button className="bg-[#25D366] text-white px-10 py-3.5 rounded-sm hover:bg-[#128C7E] transition-all font-bold text-[14px] font-primary shadow-lg shadow-[#25D366]/20 active:scale-95 flex items-center gap-2">
                  Connect WhatsApp
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-[#F9FBFC]">
            <Zap size={48} className="text-gray-100 mb-4" />
            <p className="text-gray-400 font-bold font-primary capitalize tracking-wide text-sm">Design update in progress for {activeTab}</p>
          </div>
        );
    }
  };

  return renderTabContent();
}

const UserAvatar = ({ name, profilePicture, size = "w-10 h-10 border" }) => {
  const [imgError, setImgError] = React.useState(false);
  React.useEffect(() => { setImgError(false); }, [profilePicture]);

  const getInitials = (fullName) => {
    if (!fullName) return "??";
    const names = fullName.trim().split(" ");
    return (names.length >= 2 ? (names[0][0] + names[1][0]) : names[0].substring(0, 2)).toUpperCase();
  };

  const getColorFromName = (name) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-red-500", "bg-slate-500", "bg-teal-500"];
    let hash = 0;
    const str = String(name || "U");
    for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  const baseUrl = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:5000/api/').replace('/api/', '');
  const cleanPath = (profilePicture && typeof profilePicture === 'string' && profilePicture !== 'null') ? profilePicture.trim() : null;
  const imageUrl = cleanPath ? (cleanPath.startsWith('http') ? cleanPath : `${baseUrl}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`) : null;

  if (!imageUrl || imgError) {
    return (
      <div className={`${size} rounded-sm ${getColorFromName(name)} flex items-center justify-center text-white font-bold text-[8px] border-gray-100 shadow-sm`} title={name}>
        {getInitials(name)}
      </div>
    );
  }

  return (
    <div className={`${size} rounded-sm overflow-hidden flex items-center justify-center border-gray-200 bg-gray-50 shadow-sm`} title={name}>
      <img src={imageUrl} alt={name} className="w-full h-full object-cover" onError={() => setImgError(true)} />
    </div>
  );
};

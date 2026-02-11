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
  Plus
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import {
  useGetLeadActivitiesQuery,
  useGetLeadNotesQuery,
  useGetLeadCallsQuery,
  useGetLeadFilesQuery,
  useGetLeadMeetingsQuery
} from "../../../store/api/leadApi";

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
    return [
      {
        date: "Recent Activities",
        items: fetchedActivities.map(act => {
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

          return {
            icon,
            color,
            title: (`${titlePrefix}: ${act.title || ""}`).toLowerCase(),
            subtitle: (act.user_name || "").toLowerCase(),
            profilePicture: act.profile_picture,
            description: act.description || "",
            time: act.created_at ? new Date(act.created_at).toLocaleTimeString() : "",
          };
        })
      }
    ];
  }, [fetchedActivities]);

  const renderTabContent = () => {
    // Normalize tab name to handle singular/plural from LeadProfile.jsx
    const normalizedTab = activeTab.toLowerCase().endsWith('s') ? activeTab.toLowerCase() : activeTab.toLowerCase() + 's';

    // Manual mapping for special cases if needed
    const finalTab = activeTab === 'activities' ? 'activities' :
      (activeTab === 'whatsapp' ? 'whatsapp' :
        (activeTab === 'email' ? 'email' : normalizedTab));

    switch (finalTab) {
      case "activities":
        return (
          <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar size={24} className="text-gray-600" />
                Activities Highlights
              </h2>
            </div>

            <div className="space-y-8">
              {activitiesLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium animate-pulse">Tracking recent activities...</p>
                </div>
              ) : activities.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-sm border border-dashed border-gray-300">
                  <Zap size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium capitalize tracking-wide text-sm">No activity history found</p>
                </div>
              ) : (
                activities.map((section, idx) => (
                  <div key={idx} className="relative">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-sm text-sm font-bold capitalize tracking-wide shadow-sm flex items-center gap-2">
                        <Calendar size={12} /> {section.date}
                      </span>
                    </div>

                    <div className="space-y-4 relative z-10 ml-4 border-l-2 border-gray-100 pl-8">
                      {section.items.map((activity, actIdx) => (
                        <div key={actIdx} className="bg-white rounded-sm border border-gray-100 p-5 hover:border-orange-200 transition-all hover:shadow-md group">
                          <div className="flex gap-4">
                            <div className={`w-12 h-12 ${activity.color} rounded-sm flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform`}>
                              <activity.icon size={24} className="text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors capitalize text-sm tracking-tight">
                                  {activity.title}
                                </h4>
                                <span className="text-xs font-bold text-gray-400 capitalize tracking-wide">{activity.time}</span>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <UserAvatar name={activity.subtitle} profilePicture={activity.profilePicture} size="w-5 h-5" />
                                <span className="text-xs font-bold text-gray-600 capitalize tracking-tight">{activity.subtitle}</span>
                              </div>
                              <p className="text-sm text-gray-500 leading-relaxed font-medium">{activity.description}</p>
                            </div>
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
          <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText size={24} className="text-gray-600" />
                Notes & Highlights
              </h2>
              <button
                onClick={() => onAddClick('note')}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-sm hover:bg-orange-600 transition-all font-bold text-sm capitalize tracking-wide shadow-lg active:scale-95"
              >
                <MessageCircle size={16} />
                Create New Note
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notesLoading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium">Gathering your notes...</p>
                </div>
              ) : notes.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-sm border border-dashed border-gray-300">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium capitalize tracking-wide text-sm">Your notebook is empty</p>
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="bg-white rounded-sm border border-gray-100 p-6 hover:shadow-xl transition-all hover:border-orange-200 group">
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-50">
                      <div className="flex items-center gap-3">
                        <UserAvatar name={note.author} profilePicture={note.profilePicture} size="w-10 h-10" />
                        <div>
                          <p className="text-xs font-bold text-gray-900 capitalize tracking-tight">{note.author}</p>
                          <p className="text-xs text-orange-500 font-bold capitalize tracking-wide">{note.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEditClick('note', note.originalData)}
                          className="p-2 hover:bg-orange-50 text-orange-600 rounded-sm transition-colors border border-transparent hover:border-orange-100"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => onDeleteClick('note', note.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-sm transition-colors border border-transparent hover:border-red-100"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2 capitalize text-sm tracking-tight">{note.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 font-medium">{note.description}</p>

                    {note.files && note.files.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {note.files.map((file, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-sm border border-gray-100 text-xs font-bold text-gray-600 capitalize tracking-tight">
                            <File size={12} className="text-orange-500" />
                            {file.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "calls":
        return (
          <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Phone size={24} className="text-gray-600" />
                Call History
              </h2>
              <button
                onClick={() => onAddClick('call')}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-sm hover:bg-orange-600 transition-all font-bold text-sm capitalize tracking-wide shadow-lg active:scale-95"
              >
                <Plus size={16} />
                Log New Call
              </button>
            </div>

            <div className="space-y-4">
              {callsLoading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Retrieving logs...</p>
                </div>
              ) : calls.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-sm border border-dashed border-gray-300">
                  <Phone size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium capitalize tracking-wide text-sm">No calls recorded yet</p>
                </div>
              ) : (
                calls.map((call) => (
                  <div key={call.id} className="bg-white rounded-sm border border-gray-100 p-6 hover:shadow-lg transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4">
                        <UserAvatar name={call.author} profilePicture={call.profilePicture} size="w-12 h-12" />
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-sm font-bold text-gray-900 capitalize tracking-tight">{call.author}</p>
                            <span className={`px-2 py-0.5 rounded-sm text-xs font-bold capitalize tracking-wide ${call.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              call.status === 'Missed' ? 'bg-red-100 text-red-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                              {call.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 font-bold capitalize tracking-wide mb-3">{call.date}</p>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">{call.content}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEditClick('call', call.originalData)}
                          className="p-2 hover:bg-orange-50 text-orange-600 rounded-sm transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => onDeleteClick('call', call.id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-sm transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );

      case "files":
        return (
          <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <File size={24} className="text-gray-600" />
                Document Vault
              </h2>
              <button
                onClick={() => onAddClick('file')}
                className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2.5 rounded-sm hover:from-orange-600 hover:to-orange-700 transition-all font-bold text-sm capitalize tracking-wide shadow-lg active:scale-95"
              >
                <Plus size={16} />
                Upload File
              </button>
            </div>

            <div className="space-y-4">
              {filesLoading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Opening safe...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-sm border border-dashed border-gray-300">
                  <File size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium capitalize tracking-wide text-sm">No files uploaded yet</p>
                </div>
              ) : (
                files.map((file) => (
                  <div key={file.id} className="bg-white rounded-sm border border-gray-100 p-5 hover:border-orange-200 hover:shadow-xl transition-all group">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-sm flex items-center justify-center border border-gray-100 group-hover:bg-orange-50 transition-colors">
                        <FileSpreadsheet size={28} className="text-orange-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-orange-600 transition-colors text-sm capitalize tracking-tight">{file.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <UserAvatar name={file.owner} profilePicture={file.profilePicture} size="w-4 h-4" />
                              <span className="text-xs text-gray-400 font-bold capitalize tracking-wide">Added by {file.owner}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                let path = null;
                                try {
                                  const rawFiles = file.originalData?.files;
                                  if (rawFiles) {
                                    const parsed = typeof rawFiles === 'string' ? JSON.parse(rawFiles) : rawFiles;
                                    path = Array.isArray(parsed) ? parsed[0]?.path : (parsed?.path || parsed);
                                  }
                                  if (!path) path = file.originalData?.file_path || file.originalData?.path;
                                } catch (e) {
                                  path = file.originalData?.file_path || file.originalData?.path;
                                }
                                onDownloadClick(path, file.title);
                              }}
                              className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-sm transition-all border border-transparent hover:border-blue-100 shadow-sm"
                              title="Download"
                            >
                              <Download size={18} />
                            </button>
                            <button
                              onClick={() => onEditClick('file', file.originalData)}
                              className="p-2.5 hover:bg-orange-50 text-orange-600 rounded-sm transition-all border border-transparent hover:border-orange-100 shadow-sm"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => onDeleteClick('file', file.id)}
                              className="p-2.5 hover:bg-red-50 text-red-600 rounded-sm transition-all border border-transparent hover:border-red-100 shadow-sm"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">{file.description}</p>
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
          <div className="flex-1 bg-gray-50 p-6 overflow-auto animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Video size={24} className="text-gray-600" />
                Scheduled Meetings
              </h2>
              <button
                onClick={() => onAddClick('meeting')}
                className="flex items-center gap-2 bg-orange-500 text-white px-5 py-2.5 rounded-sm hover:bg-orange-600 transition-all font-bold text-sm capitalize tracking-wide shadow-lg active:scale-95"
              >
                <Plus size={16} />
                New Meeting
              </button>
            </div>

            <div className="space-y-4">
              {meetingsLoading ? (
                <div className="text-center py-20">
                  <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500 font-medium">Syncing calendar...</p>
                </div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-sm border border-dashed border-gray-300">
                  <Video size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium capitalize tracking-wide text-sm">No upcoming meetings</p>
                </div>
              ) : (
                meetings.map((meeting) => (
                  <div key={meeting.id} className="bg-white rounded-sm border border-gray-100 p-6 hover:shadow-xl hover:border-orange-200 transition-all group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`px-3 py-1 rounded-sm text-xs font-bold capitalize tracking-wide ${meeting.priority === 'High' ? 'bg-red-100 text-red-700' :
                            meeting.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                            {meeting.priority} Priority
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 capitalize tracking-wide">
                            <Calendar size={12} /> {meeting.date}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-400 capitalize tracking-wide">
                            <Clock size={12} /> {meeting.time}
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 capitalize tracking-tight group-hover:text-orange-600 transition-colors">
                          {meeting.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed font-medium">{meeting.description}</p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-400 capitalize tracking-wide mb-1">Host</span>
                              <div className="flex items-center gap-2">
                                <UserAvatar name={meeting.host} profilePicture={meeting.profilePicture} size="w-6 h-6" />
                                <span className="text-xs font-bold text-gray-700 capitalize tracking-tight">{meeting.host}</span>
                              </div>
                            </div>
                            {meeting.attendees?.length > 0 && (
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-400 capitalize tracking-wide mb-1">Participants</span>
                                <div className="flex items-center -space-x-2">
                                  {meeting.attendees.map((at, i) => (
                                    <UserAvatar key={i} name={typeof at === 'string' ? at : at.name} size="w-6 h-6 border-2 border-white" />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEditClick('meeting', meeting.originalData)}
                              className="p-2.5 hover:bg-orange-50 text-orange-600 rounded-sm transition-all border border-transparent hover:border-orange-100"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => onDeleteClick('meeting', meeting.id)}
                              className="p-2.5 hover:bg-red-50 text-red-600 rounded-sm transition-all border border-transparent hover:border-red-100"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
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

      default:
        return (
          <div className="flex-1 flex flex-col items-center justify-center py-20 bg-gray-50">
            <Zap size={48} className="text-gray-200 mb-4" />
            <p className="text-gray-400 font-bold capitalize tracking-wide text-sm">Development in progress for {activeTab}</p>
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

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
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function LeadTabs({
  activeTab,
  selectedSort,
  setSelectedSort,
  showSortDropdown,
  setShowSortDropdown,
  setOpen,
}) {
  const sortOptions = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 3 Months",
    "All Time",
  ];

  const activities = [
    {
      date: "15 Feb 2024",
      items: [
        {
          icon: MessageCircle,
          color: "bg-sky-400",
          title: "You sent 1 Message to the contact.",
          time: "10:25 pm",
        },
        {
          icon: Phone,
          color: "bg-green-500",
          title:
            "Denwar responded to your appointment schedule question by call at 09:30pm.",
          time: "09:25 pm",
        },
        {
          icon: FileText,
          color: "bg-yellow-500",
          title: "Notes added by Antony",
          description:
            "Please accept my apologies for the inconvenience caused. It would be much appreciated if it's possible to reschedule to 6:00 PM, or any other day that week.",
          time: "10:00 pm",
        },
      ],
    },
    {
      date: "15 Feb 2024",
      items: [
        {
          icon: Users,
          color: "bg-purple-500",
          title: "Meeting With",
          subtitle: "Abraham",
          description: "Scheduled on 03:00 pm",
          time: null,
        },
        {
          icon: Phone,
          color: "bg-green-500",
          title: "Dean responded to your appointment schedule question.",
          time: "09:25 pm",
        },
      ],
    },
    {
      date: "Upcoming Activity",
      items: [
        {
          icon: Users,
          color: "bg-purple-500",
          title: "Product Meeting",
          description:
            "A product team meeting is a gathering of the cross-functional product team — ideally including team members from product, engineering, marketing, and customer support.",
          subdescription: "Scheduled on 05:00 pm",
          hasActions: true,
          time: null,
        },
      ],
    },
  ];

  const notes = [
    {
      id: 1,
      author: "Darlee Robertson",
      avatar: "https://i.pravatar.cc/150?img=8",
      date: "15 Sep 2023, 12:10 pm",
      title: "Notes added by Antony",
      content:
        "A project review evaluates the success of an initiative and identifies areas for improvement. It can also evaluate a current project to determine whether it's on the right track. Or, it can determine the success of a completed project.",
      files: [
        { name: "Project Specs.xls", size: "365 KB", type: "excel" },
        { name: "090224.jpg", size: "365 KB", type: "image" },
      ],
    },
    {
      id: 2,
      author: "Sharon Roy",
      avatar: "https://i.pravatar.cc/150?img=5",
      date: "18 Sep 2023, 09:52 am",
      title: "Notes added by Antony",
      content:
        "A project plan typically contains a list of the essential elements of a project, such as stakeholders, scope, timelines, estimated cost and communication methods. The project manager typically lists the information based on the assignment.",
      files: [{ name: "Andrewpass.txt", size: "365 KB", type: "text" }],
    },
  ];

  const calls = [
    {
      id: 1,
      author: "Darlee Robertson",
      avatar: "https://i.pravatar.cc/150?img=8",
      date: "23 Jul 2023, 10:00 pm",
      status: "Busy",
      content:
        "A project review evaluates the success of an initiative and identifies areas for improvement. It can also evaluate a current project to determine whether it's on the right track. Or, it can determine the success of a completed project",
    },
    {
      id: 2,
      author: "Sharon Roy",
      avatar: "https://i.pravatar.cc/150?img=5",
      date: "28 Jul 2023, 09:00 pm",
      status: "No Answer",
      content:
        "A project plan typically contains a list of the essential elements of a project, such as stakeholders, scope, timelines, estimated cost and communication methods. The project manager typically lists the information based on the assignment.",
    },
    {
      id: 3,
      author: "Vaughan Lewis",
      avatar: "https://i.pravatar.cc/150?img=12",
      date: "30 Jul 2023, 08:00 pm",
      status: "No Answer",
      content:
        "Projects play a crucial role in the success of organizations, and their importance cannot be overstated. Whether it's launching a new product, improving an existing",
    },
  ];

  const files = [
    {
      id: 1,
      title: "Collier-Turner Proposal",
      description:
        "Send customizable quotes, proposals and contracts to close deals faster.",
      owner: "Darlee Robertson",
      avatar: "https://i.pravatar.cc/150?img=8",
      status: "Proposal",
      statusType: "proposal",
    },
    {
      id: 2,
      title: "Collier-Turner Proposal",
      description:
        "Send customizable quotes, proposals and contracts to close deals faster.",
      owner: "Sharon Roy",
      avatar: "https://i.pravatar.cc/150?img=5",
      status: "Quote",
      statusType: "quote",
      statusExtra: "Sent",
    },
    {
      id: 3,
      title: "Collier-Turner Proposal",
      description:
        "Send customizable quotes, proposals and contracts to close deals faster.",
      owner: "Vaughan Lewis",
      avatar: "https://i.pravatar.cc/150?img=12",
      status: "Proposal",
      statusType: "proposal",
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "activities":
        return (
          <div className="flex-1 bg-gray-50 p-6 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-gray-600" />
                Activities
              </h2>
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <span className="text-sm text-gray-700">
                    Sort By : {selectedSort}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    {sortOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedSort(option);
                          setShowSortDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {activities.map((section, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-xs font-semibold flex items-center gap-2">
                      <Calendar className="w-3 h-3" /> {section.date}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {section.items.map((activity, actIdx) => (
                      <div
                        key={actIdx}
                        className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex gap-4">
                          <div
                            className={`w-12 h-12 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            <activity.icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold text-gray-900">
                                    {activity.title}
                                  </p>
                                  {activity.subtitle && (
                                    <>
                                      <span className="flex items-center gap-1">
                                        <img
                                          src="https://i.pravatar.cc/150?img=33"
                                          alt="User"
                                          className="w-5 h-5 rounded-full"
                                        />
                                        <span className="font-semibold text-gray-900">
                                          {activity.subtitle}
                                        </span>
                                      </span>
                                    </>
                                  )}
                                </div>
                                {activity.description && (
                                  <p className="text-sm text-gray-600 leading-relaxed mt-1">
                                    {activity.description}
                                  </p>
                                )}
                                {activity.subdescription && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    {activity.subdescription}
                                  </p>
                                )}
                              </div>
                            </div>
                            {activity.time && (
                              <p className="text-xs text-gray-500 mt-3">
                                {activity.time}
                              </p>
                            )}

                            {activity.hasActions && (
                              <div className="flex gap-16 mt-4">
                                <div>
                                  <p className="text-xs font-bold text-gray-700 mb-2">
                                    Reminder
                                  </p>
                                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-gray-300 text-sm">
                                    Reminder
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-700 mb-2">
                                    Task Priority
                                  </p>
                                  <button className="flex items-center gap-2 px-3 py-1.5 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm font-medium">
                                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                    High
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                </div>
                                <div>
                                  <p className="text-xs font-bold text-gray-700 mb-2">
                                    Assigned to
                                  </p>
                                  <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-md border border-gray-300 text-sm">
                                    <img
                                      src="https://i.pravatar.cc/150?img=15"
                                      alt="Assigned"
                                      className="w-5 h-5 rounded-full"
                                    />
                                    John
                                    <ChevronDown className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "notes":
        return (
          <div className="flex-1 bg-gray-50 p-8 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-600" />
                Notes
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm text-gray-700">
                      Sort By : {selectedSort}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                      {sortOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            setSelectedSort(option);
                            setShowSortDropdown(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setOpen(true)}
                  className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
                >
                  <span className="text-orange-600 border border-orange-600 rounded-full w-4 h-4 flex items-center justify-center text-sm">
                    +
                  </span>
                  Add Note
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={note.avatar}
                        alt={note.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {note.author}
                        </p>
                        <p className="text-sm text-gray-500">{note.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">
                    {note.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {note.content}
                  </p>

                  <div className="flex flex-wrap gap-4">
                    {note.files.map((file, idx) => {
                      const FileIcon =
                        file.type === "excel"
                          ? FileSpreadsheet
                          : file.type === "image"
                          ? Image
                          : File;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-3 px-4 py-3 rounded-lg border border-gray-200 bg-white"
                        >
                          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-500">
                            <FileIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-gray-900">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-500">{file.size}</p>
                          </div>
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                            <Download className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-orange-500 text-sm font-semibold hover:text-orange-600 transition-colors">
                      <MessageCircle className="w-4 h-4" /> Add Comment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "calls":
        return (
          <div className="flex-1 bg-gray-50 p-8 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Phone className="w-6 h-6 text-gray-600" />
                Calls
              </h2>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <span className="text-orange-500 border border-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-sm">
                  +
                </span>
                Add New
              </button>
            </div>

            <div className="space-y-4">
              {calls.map((call) => (
                <div
                  key={call.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={call.avatar}
                        alt={call.author}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm">
                          <span className="font-semibold text-gray-900">
                            {call.author}
                          </span>
                          <span className="text-gray-600">
                            {" "}
                            logged a call on {call.date}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <button
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium ${
                            call.status === "Busy"
                              ? "bg-red-100 text-red-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {call.status}
                          <ChevronDown className="w-3 h-3" />
                        </button>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <Trash2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {call.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "files":
        return (
          <div className="flex-1 bg-gray-50 p-8 overflow-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <File className="w-6 h-6 text-gray-600" />
              Files
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Manage Documents
                </h3>
                <p className="text-sm text-gray-600">
                  Send customizable quotes, proposals and contracts to close
                  deals faster.
                </p>
              </div>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                Create Document
              </button>
            </div>

            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {file.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {file.description}
                      </p>

                      <div className="flex items-center gap-3">
                        <img
                          src={file.avatar}
                          alt={file.owner}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-xs text-gray-500">Owner</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {file.owner}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                            file.statusType === "quote"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-pink-100 text-pink-600"
                          }`}
                        >
                          {file.status}
                        </span>
                        {file.statusExtra && (
                          <span className="px-3 py-1.5 bg-green-100 text-green-600 rounded-md text-xs font-semibold flex items-center gap-1">
                            <span>●</span> {file.statusExtra}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <Download className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <Edit2 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                          <Trash2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "email":
        return (
          <div className="flex-1 bg-gray-50 p-8 overflow-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-gray-600" />
              Email
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Manage Emails
                </h3>
                <p className="text-sm text-gray-600">
                  You can send and reply to emails directly via this section.
                </p>
              </div>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-semibold">
                Connect Account
              </button>
            </div>
          </div>
        );

      case "whatsapp":
        return (
          <div className="flex-1 bg-gray-50 p-8 overflow-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FaWhatsapp size={28} className="text-green-500" />
              WhatsApp
            </h2>

            <div className="bg-white rounded-lg border border-gray-200 p-8 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Manage WhatsApp Messages
                </h3>
                <p className="text-sm text-gray-600">
                  You can send and receive WhatsApp messages directly via this
                  section.
                </p>
              </div>
              <button className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold flex items-center gap-2">
                <FaWhatsapp size={20} />
                Connect WhatsApp
              </button>
            </div>
          </div>
        );

      case "meeting":
        return (
          <div className="flex-1 bg-gray-50 p-8 overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Users className="w-7 h-7 text-gray-600" />
                Meetings
              </h2>
              <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-medium"
              >
                <span className="text-orange-500 border border-orange-500 rounded-full w-5 h-5 flex items-center justify-center text-sm">
                  +
                </span>
                Add Meeting
              </button>
            </div>

            <div className="space-y-4">
              {/* Meeting Card 1 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Product Strategy Meeting
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Host:</span>
                        <span className="font-semibold text-gray-900">
                          John Smith
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Members:</span>
                        <div className="flex items-center gap-1">
                          <img
                            src="https://i.pravatar.cc/150?img=8"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white"
                          />
                          <img
                            src="https://i.pravatar.cc/150?img=5"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
                          />
                          <img
                            src="https://i.pravatar.cc/150?img=12"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
                          />
                          <span className="text-gray-600 ml-1">+3 more</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 mt-3">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Description:</span>
                          <p className="text-gray-700 mt-1">
                            Discuss Q4 product roadmap and strategic initiatives
                            for the upcoming quarter.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-gray-900">
                          25 Feb 2024
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold text-gray-900">
                          03:00 PM - 04:30 PM
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Priority:</span>
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-xs font-semibold">
                          High
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Card 2 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Client Presentation
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Host:</span>
                        <span className="font-semibold text-gray-900">
                          Sarah Johnson
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Members:</span>
                        <div className="flex items-center gap-1">
                          <img
                            src="https://i.pravatar.cc/150?img=15"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white"
                          />
                          <img
                            src="https://i.pravatar.cc/150?img=20"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
                          />
                          <span className="text-gray-600 ml-1">+2 more</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 mt-3">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Description:</span>
                          <p className="text-gray-700 mt-1">
                            Present new proposal and discuss project
                            requirements with the client.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-gray-900">
                          28 Feb 2024
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold text-gray-900">
                          10:00 AM - 11:00 AM
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Priority:</span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-xs font-semibold">
                          Medium
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Card 3 */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      Team Sync-up
                    </h3>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Host:</span>
                        <span className="font-semibold text-gray-900">
                          Michael Brown
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Members:</span>
                        <div className="flex items-center gap-1">
                          <img
                            src="https://i.pravatar.cc/150?img=25"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white"
                          />
                          <img
                            src="https://i.pravatar.cc/150?img=30"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
                          />
                          <img
                            src="https://i.pravatar.cc/150?img=35"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
                          />
                          <img
                            src="https://i.pravatar.cc/150?img=40"
                            alt="Member"
                            className="w-6 h-6 rounded-full border-2 border-white -ml-2"
                          />
                        </div>
                      </div>

                      <div className="flex items-start gap-2 mt-3">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div>
                          <span className="text-gray-600">Description:</span>
                          <p className="text-gray-700 mt-1">
                            Weekly team meeting to discuss progress and
                            blockers.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Date:</span>
                        <span className="font-semibold text-gray-900">
                          26 Feb 2024
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600">Time:</span>
                        <span className="font-semibold text-gray-900">
                          02:00 PM - 02:30 PM
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">Priority:</span>
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs font-semibold">
                          Low
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderTabContent();
}

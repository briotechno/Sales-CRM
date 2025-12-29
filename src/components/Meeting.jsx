import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Bell,
  User,
  Calendar,
  Video,
  Users,
  AlertCircle,
  Clock,
  Star,
  UserCheck,
  Briefcase,
  MapPin,
} from "lucide-react";

export default function MeetingReminder() {
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef(null);

  // Sample meeting reminder data
  const meeting = {
    meetingId: "MTG-2024-00892",
    leadId: "LD-2024-00458",
    leadProfile: "Rajesh Kumar",
    leadType: "Organization",
    priority: "High",
    dateTime: "Nov 23, 2024 - 02:00 PM",
    meetingMode: "Video Call",
    meetingMembers: ["Anish Kumar", "Priya Sharma", "Vikram Singh"],
    hostName: "Anish Kumar",
  };

  // Function to play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  // Auto-trigger reminder after 2 seconds (for demo)
  useEffect(() => {
    const demoTimer = setTimeout(() => {
      setIsVisible(true);
      playNotificationSound();
    }, 12000);

    return () => {
      clearTimeout(demoTimer);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getMeetingModeIcon = (mode) => {
    if (mode.toLowerCase().includes("video")) {
      return <Video size={14} className="text-orange-600" />;
    } else if (
      mode.toLowerCase().includes("office") ||
      mode.toLowerCase().includes("person")
    ) {
      return <MapPin size={14} className="text-orange-600" />;
    } else {
      return <Users size={14} className="text-orange-600" />;
    }
  };

  return (
    <>
      {/* Hidden Audio Element for Notification Sound */}
      <audio ref={audioRef} preload="auto">
        <source
          src="https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Meeting Reminder Popup */}
      {isVisible && (
        <div className="fixed top-4 left-4 z-[9999] animate-slideIn">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 w-96 overflow-hidden transform transition-all hover:scale-[1.02]">
            {/* Header with Gradient */}
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-5 py-4 relative overflow-hidden">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16"></div>
              </div>

              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white bg-opacity-20 backdrop-blur-sm p-2.5 rounded-xl animate-bounce">
                    <Bell size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      Meeting Reminder
                      <span className="bg-white bg-opacity-20 px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse">
                        New
                      </span>
                    </h3>
                    <p className="text-white text-opacity-90 text-xs mt-0.5">
                      Upcoming meeting 📅
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 p-1.5 rounded-lg transition-all backdrop-blur-sm"
                >
                  <X size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-3 bg-gradient-to-br from-orange-50 to-white max-h-[70vh] overflow-y-auto">
              {/* Meeting ID & Lead ID */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border-2 border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Briefcase size={14} className="text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Meeting ID
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {meeting.meetingId}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3 border-2 border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <AlertCircle size={14} className="text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Lead ID</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {meeting.leadId}
                  </p>
                </div>
              </div>

              {/* Lead Profile & Lead Type */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={14} className="text-orange-600" />
                    <p className="text-xs text-gray-500 font-medium">
                      Lead Profile
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {meeting.leadProfile}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Star size={14} className="text-orange-600" />
                    <p className="text-xs text-gray-500 font-medium">
                      Lead Type
                    </p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {meeting.leadType}
                  </p>
                </div>
              </div>

              {/* Priority */}
              <div className="bg-white rounded-xl p-3 border-2 border-orange-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <AlertCircle size={14} className="text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">
                      Priority
                    </p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPriorityColor(
                      meeting.priority
                    )}`}
                  >
                    {meeting.priority}
                  </div>
                </div>
              </div>

              {/* Date & Time */}
              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3 border-2 border-orange-200 animate-pulse-slow">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-orange-700" />
                  <p className="text-xs text-orange-700 font-bold">
                    Meeting Schedule
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={16} className="text-orange-600" />
                  <p className="text-sm font-bold text-orange-900">
                    {meeting.dateTime}
                  </p>
                </div>
              </div>

              {/* Meeting Mode */}
              <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  {getMeetingModeIcon(meeting.meetingMode)}
                  <p className="text-xs text-gray-500 font-medium">
                    Meeting Mode
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {meeting.meetingMode}
                </p>
              </div>

              {/* Host Name */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <UserCheck size={14} className="text-blue-600" />
                  <p className="text-xs text-blue-700 font-medium">
                    Meeting Host
                  </p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {meeting.hostName}
                </p>
              </div>

              {/* Meeting Members */}
              <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users size={14} className="text-orange-600" />
                  <p className="text-xs text-gray-500 font-medium">
                    Members ({meeting.meetingMembers.length})
                  </p>
                </div>
                <div className="space-y-2">
                  {meeting.meetingMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-2"
                    >
                      <div className="bg-orange-200 text-orange-700 font-bold w-7 h-7 rounded-full flex items-center justify-center text-xs">
                        {member.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-800">
                        {member}
                      </span>
                      {member === meeting.hostName && (
                        <span className="ml-auto bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Host
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => alert("Joining meeting...")}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Video size={16} />
                  Join Meeting
                </button>
                <button
                  onClick={() => {
                    alert("Reminder snoozed for 5 minutes");
                    handleClose();
                  }}
                  className="flex-1 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Clock size={16} />
                  Snooze
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes slideIn {
              from {
                transform: translateX(-100%);
                opacity: 0;
              }
              to {
                transform: translateX(0);
                opacity: 1;
              }
            }

            @keyframes pulse-slow {
              0%, 100% {
                opacity: 1;
              }
              50% {
                opacity: 0.8;
              }
            }

            .animate-slideIn {
              animation: slideIn 0.5s ease-out;
            }

            .animate-pulse-slow {
              animation: pulse-slow 2s ease-in-out infinite;
            }
          `}</style>
        </div>
      )}
    </>
  );
}

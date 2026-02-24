import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { useGetDueMeetingsQuery } from "../store/api/leadApi";
import { useSelector } from "react-redux";

export default function MeetingReminder() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isVisible, setIsVisible] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const audioRef = useRef(null);

  // Reference to track if we've already notified for a specific meeting
  const notifiedMeetings = useRef(new Set());

  const { data: dueMeetings, refetch } = useGetDueMeetingsQuery(null, {
    pollingInterval: 10000, // Poll every 10 seconds
    skip: !user,
  });

  // Function to play notification sound
  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.log("Audio play failed:", err));
    }
  };

  useEffect(() => {
    if (!dueMeetings || dueMeetings.length === 0) {
      if (isVisible) setIsVisible(false);
      return;
    }

    // Cleanup notified meetings that are no longer due
    const currentDueIds = new Set(dueMeetings.map((m) => m.id));
    notifiedMeetings.current.forEach((id) => {
      if (!currentDueIds.has(id)) {
        notifiedMeetings.current.delete(id);
      }
    });

    if (!isVisible) {
      // Find the first due meeting that we haven't shown yet
      const nextOne = dueMeetings.find((m) => !notifiedMeetings.current.has(m.id));

      if (nextOne) {
        setCurrentMeeting(nextOne);
        setIsVisible(true);
        notifiedMeetings.current.add(nextOne.id);
        playNotificationSound();
      }
    } else if (currentMeeting) {
      // If already visible, check if current meeting is still in the due list
      const updated = dueMeetings.find((m) => m.id === currentMeeting.id);
      if (updated) {
        setCurrentMeeting(updated);
      } else {
        setIsVisible(false);
        setCurrentMeeting(null);
      }
    }
  }, [dueMeetings, isVisible, currentMeeting?.id]);

  const handleClose = () => {
    setIsVisible(false);
    setCurrentMeeting(null);
  };

  const handleJoin = () => {
    if (currentMeeting) {
      // Logic for joining - maybe just view the lead for now?
      navigate(`/crm/leads/profile/${currentMeeting.lead_id}`);
      handleClose();
    }
  };

  const getPriorityColor = (priority) => {
    if (!priority) return "bg-gray-100 text-gray-700 border-gray-300";
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

  if (!isVisible || !currentMeeting) return null;

  // Formatting attendees
  let members = [];
  try {
    members = typeof currentMeeting.attendees === 'string'
      ? JSON.parse(currentMeeting.attendees)
      : (currentMeeting.attendees || []);
  } catch (e) {
    members = [];
  }

  const displayDateTime = `${new Date(currentMeeting.meeting_date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })} - ${currentMeeting.meeting_time}`;

  return (
    <>
      <audio ref={audioRef} preload="auto">
        <source
          src="https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3"
          type="audio/mpeg"
        />
      </audio>

      {isVisible && (
        <div className="fixed top-4 left-4 z-[9999] animate-slideIn">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-orange-200 w-96 overflow-hidden transform transition-all hover:scale-[1.02]">
            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-5 py-4 relative overflow-hidden">
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
                        Due Now
                      </span>
                    </h3>
                    <p className="text-white text-opacity-90 text-xs mt-0.5">
                      Upcoming meeting: {currentMeeting.title}
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

            <div className="p-5 space-y-3 bg-gradient-to-br from-orange-50 to-white max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3 border-2 border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Briefcase size={14} className="text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Lead ID</p>
                  </div>
                  <p className="text-sm font-bold text-gray-800">
                    {currentMeeting.lead_identifier || 'N/A'}
                  </p>
                </div>

                <div className="bg-white rounded-xl p-3 border-2 border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <AlertCircle size={14} className="text-orange-600" />
                    </div>
                    <p className="text-xs text-gray-500 font-medium">Priority</p>
                  </div>
                  <div
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityColor(
                      currentMeeting.lead_priority || "Medium"
                    )}`}
                  >
                    {currentMeeting.lead_priority || "Medium"}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <User size={14} className="text-orange-600" />
                  <p className="text-xs text-gray-500 font-medium">Lead Profile</p>
                </div>
                <p className="text-sm font-bold text-gray-800">
                  {currentMeeting.lead_name} ({currentMeeting.lead_type})
                </p>
              </div>

              <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-xl p-3 border-2 border-orange-200 animate-pulse-slow">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar size={14} className="text-orange-700" />
                  <p className="text-xs text-orange-700 font-bold">Meeting Schedule</p>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={16} className="text-orange-600" />
                  <p className="text-sm font-bold text-orange-900">{displayDateTime}</p>
                </div>
              </div>

              {currentMeeting.description && (
                <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={14} className="text-orange-600" />
                    <p className="text-xs text-gray-500 font-medium">Agenda</p>
                  </div>
                  <p className="text-xs text-gray-700">{currentMeeting.description}</p>
                </div>
              )}

              {members.length > 0 && (
                <div className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={14} className="text-orange-600" />
                    <p className="text-xs text-gray-500 font-medium">Attendees ({members.length})</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {members.map((member, index) => (
                      <span key={index} className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full border border-orange-100">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleJoin}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Video size={16} />
                  Join Meeting
                </button>
                <button
                  onClick={handleClose}
                  className="flex-1 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <X size={16} />
                  Dismiss
                </button>
              </div>
            </div>
          </div>

          <style>{`
            @keyframes slideIn {
              from { transform: translateX(-100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes pulse-slow {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.8; }
            }
            .animate-slideIn { animation: slideIn 0.5s ease-out; }
            .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
          `}</style>
        </div>
      )}
    </>
  );
}

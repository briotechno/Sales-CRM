import React, { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FiMail,
  FiStar,
  FiSearch,
  FiTrash2,
  FiSend,
} from "react-icons/fi";


const initialMails = [
  {
    id: 1, sender: "Sales Admin",
    subject: "📄 New Lead Assigned",
    time: "2h ago",
    content: "A new high-priority lead has been assigned to you. Review the lead details and reach out within the next 24 hours.",
    starred: false
  },
  {
    id: 2, sender: "Marketing Team",
    subject: "🎉 Upcoming Webinar: Closing Deals Faster",
    time: "1d ago", content: "Join our internal training webinar to learn advanced techniques for speeding up the sales cycle and increasing conversions.",
    starred: true,
  },
  {
    id: 3, sender: "CRM System",
    subject: "System Maintenance Scheduled", time: "3d ago", content: "The CRM platform will undergo maintenance on November 12th from 1:00 AM to 3:00 AM UTC. Certain features may be temporarily unavailable.", starred: false,
  },
  {
    id: 4, sender: "Finance Department",
    subject: "⚠️ Invoice Reminder: Payment Overdue",
    time: "4d ago",
    content: "Invoice #4821 for BlueWave Solutions is overdue by 7 days. Please follow up with the client and update the finance team.",
    starred: false,
  },
  {
    id: 5,
    sender: "Client: TechNova Inc.",
    subject: "📁 Feedback on Proposal Draft", time: "5d ago",
    content: "Thank you for sending the proposal. Our team has reviewed it and added comments. Let’s schedule a call to finalize the next steps.",
    starred: false,
  },

];

const MailPage = () => {
  const [mails, setMails] = useState(initialMails);
  const [selectedMail, setSelectedMail] = useState(null);
  const [search, setSearch] = useState("");

  const filteredMails = mails.filter(
    (mail) =>
      mail.sender.toLowerCase().includes(search.toLowerCase()) ||
      mail.subject.toLowerCase().includes(search.toLowerCase())
  );

  const openMail = (mail) => {
    setSelectedMail(mail);
    setMails((prev) =>
      prev.map((m) =>
        m.id === mail.id ? { ...m, unread: false } : m
      )
    );
  };

  const toggleStar = (id) => {
    setMails((prev) =>
      prev.map((mail) =>
        mail.id === id ? { ...mail, starred: !mail.starred } : mail
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="h-screen pt-[72px] bg-black text-white flex">

        {/* LEFT PANEL */}
        <div className="w-[380px] border-r border-gray-800 flex flex-col">

          {/* Header */}
          <div className="p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
            <div className="flex items-center justify-between">
              <h1 className="flex items-center gap-2 text-lg font-semibold">
                <FiMail className="text-orange-500" />
                Mailbox
              </h1>
              <button className="bg-orange-500 px-3 py-1.5 rounded text-sm">
                Compose
              </button>
            </div>

            {/* Search */}
            <div className="mt-3 flex items-center gap-2 bg-[#111] border border-gray-800 px-3 py-2 rounded-sm">
              <FiSearch className="text-gray-400" />
              <input
                placeholder="Search mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>
          </div>

          {/* Mail List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMails.map((mail) => (
              <div
                key={mail.id}
                onClick={() => openMail(mail)}
                className={`group relative p-4 border-b border-gray-800 cursor-pointer hover:bg-[#1a1a1a]
                ${selectedMail?.id === mail.id ? "bg-[#1f1f1f]" : ""}`}
              >
                {/* Selected Accent */}
                {selectedMail?.id === mail.id && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-orange-500" />
                )}

                <div className="flex justify-between">
                  <div>
                    <h3
                      className={`text-sm ${mail.unread ? "font-semibold" : "font-medium"
                        }`}
                    >
                      {mail.sender}
                    </h3>
                    <p
                      className={`text-sm truncate ${mail.unread
                        ? "text-white"
                        : "text-gray-400"
                        }`}
                    >
                      {mail.subject}
                    </p>
                    <span className="text-xs text-gray-500">
                      {mail.time}
                    </span>
                  </div>

                  {/* Right icons */}
                  <div className="flex flex-col items-end gap-2">
                    {mail.unread && (
                      <span className="h-2 w-2 rounded-full bg-orange-500" />
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStar(mail.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition"
                    >
                      <FiStar
                        size={16}
                        className={
                          mail.starred
                            ? "text-yellow-400"
                            : "text-gray-500"
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 hidden sm:flex flex-col">

          {!selectedMail ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <FiMail size={48} className="mb-4 opacity-40" />
              Select a mail to read
            </div>
          ) : (
            <>
              {/* Actions */}
              <div className="p-4 border-b border-gray-800 flex gap-4 sticky top-0 bg-black z-10">
                <button className="hover:text-orange-400">
                  <FiSend />
                </button>
                <button className="hover:text-red-400">
                  <FiTrash2 />
                </button>
                <button
                  onClick={() => toggleStar(selectedMail.id)}
                  className="hover:text-yellow-400"
                >
                  <FiStar />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                <h2 className="text-xl font-semibold mb-2">
                  {selectedMail.subject}
                </h2>
                <p className="text-sm text-gray-400 mb-6">
                  From{" "}
                  <span className="text-white">
                    {selectedMail.sender}
                  </span>{" "}
                  • {selectedMail.time}
                </p>

                <div className="text-gray-300 leading-relaxed text-sm">
                  {selectedMail.content}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MailPage;

import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import {
  FiMail,
  FiStar,
  FiSearch,
  FiTrash2,
  FiSend,
  FiInbox,
  FiFile,
  FiAlertCircle,
  FiMenu,
  FiMoreVertical,
  FiArchive,
  FiClock,
  FiPaperclip,
  FiChevronLeft,
  FiChevronRight,
  FiEdit,
  FiX,
  FiRefreshCw,
  FiFilter,
  FiTag,
  FiCornerUpLeft
} from "react-icons/fi";
import { Paperclip, PinIcon } from "lucide-react";

// --- Mock Data ---
const initialMails = [
  {
    id: 1,
    sender: "Sales Admin",
    senderEmail: "admin@sales-crm.com",
    subject: "📄 New Lead Assigned",
    time: "2h ago",
    timestamp: new Date().getTime() - 2 * 60 * 60 * 1000,
    content: "A new high-priority lead has been assigned to you. Review the lead details and reach out within the next 24 hours. The lead is interested in our Enterprise plan and has a team of 50+. Please prepare the pitch deck specifically highlighting our CRM automation features.",
    starred: false,
    folder: "inbox",
    read: false,
    label: "work"
  },
  {
    id: 2,
    sender: "Marketing Team",
    senderEmail: "marketing@sales-crm.com",
    subject: "🎉 Upcoming Webinar: Closing Deals Faster",
    time: "1d ago",
    timestamp: new Date().getTime() - 24 * 60 * 60 * 1000,
    content: "Join our internal training webinar to learn advanced techniques for speeding up the sales cycle and increasing conversions. We will have guest speakers from the industry share their secrets on negotiation and closing tactics.",
    starred: true,
    folder: "inbox",
    read: true,
    label: "update"
  },
  {
    id: 3,
    sender: "CRM System",
    senderEmail: "no-reply@crm-sys.com",
    subject: "System Maintenance Scheduled",
    time: "3d ago",
    timestamp: new Date().getTime() - 3 * 24 * 60 * 60 * 1000,
    content: "The CRM platform will undergo maintenance on November 12th from 1:00 AM to 3:00 AM UTC. Certain features may be temporarily unavailable during this window. We apologize for any inconvenience caused.",
    starred: false,
    folder: "inbox",
    read: true,
    label: "system"
  },
  {
    id: 4,
    sender: "Finance Department",
    senderEmail: "finance@sales-crm.com",
    subject: "⚠️ Invoice Reminder: Payment Overdue",
    time: "4d ago",
    timestamp: new Date().getTime() - 4 * 24 * 60 * 60 * 1000,
    content: "Invoice #4821 for BlueWave Solutions is overdue by 7 days. Please follow up with the client and update the finance team immediately. This is the second reminder for this client.",
    starred: false,
    folder: "inbox",
    read: true,
    label: "urgent"
  },
  {
    id: 5,
    sender: "Client: TechNova Inc.",
    senderEmail: "contact@technova.com",
    subject: "📁 Feedback on Proposal Draft",
    time: "Mar 10",
    timestamp: new Date("2024-03-10").getTime(),
    content: "Thank you for sending the proposal. Our team has reviewed it and added comments. Let’s schedule a call to finalize the next steps. We are generally happy with the terms but need clarification on the support SLAs.",
    starred: false,
    folder: "inbox",
    read: true,
    label: "client"
  },
  {
    id: 6,
    sender: "John Doe",
    senderEmail: "john.doe@example.com",
    subject: "Lunch meeting?",
    time: "Feb 28",
    timestamp: new Date("2024-02-28").getTime(),
    content: "Hey, are you free for lunch tomorrow? I wanted to discuss the new project dashboard requirements and get your thoughts on the UI changes we're planning.",
    starred: true,
    folder: "sent",
    read: true,
    label: "personal"
  }
];

const folders = [
  { id: "inbox", name: "Inbox", icon: FiInbox },
  { id: "starred", name: "Starred", icon: FiStar },
  { id: "sent", name: "Sent", icon: FiSend },
  { id: "drafts", name: "Drafts", icon: FiFile },
  { id: "trash", name: "Trash", icon: FiTrash2 },
];

const labels = [
  { id: "work", name: "Work", color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: "personal", name: "Personal", color: "text-green-500", bg: "bg-green-500/10" },
  { id: "urgent", name: "Urgent", color: "text-red-500", bg: "bg-red-500/10" },
  { id: "client", name: "Client", color: "text-purple-500", bg: "bg-purple-500/10" },
];

const MailPage = () => {
  const [mails, setMails] = useState(initialMails);
  const [selectedFolder, setSelectedFolder] = useState("inbox");
  const [selectedMail, setSelectedMail] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'content' for mobile

  // Filter Mails
  const filteredMails = useMemo(() => {
    let filtered = mails;

    // Folder Filtering
    if (selectedFolder === "starred") {
      filtered = filtered.filter((m) => m.starred);
    } else {
      filtered = filtered.filter((m) => m.folder === selectedFolder);
    }

    // Search Filtering
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.sender.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.content.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => b.timestamp - a.timestamp);
  }, [mails, selectedFolder, searchQuery]);

  // Handle mail selection
  const handleSelectMail = (mail) => {
    setSelectedMail(mail);
    setMails((prev) =>
      prev.map((m) => (m.id === mail.id ? { ...m, read: true } : m))
    );
    if (window.innerWidth < 1024) setViewMode("content");
  };

  const toggleStar = (e, id) => {
    e.stopPropagation();
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m))
    );
  };

  const deleteMail = (e, id) => {
    if (e) e.stopPropagation();
    setMails((prev) =>
      prev.map((m) => (m.id === id ? { ...m, folder: "trash" } : m))
    );
    if (selectedMail && selectedMail.id === id) {
      setSelectedMail(null);
      if (window.innerWidth < 1024) setViewMode("list");
    }
  };

  return (
    <DashboardLayout isFullHeight={true} isNoPadding={true}>
      <div className="flex h-full w-full bg-white overflow-hidden text-gray-800 font-sans">

        {/* --- LEFT SIDEBAR (Glassmorphism effect) --- */}
        <aside
          className={`
          absolute z-30 h-full w-64 transform border-r border-gray-200 bg-white/80 backdrop-blur-md transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
          ${isMobileMenuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
        >
          <div className="flex h-full flex-col px-4 py-6">
            <button
              onClick={() => setIsComposeOpen(true)}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] hover:shadow-orange-500/40 active:scale-95 group"
            >
              <FiEdit className="transition-transform group-hover:rotate-12" size={18} />
              <span>Compose</span>
            </button>

            <nav className="mt-8 flex-1 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-none">
              <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Mailboxes</p>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => {
                    setSelectedFolder(folder.id);
                    setSelectedMail(null);
                    setIsMobileMenuOpen(false);
                    setViewMode("list");
                  }}
                  className={`flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200
                  ${selectedFolder === folder.id
                      ? "bg-orange-50 text-orange-600 shadow-sm"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                >
                  <folder.icon size={20} className={selectedFolder === folder.id ? "text-orange-600" : "text-gray-400"} />
                  <span className="flex-1 text-left">{folder.name}</span>
                  {folder.id === "inbox" && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] text-white">
                      {mails.filter((m) => m.folder === "inbox" && !m.read).length}
                    </span>
                  )}
                </button>
              ))}

              <div className="mt-8">
                <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Labels</p>
                {labels.map((label) => (
                  <button
                    key={label.id}
                    className="flex w-full items-center gap-4 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors group"
                  >
                    <div className={`h-2.5 w-2.5 rounded-full transition-transform group-hover:scale-125 ${label.color.replace('text-', 'bg-')}`} />
                    <span>{label.name}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-20 bg-gray-900/40 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* --- MIDDLE COLUMN (Mail List) --- */}
        <div className={`
          flex h-full w-full flex-col border-r border-gray-100 bg-white lg:w-[400px] xl:w-[450px]
          ${viewMode === "content" ? "hidden lg:flex" : "flex"}
        `}>
          {/* List Header */}
          <div className="flex h-[72px] items-center gap-4 border-b border-gray-100 px-6">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <FiMenu size={20} />
            </button>
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search messages..."
                value={searchQuery}
                onInput={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl bg-gray-100 py-2.5 pl-10 pr-4 text-sm text-gray-700 placeholder-gray-400 outline-none transition-all focus:bg-white focus:ring-2 focus:ring-orange-500/10"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors">
              <FiFilter size={18} />
            </button>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200">
            {filteredMails.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center p-8 text-center text-gray-400">
                <div className="mb-4 rounded-full bg-gray-50 p-6">
                  <FiInbox size={48} className="opacity-20" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No emails here</h3>
                <p className="mt-1 text-sm text-gray-500">Your mailbox for this folder is empty.</p>
              </div>
            ) : (
              filteredMails.map((mail) => (
                <div
                  key={mail.id}
                  onClick={() => handleSelectMail(mail)}
                  className={`
                    group relative cursor-pointer border-b border-gray-50 p-6 transition-all duration-200 hover:bg-orange-50/30
                    ${selectedMail?.id === mail.id ? "bg-orange-50/50" : ""}
                    ${!mail.read ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-transparent"}
                  `}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl font-bold text-white shadow-sm transition-transform group-hover:scale-105 
                        ${!mail.read ? "bg-gradient-to-br from-orange-400 to-orange-600" : "bg-gray-400"}`}>
                        {mail.sender[0]}
                      </div>
                      <span className={`truncate text-sm font-bold ${!mail.read ? "text-gray-900" : "text-gray-500"}`}>
                        {mail.sender}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-gray-400 whitespace-nowrap">{mail.time}</span>
                  </div>

                  <h4 className={`mb-1 line-clamp-1 text-sm font-semibold tracking-tight ${!mail.read ? "text-gray-900" : "text-gray-600"}`}>
                    {mail.subject}
                  </h4>

                  <p className="line-clamp-2 text-[13px] leading-relaxed text-gray-400">
                    {mail.content}
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex gap-2">
                      {mail.label && (
                        <span className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${labels.find(l => l.id === mail.label)?.bg} ${labels.find(l => l.id === mail.label)?.color}`}>
                          {labels.find(l => l.id === mail.label)?.name.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => toggleStar(e, mail.id)}
                        className={`p-1.5 transition-colors hover:scale-110 ${mail.starred ? "text-yellow-400" : "text-gray-300 hover:text-gray-400"}`}
                      >
                        <FiStar size={16} fill={mail.starred ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN (Mail Content) --- */}
        <div className={`
          relative flex h-full flex-1 flex-col bg-white
          ${viewMode === "list" ? "hidden lg:flex" : "flex"}
        `}>
          {selectedMail ? (
            <>


              {/* Email Content Body */}
              <div className="flex-1 overflow-y-auto px-10 py-10 scrollbar-thin scrollbar-thumb-gray-100">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-10 flex items-start justify-between">
                    <div>
                      <h1 className="mb-6 text-2xl font-black tracking-tight text-gray-900 leading-tight">
                        {selectedMail.subject}
                      </h1>
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-black text-white shadow-lg shadow-orange-500/20">
                          {selectedMail.sender[0]}
                        </div>
                        <div>
                          <div className="text-base font-black text-gray-900 leading-none">
                            {selectedMail.sender}
                          </div>
                          <div className="mt-1 text-sm font-bold text-gray-400">
                            &lt;{selectedMail.senderEmail}&gt; <span className="mx-2 text-gray-200">|</span> to me
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                        Received {selectedMail.time}
                      </div>
                      <span className="inline-flex rounded-xl bg-gray-100 px-3 py-1 text-[11px] font-black uppercase text-gray-500 ring-1 ring-inset ring-gray-200/50 shadow-sm">
                        Public Account
                      </span>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-gray-100 bg-gray-50/30 py-4">
                    <p className="whitespace-pre-wrap text-base font-medium leading-loose text-gray-700">
                      {selectedMail.content}
                    </p>
                  </div>

                  <div className="mt-15 flex flex-wrap gap-4 pt-12 border-t border-gray-100">
                    <button className="flex items-center gap-3 rounded-2xl bg-orange-500 px-8 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/30 transition-all hover:bg-orange-600 hover:shadow-orange-500/40 active:scale-95 group">
                      <FiCornerUpLeft size={18} className="transition-transform group-hover:-translate-x-1" />
                      Reply
                    </button>
                    <button className="flex items-center gap-3 rounded-2xl border-2 border-gray-100 bg-white px-8 py-4 text-sm font-black text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-200 active:scale-95 group">
                      Forward
                      <FiSend size={18} className="text-gray-400 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </button>
                    <button className="flex items-center justify-center rounded-xl bg-gray-50 p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-500 group" title="Delete" onClick={(e) => deleteMail(e, selectedMail.id)}>
                      <Paperclip size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                    <button className="flex items-center justify-center rounded-xl bg-gray-50 p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-red-500 group" title="Delete" onClick={(e) => deleteMail(e, selectedMail.id)}>
                      <FiTrash2 size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-12 text-center">
              <div className="relative mb-8 h-48 w-48">
                <div className="absolute inset-0 rotate-12 rounded-[40px] bg-orange-500/5 transition-transform hover:rotate-6" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <FiMail size={84} className="text-gray-300 transition-transform hover:scale-110" />
                </div>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-gray-900">Select an email to read</h2>
              <p className="mt-3 max-w-sm text-base font-medium text-gray-400">
                Pick a message from the list on the left to start reading. Your inbox is looking healthy!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* --- COMPOSE MODAL (Glassmorphism + Animations) --- */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md transition-all duration-300 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-[0_25px_50px_-12px_rgba(251,142,40,0.15)] animate-in fade-in zoom-in duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-8 py-6">
              <h3 className="text-xl font-black text-gray-900">New Message</h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-400 shadow-sm transition-all hover:text-red-500 active:scale-95"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-0 px-8 py-4">
              <div className="flex items-center gap-4 border-b border-gray-50 py-3">
                <span className="w-16 text-xs font-black uppercase tracking-widest text-gray-400">To</span>
                <input
                  className="flex-1 bg-transparent py-2 text-sm font-bold text-gray-900 outline-none placeholder:text-gray-300 focus:ring-0"
                  placeholder="recipient@example.com"
                  autoFocus
                />
              </div>
              <div className="flex items-center gap-4 border-b border-gray-50 py-3">
                <span className="w-16 text-xs font-black uppercase tracking-widest text-gray-400">Subject</span>
                <input
                  className="flex-1 bg-transparent py-2 text-sm font-bold text-gray-900 outline-none placeholder:text-gray-300 focus:ring-0"
                  placeholder="What's this about?"
                />
              </div>
              <textarea
                className="mt-6 h-64 w-full resize-none rounded-2xl bg-gray-50/50 p-6 text-base font-medium text-gray-700 outline-none transition-all placeholder:text-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                placeholder="Type your message here..."
              />
            </div>

            <div className="flex items-center justify-between border-t border-gray-100 px-8 py-6">
              <div className="flex items-center gap-4 text-gray-400">
                <button className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-gray-100 hover:text-blue-500 transition-colors">
                  <FiPaperclip size={20} />
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-gray-100 hover:text-purple-500 transition-colors">
                  <FiTag size={20} />
                </button>
                <button className="flex h-11 w-11 items-center justify-center rounded-xl hover:bg-gray-100 hover:text-red-500 transition-colors" onClick={() => setIsComposeOpen(false)}>
                  <FiTrash2 size={20} />
                </button>
              </div>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 px-8 py-4 text-sm font-black text-white shadow-lg shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 group"
              >
                Send Message
                <FiSend size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default MailPage;

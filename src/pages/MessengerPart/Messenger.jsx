import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { MessageCircle, Search, Users, User, X } from "lucide-react";
import {
  ChatHeader,
  ChatMessages,
  ChatInput,
  ChatInfoSidebar,
  ContactsList,
  EmptyState,
} from "../../pages/MessengerPart/MessengerComponents";

export default function MessengerPage() {
  // State Management
  const [activeTab, setActiveTab] = useState("team");
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [chatMessages, setChatMessages] = useState({});
  const [typingIndicator, setTypingIndicator] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showMessageMenu, setShowMessageMenu] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [pinnedMessages, setPinnedMessages] = useState({});
  const [notifications, setNotifications] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [starredMessages, setStarredMessages] = useState(new Set());

  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const attachmentMenuRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  // Data
  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Sales Manager",
      avatar: "SJ",
      status: "online",
      lastMessage: "Can you send me the Q4 report?",
      time: "2m",
      unread: 2,
      email: "sarah.j@company.com",
      phone: "+91 98765 43210",
    },
    {
      id: 2,
      name: "Mike Chen",
      role: "CRM Specialist",
      avatar: "MC",
      status: "online",
      lastMessage: "Meeting at 3 PM confirmed",
      time: "15m",
      unread: 0,
      email: "mike.c@company.com",
      phone: "+91 98765 43211",
    },
    {
      id: 3,
      name: "Emily Davis",
      role: "Sales Rep",
      avatar: "ED",
      status: "away",
      lastMessage: "Thanks for your help!",
      time: "1h",
      unread: 0,
      email: "emily.d@company.com",
      phone: "+91 98765 43212",
    },
    {
      id: 4,
      name: "James Wilson",
      role: "Account Manager",
      avatar: "JW",
      status: "offline",
      lastMessage: "Let me check and get back",
      time: "3h",
      unread: 1,
      email: "james.w@company.com",
      phone: "+91 98765 43213",
    },
    {
      id: 5,
      name: "Alex Turner",
      role: "Business Analyst",
      avatar: "AT",
      status: "online",
      lastMessage: "Data analysis complete",
      time: "5h",
      unread: 0,
      email: "alex.t@company.com",
      phone: "+91 98765 43214",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      role: "Marketing Lead",
      avatar: "LA",
      status: "away",
      lastMessage: "Campaign results are in",
      time: "6h",
      unread: 3,
      email: "lisa.a@company.com",
      phone: "+91 98765 43215",
    },
  ];

  const clients = [
    {
      id: 10,
      name: "Acme Corporation",
      role: "Enterprise Client",
      avatar: "AC",
      status: "online",
      lastMessage: "When can we schedule a demo?",
      time: "10m",
      unread: 3,
      email: "contact@acme.com",
      phone: "+91 98765 43220",
    },
    {
      id: 11,
      name: "Tech Innovators",
      role: "Premium Client",
      avatar: "TI",
      status: "online",
      lastMessage: "Invoice received, thank you",
      time: "45m",
      unread: 0,
      email: "info@techinnovators.com",
      phone: "+91 98765 43221",
    },
    {
      id: 12,
      name: "Global Solutions",
      role: "Standard Client",
      avatar: "GS",
      status: "away",
      lastMessage: "Need support with integration",
      time: "2h",
      unread: 1,
      email: "support@globalsolutions.com",
      phone: "+91 98765 43222",
    },
  ];

  // Initialize chat messages
  useEffect(() => {
    const initialMessages = {};
    [...teamMembers, ...clients].forEach((contact) => {
      initialMessages[contact.id] = [
        {
          id: 1,
          sender: "them",
          text: "Hello! How are you today?",
          time: "10:30 AM",
          read: true,
          reactions: {},
          edited: false,
        },
        {
          id: 2,
          sender: "me",
          text: "Hi! I am doing great, thanks for asking!",
          time: "10:32 AM",
          read: true,
          reactions: {},
          edited: false,
        },
        {
          id: 3,
          sender: "them",
          text: contact.lastMessage,
          time: "10:35 AM",
          read: false,
          reactions: {},
          edited: false,
        },
      ];
    });
    setChatMessages(initialMessages);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, selectedChat]);

  // Close popovers on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
      if (
        attachmentMenuRef.current &&
        !attachmentMenuRef.current.contains(event.target)
      ) {
        setShowAttachmentMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingDuration(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  // Handlers
  const handleSend = () => {
    if ((message.trim() || attachedFiles.length > 0) && selectedChat) {
      if (editingMessage) {
        // Edit existing message
        setChatMessages((prev) => ({
          ...prev,
          [selectedChat.id]: prev[selectedChat.id].map((msg) =>
            msg.id === editingMessage.id
              ? { ...msg, text: message.trim(), edited: true }
              : msg
          ),
        }));
        setEditingMessage(null);
      } else {
        // Send new message
        const newMessage = {
          id: Date.now(),
          sender: "me",
          text: message.trim() || `Sent ${attachedFiles.length} file(s)`,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          read: false,
          attachments: attachedFiles.length > 0 ? [...attachedFiles] : null,
          reactions: {},
          replyTo: replyingTo,
          edited: false,
        };

        setChatMessages((prev) => ({
          ...prev,
          [selectedChat.id]: [...(prev[selectedChat.id] || []), newMessage],
        }));

        // Simulate typing and response
        setTypingIndicator(selectedChat.id);
        setTimeout(() => {
          setTypingIndicator(null);
          const responseMessage = {
            id: Date.now() + 1,
            sender: "them",
            text: "Thanks for your message! I'll get back to you shortly.",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            read: false,
            reactions: {},
            edited: false,
          };

          setChatMessages((prev) => ({
            ...prev,
            [selectedChat.id]: [
              ...(prev[selectedChat.id] || []),
              responseMessage,
            ],
          }));
        }, 2000);
      }

      setMessage("");
      setAttachedFiles([]);
      setReplyingTo(null);
    }
  };

  const handleChatSelect = (contact) => {
    setSelectedChat(contact);
    setChatMessages((prev) => ({
      ...prev,
      [contact.id]:
        prev[contact.id]?.map((msg) => ({ ...msg, read: true })) || [],
    }));
    setShowChatInfo(false);
    setChatSearchQuery("");
    setReplyingTo(null);
    setEditingMessage(null);
    setMessage("");
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setAttachedFiles((prev) => [...prev, ...fileData]);
    setShowAttachmentMenu(false);
  };

  const handleVoiceMessage = () => {
    if (!isRecording) {
      setIsRecording(true);
    } else {
      const voiceMessage = {
        id: Date.now(),
        sender: "me",
        text: `Voice message (${recordingDuration}s)`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        read: false,
        isVoice: true,
        duration: recordingDuration,
        reactions: {},
        edited: false,
      };

      setChatMessages((prev) => ({
        ...prev,
        [selectedChat.id]: [...(prev[selectedChat.id] || []), voiceMessage],
      }));

      setIsRecording(false);
    }
  };

  const handleReaction = (messageId, emoji) => {
    setChatMessages((prev) => ({
      ...prev,
      [selectedChat.id]: prev[selectedChat.id].map((msg) =>
        msg.id === messageId
          ? {
            ...msg,
            reactions: {
              ...msg.reactions,
              [emoji]: (msg.reactions[emoji] || 0) + 1,
            },
          }
          : msg
      ),
    }));
    setShowReactionPicker(null);
  };

  const handleDeleteMessage = (messageId) => {
    setChatMessages((prev) => ({
      ...prev,
      [selectedChat.id]: prev[selectedChat.id].filter(
        (msg) => msg.id !== messageId
      ),
    }));
    setShowMessageMenu(null);
  };

  const handlePinMessage = (messageId) => {
    setPinnedMessages((prev) => ({
      ...prev,
      [selectedChat.id]: messageId,
    }));
    setShowMessageMenu(null);
  };

  const handleEditMessage = (msg) => {
    setEditingMessage(msg);
    setMessage(msg.text);
    setShowMessageMenu(null);
    setReplyingTo(null);
  };

  const handleReply = (msg) => {
    setReplyingTo(msg);
    setShowMessageMenu(null);
    setEditingMessage(null);
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    setShowMessageMenu(null);
  };

  const handleStarMessage = (messageId) => {
    setStarredMessages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(messageId)) {
        newSet.delete(messageId);
      } else {
        newSet.add(messageId);
      }
      return newSet;
    });
    setShowMessageMenu(null);
  };

  const handleForwardMessage = (msg) => {
    console.log("Forward message:", msg);
    setShowMessageMenu(null);
  };

  const cancelRecording = () => {
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setMessage("");
  };

  // Computed values
  const contacts = activeTab === "team" ? teamMembers : clients;
  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const messages = selectedChat ? chatMessages[selectedChat.id] || [] : [];
  const filteredMessages = chatSearchQuery
    ? messages.filter((msg) =>
      msg.text.toLowerCase().includes(chatSearchQuery.toLowerCase())
    )
    : messages;

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-4rem)] ml-5 bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-[380px] bg-gray-50/30 flex flex-col h-full border-r border-gray-100">
            {/* Header */}
            <div className="px-6 pt-8 pb-6 bg-white shrink-0">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-100">
                    <MessageCircle className="text-white" size={24} />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">Chats</h1>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Messenger Pro</p>
                  </div>
                </div>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-600 transition-all cursor-pointer group">
                  <div className="relative">
                    <Users size={20} className="group-hover:scale-110 transition-transform" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full border-2 border-white"></div>
                  </div>
                </div>
              </div>

              {/* Search */}
              <div className="relative group">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search chats, people..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-3.5 text-sm bg-gray-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-orange-100 focus:ring-4 focus:ring-orange-50/50 transition-all placeholder:text-gray-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 bg-white rounded-lg p-1 transition-all"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 pb-2 bg-white shrink-0">
              <div className="flex p-1.5 bg-gray-50 rounded-[20px] gap-1">
                <button
                  onClick={() => setActiveTab("team")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "team"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <Users size={14} />
                  Team
                </button>
                <button
                  onClick={() => setActiveTab("person")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === "person"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                    }`}
                >
                  <User size={14} />
                  Clients
                </button>
              </div>
            </div>

            {/* Contacts List */}
            <div className="flex-1 overflow-hidden">
              <ContactsList
                contacts={filteredContacts}
                selectedChat={selectedChat}
                onChatSelect={handleChatSelect}
              />
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white h-full">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0">
                  <ChatHeader
                    selectedChat={selectedChat}
                    showChatInfo={showChatInfo}
                    onToggleChatInfo={() => setShowChatInfo(!showChatInfo)}
                    notifications={notifications}
                    setNotifications={setNotifications}
                    chatSearchQuery={chatSearchQuery}
                    setChatSearchQuery={setChatSearchQuery}
                    pinnedMessage={
                      pinnedMessages[selectedChat.id]
                        ? messages.find(
                          (m) => m.id === pinnedMessages[selectedChat.id]
                        )
                        : null
                    }
                  />
                </div>

                {/* Messages Area */}
                <div className="flex-1 flex overflow-hidden">
                  <div className="flex-1 overflow-y-auto">
                    <ChatMessages
                      messages={filteredMessages}
                      typingIndicator={typingIndicator}
                      selectedChatId={selectedChat.id}
                      messagesEndRef={messagesEndRef}
                      showMessageMenu={showMessageMenu}
                      setShowMessageMenu={setShowMessageMenu}
                      showReactionPicker={showReactionPicker}
                      setShowReactionPicker={setShowReactionPicker}
                      onReaction={handleReaction}
                      onReply={handleReply}
                      onEdit={handleEditMessage}
                      onDelete={handleDeleteMessage}
                      onCopy={handleCopyMessage}
                      onStar={handleStarMessage}
                      onPin={handlePinMessage}
                      onForward={handleForwardMessage}
                      starredMessages={starredMessages}
                    />
                  </div>

                  {showChatInfo && (
                    <div className="flex-shrink-0 overflow-y-auto">
                      <ChatInfoSidebar
                        selectedChat={selectedChat}
                        messages={messages}
                        starredMessages={starredMessages}
                      />
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex-shrink-0">
                  <ChatInput
                    message={message}
                    setMessage={setMessage}
                    attachedFiles={attachedFiles}
                    setAttachedFiles={setAttachedFiles}
                    showEmojiPicker={showEmojiPicker}
                    setShowEmojiPicker={setShowEmojiPicker}
                    showAttachmentMenu={showAttachmentMenu}
                    setShowAttachmentMenu={setShowAttachmentMenu}
                    onSend={handleSend}
                    onFileSelect={handleFileSelect}
                    fileInputRef={fileInputRef}
                    emojiPickerRef={emojiPickerRef}
                    attachmentMenuRef={attachmentMenuRef}
                    isRecording={isRecording}
                    recordingDuration={recordingDuration}
                    handleVoiceMessage={handleVoiceMessage}
                    cancelRecording={cancelRecording}
                    replyingTo={replyingTo}
                    cancelReply={cancelReply}
                    editingMessage={editingMessage}
                    cancelEdit={cancelEdit}
                  />
                </div>
              </>
            ) : (
              <EmptyState />
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #f97316 transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #f97316;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #ea580c;
        }
      `}</style>
    </DashboardLayout>
  );
}
